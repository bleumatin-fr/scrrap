import { Parameter, Project, Sector, Value } from '@scrrap/core';
import getValue from './getValue';

const flattenParameters = (sectors: Sector[]): Parameter[] =>
  sectors.reduce((allParameters, sector) => {
    const subParameters = flattenParameters(sector.sectors || []);

    return [...allParameters, ...sector.parameters, ...subParameters];
  }, [] as Parameter[]);

const getProjectTitle = (
  project: Project,
  defaultTitle: string,
): string | undefined => {
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
      }, '') || defaultTitle;
  }

  return title?.trim();
};

export default getProjectTitle;