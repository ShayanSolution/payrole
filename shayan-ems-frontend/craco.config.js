const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "options",
        baseUrl: "./",
        aliases: {
          "@utils": "./src/utils",
          "@components": "./src/components",
          "@services": "./src/services",
          "@styles": "./src/Styles",
          "@redux": "./src/Redux",
          "@screens": "./src/screens"
        },
      },
    },
  ],
};
