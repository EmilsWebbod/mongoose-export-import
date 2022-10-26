import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import {
  AnyObject,
  ExportImport,
  ExportImportDocument,
  ExportImportPopulate,
  ExportImportRequest,
  newIDKey,
  oldIDKey,
  TESTING,
  validateTransferQuery
} from '../utils';
import isPlainObject = require('lodash.isplainobject');

export async function importParent<
  D extends ExportImportDocument,
  M extends Model<D>,
  R extends ExportImportRequest
>(
  {
    model,
    baseQuery,
    importQuery,
    field,
    remote = [],
    replaceIds = [],
    ...params
  }: ExportImport<D, M>,
  file: D,
  req: R,
  overwrite: AnyObject = {},
  parents: D[] = []
) {
  const currentQuery = {
    ...(baseQuery ? baseQuery(req, parents) : {}),
    ...(importQuery ? importQuery(req, parents) : {})
  };
  validateTransferQuery(currentQuery);

  const remoteFields: AnyObject = {};

  for (const rem of remote) {
    remoteFields[rem.field] = file[rem.field].map((x: D) =>
      createObjectIds(x, req)
    );
    delete file[rem.field];
  }

  const objectWithIds = createObjectIds<D, M, R>(file, req);

  if (field) {
    // @ts-ignore
    req[field] = objectWithIds;
  }

  await importRemote(
    { field, model, remote, replaceIds, ...params },
    remoteFields,
    req,
    [...parents, objectWithIds]
  );

  const objectWithReplacedIds = replaceObjectIds(
    objectWithIds,
    replaceIds,
    req
  );

  const importObject = {
    ...objectWithReplacedIds,
    ...overwrite,
    ...currentQuery
  };

  return modelCreate<D, M>(model, importObject);
}

export function createObjectIds<
  D extends ExportImportDocument,
  M extends Model<D>,
  R extends ExportImportRequest
>(doc: D, req: ExportImportRequest) {
  if (!isPlainObject(doc)) {
    return doc;
  }

  const newModel: D = {} as D;

  for (const k in doc) {
    if (!doc.hasOwnProperty(k)) {
      continue;
    }

    if (k === oldIDKey && (!doc[newIDKey] || doc[newIDKey] === '')) {
      newModel[newIDKey] = new mongoose.Types.ObjectId().toHexString();
      req.ids.push({
        new: newModel[newIDKey],
        old: doc[oldIDKey]
      });
    } else if (Array.isArray(doc[k])) {
      newModel[k] = doc[k].map((x: D) => createObjectIds(x, req));
    } else {
      newModel[k] = createObjectIds(doc[k], req);
    }
  }

  return newModel;
}

export function replaceObjectIds<
  D extends ExportImportDocument,
  M extends Model<D>,
  R extends ExportImportRequest
>(model: AnyObject, replaceIds: string[], req: ExportImportRequest) {
  if (!isPlainObject(model)) {
    return model;
  }

  const newModel: AnyObject = {};

  for (const k in model) {
    if (!model.hasOwnProperty(k)) {
      continue;
    }

    if (Array.isArray(model[k])) {
      newModel[k] = model[k].map((x: AnyObject) => {
        if (
          typeof x === 'string' &&
          replaceIds.includes(k) &&
          mongoose.Types.ObjectId.isValid(x)
        ) {
          const id = req.ids.find(ids => ids.old === x);
          return id ? id.new : x;
        }

        return replaceObjectIds(x, replaceIds, req);
      });
    } else if (
      replaceIds.includes(k) &&
      mongoose.Types.ObjectId.isValid(model[k])
    ) {
      const id = req.ids.find(x => x.old === model[k]);
      newModel[k] = id ? id.new : model[k];
    } else {
      newModel[k] = model[k];
    }
  }

  return newModel;
}

async function importRemote<
  D extends ExportImportDocument,
  M extends Model<D>,
  R extends ExportImportRequest
>(
  { remote, ...params }: ExportImport<D, M>,
  file: AnyObject,
  req: ExportImportRequest,
  parents: D[]
) {
  if (!remote) {
    return null;
  }

  return await Promise.all(
    remote.map(x => {
      if (!file[x.field]) {
        throw new Error(`Could not find ${x.field} in file`);
      }
      return file[x.field].map((field: D) => {
        return importParent(
          {
            ...params,
            ...x
          },
          field,
          req,
          {},
          parents
        );
      });
    })
  );
}

function modelCreate<D extends ExportImportDocument, M extends Model<D>>(
  model: ExportImport<D, M>['model'],
  importObject: object
) {
  return TESTING ? importObject : mongoose.model(model).create(importObject);
}
