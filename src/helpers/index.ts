import * as mongoose from 'mongoose';

export interface ImportMongooseId {
  _id: string;

  [key: string]: ImportMongooseId | ImportMongooseId[] | any;
}

export interface ImportId {
  __id: string;
}

export interface ImportIdReferences {
  new: string;
  old: string;
}

type ReturnObj<T> = T & ImportId;
type ImportObj = ImportMongooseId & ImportId;
type IgnoreKeys = string[];

export function importNewIdsAndReplace<T extends ImportMongooseId>(
  obj: T,
  keys?: string[],
  ignore?: IgnoreKeys
) {
  const [retObj, ids] = importNewSchemaIds(obj, ignore);
  return importReplaceIds(retObj, ids, keys, ignore);
}

export function importNewSchemaIds<T extends ImportMongooseId>(
  doc: T,
  ignore?: IgnoreKeys
): [ReturnObj<T>, ImportIdReferences[]] {
  const ids: ImportIdReferences[] = [];

  const newDoc = traverseObject(
    doc,
    (k, value: any, obj: ImportObj) => {
      if (k === '_id') {
        const newId = mongoose.Types.ObjectId().toHexString();
        obj.__id = typeof value === 'string' ? value : value.toHexString();
        ids.push({ new: newId, old: obj.__id });
        return newId;
      }
      return value;
    },
    ignore
  ) as ReturnObj<T>;

  return [newDoc, ids];
}

export function importReplaceIds<T extends ImportObj>(
  doc: T,
  ids: ImportIdReferences[],
  keys?: string[],
  ignore?: IgnoreKeys
): T {
  return traverseObject(
    doc,
    (key, value) => {
      if (typeof value === 'string' && (!keys || keys.some(x => x === key))) {
        const replaceId = ids.find(x => x.old === value);
        if (replaceId) {
          return replaceId.new;
        }
      }
      return value;
    },
    ignore
  );
}

type ImportReplace = [string, (value: unknown) => any];

export function importReplaceField<T extends object>(
  doc: T,
  keys: ImportReplace | ImportReplace[],
  ignore?: IgnoreKeys
) {
  const findKeys = Array.isArray(keys[0]) ? (keys as ImportReplace[]) : [keys];
  return traverseObject(
    doc,
    (key, value) => {
      const found = findKeys.find(x => x[0] === key) as ImportReplace;
      return found ? found[1](value) : value;
    },
    ignore
  );
}

interface AnyObject {
  [key: string]: any;
}

export function traverseObject<T extends AnyObject, K extends keyof T>(
  obj: T,
  fn: (key: string, value: unknown, obj: any) => any,
  ignore?: string[]
): T {
  if (!(typeof obj === 'object') || Array.isArray(obj)) {
    return obj;
  }

  const newObj: Partial<T> = {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    if (ignore && ignore.some(x => x === key)) {
      newObj[key] = obj[key];
      continue;
    }

    if (!obj[key]) {
      newObj[key] = fn(key, obj[key], newObj);
    } else if (Array.isArray(obj[key])) {
      newObj[key] = obj[key].map((x: T[K]) => traverseObject(x, fn, ignore));
    } else if (typeof obj[key] === 'object') {
      newObj[key] = traverseObject(obj[key], fn, ignore);
    } else {
      newObj[key] = fn(key, obj[key], newObj);
    }
  }

  return newObj as T;
}

function isObjectOrArray(obj: object | any[]) {
  return typeof obj === 'object' || Array.isArray(obj);
}
