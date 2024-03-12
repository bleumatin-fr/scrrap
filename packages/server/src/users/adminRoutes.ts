import express, { Request } from 'express';
import initAccountMail from './initAccountMail';
import { send } from '../mail';
import jwt from 'jsonwebtoken';

import { HttpError } from '../middlewares/errorHandler';
import User, { Role } from './model';

const router = express.Router();

interface RequestQuery {
  _start: number;
  _end: number;
  _order: 'ASC' | 'DESC';
  _sort: string;
  id?: string[];
  q?: string;
}

router.get('/', async (request, response) => {
  const { _end, _order, _sort, _start, id, q } =
    request.query as unknown as RequestQuery;

  const userCount = await User.count();
  let filter = {};

  if (id && id.length) {
    filter = {
      _id: {
        $in: id,
      },
    };
  }

  if (q) {
    filter = { ...filter, $text: { $search: q } };
  }

  let sort = {};
  switch (_sort) {
    case 'fullname':
      sort = {
        firstName: _order === 'ASC' ? 1 : -1,
        lastName: _order === 'ASC' ? 1 : -1,
      };
      break;
    default:
      sort = {
        [_sort]: _order === 'ASC' ? 1 : -1,
      };
  }

  const foundUsers = await User.find(filter)
    .sort(sort)
    .skip(_start)
    .limit(_end - _start);

  response.setHeader('X-Total-Count', userCount);

  response.json(foundUsers);
});

router.get('/:id', async (request, response) => {
  const foundUser = await User.findById(request.params.id);
  if (!foundUser) {
    throw new HttpError(404, 'Not found');
  }
  response.json(foundUser);
});

router.post('/', async (request, response) => {
  if (!process.env.RESET_PASSWORD_TOKEN_SECRET) {
    throw new Error('Environment variable RESET_PASSWORD_TOKEN_SECRET not set');
  }
  if (!process.env.INVITATION_TOKEN_EXPIRY) {
    throw new Error('Environment variable INVITATION_TOKEN_EXPIRY not set');
  }

  const userToRegister = new User({
    email: request.body.email,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    company: request.body.company,
    role: request.body.role,
  });

  await userToRegister.save();

  const payload = {
    id: userToRegister._id,
  };

  const token = jwt.sign(payload, process.env.RESET_PASSWORD_TOKEN_SECRET, {
    expiresIn: eval(process.env.INVITATION_TOKEN_EXPIRY),
  });

  userToRegister.resetPasswordToken = token;
  await userToRegister.save();

  await send({
    to: userToRegister.email,
    from: process.env.MAIL_FROM,
    ...initAccountMail(token),
  });

  response.json(userToRegister);
});

router.put(
  '/:id',
  async (
    request: Request<
      { id: string },
      {},
      {
        email: string;
        firstName: string;
        lastName: string;
        company: string;
        role: Role;
      }
    >,
    response,
  ) => {
    const updatedUser = await User.findOneAndUpdate(
      { _id: request.params.id },
      {
        email: request.body.email,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        company: request.body.company,
        role: request.body.role,
      },
      {
        upsert: false,
        new: true,
      },
    );
    if (!updatedUser) {
      throw new HttpError(404, 'Not found');
    }
    response.json(updatedUser);
  },
);

router.delete('/:id', async (request, response) => {
  const foundUser = await User.findById(request.params.id);
  if (!foundUser) {
    throw new HttpError(404, 'Not found');
  }
  await User.deleteOne({ _id: request.params.id });

  response.json(foundUser);
});

export default router;
