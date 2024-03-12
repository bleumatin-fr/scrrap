import {
  Model,
  ParameterInput,
  Project as ProjectType,
  spreadsheet,
} from '@scrrap/core';
import { HydratedDocument } from 'mongoose';
import Project from './model';
import { refreshProject } from './refreshProject';
import updateParameters from './updateParameters';

export const createProject = async (
  project: Partial<ProjectType>,
  model: HydratedDocument<Model>,
  initParameters?: ParameterInput[],
): Promise<HydratedDocument<ProjectType>> => {
  const spreadsheetId = await spreadsheet.copy(`${model.spreadsheetId}_optimized`);

  const savedProject = await Project.create({
    ...project,
    spreadsheetId,
    model,
  });

  await refreshProject(savedProject);

  if (initParameters) {
    await updateParameters(savedProject, initParameters);
  }

  return await savedProject.save();
};

export default createProject;
