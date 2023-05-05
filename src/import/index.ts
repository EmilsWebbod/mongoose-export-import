import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import {
  AnyObject,
  ExportImport,
  ExportImportDocument,
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
    idArrays = [],
    replaceFields = [],
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
      createObjectIds(x, req, replaceFields, idArrays)
    );
    delete file[rem.field];
  }

  const objectWithIds = createObjectIds<D, M, R>(file, req, replaceFields, idArrays);

  if (field) {
    // @ts-ignore
    req[field] = objectWithIds;
  }

  await importRemote(
    { field, model, remote, replaceIds, idArrays, replaceFields, ...params },
    remoteFields,
    req,
    [...parents, objectWithIds]
  );

  const objectWithReplacedIds = replaceObjectIds(
    objectWithIds,
    replaceIds,
    idArrays,
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
>(doc: D, req: ExportImportRequest, replaceFields: string[], idArrays: string[]) {
  if (!isPlainObject(doc)) {
    return doc;
  }

  const newModel: D = {} as D;

  for (const k in doc) {
    if (!doc.hasOwnProperty(k)) {
      continue;
    }

    if (k === oldIDKey && (!doc[newIDKey] || doc[newIDKey] === '')) {
      const alreadyChanged = req.ids.find((x) => x.old === doc[oldIDKey]);
      if (alreadyChanged) {
        newModel[newIDKey] = alreadyChanged.new;
      } else {
        newModel[newIDKey] = new mongoose.Types.ObjectId().toHexString();
        req.ids.push({
          new: newModel[newIDKey],
          old: doc[oldIDKey]
        });
      }
    } else if (idArrays.includes(k)) {
      const v = doc[k];
      if (Array.isArray(v) && typeof v[0] === 'string') {
        // @ts-ignore
        newModel[k] = new Array(v.length);
        v.forEach((x: string, i: number) => {
          newModel[k][i] = new mongoose.Types.ObjectId().toHexString() as any;
          req.ids.push({ new: newModel[k], old: x });
        });
      }
    } else if (replaceFields.includes(k)) {
      newModel[k] = new mongoose.Types.ObjectId().toHexString() as any;
      req.ids.push({ new: newModel[k], old: doc[k] });
    } else if (Array.isArray(doc[k])) {
      newModel[k] = doc[k].map((x: D) =>
        createObjectIds(x, req, replaceFields, idArrays)
      );
    } else {
      newModel[k] = createObjectIds(doc[k], req, replaceFields, idArrays);
    }
  }

  return newModel;
}

export function replaceObjectIds<
  D extends ExportImportDocument,
  M extends Model<D>,
  R extends ExportImportRequest
>(
  model: AnyObject,
  replaceIds: string[],
  idArrays: string[],
  req: ExportImportRequest
) {
  if (!isPlainObject(model)) {
    return model;
  }

  const newModel: AnyObject = {};

  for (const k in model) {
    const v = model[k];
    if (Array.isArray(v)) {
      if (
        idArrays.includes(k) &&
        idArrays.length > 0 &&
        typeof idArrays[0] === 'string'
      ) {
        newModel[k] = v.map((x: string) => {
          const id = req.ids.find((ids) => ids.old === x);
          return id ? id.new : x;
        });
      } else {
        newModel[k] = v.map((x: AnyObject) => {
          if (
            typeof x === 'string' &&
            replaceIds.includes(k) &&
            mongoose.Types.ObjectId.isValid(x)
          ) {
            const id = req.ids.find((ids) => ids.old === x);
            return id ? id.new : x;
          }

          return replaceObjectIds(x, replaceIds, idArrays, req);
        });
      }
    } else if (v && typeof v === 'object') {
      newModel[k] = replaceObjectIds(v, replaceIds, idArrays, req);
    } else if (replaceIds.includes(k) && mongoose.Types.ObjectId.isValid(v)) {
      const id = req.ids.find((x) => x.old === v);
      newModel[k] = id ? id.new : v;
    } else {
      newModel[k] = v;
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
    remote.map((x) => {
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
  if (TESTING) {
    console.info(model, JSON.stringify(importObject, null, 2));
  }
  return TESTING ? importObject : mongoose.model(model).create(importObject);
}
