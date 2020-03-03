export const error = (code: number) =>
  `<style>.msg {font-family:  Roboto, sans-serif; color: #f26; text-align: center; font-weight: bold; height 100vh; width: 100vw; line-height: 100vh; font-size: 20vh; overflow: hidden;} body {background: #2A2D31; overflow: hidden; margin: 0; padding: 0;}</style><div class="msg">${code}</div>`;
