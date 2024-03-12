import { getParameters, Parameter, Sector, spreadsheet } from '@scrrap/core';
import express from 'express';

import Model from './model';

import { Model as ModelType } from '@scrrap/core';

const router = express.Router();

export const flattenParameters = (sectors: Sector[]): Parameter[] =>
  sectors.reduce((allParameters, sector) => {
    const subParameters = flattenParameters(sector.sectors);

    return [...allParameters, ...sector.parameters, ...subParameters];
  }, [] as Parameter[]);

router.get('/', async (request, response) => {
  const models = await Model.find().lean();
  const cleanedUpModels = await Promise.all(
    models.map(async (model: ModelType) => {
      const technicalSpreadsheetId = model.spreadsheetId;

      const { rows } = await spreadsheet.read(
        `${technicalSpreadsheetId}_optimized`,
        {
          rows: model.config!.parameters.range,
        },
      );
      
      const parameters = await getParameters(
        rows,
        model.config!.parameters,
        (parameter: Parameter) => {
          return parameter.displayOnCreate ? true : false;
        },
      );
      model.parameters = flattenParameters(parameters);
      const { spreadsheetId, config, ...cleanedModel } = model;
      const {
        parameters: { externalModules },
      } = config;

      return {
        ...cleanedModel,
        config: { parameters: { externalModules } },
      };
    }),
  );
  response.json(cleanedUpModels);
});

export default router;
