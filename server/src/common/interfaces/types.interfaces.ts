/**
 * Generic object type
 */
export type ObjectType<T> = {
  [key in string]: T;
};
