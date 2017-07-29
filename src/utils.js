export function isObject(some) {
  return some === Object(some);
}

export function omitKeys(object, keys) {
  return Object.entries(object).reduce(
    (object, [key, value]) =>
      keys.includes(key) ? object : { ...object, [key]: value },
    {}
  );
}
