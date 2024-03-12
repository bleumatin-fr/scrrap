import { Button } from '@mui/material';
import { get } from 'lodash';
import {
  sanitizeFieldRestProps,
  UrlFieldProps,
  useRecordContext,
  useRedirect,
} from 'react-admin';

import GoogleDriveIcon from './icons/GoogleDriveIcon';
import OnlyOfficeIcon from './icons/OnlyOfficeIcon';

export const SpreadsheetField = ({
  className,
  emptyText,
  source,
  ...rest
}: UrlFieldProps) => {
  const redirect = useRedirect();
  const record = useRecordContext();

  if (!source) {
    return null;
  }
  const value = get(record, source);
  const icon = value.startsWith('google') ? (
    <GoogleDriveIcon />
  ) : value.startsWith('local') ? (
    <OnlyOfficeIcon />
  ) : (
    <OnlyOfficeIcon />
  );
  return (
    <Button
      variant="contained"
      startIcon={icon}
      color="success"
      onClick={(e) => {
        e.stopPropagation();
        redirect('edit', 'spreadsheets', value);
      }}
      size="small"
      target="_blank"
      {...sanitizeFieldRestProps(rest)}
      style={{ whiteSpace: 'nowrap' }}
    >
      Spreadsheet
    </Button>
  );
};
