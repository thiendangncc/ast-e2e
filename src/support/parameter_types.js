import { defineParameterType } from "@cucumber/cucumber";
import { getDataConfig } from "../utils";

defineParameterType({
  regexp: /"([^"]*)"/,
  transformer: function (key) {
    const value = getDataConfig(key);

    return value;
  },
  name: "config",
  useForSnippets: false
});
