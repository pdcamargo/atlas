type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? PathValue<T[Key], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

/**
 * Get the value at the given path of object.
 *
 * Optionally, you can provide a default value to return if the path is not found.
 */
export function get<T, P extends string>(
  obj: T,
  path: P,
  defaultValue: PathValue<T, P> | undefined = undefined
): PathValue<T, P> | undefined {
  const travel = (regexp: RegExp): any =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj as unknown as { [key: string]: any }
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}
