export function pick(object = {}, keys = []) {
  const result = {};
  const filteredKeys = Object.keys(object).filter((key) => keys.includes(key));

  filteredKeys.forEach((key) => {
    if(!Boolean(object[key])) return;

    result[key] = object[key];
  });

  return result;
}

export function isPartialMatchWith(object = {}, source = {}, keys = []) {
  let match = true;

  for (const key of keys) {
    match &&= object[key] === source[key];
  }

  return match;
}
