require('dotenv').config();
const tags = process.env.TAGS;

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    paths: ["src/features/*.{feature,feature.md}"],
    require: ["src/stepDefinitions/*", "src/support/*"],
    parallel: 1,
    format: ["json:test-reports/results/report.json", "@cucumber/pretty-formatter"],
    tags: tags ? tags : "not @pending",
    formatOptions: { "colorsEnabled": true }
  },
};
