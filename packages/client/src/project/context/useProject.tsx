import {
  Parameter,
  ParameterInput,
  Period,
  Project,
  Reference,
  Sector,
  Value,
} from '@scrrap/core';
import { debounce } from 'lodash';
import { Types } from 'mongoose';
import { useCallback, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { authenticatedFetch } from '../../authentication/authenticatedFetch';
import { getValue } from '../parameters/getValue';

const optimisticUpdate = (
  sectors: Sector[],
  newValues: ParameterInput[],
): Sector[] => {
  return sectors.map((sector) => {
    return {
      ...sector,
      sectors: optimisticUpdate(sector.sectors, newValues),
      parameters: sector.parameters.map((parameter) => {
        const newValue = newValues.find((newValue) => {
          if (newValue.type === 'index') {
            return newValue.index === parameter.index;
          }
          if (newValue.type === 'id') {
            return newValue.id === parameter.id;
          }
          return false;
        });
        if (newValue) {
          return {
            ...parameter,
            value: newValue.value,
          };
        }
        return parameter;
      }),
    };
  });
};

const mergeValues = (values: ParameterInput[]) => {
  return values.reduce<ParameterInput[]>((merged, value) => {
    const found = merged.find((v) => {
      if (v.type === 'index' && value.type === 'index') {
        return v.index === value.index;
      }
      if (v.type === 'id' && value.type === 'id') {
        return v.id === value.id;
      }
      return false;
    });
    if (found) {
      return [
        ...merged.filter((v) => {
          if (v.type === 'index' && value.type === 'index') {
            return v.index !== value.index;
          }
          if (v.type === 'id' && value.type === 'id') {
            return v.id !== value.id;
          }
          return true;
        }),
        value,
      ];
    }
    return [...merged, value];
  }, [] as ParameterInput[]);
};

const shareProject = async ({
  email,
  message,
  projectId,
}: {
  email: string;
  message?: string;
  projectId: string;
}) => {
  const response = await authenticatedFetch(
    `${process.env.REACT_APP_API_URL}/projects/share/add/${projectId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ email, message: message || '' }),
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw await response.json();
  }
  return await response.json();
};

const updateSharedUsers = async ({
  usersId,
  projectId,
}: {
  usersId: Types.ObjectId[];
  projectId: string;
}) => {
  const response = await authenticatedFetch(
    `${process.env.REACT_APP_API_URL}/projects/share/update/${projectId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ usersId }),
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw await response.json();
  }
  return await response.json();
};

const getProject = async (projectId: string): Promise<Project> => {
  const response = await authenticatedFetch(
    `${process.env.REACT_APP_API_URL}/projects/${projectId}`,
  );
  return await response.json();
};

const patchProject = async (id: string, body: BodyInit | null | undefined) => {
  const response = await authenticatedFetch(
    `${process.env.REACT_APP_API_URL}/projects/${id}`,
    {
      method: 'PATCH',
      body,
    },
  );
  return await response.json();
};

