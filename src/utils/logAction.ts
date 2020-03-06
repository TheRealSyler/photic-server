export function logAction(type: string, message: string) {
  console.log(
    `${type !== 'GET' ? '\x1b[38;2;0;155;255m' : '\x1b[38;2;0;220;50m'}[${type.padEnd(
      10
    )}] \x1b[38;2;255;20;90m${message}\x1b[0m`
  );
}
