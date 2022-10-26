import {
  AnyObject,
  ExportImport,
  ExportImportBase,
  ExportImportDocument,
  ExportImportRequest,
  makeExportable,
  validateTransferQuery
} from '../utils';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

export async function exportParent<
  D extends ExportImportDocument,
  M extends Model<D>,
  R extends ExportImportRequest
>(req: ExportImportRequest, options: ExportImport<D, M>) {
  const { model, baseQuery, exportQuery, ...params } = options;

  const currentQuery: any = {
    ...(baseQuery ? baseQuery(req) : {}),
    ...(exportQuery ? exportQuery(req) : {})
  };
  validateTransferQuery(currentQuery);
  const mongooseModel = mongoose.model<D, M>(model);
  const modelQuery = mongooseModel.findOne(currentQuery);

  const mainModel = (await modelQuery.lean().exec()) as D;

  if (!mainModel) {
    throw new Error(
      `Could not find model "${model}" with query "${JSON.stringify(
        currentQuery,
        null,
        2
      )}"`
    );
  }

  return await exportModel(req, [mainModel], params);
}

export async function exportModel<
  D extends ExportImportDocument = ExportImportDocument,
  M extends Model<D> = Model<D>
>(
  req: ExportImportRequest,
  mainDocs: D[],
  { exclude, remote }: ExportImportBase<D, M>
): Promise<D> {
  const doc = mainDocs[mainDocs.length - 1];
  const model = makeExportable(doc, exclude);
  const remoteModels = await exportRemotes(req, mainDocs, remote);

  return {
    ...model,
    ...remoteModels
  } as D;
}

export async function exportRemotes<
  D extends ExportImportDocument = ExportImportDocument,
  M extends Model<D> = Model<D>
>(
  req: ExportImportRequest,
  mainDocs: D[],
  remotes?: Array<ExportImport<D, M>>
): Promise<AnyObject | null> {
  if (!remotes || !Array.isArray(remotes)) {
    return null;
  }

  const promises = remotes.map(remote => exportRemote(req, mainDocs, remote));

  return (await Promise.all(promises)).reduce(
    (obj, result, i) => ({ ...obj, [remotes[i].field as string]: result }),
    {}
  );
}

export async function exportRemote<
  D extends ExportImportDocument = ExportImportDocument,
  M extends Model<D> = Model<D>
>(req: ExportImportRequest, mainDocs: D[], remote: ExportImport<D, M>) {
  const query = {
    ...(remote.baseQuery ? remote.baseQuery(req, mainDocs) : {}),
    ...(remote.exportQuery ? remote.exportQuery(req, mainDocs) : {})
  };
  validateTransferQuery(query);

  const mongooseQuery = mongoose.model(remote.model).find(query);

  const documents: D[] = await mongooseQuery.lean();
  if (!documents) {
    console.warn(
      `Could not find a document with "${
        remote.model
      }" and query "${JSON.stringify(query, null, 2)}"`
    );
    return null;
  }

  return await Promise.all(
    documents.map((doc: D) => exportModel(req, [...mainDocs, doc], remote))
  );
}
