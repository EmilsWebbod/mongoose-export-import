import { describe, it } from 'vitest';
import { importParent } from '../src/import';
import { ExportImport } from '../src';
import { mockImport } from './mock/import.mock';

const defaultExcludeIds = [
  '_id',
  '__v',
  'lastChange',
  'history',
  'archived',
  'locked',
  'organization',
  'created'
];

const baseQuery = (projectLevel: number) => (req: any, parents?: any[]) => ({
  organization: req.organization._id,
  project: parents ? parents[projectLevel]._id : undefined,
  archived: false
});

export const projectExportImportRemote = (
  projectLevel: number
): Array<ExportImport<any, any, any & { ids: any[] }>> => [
  {
    model: 'UnitTemplate',
    field: 'unitTemplates',
    baseQuery: baseQuery(projectLevel),
    exclude: defaultExcludeIds
  },
  {
    model: 'UpsellTemplate',
    field: 'content',
    baseQuery: baseQuery(projectLevel),
    exclude: defaultExcludeIds
  },
  {
    model: 'Product',
    field: 'products',
    baseQuery: baseQuery(projectLevel),
    exclude: defaultExcludeIds
  },
  {
    model: 'Recommendation',
    field: 'recommendations',
    baseQuery: baseQuery(projectLevel),
    exclude: defaultExcludeIds
  },
  {
    model: 'Page',
    field: 'remotePages',
    baseQuery: baseQuery(projectLevel),
    exclude: defaultExcludeIds
  },
  {
    model: 'OptionLabel',
    field: 'remoteOptionLabels',
    baseQuery: baseQuery(projectLevel),
    exclude: defaultExcludeIds
  }
];

const opts: ExportImport<any, any, any> = {
  model: 'Project',
  field: 'project',
  exportQuery: req => ({
    _id: req.project._id
  }),
  importQuery: req => ({
    organization: req.organization._id
  }),
  exclude: [...defaultExcludeIds, 'customers'],
  replaceFields: ['_orderID'],
  idArrays: [
    'pages',
    'availableProducts',
    'labels',
    'optionLabels',
    '_order_categories',
    '_order_sections',
    '_order_products'
  ],
  replaceIds: [
    'upsellTemplate',
    'period',
    'algorithm',
    'partOfPackage',
    'partOfAssortment',
    'recommendation',
    'product'
  ],
  remote: projectExportImportRemote(0)
};

describe('Import', () => {
  it('should import project with replaced ids in all parts', async () => {
    const req: any = { organization: { _id: '' }, ids: [] };
    const res = await importParent(opts, mockImport, req, {});
    console.info('res', JSON.stringify(res, null, 2));
  });
});
