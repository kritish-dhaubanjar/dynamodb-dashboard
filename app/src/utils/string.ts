export function interpolate(str: string, params: object): string {
  let formattedString = str;

  for (const [key, value] of Object.entries(params)) {
    formattedString = formattedString.replace(`:${key}`, value);
  }

  return formattedString;
}

export function generateString(length = 5) {
  const characters = "abcdefghijklmnopqrstuvwxyz";

  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
