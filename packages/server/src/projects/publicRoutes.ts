import {
  getParameters,
  getStatisticsSpreadsheet,
  Model as ModelType,
  Parameter,
  ParameterInput,
  Period,
  ParametersConfiguration,
  Project as ProjectType,
  ProjectUser,
  Reference,
  Sector,
  spreadsheet,
  IdParameterInput,
  cleanUpSectors
} from '@scrrap/core';
import express, { Request } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import createProject from './createProject';
import updateParameters from './updateParameters';

import { authenticate } from '../authentication/authenticate';

import Model from '../models/model';
import Project from './model';
import User, { Role } from '../users/model';

import { HttpError } from '../middlewares/errorHandler';

import sendShareInviteForUser from './sendShareInviteForUser';

import path from 'path';
import { send } from '../mail';
import getData from './getData';

const router = express.Router();

const cleanUpProject = (project: ProjectType | null) => {
  if (!project) {
    return null;
  }
  return {
    ...project,
    sectors: cleanUpSectors(project.sectors, ''),
  };
};
interface RequestQuery {
  projectType: string;
  includePublic: boolean;
  limit?: number;
}

router.get(
  '/',
  async (request: Request<{}, {}, {}, RequestQuery>, response) => {
    const projectsCount = await Project.count();

    let filters: any[] = [
      {
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: { $eq: null } }],
      },
    ];

    if (request.query.projectType) {
      filters.push({ 'model.type': request.query.projectType });
    }

    if (
      typeof request.query.includePublic !== 'undefined' &&
      request.query.includePublic
    ) {
      filters.push({
        $or: [
          { public: true },
          { users: { $elemMatch: { id: request.user._id } } },
        ],
      });
    } else {
      filters.push({ users: { $elemMatch: { id: request.user._id } } });
    }

    let query = Project.find({ $and: filters }).populate('users.user').sort({
      createdAt: -1,
    });

    const count = await query.clone().count();
    if (request.query.limit) {
      query = query.limit(request.query.limit);
    }

    const foundProjects = await query.lean();

    response.setHeader('X-Total-Count', count);

    response.json(foundProjects);
  },
);

const flattenParameters = (sectors: Sector[]): Parameter[] =>
  sectors.reduce((allParameters, sector) => {
    const subParameters = flattenParameters(sector.sectors);

    return [...allParameters, ...sector.parameters, ...subParameters];
  }, [] as Parameter[]);

router.post('/', async (request, response) => {
  const { values, type }: { values: ParameterInput[]; type: string } =
    request.body;

  const model = await Model.findOne({ type: type });
  if (!model) {
    throw new HttpError(404, `Project model ${type} not found`);
  }

  const users: ProjectUser[] = [
    {
      id: request.user._id,
      role: 'owner',
      user: request.user,
    },
  ];

  const project = await createProject(
    { name: 'Mon Projet', users },
    model,
    fixDateTypes(values)
  );

  response.json(cleanUpProject(project.toObject()));
});

const notEmpty = <TValue>(value: TValue): value is NonNullable<TValue> => {
  return value !== null && value !== undefined;
};

const readParameters = async (
  spreadsheetId: string,
  config: ParametersConfiguration,
): Promise<Parameter[]> => {
  if (!process.env.DOCBUILDER_SPREADSHEET_FOLDER) {
    throw new Error('DOCBUILDER_SPREADSHEET_FOLDER not set');
  }
  const filePath = path.resolve(process.env.DOCBUILDER_SPREADSHEET_FOLDER);

  const technicalSpreadsheetId = spreadsheetId.includes(':')
    ? spreadsheetId.split(':')[1]
    : spreadsheetId;

  const fileName = fs.existsSync(
    path.join(filePath, `${technicalSpreadsheetId}.xlsx`),
  )
    ? technicalSpreadsheetId
    : `${technicalSpreadsheetId}_optimized`;

  const { parameters: parametersRows } = await spreadsheet.read(fileName, {
    parameters: config.range,
  });

  const parameters = await getParameters(
    parametersRows,
    config,
    () => true
  );

  return flattenParameters(parameters.filter(notEmpty));
};

const getNewlyAddedParameters = async (
  oldProject: ProjectType,
  newModel: ModelType,
) => {
  const oldParameters = await readParameters(
    oldProject.spreadsheetId,
    oldProject.model.config.parameters,
  );
  const newParameters = await readParameters(
    newModel.spreadsheetId,
    newModel.config.parameters,
  );

  const newlyAddedParameters = newParameters.filter((parameter) => {
    const oldParameter = oldParameters.find(
      (oldParameter) => oldParameter.id === parameter.id,
    );

    return !oldParameter;
  });

  return newlyAddedParameters;
};

