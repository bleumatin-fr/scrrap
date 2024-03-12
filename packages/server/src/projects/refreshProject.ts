import {
  Action,
  getActions,
  getCompletionRate,
  getParameters,
  getResults,
  Parameter,
  Project as ProjectType,
  Result,
  Sector,
  spreadsheet,
} from '@scrrap/core';
import { HydratedDocument } from 'mongoose';
import getProjectTitle from './getProjetTitle';

export const refreshParameters = async (
  project: HydratedDocument<ProjectType>,
  data: any[][],
): Promise<{
  sectors: Sector[];
  completionRate: number;
  uncompleted: Parameter[];
  name: string;
}> => {
  const sectors = await getParameters(
    data,
    project.model.config.parameters,
    () => true,
    true,
  );
  const { completionRate, uncompleted } = getCompletionRate(sectors);

  const name = getProjectTitle({ ...project.toObject(), sectors }, '') || '';

  return {
    sectors,
    completionRate,
    uncompleted,
    name,
  };
};

export const refreshResults = async (
  project: HydratedDocument<ProjectType>,
  data: any[][],
): Promise<{
  results: Result[];
}> => {
  return {
    results: await getResults(data, project.model.config.results),
  };
};

export const refreshActions = async (
  project: HydratedDocument<ProjectType>,
  data: any[][],
): Promise<{
  actions: Action[];
} | null> => {
  if (!project.model.config.actions) {
    return null;
  }
  return {
    actions: await getActions(data, project.model.config.actions),
  };
};

export const refreshProject = async (
  project: HydratedDocument<ProjectType>,
): Promise<HydratedDocument<ProjectType>> => {
  const { parameters, actions, results } = await spreadsheet.read(
    project.spreadsheetId,
    {
      parameters: project.model.config.parameters.range,
      actions: project.model.config.actions?.range,
      results: project.model.config.results.range,
    },
  );

  project.set({
    ...(await refreshParameters(project, parameters)),
    ...(await refreshActions(project, actions)),
    ...(await refreshResults(project, results)),
  });

  return project.save();
};

export default refreshProject;
