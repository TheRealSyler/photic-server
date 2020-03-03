export function logAction(type: string, message: string) {
  console.log(`\x1b[38;2;0;155;255m[${type.padEnd(8)}] \x1b[38;2;255;20;90m${message}\x1b[0m`);
}