router.post('/:id/duplicate', async (request, response) => {
  const foundProject = cleanUpProject(
    await Project.findOne({
      _id: request.params.id,
    })
      .populate('users.user')
      .lean(),
  );
  if (!foundProject) {
    throw new HttpError(404, 'Not found');
  }

  const hasAccess = foundProject.users.some(
    (user) => user.id.toString() === request.user._id.toString(),
  );
  if (!hasAccess && request.user.role !== Role.ADMIN) {
    throw new HttpError(403, 'Forbidden');
  }

  const model = await Model.findOne({ type: foundProject.model.type });
  if (!model) {
    throw new HttpError(
      404,
      `Project model ${foundProject.model.type} not found`,
    );
  }

  const users: ProjectUser[] = [
    {
      id: request.user._id,
      role: 'owner',
      user: request.user,
    },
  ];

  let project = await createProject({ name: 'Mon Projet', users }, model);

  const parameters = flattenParameters(foundProject.sectors);

  let newParameters: any[] = [];
  try {
    newParameters = await getNewlyAddedParameters(foundProject, model);
  } catch (e) {
    // do nothing it might fail with old models
  }

  const parameterChanges = parameters
    .map((parameter: Parameter) => {
      if (!parameter.id) return null;
      return {
        type: 'id',
        id: parameter.id,
        value: parameter.value,
      };
    })
    .filter(notEmpty) as ParameterInput[];

  const titleParameter = parameters.find(
    (parameter) => parameter.id === model.config.parameters.titleParameterId[0],
  );

  if (titleParameter && titleParameter.id) {
    parameterChanges.push({
      type: 'id',
      id: titleParameter.id,
      value: `${titleParameter.value} (copie)`,
    });
  }

  project = await updateParameters(project, parameterChanges);

  project.new = newParameters;

  await project.save();

  response.json(cleanUpProject(project.toObject()));
});

router.get('/:id', async (request, response) => {
  const foundProject = await Project.findOne(
    { _id: request.params.id },
    { 'model.spreadsheetId': 0, spreadsheetId: 0 },
  )
    .populate('users.user')
    .lean();
  if (!foundProject) {
    throw new HttpError(404, 'Not found');
  }

  if (request.headers.accept?.includes('application/vnd.ms-excel')) {
    const statSpreadSheetId = await getStatisticsSpreadsheet([foundProject]);

    const spreadsheetId = statSpreadSheetId.includes(':')
      ? statSpreadSheetId.split(':')[1]
      : statSpreadSheetId;

    if (!process.env.DOCBUILDER_SPREADSHEET_FOLDER) {
      throw new Error('DOCBUILDER_SPREADSHEET_FOLDER not set');
    }
    return response.sendFile(
      path.resolve(
        process.env.DOCBUILDER_SPREADSHEET_FOLDER,
        `${spreadsheetId}.xlsx`,
      ),
    );
  }

  if (
    !foundProject.users.some((user) => user.id.equals(request.user._id)) &&
    request.user.role !== Role.ADMIN
  ) {
    throw new HttpError(403, 'Forbidden');
  }
  response.json(cleanUpProject(foundProject));
});

const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const fixDateTypes = (parameterInputs: ParameterInput[]) =>
  parameterInputs.map((parameterInput) => {
    if (String(parameterInput.value) === parameterInput.value) {
      if (
        isoPattern.test(parameterInput.value) &&
        Date.parse(parameterInput.value) > 0
      ) {
        return {
          ...parameterInput,
          value: new Date(parameterInput.value),
        };
      }
    }
    return parameterInput;
  });

router.patch('/share/update/:id', authenticate, async (request, response) => {
  const projectId: string = request.params.id;
  const { usersId } = request.body;
  const foundProject = await Project.findById(projectId);
  if (!foundProject) {
    throw new HttpError(404, 'Not found');
  }
  const usersData = await User.find({ _id: usersId });
  const users = [
    ...foundProject.users.filter((user) => user.role === 'owner'),
    ...usersData.map((user) => {
      return {
        id: user._id,
        role: 'user',
      };
    }),
  ];

  const savedProject = await Project.findOneAndUpdate(
    { _id: projectId },
    { users: users },
    { new: true },
  ).lean();

  response.json(cleanUpProject(savedProject));
});

interface SelectedProject {
  id?: string | null;
  year?: number | null;
  etp: number | null;
}

