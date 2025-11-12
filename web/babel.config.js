// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    // Carregue o NativeWind **como preset**
    presets: ['babel-preset-expo', 'nativewind/babel'],
    // Se usar Reanimated, deixe este plugin por último:
    // plugins: ['react-native-reanimated/plugin'],
  };
};
