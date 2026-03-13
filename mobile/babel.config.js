module.exports = function (api) {
  api.cacheIdentifier('expo');
  return { presets: ['babel-preset-expo'] };
};
