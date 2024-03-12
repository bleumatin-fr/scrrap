import Configuration from './model';

const seed = async () => {
  const models = await Configuration.find();
  if (models.length > 0) {
    return;
  }

  await new Configuration({
    name: 'home.welcomeMessage',
    value: '[]',
  }).save();
  await new Configuration({
    name: 'home.bottomMessage',
    value: '[]',
  }).save();
  await new Configuration({
    name: 'reports.introduction',
    value: '[]',
  }).save();
  console.log('Default configuration seeded');
};

export default seed;
