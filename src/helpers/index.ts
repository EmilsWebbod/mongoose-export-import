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

export interface TraverseObjectOptions<T> {
  keys?: Array<Paths<T>>;
  ignore?: Array<Paths<T>>;
}

type ReturnObj<T> = T & ImportId;
type ImportObj = ImportMongooseId & ImportId;

export type Path<T> = { [K in keyof T]: T[K] extends object ? Paths<T[K]> : K };
export type Paths<A> = A extends any[]
  ? never
  : A extends object
  ? Path<A>[keyof A] | keyof A
  : never;

export function importNewIdsAndReplace<T extends ImportMongooseId>(
  obj: T,
  replace?: Array<Paths<T>>,
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
    (k, value, obj: ImportObj) => {
      if (k === '_id') {
        const newId = mongoose.Types.ObjectId().toHexString();
        obj.__id = typeof value === 'string' ? value : value.toHexString();
        ids.push({ new: newId, old: obj.__id! });
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
  replace?: Array<Paths<T>>,
  opts?: TraverseObjectOptions<T>
): T {
  return traverseObject(
    doc,
    (key, value) => {
      if (
        typeof value === 'string' &&
        (!replace || replace.some(x => x === key))
      ) {
        const replaceId = ids.find(x => x.old === value);
        if (replaceId) {
          return replaceId.new;
        }
      }
      return value;
    },
    opts
  );
}

type ImportReplace = [string, (value: unknown) => any];

export function importReplaceField<T extends object>(
  doc: T,
  keys: ImportReplace | ImportReplace[],
  opts?: TraverseObjectOptions<T>
) {
  const findKeys = Array.isArray(keys[0]) ? (keys as ImportReplace[]) : [keys];
  return traverseObject(
    doc,
    (key, value) => {
      const found = findKeys.find(x => x[0] === key);
      // @ts-ignore
      return found ? found[1](value) : value;
    },
    opts
  );
}

interface AnyObject {
  [key: string]: any;
}

export function traverseObject<T extends object, K extends keyof T>(
  obj: T,
  fn: <A extends keyof T>(key: keyof T, value: T[A], obj: T) => any,
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
    const hasKeys = Boolean(opts && opts.keys);

    if (hasKeys) {
      // @ts-ignore
      if (opts!.keys!.some(x => x === key)) {
        newObj[key] = fn(key, obj[key], newObj);
        continue;
      }
    }

    // @ts-ignore
    if (opts && opts.ignore && opts.ignore.some(x => x === key)) {
      newObj[key] = obj[key];
      continue;
    }

    if (!hasKeys && !obj[key]) {
      newObj[key] = fn(key, obj[key], newObj);
    } else if (Array.isArray(obj[key])) {
      newObj[key] = (obj[key] as any).map((x: any) =>
        traverseObject(x, fn, opts)
      );
    } else if (typeof obj[key] === 'object') {
      newObj[key] = traverseObject(obj[key] as any, fn, opts) as any;
    } else {
      if (hasKeys) {
        newObj[key] = obj[key];
      } else {
        newObj[key] = fn(key, obj[key], newObj);
      }
    }
  }

  return newObj as T;
}

function isObjectOrArray(obj: object | any[]) {
  return typeof obj === 'object' || Array.isArray(obj);
}