router.post('/:id/import', async (request, response) => {
  const projectId: string = request.params.id;
  const { projectsToImportFrom }: { projectsToImportFrom: SelectedProject[] } =
    request.body;
  let foundProject = await Project.findById(projectId);

  if (!foundProject) {
    throw new HttpError(404, 'Not found');
  }
  const parameters = flattenParameters(foundProject.sectors);
  const parameterChanges: IdParameterInput[] = [];

  const projects = await Project.find({
    _id: { $in: projectsToImportFrom.filter((p) => p.id).map((p) => p.id) },
  });

  parameters.forEach((parameter) => {
    if (!parameter.id) return;
    if (parameter.id.endsWith('_comment')) return;

    const toImportParameters = projectsToImportFrom
      .filter((p) => p.id)
      .map((project) => {
        const foundProject = projects.find(
          (p) => p._id.toString() === project.id,
        );
        if (!foundProject) {
          return null;
        }
        const parameters = flattenParameters(foundProject.sectors);
        const foundParameter = parameters.find((p) => p.id === parameter.id);
        if (!foundParameter) {
          return null;
        }
        const actualEtp = parameters.find((p) => p.id === 'Nb_employés');
        return {
          id: parameter.id,
          project: foundProject.name,
          actualEtp: (actualEtp?.value || 1) as number,
          etp: project.etp,
          value: foundParameter.exportedValue,
          unit: foundParameter.unit,
        };
      });
    const sum = toImportParameters.reduce((sum, parameter) => {
      if (!parameter || !parameter.value) {
        return sum;
      }
      if (typeof parameter.value !== 'number') {
        return sum;
      }

      return (
        (sum || 0) +
        parameter.value * ((parameter?.etp || 1) / (parameter.actualEtp || 1))
      );
    }, null as number | null);
    if (sum === null) {
      return;
    }

    const comment = toImportParameters.reduce((comment, parameter) => {
      if (!parameter) {
        return comment;
      }
      if (typeof parameter.value !== 'number') {
        return comment;
      }

      if (!comment)
        return `${parameter.value} ${parameter.unit} * (${parameter.etp} / ${parameter.actualEtp} ETP) (${parameter.project}) `;
      return `${comment} + ${parameter.value} ${parameter.unit} * (${parameter.etp} / ${parameter.actualEtp} ETP) (${parameter.project}) `;
    }, '');

    parameterChanges.push({
      type: 'id',
      id: parameter.id,
      value: sum,
    });
    parameterChanges.push({
      type: 'id',
      id: parameter.id + '_comment',
      value: comment,
    });
  });

  if (parameterChanges && parameterChanges.length !== 0) {
    foundProject = await updateParameters(
      foundProject,
      parameterChanges,
    );
  }

  await foundProject.save();

  return response.json(cleanUpProject(foundProject.toObject()));
});

router.patch('/share/add/:id', authenticate, async (request, response) => {
  const projectId: string = request.params.id;
  const { email, message } = request.body;
  const foundProject = await Project.findById(projectId).lean();

  if (!foundProject) {
    throw new HttpError(404, 'Not found');
  }

  const foundUser = await User.findOne({ email }).lean();

  //check if email is associated to shared user
  if (
    foundUser &&
    foundProject.users
      .map((user) => user.id.toString())
      .includes(foundUser._id.toString())
  ) {
    throw new HttpError(400, 'Utilisateur déjà ajouté');
  }

  const invitingUser = request.user;

  if (!foundUser) {
    throw new HttpError(400, 'Utilisateur non existant');
  }

  if (foundUser) {
    const savedProject = await Project.updateOne(
      { _id: projectId },
      {
        $push: {
          users: {
            id: foundUser._id,
            role: 'user',
          },
        },
      },
    );
    try {
      await send({
        to: email,
        from: process.env.MAIL_FROM,
        ...sendShareInviteForUser({
          project: foundProject,
          invitedUser: foundUser,
          invitingUser,
          message,
        }),
      });
      response.json(cleanUpProject(foundProject));
    } catch (error) {
      throw error;
    }
  }
});

router.patch('/:id', async (request, response) => {
  const {
    values,
    tour,
    planning,
    references,
  }: { values: ParameterInput[]; tour: any; planning: Period[]; references: Reference[] } =
    request.body;

  const projectId: string = request.params.id;
  let foundProject = await Project.findById(projectId);

  if (!foundProject) {
    throw new HttpError(404, 'Not found');
  }
  if (
    !foundProject.users.some((user) => user.id.equals(request.user._id)) &&
    request.user.role !== Role.ADMIN
  ) {
    throw new HttpError(403, 'Forbidden');
  }

  let modifications = {} as any;

  if (tour) {
    modifications.tour = tour;
  }

  if (foundProject.spreadsheetId.includes(':')) {
    foundProject.spreadsheetId = foundProject.spreadsheetId.split(':')[1];
  }

  if (references) {
    modifications.references = [
      ...(foundProject.references || []).filter(
        (ref: any) =>
          references.findIndex((newRef) => newRef.index === ref.index) === -1,
      ),
      ...references,
    ];
  }
  if (planning) {
    modifications.planning = planning;
  }
  const tempProject = {...foundProject.toObject(), ...modifications};
  const data = getData(tempProject as ProjectType)
  if (data) {
    modifications.data = data;
  }
  if (Object.keys(modifications).length !== 0) {
    foundProject.set(modifications);
  }

  let updatedProject = await foundProject.save();


  if (values && values.length) {
    updatedProject = await updateParameters(updatedProject, fixDateTypes(values));
  }

  response.json(cleanUpProject(updatedProject.toObject()));
});

router.delete('/:id', async (request, response) => {
  const projectId = request.params.id;
  const foundProject = await Project.findById(projectId);
  if (!foundProject) {
    throw new HttpError(404, 'Not found');
  }
  if (
    !foundProject.users.some(
      (user) => user.id.equals(request.user._id) && user.role === 'owner',
    )
  ) {
    throw new HttpError(403, 'Forbidden');
  }

  foundProject.deletedAt = new Date();
  const savedProject = await foundProject.save();

  response.json(cleanUpProject(savedProject));
});

export default router;
