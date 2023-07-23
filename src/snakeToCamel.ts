import { camelCase } from 'lodash';
import { isExist } from './isExist';
// 参考: https://zenn.dev/kazuwombat/articles/038963ca99854e
// ※ 上記が配列に対応してないようだったので、少し手を加えている
type SnakeToCamelCase<T extends string> = T extends `${infer R}_${infer U}`
  ? `${R}${Capitalize<SnakeToCamelCase<U>>}`
  : T;

export type SnakeToCamel<T> = {
  [K in keyof T as `${SnakeToCamelCase<string & K>}`]: T[K] extends unknown[]
    ? Array<SnakeToCamel<T[K][0]>>
    : T[K] extends object
    ? SnakeToCamel<T[K]>
    : T[K];
};

export const snakeToCamel = <T extends object>(
  targetObject: T,
): SnakeToCamel<T> => {
  if (!isExist(targetObject)) return targetObject;
  if (typeof targetObject !== 'object') return targetObject;
  if (Array.isArray(targetObject))
    return targetObject.map(item => snakeToCamel(item)) as SnakeToCamel<T>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return Object.entries(targetObject).reduce<SnakeToCamel<T>>(
    (returnObject, [key, value]) => {
      return {
        ...returnObject,
        [camelCase(key).replace('I18N', 'I18n')]: snakeToCamel(value),
      };
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    {},
  );
};
