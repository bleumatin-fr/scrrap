import { Edit, SimpleForm, TextInput, useRecordContext } from 'react-admin';
import { JsonInput } from 'react-admin-json-view';
import { RichTextInput } from 'ra-input-rich-text';

const ModelTitle = () => {
  const record = useRecordContext();
  return <span>{record?.name} Model</span>;
};

const ModelEdit = () => (
  <Edit title={<ModelTitle />}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="type" />
      <RichTextInput source="description" />
      <TextInput source="spreadsheetId" />
      <JsonInput source="config" />
    </SimpleForm>
  </Edit>
);

export default ModelEdit;
