import {
  Create,
  RadioButtonGroupInput,
  SimpleForm,
  TextInput,
} from 'react-admin';
import { JsonInput } from 'react-admin-json-view';

const defaultConfig = {
  parameters: {
    range: 'Paramètres!A3:Q1000',
    columnIndexes: {
      sectors: [0, 1],
      parameters: {
        name: 2,
        unit: 6,
        description: 3,
        type: 4,
        value: 5,
        possibleValues: 8,
        initialValue: 9,
        step: 10,
        min: 11,
        max: 12,
        display: 14,
        displayOnCreate: 13,
        id: 7,
        modelReference: 16,
      },
    },
  },
  results: {
    range: 'Résultats!A1:K1000',
  },
  actions: {
    range: 'Actions!A1:Q1000',
    columnIndexes: {
      sector: 0,
      subSector: 1,
      types: 2,
      title: 4,
      scope: 5,
      value: 6,
      unit: 7,
      percentage: 8,
      cost: 9,
      difficulty: 10,
      duration: 11,
      priority: 12,
      link: 13,
    },
  },
};

const ModelCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="type" required />
      <TextInput source="description" multiline fullWidth />
      <RadioButtonGroupInput
        source="spreadsheetType"
        choices={[
          { id: 'google', name: 'Google Spreadsheet' },
          { id: 'local', name: 'OnlyOffice' },
        ]}
      />
      <JsonInput source="config" defaultValue={defaultConfig} />
    </SimpleForm>
  </Create>
);

export default ModelCreate;
