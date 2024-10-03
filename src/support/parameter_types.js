import { defineParameterType } from "@cucumber/cucumber";
import { getDataConfig } from "../utils";
const { parse } = require('csv-parse/sync');

defineParameterType({
  regexp: /"([^"]*)"/,
  transformer: function (key) {
    const value = getDataConfig(key);

    return value;
  },
  name: "config",
  useForSnippets: false
});


defineParameterType({
  name: 'csv',
  regexp: /"([^"]*)"/,
  transformer: function(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
  }
});
