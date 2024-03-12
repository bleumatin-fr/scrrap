import { Configuration, spreadsheet, SpreadsheetType } from '@scrrap/core';
import express, { Request } from 'express';
import { HttpError } from '../middlewares/errorHandler';
import Model from './model';

const router = express.Router();

interface RequestQuery {
  _start: number;
  _end: number;
  _order: 'ASC' | 'DESC';
  _sort: string;
}

router.get('/', async (request, response) => {
  const { _end, _order, _sort, _start } =
    request.query as unknown as RequestQuery;

  const modelsCount = await Model.count();

  const foundModels = await Model.find()
    .sort({ [_sort]: _order === 'ASC' ? 1 : -1 })
    .skip(_start)
    .limit(_end - _start);

  response.setHeader('X-Total-Count', modelsCount);

  response.json(foundModels);
});

router.get('/:id', async (request, response) => {
  const foundModel = await Model.findById(request.params.id);
  if (!foundModel) {
    throw new HttpError(404, 'Not found');
  }
  response.json(foundModel);
});

type PostRequestBody = {
  name: string;
  type: string;
  description: string;
  config: Configuration;
  spreadsheetType: SpreadsheetType;
};

router.post(
  '/',
  async (request: Request<{}, {}, PostRequestBody>, response) => {
    const { name, type, description, config, spreadsheetType } = request.body;

    const existingModelType = await Model.findOne({ type });
    if (existingModelType) {
      throw new HttpError(400, 'Model type already exists and must be unique');
    }
    const spreadsheetId = await spreadsheet.create();

    const newModel = new Model({
      name,
      type,
      description,
      config,
      spreadsheetId,
    });

    response.json(await newModel.save());
  },
);

router.put(
  '/:id',
  async (request: Request<{ id: string }, {}, { name: string }>, response) => {
    const newModel = await Model.findOneAndUpdate(
      { _id: request.params.id },
      request.body,
      {
        upsert: false,
        new: true,
      },
    );
    if (!newModel) {
      throw new HttpError(404, 'Not found');
    }
    response.json(newModel);
  },
);

router.delete('/:id', async (request, response) => {
  const foundModel = await Model.findById(request.params.id);
  if (!foundModel) {
    throw new HttpError(404, 'Not found');
  }
  await spreadsheet.remove(foundModel.spreadsheetId);
  await Model.deleteOne({ _id: request.params.id });

  response.json(foundModel);
});

export default router;
