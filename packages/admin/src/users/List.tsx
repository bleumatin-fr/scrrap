import {
  Datagrid,
  DateField,
  List,
  SelectField,
  TextField,
  TextInput,
} from 'react-admin';

const projectFilters = [<TextInput label="Search" source="q" alwaysOn />];

export const UserList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }} filters={projectFilters}>
    <Datagrid rowClick="edit">
      <TextField source="email" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <SelectField
        source="role"
        choices={[
          { id: 'user', name: 'Utilisateur' },
          { id: 'admin', name: 'Administrateur' },
        ]}
      />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);

export default UserList;
