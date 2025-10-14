import { Datagrid, DateField, EditButton, List, TextField } from 'react-admin';
import { SpreadsheetDownloadField } from '../SpreadsheetDownloadField';
import { SpreadsheetUploadField } from '../SpreadsheetUploadField';

export const ModelList = () => (
  <List>
    <Datagrid>
      <TextField source="name" />
      <TextField source="type" />
      <TextField source="description" />
      <SpreadsheetDownloadField/>
      <SpreadsheetUploadField/>
      <TextField source="spreadsheetId" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export default ModelList;
