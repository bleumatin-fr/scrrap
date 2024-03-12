import Model from './model';

const seed = async () => {
  const modelsToRegister = [
    {
      name: 'Activités',
      singularName: 'Activité',
      type: 'activity',
      class: 'punctual',
      description: '',
      spreadsheetId: 'activity',
      color: '#FF7E6B',
      config: {
        parameters: {
          range: 'Paramètres!A2:R500',
          columnIndexes: {
            sectors: [0, 1, 2],
            parameters: {
              name: 3,
              description: 4,
              id: 5,
              type: 6,
              display: 7,
              value: 8,
              possibleValues: 9,
              unit: 10,
              initialValue: 11,
              min: 12,
              max: 13,
              step: 14,
              information: 15,
              displayOnCreate: 16,
            },
          },
          defaultTitle: 'Mon calcul',
          titleParameterId: ['Project Name'],
          sectors: [
            {
              color: '#6A602C',
              icon: 'material',
              children: [],
            },
            {
              color: '#191C6B',
              icon: 'transport-good',
              children: [],
            },
            {
              color: '#D7FEAF',
              icon: 'transport-person',
              children: [],
            },
            {
              color: '#408C73',
              icon: 'investment',
              children: [],
            },
            {
              color: '#A5D152',
              icon: 'goods-new',
              children: [],
            },
            {
              color: '#9EFD38',
              icon: 'purchasing',
              children: [],
            },
            {
              color: '#42DAA7',
              icon: 'machine-use',
              children: [],
            },
            {
              color: '#6D72DD',
              icon: 'machine-maintenance',
              children: [],
            },
            {
              color: '#697A23',
              icon: 'waste',
              children: [],
            },
            {
              color: '#E6F93B',
              icon: 'stakeholders',
              children: [],
            },
            {
              color: '#E6F93B',
              icon: 'info',
              children: [],
            },
          ],
        },
        results: {
          range: 'Résultats!A1:K400',
          mainIndicatorCode: "co2",
          mainIndicatorDuration: 1,
          mainPieCode: "co2_detailed"
        },
      },
    },
  ];

  await Promise.all(
    modelsToRegister.map((model) => {
      return Model.findOneAndUpdate({ type: model.type }, model, {
        upsert: true,
        new: true,
      });
    }),
  );

  console.log('Project Models seeded');
};

export default seed;
