import { ParameterInput, Project } from '@scrrap/core';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { authenticatedFetch } from '../../authentication/authenticatedFetch';

const getProjects = async (
  filter: any,
): Promise<{ data: Project[]; count: number }> => {
  const sanitizedFilter = Object.keys(filter || {}).reduce((acc, key) => {
    if (filter[key] !== undefined) {
      acc[key] = filter[key];
    }
    return acc;
  }, {} as any);

  const response = await authenticatedFetch(
    `${process.env.REACT_APP_API_URL}/projects?${new URLSearchParams(
      sanitizedFilter,
    ).toString()}`,
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  const count = response.headers.get('X-Total-Count');
  return { data, count: parseInt(count || '') || 0 };
};

const createProject = async ({
  values,
  type,
}: {
  values?: ParameterInput[];
  type?: string;
}) => {
  const response = await authenticatedFetch(
    `${process.env.REACT_APP_API_URL}/projects`,
    {
      method: 'POST',
      body: JSON.stringify({ values: values || [], type: type || '' }),
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

const removeProject = async (projectId: string): Promise<Project> => {
  const response = await authenticatedFetch(
    `${process.env.REACT_APP_API_URL}/projects/${projectId}`,
    {
      method: 'DELETE',
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

const useProjects = (filter?: any) => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery(
    ['projects', JSON.stringify(filter)],
    async () => {
      return getProjects(filter);
    },
    {
      useErrorBoundary: true,
    },
  );

  const createProjectMutation = useMutation(
    ({ values, type }: { values?: ParameterInput[]; type: string }) =>
      createProject({ values, type }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
      },
    },
  );

  const removeProjectMutation = useMutation(
    (projectId: string) => removeProject(projectId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
      },
    },
  );

  return {
    count: projectsQuery.data?.count,
    projects: projectsQuery.data?.data,
    error:
      projectsQuery.error ||
      createProjectMutation.error ||
      removeProjectMutation.error,
    loading:
      projectsQuery.isLoading ||
      createProjectMutation.isLoading ||
      removeProjectMutation.isLoading,
    create: createProjectMutation.mutateAsync,
    remove: removeProjectMutation.mutateAsync,
  };
};

export default useProjects;
