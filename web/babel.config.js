// web/babel.config.js
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      // o plugin do Reanimated **sempre por último**
      "react-native-reanimated/plugin",
    ],
  }
}
