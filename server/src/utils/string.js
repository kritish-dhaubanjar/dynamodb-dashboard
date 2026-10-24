export function interpolate(string, params) {
  let formattedString = string;

  for (const [key, value] of Object.entries(params)) {
    formattedString = formattedString.replace(`:${key}`, value);
  }

  return formattedString;
}
