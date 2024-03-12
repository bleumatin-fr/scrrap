import { Model } from '@scrrap/core';
import { model, Schema } from 'mongoose';

const modelSchema = new Schema<Model>(
  {
    name: { type: String, required: true },
    singularName: { type: String, required: true },
    type: { type: String, required: true, unique: true },
    class: { type: String, required: true, unique: true },
    description: { type: String },
    color: { type: String },
    spreadsheetId: { type: String, required: true },
    config: {
      parameters: {
        range: { type: String, required: true },
        columnIndexes: { type: Schema.Types.Mixed, required: true },
        defaultTitle: { type: String },
        startDateId: { type: String },
        endDateId: { type: String },
        titleParameterId: { type: [String] },
        types: { type: Schema.Types.Mixed },
        sectors: { type: Schema.Types.Mixed },
        externalModules: { type: Schema.Types.Mixed },
      },
      results: {
        range: { type: String, required: true },
        mainIndicatorCode: { type: String, required: true },
        mainIndicatorDuration: { type: Number },
        mainPieCode: { type: String, required: true },
      },
      actions: {
        type: {
          columnIndexes: { type: Schema.Types.Mixed, required: true },
          range: { type: String, required: true },
        },
        required: false,
      },
      sectors: { type: Schema.Types.Mixed, required: false },
      types: { type: Schema.Types.Mixed, required: false },
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

export default model<Model>('Model', modelSchema);
