import { Datagrid, List, TextField } from 'react-admin';

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
    </Datagrid>
  </List>
);

export default UserList;
