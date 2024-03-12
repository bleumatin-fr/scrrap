import { Parameter, Period, Project, Result } from '@scrrap/core';
import { flattenParameters } from '../models/publicRoutes';

const getData = (project: Project) => {
  const { startDateId, endDateId } = project.model.config.parameters;
  const { mainIndicatorCode, mainPieCode } = project.model.config.results;
  const mainIndicator = project.results.find(
    (result: Result) => 'code' in result && result.code === mainIndicatorCode,
  );
  const mainPie = project.results.find(
    (result: Result) => 'code' in result && result.code === mainPieCode,
  );
  const flattenParams = flattenParameters(project.sectors);
  const startDateParam = getParametersById(startDateId, flattenParams);
  const startDate = getDate(startDateParam);
  const endDateParam = getParametersById(endDateId, flattenParams);
  const endDate = getDate(endDateParam);
  let mainIndicatorDuration = undefined;
  switch (project.model.class) {
    case 'punctual': {
      if (startDate && endDate) {
        mainIndicatorDuration = nbDays({ startDate, endDate });
      }
      break;
    }
    case 'period': {
      mainIndicatorDuration =
        project.model.config.results.mainIndicatorDuration;
      break;
    }
  }
  return {
    mainIndicator,
    mainIndicatorDuration,
    mainPie,
    startDate,
    endDate,
  };
};

const getParametersById = (id: string, parameters: Parameter[]) => {
  if (!id || !parameters || parameters.length === 0) return undefined;
  return parameters.find((param) => param.id === id);
};

const getDate = (dateParameter: Parameter | undefined) => {
  if (!dateParameter) return undefined;
  const value = dateParameter.value;
  if (value && typeof value === 'number') {
    return new Date(Math.round((value - 25569) * 86400 * 1000));
  }
  return undefined;
};

const nbDays = (period: Period): number => {
  const { startDate, endDate } = period;

  if (!startDate || !endDate) return 0;

  const utcStart = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  const utcEnd = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((utcEnd - utcStart) / millisecondsPerDay);
};

export default getData;
