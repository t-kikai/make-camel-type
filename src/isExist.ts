export const isExist = <T>(value: T): value is NonNullable<T> => {
	return value !== undefined && value !== null;
};
