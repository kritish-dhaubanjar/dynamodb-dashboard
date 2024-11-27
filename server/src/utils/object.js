/**
 * @param {object} object
 * @param {object} source
 * @param {Array<string>} keys
 *
 * @returns {boolean}
 */
export function isPartialMatchWith(object = {}, source = {}, keys = []) {
  let match = true;

  // TODO: Refactor this to make it simple
  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    match &&= object[key] === source[key];
  }

  return match;
}
