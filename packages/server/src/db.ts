import { up as migrateUp } from 'migrate-mongo';
import { connect, Connection } from 'mongoose';

const connectionString =
  process.env.MONGO_URL || 'mongodb://localhost:27017/talm';

export const up = async (connection: Connection) => {
  await migrateUp(connection.db, connection.getClient());
};

export default async () => {
  return await connect(connectionString);
};
