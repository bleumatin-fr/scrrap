import { getStatisticsSpreadsheet } from '@scrrap/core';
import express, { Request } from 'express';
import { SortOrder } from 'mongoose';
import { HttpError } from '../middlewares/errorHandler';
import Project from './model';

const router = express.Router();

interface RequestQuery {
  _start: number;
  _end: number;
  _order: 'ASC' | 'DESC';
  _sort: string;
  users: string[];
  q: string;
  public: boolean | undefined;
  deleted: boolean | undefined;
}

router.get(
  '/',
  async (request: Request<{}, {}, {}, RequestQuery>, response) => {
    const {
      _end,
      _order,
      _sort,
      _start,
      users,
      q,
      public: isPublic,
      deleted: isDeleted = false,
    } = request.query;

    const projectsCount = await Project.count();

    let filter = {};

    if (users && users.length > 0) {
      filter = { ...filter, users: { $elemMatch: { id: users } } };
    }

    if (q) {
      filter = { ...filter, name: { $regex: q, $options: 'i' } };
    }

    if (isDeleted) {
      filter = { ...filter, deletedAt: { $ne: null } };
    } else {
      filter = {
        ...filter,
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: { $eq: null } }],
      };
    }

    if (typeof isPublic !== 'undefined') {
      if (isPublic) {
        filter = { ...filter, public: true };
      } else {
        filter = {
          ...filter,
          $or: [{ public: false }, { public: { $exists: false } }],
        };
      }
    }

    let sort: { [key: string]: SortOrder } = {
      [_sort]: _order === 'ASC' ? 1 : -1,
      name: _sort === 'name' ? (_order === 'ASC' ? 1 : -1) : 1,
    };

    const foundProjects = await Project.find(filter)
      .sort(sort)
      .skip(_start)
      .limit(_end - _start);

    response.setHeader('X-Total-Count', projectsCount);

    response.json(foundProjects);
  },
);

router.get('/statistics', async (request, response) => {
  const foundProjects = await Project.find();
  if (!foundProjects.length) {
    throw new HttpError(404, 'No project found');
  }
  const statSpreadSheetId = await getStatisticsSpreadsheet(foundProjects);
  response.json(statSpreadSheetId);
});

router.get('/:id', async (request, response) => {
  const foundProject = await Project.findOne({
    $or: [{ _id: request.params.id }, { spreadsheetId: request.params.id }],
  });
  if (!foundProject) {
    throw new HttpError(404, 'Not found');
  }
  response.json(foundProject);
});

router.post('/', async (request, response) => {
  const newProject = new Project(request.body);
  response.json(await newProject.save());
});

router.put(
  '/:id',
  async (request: Request<{ id: string }, {}, { name: string }>, response) => {
    const newProject = await Project.findOneAndUpdate(
      { _id: request.params.id },
      request.body,
      {
        upsert: false,
        new: true,
      },
    );
    if (!newProject) {
      throw new HttpError(404, 'Not found');
    }
    response.json(newProject);
  },
);

router.delete('/:id', async (request, response) => {
  const foundProject = await Project.findById(request.params.id);
  if (!foundProject) {
    throw new HttpError(404, 'Not found');
  }
  if (!foundProject.deletedAt) {
    foundProject.deletedAt = new Date();
    await foundProject.save();
  }
  else { //project already "deleted"
    await Project.findOneAndDelete({_id: request.params.id});
  }
  response.json(foundProject);
});

export default router;
