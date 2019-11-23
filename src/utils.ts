import { Request } from 'express';
import { Document, Model, Types } from 'mongoose';

// tslint:disable-next-line:no-var-requires
const isPlainObject = require('lodash.isplainobject');

export interface AnyObject {
  [key: string]: any;
}
export type ExportImportQueryFn<
  D extends ExportImportDocument,
  R extends ExportImportRequest
> = (req: R, docs?: D[]) => AnyObject;
export type ExportImportPopulate = string[];
export interface ExportImportId {
  new: string | Types.ObjectId;
  old: string | Types.ObjectId;
}

export interface ExportImportDocument extends Document {
  [key: string]: any;
}

export interface ExportImportRequest extends Request {
  ids: ExportImportId[];
}

export interface ExportImportBase<
  D extends ExportImportDocument = ExportImportDocument,
  M extends Model<D> = Model<D>,
  R extends ExportImportRequest = ExportImportRequest
> {
  field: string;
  exclude?: Array<keyof D>;
  replaceIds?: string[];
  afterImport?: (req: R) => void;
  populate?: ExportImportPopulate;
  remote?: Array<ExportImport<D, M, R>>;
}

export interface ExportImport<
  D extends ExportImportDocument = ExportImportDocument,
  M extends Model<D> = Model<D>,
  R extends ExportImportRequest = ExportImportRequest
> extends ExportImportBase<D, M, R> {
  model: string;
  baseQuery?: ExportImportQueryFn<D, R>;
  importQuery?: ExportImportQueryFn<D, R>;
  exportQuery?: ExportImportQueryFn<D, R>;
}

const coreExcludeFields = <T extends ExportImportDocument>(
  exclude: Array<keyof T> = []
): Array<keyof T> => ['_id', '__v', ...exclude];

export function makeExportable<T extends ExportImportDocument>(
  elem: T,
  suppliedExcludeFields: Array<keyof T> = []
): T {
  if (!isPlainObject(elem)) {
    return elem;
  }

  const exportableObject: Partial<T> = {};
  const excludeFields: Array<keyof T> = coreExcludeFields(
    suppliedExcludeFields
  );

  // tslint:disable-next-line:forin
  for (const k in elem) {
    if (k === '_id') {
      // @ts-ignore
      exportableObject.__id = elem._id;
    }

    if (!excludeFields.includes(k)) {
      const val = elem[k];

      if (Array.isArray(val)) {
        exportableObject[k] = val.map((v: T) =>
          makeExportable(v, excludeFields)
        );
      } else if (typeof val === 'object') {
        // @ts-ignore
        exportableObject[k] = makeExportable(val, excludeFields);
      } else {
        exportableObject[k] = val;
      }
    }
  }

  return exportableObject as T;
}

export function validateTransferQuery(query: AnyObject) {
  if (!query) {
    throw new Error(`query is undefined`);
  }

  for (const key in query) {
    if (!(key in query)) {
      return new Error(`Object with key ${key} is empty. Check query function`);
    }
  }
}
