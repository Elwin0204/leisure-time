/* eslint-disable no-console */
/**
 * @description 工具函數
 */
export function deepClone<T>(source: T) {
  if (!source) {
    return source;
  }
  const target: T = (Array.isArray(source) ? [] : {}) as T;
  switch (typeof source) {
    case 'object':
      for (const key in source) {
        const isObject = Object.prototype.toString.call(source[key]) === '[object Object]';
        if (isObject || Array.isArray(source[key])) {
          target[key] = deepClone(source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    case 'function':
      console.warn('deepClone warn: 不支持function類型對象的deep clone');
      return target;
    case 'bigint':
      console.warn('deepClone warn: 不支持bigint類型對象的deep clone');
      return target;
    case 'symbol':
      console.warn('deepClone warn: 不支持symbol類型對象的deep clone');
      return target;
    default:
      return source;
  }
}
