const CO2JS_VERSION = require("./package.json").version;

module.exports = {
  define: {
    "process.env.CO2JS_VERSION": JSON.stringify(CO2JS_VERSION),
  },
};
