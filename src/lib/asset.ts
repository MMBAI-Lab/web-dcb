// next/image's built-in loader does not reliably prepend `basePath` to
// unoptimized static exports, so internal asset URLs go through this
// helper instead of being hardcoded as absolute "/..." paths.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
