/**
 * Node.js 21+ removed legacy util.is* helpers still used by oracledb@5.5 and mongoose@7.
 * Import this file before any other backend module.
 */
import util from 'util'

type LegacyUtil = typeof util & {
  isArray?: (object: unknown) => object is unknown[]
  isBoolean?: (object: unknown) => object is boolean
  isBuffer?: (object: unknown) => object is Buffer
  isDate?: (object: unknown) => object is Date
  isError?: (object: unknown) => object is Error
  isFunction?: (object: unknown) => object is (...args: unknown[]) => unknown
  isNull?: (object: unknown) => object is null
  isNullOrUndefined?: (object: unknown) => object is null | undefined
  isNumber?: (object: unknown) => object is number
  isObject?: (object: unknown) => object is object
  isPrimitive?: (object: unknown) => boolean
  isRegExp?: (object: unknown) => object is RegExp
  isString?: (object: unknown) => object is string
  isSymbol?: (object: unknown) => object is symbol
  isUndefined?: (object: unknown) => object is undefined
}

const legacyUtil = util as LegacyUtil

if (!legacyUtil.isDate) {
  legacyUtil.isDate = (object): object is Date => object instanceof Date
}

if (!legacyUtil.isArray) {
  legacyUtil.isArray = (object): object is unknown[] => Array.isArray(object)
}

if (!legacyUtil.isBoolean) {
  legacyUtil.isBoolean = (object): object is boolean => typeof object === 'boolean'
}

if (!legacyUtil.isBuffer) {
  legacyUtil.isBuffer = (object): object is Buffer =>
    typeof Buffer !== 'undefined' && Buffer.isBuffer(object)
}

if (!legacyUtil.isError) {
  legacyUtil.isError = (object): object is Error => object instanceof Error
}

if (!legacyUtil.isFunction) {
  legacyUtil.isFunction = (object): object is (...args: unknown[]) => unknown =>
    typeof object === 'function'
}

if (!legacyUtil.isNull) {
  legacyUtil.isNull = (object): object is null => object === null
}

if (!legacyUtil.isNullOrUndefined) {
  legacyUtil.isNullOrUndefined = (object): object is null | undefined =>
    object === null || object === undefined
}

if (!legacyUtil.isNumber) {
  legacyUtil.isNumber = (object): object is number =>
    typeof object === 'number' && Number.isFinite(object)
}

if (!legacyUtil.isObject) {
  legacyUtil.isObject = (object): object is object =>
    object !== null && (typeof object === 'object' || typeof object === 'function')
}

if (!legacyUtil.isPrimitive) {
  legacyUtil.isPrimitive = (object) =>
    object === null || (typeof object !== 'object' && typeof object !== 'function')
}

if (!legacyUtil.isRegExp) {
  legacyUtil.isRegExp = (object): object is RegExp => object instanceof RegExp
}

if (!legacyUtil.isString) {
  legacyUtil.isString = (object): object is string => typeof object === 'string'
}

if (!legacyUtil.isSymbol) {
  legacyUtil.isSymbol = (object): object is symbol => typeof object === 'symbol'
}

if (!legacyUtil.isUndefined) {
  legacyUtil.isUndefined = (object): object is undefined => object === undefined
}

export {}
