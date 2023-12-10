export function addSearchParamToPath(path: string, key: string, value: string) {
  const url = new URL(path, "http://localhost");
  url.searchParams.set(key, value);
  return url.pathname + url.search;
}
