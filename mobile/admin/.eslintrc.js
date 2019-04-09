module.exports = {
  plugins: ["react", "react-native"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "prettier"
  ],
  parser: "babel-eslint",
  env: {
    jest: true,
    "react-native/react-native": true
  },
  rules: {
    "no-console": "off",
    "react/jsx-filename-extension": "off",
    "react-native/split-platform-components": "off",
    "react/display-name": "off"
  },
  globals: {
    fetch: false
  }
};
