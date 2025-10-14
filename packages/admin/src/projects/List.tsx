import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useState } from 'react';
import {
  AutocompleteArrayInput,
  Datagrid,
  DateField,
  EditButton,
  FilterButton,
  List,
  ReferenceArrayInput,
  SelectInput,
  TextField,
  TextInput,
  TopToolbar,
} from 'react-admin';

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { CreateProjectField } from '../CreateProjectField';
import { SeeProjectField } from '../SeeProjectField';
import { SpreadsheetField } from '../SpreadsheetField';

import CompletionField from './CompletionField';
import UsersField from './UsersField';
import { SpreadsheetDownloadField } from '../SpreadsheetDownloadField';

const ActionsContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const ListActions = () => {
  const [loading, setLoading] = useState(false);
  const exportRawData = async () => {
    setLoading(true);
  };
  return (
    <TopToolbar>
      <FilterButton />
      <CreateProjectField />
      <Button
        startIcon={<DriveFolderUploadIcon />}
        onClick={exportRawData}
        size="small"
        disabled={loading}
      >
        Export Données Brutes
      </Button>
    </TopToolbar>
  );
};

const projectFilters = [
  <TextInput label="Search" source="q" alwaysOn />,
  <ReferenceArrayInput
    label="Users"
    reference="users"
    source="users"
    alwaysOn

    sort={{ field: 'firstName', order: 'ASC' }}
  >
    <AutocompleteArrayInput
      optionText={(user) => `${user.firstName} ${user.lastName} (${user.email})`.trim() || user.email}
      sx={{
        width: "300px"
      }}
    />
  </ReferenceArrayInput>,
  <SelectInput
    label="Public"
    source="public"
    choices={[
      { id: true, name: 'Public' },
      { id: false, name: 'Privé' },
    ]}
  />,
  <SelectInput
    label="Deleted"
    source="deleted"
    defaultValue={true}
    choices={[
      { id: true, name: 'Yes' },
      { id: false, name: 'No' },
    ]}
  />,
];

const ProjectList = () => {
  return (
    <List
      filters={projectFilters}
      filterDefaultValues={{ deleted: false }}
      actions={<ListActions />}
      sort={{ field: 'public', order: 'DESC' }}
    >
      <Datagrid rowClick="edit">
        <TextField source="name" />
        {/* <BooleanField source="public" /> */}
        <TextField source="model.name" label="Type" />
        <UsersField source="users" />
        <CompletionField source="completionRate" />
        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />
        {/* <DateField source="deletedAt" showTime /> */}
        {/* <TextField source="spreadsheetId" /> */}
        <ActionsContainer>
          <SpreadsheetDownloadField source="spreadsheetId" />
          <SeeProjectField source="id"></SeeProjectField>
          <EditButton></EditButton>
        </ActionsContainer>
      </Datagrid>
    </List>
  );
};

export default ProjectList;
