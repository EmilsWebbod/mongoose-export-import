import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import {newIDKey, oldIDKey} from '../utils';

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

export interface TraverseObjectOptions<T> {
  keys?: string[];
  ignore?: string[];
  arrays?: string[];
  alwaysReplace?: string[];
}

type ReturnObj<T> = T & ImportId;
type ImportObj = ImportMongooseId & ImportId;

export function importNewIdsAndReplace<T extends ImportMongooseId>(
  obj: T,
  replace?: string[],
  opts?: TraverseObjectOptions<T>
) {
  const [retObj, ids] = importNewSchemaIds(obj, opts);
  return importReplaceIds(retObj, ids, replace, opts);
}

export function importNewSchemaIds<T extends ImportMongooseId>(
  doc: T,
  opts?: TraverseObjectOptions<T>
): [ReturnObj<T>, ImportIdReferences[]] {
  const ids: ImportIdReferences[] = [];

  const newDoc = traverseObject(
    doc,
    (key, value, obj: ImportObj | string[]) => {
      if (key === newIDKey || (opts?.arrays?.includes(key))) {
        const newId = mongoose.Types.ObjectId().toHexString();
        const old =
          typeof value === 'string'
            ? value
            : (value as Types.ObjectId).toHexString();
        if (Array.isArray(obj)) {
          ids.push({ new: newId, old });
        } else {
          obj[oldIDKey] =
            typeof value === 'string'
              ? value
              : (value as Types.ObjectId).toHexString();
          ids.push({ new: newId, old });
        }
        return newId;
      }
      return value;
    },
    opts
  ) as ReturnObj<T>;

  return [newDoc, ids];
}

export function importReplaceIds<T extends ImportObj>(
  doc: T,
  ids: ImportIdReferences[],
  replace?: string[],
  opts?: TraverseObjectOptions<T>
): T {
  return traverseObject(
    doc,
    (key, value) => {
      if (
        typeof value === 'string' &&
        (!replace || replace.some((x) => x === key))
      ) {
        const replaceId = ids.find((x) => x.old === value);
        if (replaceId) {
          return replaceId.new;
        } else if (opts?.alwaysReplace?.includes(key)) {
          return mongoose.Types.ObjectId().toHexString();
        }
      }
      return value;
    },
    opts
  );
}

type ImportReplace = [
  string,
  (value: unknown, newObj: object, oldObj: object) => any
];

export function importReplaceField<T extends object>(
  doc: T,
  keys: ImportReplace | ImportReplace[],
  opts?: TraverseObjectOptions<T>
) {
  const findKeys = Array.isArray(keys[0]) ? (keys as ImportReplace[]) : [keys];
  return traverseObject(
    doc,
    (key, value, newObj, oldObj) => {
      const found = findKeys.find(x => x[0] === key);
      return found && typeof found[1] === 'function'
        ? found[1](value, newObj, oldObj)
        : value;
    },
    opts
  );
}

export function exportCreate<T extends object>(
  exportObj: T,
  exclude: string[]
) {
  traverseObject(exportObj, (key, value, obj) => {
    if (exclude.includes(key)) {
      delete obj[key];
      return;
    }
    return value;
  });
}

export function traverseObject<T extends object, K extends keyof T>(
  obj: T,
  fn: (key: string, value: unknown, newObj: any, oldObj: any) => any,
  opts?: TraverseObjectOptions<T>
): T {
  if (!(typeof obj === 'object') || Array.isArray(obj)) {
    return obj;
  }

  const newObj: T = {} as T;

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    const value = obj[key];
    const hasKeys = Boolean(opts && opts.keys);

    if (hasKeys) {
      // @ts-ignore
      if (opts!.keys!.some(x => x === key)) {
        newObj[key] = fn(key, value, newObj, obj);
        continue;
      }
      if (!value) {
        newObj[key] = value;
        continue;
      }
    }

    // @ts-ignore
    if (opts && opts.ignore && opts.ignore.some(x => x === key)) {
      newObj[key] = value;
      continue;
    }

    // @ts-ignore
    if (opts && opts.arrays && opts.arrays.some(x => x === key)) {
      if (value && Array.isArray(value)) {
        newObj[key] = (value as any).map((id: any) =>
          fn(key, id, newObj, obj)
        );
      } else {
        newObj[key] = value;
      }
      continue;
    }

    if (!value) {
      newObj[key] = fn(key, value, newObj, obj);
    } else if (Array.isArray(value)) {
      newObj[key] = (value as any).map((x: any) => traverseObject(x, fn, opts));
    } else if (typeof value === 'object') {
      newObj[key] = traverseObject(value as any, fn, opts);
    } else {
      if (hasKeys) {
        newObj[key] = value;
      } else {
        newObj[key] = fn(key, value, newObj, obj);
      }
    }
  }

  return newObj as T;
}
