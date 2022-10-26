import { describe, it } from 'vitest';
import { importParent } from '../src/import';
import MongooseExportImport, { ExportImport } from '../src/index';
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

const replaceIds = [
  'pages',
  'upsellTemplate',
  'period',
  'algorithm',
  'packages',
  'assortments',
  'partOfPackage',
  'partOfAssortment',
  'recommendation',
  'labels',
  'value',
  'optionLabels',
  '_orderID',
  '_order_categories',
  '_order_sections',
  '_order_products'
];

const exclude = [...defaultExcludeIds, 'customers'];

const opts: ExportImport<any, any, any> = {
  model: 'Project',
  field: 'project',
  exportQuery: req => ({
    _id: req.project._id
  }),
  importQuery: req => ({
    organization: req.organization._id
  }),
  exclude,
  replaceIds,
  remote: projectExportImportRemote(0)
};

export const exportImportProject = new MongooseExportImport<
  any,
  any,
  any & { ids: any[] }
>(opts);

describe('Import', () => {
  it('should import project with replaced ids in all parts', async () => {
    const req: any = { organization: { _id: '' }, ids: [] };
    const res = await importParent(opts, mockImport, req, {});
    console.log('res', JSON.stringify(res, null, 2));
  });
});