export const useProject = (projectId: string | undefined) => {
  if (!projectId) {
    throw new Error('No projectId');
  }
  const valuesBuffer = useRef([] as ParameterInput[]);
  const queryClient = useQueryClient();
  const ongoingMutations = useRef(0);

  const projectQuery = useQuery(
    ['project', projectId],
    () => getProject(projectId),
    {
      useErrorBoundary: true,
    },
  );

  const updateReferencesMutation = useMutation(
    (references: Reference[]) =>
      patchProject(projectId, JSON.stringify({ references })),
    {
      onMutate: async (newReferences: Reference[]) => {
        ongoingMutations.current += 1;
        await queryClient.cancelQueries({ queryKey: ['project', projectId] });

        const previousProject = queryClient.getQueryData<Project>([
          'project',
          projectId,
        ]);

        const newProject = {
          ...previousProject,
          references: newReferences,
        };
        queryClient.setQueryData(['project', projectId], newProject);
      },
      onSettled: (updatedProject) => {
        ongoingMutations.current -= 1;
        ongoingMutations.current === 0 &&
          queryClient.setQueryData(['project', projectId], updatedProject);

        queryClient.invalidateQueries('projects');
      },
    },
  );

  const updatePlanningMutation = useMutation(
    (planning: Period[]) =>
      patchProject(projectId, JSON.stringify({ planning })),
    {
      onMutate: async (newPlanning: Period[]) => {
        ongoingMutations.current += 1;
        await queryClient.cancelQueries({ queryKey: ['project', projectId] });

        const previousProject = queryClient.getQueryData<Project>([
          'project',
          projectId,
        ]);

        const newProject = {
          ...previousProject,
          planning: newPlanning,
        };
        queryClient.setQueryData(['project', projectId], newProject);
      },
      onSettled: (updatedProject) => {
        ongoingMutations.current -= 1;
        ongoingMutations.current === 0 &&
          queryClient.setQueryData(['project', projectId], updatedProject);

        queryClient.invalidateQueries('projects');
      },
    },
  );

  const updateParametersMutation = useMutation(
    (values: ParameterInput[]) =>
      patchProject(
        projectId,
        JSON.stringify({
          values,
        }),
      ),
    {
      onMutate: async (newValues: ParameterInput[]) => {
        ongoingMutations.current += 1;
        await queryClient.cancelQueries({ queryKey: ['project', projectId] });

        const previousProject = queryClient.getQueryData<Project>([
          'project',
          projectId,
        ]);

        const newProject = {
          ...previousProject,
          sectors: optimisticUpdate(previousProject?.sectors || [], newValues),
        };
        queryClient.setQueryData(['project', projectId], newProject);
      },
      onSettled: (updatedProject) => {
        ongoingMutations.current -= 1;
        ongoingMutations.current === 0 &&
          queryClient.setQueryData(['project', projectId], updatedProject);
        queryClient.invalidateQueries('projects');
      },
    },
  );

  const shareProjectMutation = useMutation(
    ({ email, message }: { email: string; message?: string }) =>
      shareProject({ email, message, projectId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project', projectId]);
      },
      onSettled: (updatedProject) => {
        ongoingMutations.current -= 1;
        ongoingMutations.current === 0 &&
          queryClient.setQueryData(['project', projectId], updatedProject);
      },
    },
  );

  const updateSharedUsersMutation = useMutation(
    ({ usersId }: { usersId: Types.ObjectId[] }) =>
      updateSharedUsers({ usersId, projectId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project', projectId]);
      },
      onSettled: (updatedProject) => {
        ongoingMutations.current -= 1;
        ongoingMutations.current === 0 &&
          queryClient.setQueryData(['project', projectId], updatedProject);
      },
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPatchProject = useCallback(
    debounce(
      (id: string) => {
        const mergedValues = mergeValues(valuesBuffer.current);
        valuesBuffer.current = [];
        updateParametersMutation.mutate(mergedValues);
      },
      500,
      { maxWait: 3000, trailing: true },
    ),
    [],
  );

  const updateParameter = (index: number | string, value: Value) => {
    if (typeof index === 'number') {
      valuesBuffer.current.push({ type: 'index', index, value });
    } else {
      valuesBuffer.current.push({ type: 'id', id: index, value });
    }
    debouncedPatchProject(projectId);
  };

  return {
    project: projectQuery.data,
    loading:
      projectQuery.isFetching ||
      updateParametersMutation.isLoading ||
      updateSharedUsersMutation.isLoading ||
      shareProjectMutation.isLoading,
    error: shareProjectMutation.error || updateSharedUsersMutation.error,
    updateParameter,
    updateParameterAsync: updateParametersMutation.mutateAsync,
    updateReferences: updateReferencesMutation.mutateAsync,
    updatePlanning: updatePlanningMutation.mutateAsync,
    updateSharedUsers: updateSharedUsersMutation.mutateAsync,
    shareProject: shareProjectMutation.mutateAsync,
  };
};

const flattenParameters = (sectors: Sector[]): Parameter[] =>
  sectors.reduce((allParameters, sector) => {
    const subParameters = flattenParameters(sector.sectors || []);

    return [...allParameters, ...sector.parameters, ...subParameters];
  }, [] as Parameter[]);

export const getParameterFromId = (sectors: Sector[], ids: string[]): Parameter | undefined => {
  const parameters = flattenParameters(sectors);
  return parameters.find((parameter) => parameter.id && ids.includes(parameter.id))
}

export const getProjectTitle = (project: Project): string | undefined => {
  let title: string | undefined = undefined;

  const titleParameters = flattenParameters(project.sectors || [])
    .filter(
      (parameter) =>
        parameter.id &&
        project.model.config.parameters.titleParameterId.includes(parameter.id),
    )
    .sort((a, b) => {
      const aIndex = project.model.config.parameters.titleParameterId.indexOf(
        a.id as string,
      );
      const bIndex = project.model.config.parameters.titleParameterId.indexOf(
        b.id as string,
      );

      return aIndex - bIndex;
    });

  if (titleParameters && titleParameters.length) {
    title =
      titleParameters.reduce((title, titleParameter) => {
        const value = getValue<string>(titleParameter.value);

        if (value) {
          return `${title} ${value}`;
        }

        return title;
      }, '') || project.model.config.parameters.defaultTitle;
  }

  return title;
};
