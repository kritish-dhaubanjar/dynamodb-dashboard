export function interpolate(str: string, params: object): string {
  let formattedString = str;

  for (const [key, value] of Object.entries(params)) {
    formattedString = formattedString.replace(`:${key}`, value);
  }

  return formattedString;
}
