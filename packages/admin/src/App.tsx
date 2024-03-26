import { Admin, defaultTheme, Resource } from 'react-admin';

import authProvider from './authProvider';
import configurations from './configurations';
import jsonServerProvider from './dataProvider';
import httpClient from './httpClient';
import models from './models';
import projects from './projects';
import spreadsheets from './spreadsheets';
import users from './users';

const dataProvider = jsonServerProvider(
  process.env.REACT_APP_API_URL || 'http://localhost:3000/admin/api',
  httpClient,
);

const theme = {
  ...defaultTheme,
  palette: {
    background: {
      default: '#EBEBEB',
    },
    primary: {
      main: '#437D6E',
    },
    secondary: {
      main: '#437D6E',
      contrastText: '#fff',
    },
  },
};
const App = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      theme={theme}
      disableTelemetry
      basename={process.env.REACT_APP_BASENAME || undefined}
    >
      <Resource name="projects" {...projects} />
      <Resource name="users" {...users} />
      <Resource name="models" {...models} />
      <Resource name="spreadsheets" {...spreadsheets} />
      <Resource name="configurations" {...configurations} />
    </Admin>
  );
};

export default App;
