import { Model } from 'mongoose';
import {
  AnyObject,
  ExportImport,
  ExportImportDocument,
  ExportImportRequest
} from './utils';
import { exportParent } from './export';
import { importParent } from './import';
import {
  ImportId,
  ImportIdReferences,
  ImportMongooseId,
  importNewIdsAndReplace,
  importNewSchemaIds,
  importReplaceField,
  importReplaceIds,
  traverseObject,
  exportCreate
} from './helpers';

export default class MongooseExportImport<
  D extends ExportImportDocument,
  M extends Model<D>,
  R extends ExportImportRequest
> {
  private readonly options: ExportImport<D, M, R>;

  constructor(props: ExportImport<D, M, R>) {
    this.options = {
      exclude: [] as any,
      remote: [],
      populate: [],
      ...props
    };

    this.export = this.export.bind(this);
  }

  public async export(req: R) {
    req.ids = [];

    // @ts-ignore
    return await exportParent(req as R, this.options);
  }

  public async import(req: R, json: AnyObject, body: AnyObject) {
    req.ids = [];

    if (typeof json !== 'object') {
      throw new Error('json should be typeof object');
    }

    // @ts-ignore
    const model = await importParent(this.options, json, req, body);

    if (this.options.afterImport) {
      await this.options.afterImport(req);
    }

    return model;
  }
}

export {
  importNewIdsAndReplace,
  importReplaceField,
  importReplaceIds,
  importNewSchemaIds,
  ImportMongooseId,
  ImportId,
  ImportIdReferences,
  traverseObject,
  exportCreate,
  ExportImport
};
