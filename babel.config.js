const plugins = [];
module.exports = {
  presets: [
    ["@vue/app", { useBuiltIns: "entry" }],
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
  ],
  plugins: plugins,
};
