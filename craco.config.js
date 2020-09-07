const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "rgb(85,59,180)" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
