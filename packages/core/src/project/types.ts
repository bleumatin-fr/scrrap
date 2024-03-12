import { Types } from 'mongoose';

export interface Report {
  _id: Types.ObjectId;
  name: string;
  startDate: Date;
  endDate: Date;
  users: ProjectUser[];
  results: Result[];
  projects: Project[];
  projectCoefficients: { id: string; value?: number }[];
  createdAt: Date;
  updatedAt: Date;
}

export type ModelClass = 'punctual' | 'period';

export interface Model {
  _id: Types.ObjectId;
  name: string;
  singularName: string;
  type: string;
  class: ModelClass;
  color: string;
  description: string;
  spreadsheetId: string;
  parameters: Parameter[];
  config: Configuration;
}

export interface Reference {
  index: number;
  value: Types.ObjectId[];
}

export interface Period {
  startDate: Date;
  endDate: Date;
}

export interface Project {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  users: ProjectUser[];
  name: string;
  year: number;
  sectors: Sector[];
  completionRate: number;
  uncompleted: Partial<Parameter>[];
  new: Partial<Parameter>[];
  spreadsheetId: string;
  results: Result[];
  actions: Action[];
  createdAt: Date;
  updatedAt: Date;
  tour: any;
  model: Model;
  references: Reference[];
  public: boolean;
  planning?: Period[];
  data: any;
}

export interface ProjectUser {
  id: Types.ObjectId;
  role: string;
  user: any;
}

export interface Sector {
  information?: any;
  sectors: Sector[];
  parameters: Parameter[];
}

export type Value = Date | number | string | string[] | undefined;

export interface Parameter {
  index: number;
  name?: string;
  unit?: string;
  description?: string;
  type?: string;
  initialValue: Value;
  value: Value;
  exportedValue: Value;
  possibleValues?: string[];
  min?: number;
  max?: number;
  step?: number;
  display?: boolean;
  error?: string;
  displayOnCreate?: boolean;
  id?: string;
  modelReference?: string;
  information?: string;
}

export interface AbacusColor {
  primary: string;
  secondary: string;
}

export interface Abacus {
  letters: string[];
  colors: AbacusColor[];
  scores: string[];
}

export interface ScoreCard {
  type: 'scoreCard';
  scope?: string;
  display?: boolean;
  code?: string;
  title?: string;
  level?: string;
  score?: string;
  abacus?: Abacus;
}

export interface Indicator {
  type: 'indicator';
  description?: string;
  scope?: string;
  code?: string;
  title?: string;
  number?: string;
  unit?: string;
}

export interface Indicator2Values {
  type: 'indicator2Values';
  scope?: string;
  code?: string;
  title?: string;
  displayed_number1?: string;
  displayed_unit1?: string;
  number1?: string;
  unit1?: string;
  displayed_number2?: string;
  displayed_unit2?: string;
  number2?: string;
  unit2?: string;
}

export interface TreemapData {
  name: string;
  color: string;
  loc?: number;
  unit?: string;
  children?: TreemapData[];
}

export interface Treemap {
  type: 'treemap';
  scope?: string;
  code?: string;
  title?: string;
  size?: string;
  unit?: string;
  subtitle?: string;
  description?: string;
  data?: TreemapData;
}

export interface Bar1DBar {
  name: string;
  color: string;
}

export interface Bar1DData {
  [key: string]: number | string;
}

export interface Bar1D {
  type: 'bar1D';
  scope?: string;
  code?: string;
  title?: string;
  size?: string;
  unit?: string;
  subtitle?: string;
  description?: string;
  data?: Bar1DData[];
  bars?: Bar1DBar[];
}

export interface Pie1DData {
  name: string;
  fill: string;
  value: number;
  link?: string;
}

export interface Pie1D {
  type: 'pie1D';
  scope?: string;
  code?: string;
  title?: string;
  unit?: string;
  size?: string;
  subtitle?: string;
  description?: string;
  data?: Pie1DData[];
}

export interface BarData {
  [key: string]: string | number | any;
}

export interface BarStacked2DData {
  categoryData: BarData[];
  barData: BarData[];
}

