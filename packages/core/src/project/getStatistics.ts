import { intToExcelCol } from 'excel-column-name';
import spreadsheet from '../spreadsheet';
import {
  BarSingle1D,
  GlobalScore,
  Indicator2Values,
  Parameter,
  Pie1D,
  Project,
  Sector,
} from './types';

const uniqueBy = (array: any[], key: string) => {
  return array.filter((item, index, self) => {
    return (
      index ===
      self.findIndex((t) => {
        return t[key] === item[key];
      })
    );
  });
};

interface Line {
  id: string;
  categories: string[];
  label: string;
  values: string[];
}

type ParameterWithCategories = Parameter & { categories: string[] };

const equalizeArrayLength = (array: any, key: string) => {
  const maxNumberOfKey = array.reduce(
    (max: number, item: any) =>
      item[key].length > max ? item[key].length : max,
    0,
  );

  array.forEach((item: any) => {
    while (item[key].length < maxNumberOfKey) {
      item[key].push('');
    }
  });
};

const flattenParameters = (
  sectors: Sector[],
  topLevelSectors: Sector[] = [],
): ParameterWithCategories[] => {
  const parameters = sectors.reduce((allParameters, sector) => {
    const subParameters = flattenParameters(sector.sectors || [], [
      ...topLevelSectors,
      sector,
    ]);

    return [
      ...allParameters,
      ...sector.parameters.map((parameter) => ({
        ...parameter,
        categories: [
          ...topLevelSectors.map((sector) => sector.information.name),
          sector.information.name,
        ],
      })),
      ...subParameters,
    ];
  }, [] as ParameterWithCategories[]);

  equalizeArrayLength(parameters, 'categories');

  return parameters;
};

const findAndUpdateLine = (
  lines: Line[],
  id: string,
  value: string,
  projectIndex: number,
  label?: string,
  categories?: string[],
) => {
  const lineIndex = lines.findIndex((line) => line.id === id);
  if (lineIndex === -1) {
    lines.push({
      id,
      categories: categories || [],
      label: label || '',
      values: [],
    });
  }
  lines[lineIndex === -1 ? lines.length - 1 : lineIndex].values[projectIndex] =
    value;
};

const updateProjectName = (
  lines: Line[],
  project: Project,
  projectIndex: number,
) => {
  findAndUpdateLine(
    lines,
    'projectName',
    project.name,
    projectIndex,
    'Project',
  );
};

const updateUserInfo = (
  lines: Line[],
  project: Project,
  projectIndex: number,
) => {
  const owner = project.users.find((user) => user.role === 'owner')?.user;
  if (!owner) {
    return;
  }
  findAndUpdateLine(
    lines,
    'user_firstName',
    owner.firstName,
    projectIndex,
    'First name',
    ['User'],
  );
  findAndUpdateLine(
    lines,
    'user_lastName',
    owner.lastName,
    projectIndex,
    'Last name',
    ['User'],
  );
  findAndUpdateLine(
    lines,
    'user_company',
    owner.company,
    projectIndex,
    'Company',
    ['User'],
  );
};

const updateParameters = (
  lines: Line[],
  project: Project,
  projectIndex: number,
) => {
  const parameters = flattenParameters(project.sectors);

  for (const parameter of parameters) {
    if (!parameter.id) {
      continue;
    }
  }

  return lines;
};

const updateIndicator2ValuesResult = (
  lines: Line[],
  result: Indicator2Values,
  projectIndex: number,
) => {
  findAndUpdateLine(
    lines,
    `indicator2Values_${result.code}_1` || '',
    result.number1 || '',
    projectIndex,
    `${result.title} ${result.unit1}`,
    ['Results'],
  );
  findAndUpdateLine(
    lines,
    `indicator2Values_${result.code}_2` || '',
    result.number2 || '',
    projectIndex,
    `${result.title} ${result.unit2}`,
    ['Results'],
  );
};

const updateGlobalScoreResult = (
  lines: Line[],
  result: GlobalScore,
  projectIndex: number,
) => {
  findAndUpdateLine(
    lines,
    `globalScore_${result.title}` || '',
    result.score || '',
    projectIndex,
    result.title,
    ['Results'],
  );
};

const updatePie1DResult = (
  lines: Line[],
  result: Pie1D,
  projectIndex: number,
) => {
  result.data?.forEach((data) => {
    findAndUpdateLine(
      lines,
      `pie1d_${result.title}_${data.name}` || '',
      `${data.value || '0'}`,
      projectIndex,
      `${result.title} ${data.name}`,
      ['Results'],
    );
  });
};
const updateBarSingle1DResult = (
  lines: Line[],
  result: BarSingle1D,
  projectIndex: number,
) => {
  result.data?.data.forEach((data) => {
    findAndUpdateLine(
      lines,
      `barSingle1D_${result.title}_${data.categoryName}` || '',
      `${data[data.categoryName] || '0'}`,
      projectIndex,
      `${result.title} ${data.categoryName}`,
      ['Results'],
    );
  });
};

const updateResults = (
  lines: Line[],
  project: Project,
  projectIndex: number,
) => {
  const results = project.results;
  for (const result of results) {
    switch (result.type) {
      case 'indicator2Values':
        updateIndicator2ValuesResult(lines, result, projectIndex);
        break;
      case 'globalScore':
        updateGlobalScoreResult(lines, result, projectIndex);
        break;
      case 'pie1D':
        updatePie1DResult(lines, result, projectIndex);
        break;
      case 'barSingle1D':
        updateBarSingle1DResult(lines, result, projectIndex);
        break;
      default:
        break;
    }
  }

  return lines;
};

export const getStatisticsSpreadsheet = async (
  projects: Project[],
): Promise<string> => {
  const projectsTypes = uniqueBy(
    projects.map((project: Project) => ({
      type: project.model.type,
      name: project.model.name,
    })),
    'type',
  );

  const sheets = projectsTypes.map(({ type, name }) => {
    const projectsOfType = projects.filter(
      (project) => project.model.type === type,
    );

    let lines = projectsOfType.reduce<Line[]>(
      (allLines, project, projectIndex) => {
        updateProjectName(allLines, project, projectIndex);
        updateUserInfo(allLines, project, projectIndex);
        updateParameters(allLines, project, projectIndex);
        updateResults(allLines, project, projectIndex);
        return allLines;
      },
      [] as Line[],
    );
    return {
      name,
      lines: lines || [],
    };
  });

  sheets.forEach((sheet) => {
    equalizeArrayLength(sheet.lines, 'categories');
    equalizeArrayLength(sheet.lines, 'values');
  });

  const statSpreadSheetId = await spreadsheet.create();
  if (!statSpreadSheetId) {
    throw new Error('Unable to create a new spreadsheet');
  }

  await spreadsheet.createSheets(
    statSpreadSheetId,
    sheets.map((sheet) => sheet.name),
  );

  for (const sheet of sheets) {
    const rows = sheet.lines.map((line) => [
      ...line.categories,
      line.id,
      line.label,
      ...line.values,
    ]);

    // sort rows by first cell
    rows.sort((a, b) => {
      return `${a[0]}${a[1]}${a[2]}`.localeCompare(`${b[0]}${b[1]}${b[2]}`);
    });

    if (!rows[0]) {
      continue;
    }
    const range = `${sheet.name}!A1:${intToExcelCol(rows[0].length)}${
      rows.length
    }`;

    await spreadsheet.write(statSpreadSheetId, range, rows);
  }

  // do not await this, non blocking
  await spreadsheet.removeSheetsByIndex(statSpreadSheetId, [0]);

  return statSpreadSheetId;
};
