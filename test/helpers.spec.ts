import { assert } from 'chai';
import {
  ImportMongooseId,
  importNewSchemaIds,
  importReplaceField,
  importReplaceIds,
  traverseObject
} from '../src/helpers';
import { Types } from 'mongoose';

const copy = Types.ObjectId().toHexString();

const ignore = {
  _id: Types.ObjectId().toHexString()
};

const obj: ImportMongooseId = {
  _id: Types.ObjectId().toHexString(),
  null: null,
  obj: {
    _id: copy,
    obj: {
      _id: Types.ObjectId().toHexString()
    },
    null: null,
    ignore
  },
  arr: [
    {
      _id: Types.ObjectId().toHexString(),
      copy: 'copy',
      null: null
    },
    {
      _id: Types.ObjectId().toHexString(),
      obj: {
        _id: Types.ObjectId().toHexString()
      },
      copy,
      ignore
    }
  ],
  copy,
  ignore
};

describe('helpers functions', () => {
  it('should add new ids with object that contains _id', () => {
    const [retObj, ids] = importNewSchemaIds(obj);
    assert.isObject(retObj);
    assert.isArray(ids);
    assert.lengthOf(ids, 9);
    assert.isDefined(retObj.__id);
    assert.isDefined(retObj.obj.__id);
    assert.isDefined(retObj.arr[0].__id);
    assert.isDefined(retObj.arr[1].obj.__id);
  });

  it('should not replace null values with {}', () => {
    const [retObj] = importNewSchemaIds(obj);
    assert.isNull(retObj.null);
    assert.isNull(retObj.obj.null);
    assert.isNull(retObj.arr[0].null);
  });

  it('should replace all ids that is replaced with new id', () => {
    const [retObj, ids] = importNewSchemaIds(obj);
    const newOjb = importReplaceIds(retObj, ids, ['copy']);
    assert.equal(newOjb.obj._id, newOjb.copy);
    assert.equal(newOjb.arr[0].copy, newOjb.arr[0].copy);
    assert.equal(newOjb.obj._id, newOjb.arr[1].copy);
  });

  it('should traverse object and run fn', () => {
    const ret = traverseObject(obj, key => {
      return key;
    });
    assert.equal(ret._id, '_id');
  });

  it('should traverse and ignore keys', () => {
    const ret = traverseObject(
      obj,
      key => {
        return key;
      },
      ['ignore']
    );
    assert.equal(ret.ignore._id, ignore._id);
    assert.equal(ret.obj.ignore._id, ignore._id);
    assert.equal(ret.arr[1].ignore._id, ignore._id);
  });

  it('should run importReplaceField and replace fields given', () => {
    const ret = importReplaceField(obj, ['copy', value => 'any']);
    assert.equal(ret.copy, 'any');
  });
});
