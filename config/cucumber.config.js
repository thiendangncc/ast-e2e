require('dotenv').config();
const tags = process.env.TAGS;
const feature = process.env.FEATURE;
const defaultConfig = {
  requireModule: ['ts-node/register'],
  paths: ["src/features/*.{feature,feature.md}"],
  require: ["src/stepDefinitions/*", "src/support/*"],
  parallel: 1,
  format: ["json:test-reports/results/report.json"],
  tags: tags ? tags : "not @pending",
  formatOptions: { "colorsEnabled": true }
}
module.exports = {
  default: defaultConfig,
  feature: {
    ...defaultConfig,
    paths: feature ? [`src/features/${feature}.{feature,feature.md}`] : defaultConfig.paths,
  }
};
