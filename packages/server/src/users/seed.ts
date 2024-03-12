import User from './model';

const defaultUsers = [
  {
    email: 'admin@bleumatin.fr',
    firstName: 'Administrateur',
    lastName: 'Bleu Matin',
    company: 'Bleu Matin',
    // = password
    hash: '$2b$10$Zq2Q6Chp53thAJnB0h0LJ.HQ6.7LmmpBSFVSUQMk1FCN8R.OXivyS',
    role: 'admin',
  },
];

const seed = async () => {
  for (const user of defaultUsers) {
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      await User.create(user);
    }
  }
  console.log('Users seeded');
};

export default seed;
