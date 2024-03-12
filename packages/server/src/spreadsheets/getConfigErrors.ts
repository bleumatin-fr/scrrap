import {
  getParameters,
  getResults,
  Model as ModelType,
  Parameter,
  ParametersConfiguration,
  Result,
  spreadsheet,
} from '@scrrap/core';
import { flattenParameters } from '../models/publicRoutes';

interface ModelsConfig {
  [key: string]: {
    parametersConfig: string[];
    parameters: string[];
    resultsConfig: string[];
  };
}

const modelsConfigToCheck: ModelsConfig = {
  period: {
    parametersConfig: [],
    parameters: ['planning'],
    resultsConfig: [
      'mainIndicatorCode',
      'mainIndicatorDuration',
      'mainPieCode',
    ],
  },
  punctual: {
    parametersConfig: ['startDateId', 'endDateId'],
    parameters: [],
    resultsConfig: ['mainIndicatorCode', 'mainPieCode'],
  },
};

const getConfigErrors = async (
  model: ModelType,
  buffer: ArrayBufferLike,
): Promise<string[]> => {
  const { parameterRows, resultRows } = await spreadsheet.read(buffer, {
    parameterRows: model.config.parameters.range,
    resultRows: model.config.results.range,
  });

  const parameters = flattenParameters(
    await getParameters(
      parameterRows,
      model.config!.parameters,
    ),
  );

  if (!parameters || !parameters.length) {
    return ['No parameters in file'];
  }

  const results = await getResults(resultRows, model.config.results);

  const configErrors: string[] = [];
  if (
    !parameters.find(
      (param) =>
        param.id && model.config.parameters.titleParameterId.includes(param.id),
    )
  ) {
    configErrors.push(
      `Title parameter not found. It should have one following id: "${model.config.parameters.titleParameterId.join(
        '", "',
      )}"`,
    );
  }
  if (model.class === 'period' || model.class === 'punctual') {
    configErrors.push(...getModelConfigErrors(model, parameters, results));
  } else {
    configErrors.push(
      `Model class isn't correctly set. It should be either "period" or "punctual"`,
    );
  }
  return configErrors;
};

const getModelConfigErrors = (
  model: ModelType,
  parameters: Parameter[],
  results: Result[],
): string[] => {
  const errors: string[] = [];
  if (!(model.class in modelsConfigToCheck)) return errors;
  const modelConfigToCheck = modelsConfigToCheck[model.class];

  modelConfigToCheck.parametersConfig.forEach((param) => {
    if (param in model.config.parameters) {
      const parameterId =
        model.config.parameters[param as keyof ParametersConfiguration];
      if (
        typeof parameterId === 'string' &&
        !isParamInProject(parameterId, parameters)
      ) {
        errors.push(
          `Parameter "${parameterId}" has not been found within the parameters set in the file`,
        );
      }
    }
  });
  modelConfigToCheck.parameters.forEach((parameterId) => {
    if (!isParamInProject(parameterId, parameters)) {
      errors.push(
        `Parameter "${parameterId}" has not been found within the parameters set in the file`,
      );
    }
  });
  modelConfigToCheck.resultsConfig.forEach((result) => {
    if (result in model.config.results) {
      const resultCode =
        model.config.results[result as keyof typeof model.config.results];
      if (!results) {
        errors.push(`No results found in the file`);
      } else if (
        resultCode &&
        typeof resultCode === 'string' &&
        !isResultInProject(resultCode, results)
      ) {
        errors.push(
          `Result code "${resultCode}" has not been found within the results set in the file`,
        );
      }
    }
  });
  return errors;
};

const isParamInProject = (parameterId: string, parameters: Parameter[]) => {
  return parameters.find((parameter) => parameter.id === parameterId);
};

const isResultInProject = (resultCode: string, results: Result[]) => {
  return results.find(
    (result) => 'code' in result && result.code === resultCode,
  );
};

export default getConfigErrors;