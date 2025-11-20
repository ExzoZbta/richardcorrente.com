module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      
      if (oneOfRule) {
        oneOfRule.oneOf.unshift({
          test: /\.glsl$/,
          use: 'raw-loader',
        });
        oneOfRule.oneOf.unshift({
          test: /\.hdr$/,
          type: 'asset/resource',
        });
      } else {
        webpackConfig.module.rules.push({
          test: /\.glsl$/,
          use: 'raw-loader',
        });
        webpackConfig.module.rules.push({
          test: /\.hdr$/,
          type: 'asset/resource',
        });
      }
      
      return webpackConfig;
    },
  },
};