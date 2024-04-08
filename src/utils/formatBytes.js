export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return { value: 0, unit: "B", string: "0 B" };

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  const unit = sizes[i];
  const string = value + " " + unit;

  return { value, unit, string };
}
