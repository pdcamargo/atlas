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
  const travel = (pathParts: string[]): any =>
    pathParts.reduce(
      (res, key) => (res !== null && res !== undefined ? res[key] : res),
      obj as any
    );

  // Split the path into parts handling both dots and brackets
  const pathParts = path.match(/[^.[\]]+/g) || [];

  const result = travel(pathParts);
  return result === undefined || result === obj ? defaultValue : result;
}

export function toTitleCase(str: string) {
  // converts all cases (kebab, snake, camel) to Title Case
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (s) => s.toUpperCase());
}
