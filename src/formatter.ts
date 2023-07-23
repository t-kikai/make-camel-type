import { snakeToCamel } from './snakeToCamel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getJsonTypeDefinition(rawObj: any): string {
  const jsonObj = snakeToCamel(rawObj);
  const getType = (value: unknown, indent = 0): string => {
    const spaces = ' '.repeat(indent);
    if (Array.isArray(value)) {
      // 配列の型を取得
      const elementType =
        value.length > 0 ? getType(value[0], indent + 2) : 'any';
      return `${elementType}[]`;
    } else if (typeof value === 'object' && value !== null) {
      // オブジェクトの型を取得
      const properties = Object.entries(value).map(([key, val]) => {
        const nestedType = getType(val, indent + 2);
        return `${spaces}${key}: ${nestedType}`;
      });
      return properties.length > 0
        ? `{\n${properties.join(',\n')}\n${spaces}}`
        : '{}';
    } else {
      // 基本型の型を取得
      return typeof value;
    }
  };

  const typeDefinition = getType(jsonObj, 2);
  return typeDefinition === '{}' ? '' : typeDefinition;
}
