module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      
      if (oneOfRule) {
        oneOfRule.oneOf.unshift({
          test: /\.glsl$/,
          use: 'raw-loader',
        });
      } else {
        webpackConfig.module.rules.push({
          test: /\.glsl$/,
          use: 'raw-loader',
        });
      }
      
      return webpackConfig;
    },
  },
};