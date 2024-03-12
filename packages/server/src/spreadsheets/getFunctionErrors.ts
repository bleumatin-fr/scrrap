import { intToExcelCol } from 'excel-column-name';
import {
  DetailedCellError as HfDetailedCellError,
  HyperFormula,
  SerializedNamedExpression,
} from 'hyperformula';
import xlsx from 'xlsx';
import { getSheetsArrayFromWorkbook } from '../projects/updateParameters';

interface DetailedCellError {
  value: string;
  address: string;
  type: string;
  message: string;
}

export const collectErrors = (hf: HyperFormula): DetailedCellError[] => {
  const workbookData = hf.getAllSheetsValues();
  const errors: DetailedCellError[] = [];
  Object.keys(workbookData).forEach((sheetName) => {
    const sheetData = workbookData[sheetName];
    sheetData.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell instanceof HfDetailedCellError) {
          errors.push({
            value: cell.value,
            address: `${sheetName}!${intToExcelCol(cellIndex)}${rowIndex + 1}`,
            type: cell.type,
            message: cell.message,
          });
        }
      });
    });
  });
  return errors;
};

const getFunctionErrors = async (buffer: ArrayBufferLike) => {
  const workbook = xlsx.read(buffer, {
    cellFormula: true,
  });

  const namedExpressions: SerializedNamedExpression[] =
    workbook.Workbook?.Names?.filter((name) => !name.Sheet).map(
      ({ Name, Ref, Sheet }) => {
        return {
          name: Name,
          expression: Ref,
          scope: Sheet,
        };
      },
    ) || [];

  const sheetsArray = getSheetsArrayFromWorkbook(workbook);

  const hf = HyperFormula.buildFromSheets(
    sheetsArray,
    {
      licenseKey: 'gpl-v3',
      useArrayArithmetic: true,
      smartRounding: true,
      useColumnIndex: true,
    },
    namedExpressions,
  );
  return collectErrors(hf);
};

export default getFunctionErrors;
