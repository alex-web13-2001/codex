module.exports = (object, keys) => {
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
};