export interface BarStacked2D {
  type: 'barStacked2D';
  scope?: string;
  code?: string;
  title?: string;
  size?: string;
  unit?: string;
  subtitle?: string;
  description?: string;
  data?: BarStacked2DData;
}

export interface BarStacked1DData {
  barData: BarData[];
  data: BarData[];
}

export interface BarStacked1D {
  type: 'barStacked1D';
  scope?: string;
  code?: string;
  title?: string;
  size?: string;
  unit?: string;
  subtitle?: string;
  description?: string;
  data?: BarStacked1DData;
}

export interface BarSingle1DData {
  barData: BarData[];
  data: BarData[];
}

export interface BarSingle1D {
  type: 'barSingle1D';
  scope?: string;
  code?: string;
  title?: string;
  size?: string;
  unit?: string;
  subtitle?: string;
  description?: string;
  data?: BarSingle1DData;
}

export interface NavElement {
  icon: string;
  link: string;
  title: string;
}

export interface Nav {
  type: 'nav';
  scope: string;
  data: NavElement[];
  code?: string;
}

export interface Title {
  type: 'title';
  scope?: string;
  icon?: string;
  text?: string;
  code?: string;
}

export interface Subtitle {
  type: 'subtitle';
  scope?: string;
  text?: string;
  code?: string;
}

export interface GlobalScore {
  type: 'globalScore';
  scope?: string;
  title?: string;
  subtitle?: string;
  score?: string;
  text?: string;
  unit?: string;
  code?: string;
}

export interface Impact {
  scope: string;
  value: number;
  unit: string;
  percentage: number;
  priority: string;
  absoluteValue: number;
  absolutePercentage: number;
}

export interface Action {
  sector: string;
  types: string[];
  title: string;
  link: string;
  impacts: Impact[];
  cost: string;
  difficulty: string;
  duration: string;
  impactValue: number;
  display?: boolean;
}

export interface TextResult {
  type: 'text';
  scope?: string;
  text?: string;
  code?: string;
}
export interface TableResult {
  type: 'table';
  title?: string;
  code?: string;
  scope?: string;
  description?: string;
  table?: any[][];
}

export type Result =
  | ScoreCard
  | Indicator
  | Indicator2Values
  | Treemap
  | Nav
  | Title
  | Subtitle
  | Pie1D
  | BarStacked2D
  | BarStacked1D
  | BarSingle1D
  | Bar1D
  | GlobalScore
  | TextResult
  | TableResult;

export interface Statistic {
  type: string;
  name: string;
  projects: Project[];
  data: any;
  parametersConfig: ParametersConfiguration;
}

export interface Statistics {
  [index: number]: Statistic;
}

export interface SectorConfiguration {
  color: string;
  icon?: string;
  children?: SectorConfiguration[];
}

export interface ParametersConfiguration {
  range: string;
  columnIndexes: {
    sectors: number[];
    parameters: {
      type: number;
      value: number;
      [key: string]: number;
    };
  };
  sectors: SectorConfiguration[];
  defaultTitle: string;
  startDateId: string;
  endDateId: string;
  titleParameterId: string[];
  types?: { [key: string]: string };
  externalModules?: {
    [key: string]: string[];
  };
}

export interface Operations {
  [key: string]:
    | undefined
    | ((row: any[], value: any, config: ParametersConfiguration) => any);
}

export interface ResultsConfiguration {
  range: string;
  mainIndicatorCode: string;
  mainIndicatorDuration?: number;
  mainPieCode: string;
}

export interface ActionsConfiguration {
  range: string;
  columnIndexes: {
    sector: number;
    display: number;
    subSector: number;
    types: number;
    title: number;
    scope: number;
    value: number;
    unit: number;
    percentage: number;
    cost: number;
    difficulty: number;
    duration: number;
    priority: number;
    link: number;
    absoluteValue: number;
    absolutePercentage: number;
  };
}

export interface Configuration {
  parameters: ParametersConfiguration;
  results: ResultsConfiguration;
  actions: ActionsConfiguration;
}

export interface IndexParameterInput {
  type: 'index';
  index: number;
  value: Value;
}

export interface IdParameterInput {
  type: 'id';
  id: string;
  value: Value;
}

export type ParameterInput = IndexParameterInput | IdParameterInput;
