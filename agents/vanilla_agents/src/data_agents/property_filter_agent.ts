import { AgentFunction, AgentFunctionInfo } from "graphai";

const applyFilter = (
  input: any,
  index: number,
  inputs: any,
  include: Array<string> | undefined,
  exclude: Array<string> | undefined,
  alter: Record<string, Record<string, string>> | undefined,
  inject: Array<Record<string, any>> | undefined,
  swap: Record<string, string> | undefined,
  inspect: Array<Record<string, any>> | undefined,
) => {
  const propIds = include ? include : Object.keys(input);
  const excludeSet = new Set(exclude ?? []);
  const result = propIds.reduce((tmp: Record<string, any>, propId) => {
    if (!excludeSet.has(propId)) {
      const mapping = alter && alter[propId];
      if (mapping && mapping[input[propId]]) {
        tmp[propId] = mapping[input[propId]];
      } else {
        tmp[propId] = input[propId];
      }
    }
    return tmp;
  }, {});

  if (inject) {
    inject.forEach((item) => {
      if (item.index === undefined || item.index === index) {
        result[item.propId] = inputs[item.from];
      }
    });
  }
  if (inspect) {
    inspect.forEach((item) => {
      const value = inputs[item.from ?? 1]; // default is inputs[1]
      if (item.equal) {
        result[item.propId] = item.equal === value;
      } else if (item.notEqual) {
        result[item.propId] = item.notEqual !== value;
      }
    });
  }
  if (swap) {
    Object.keys(swap).forEach((key) => {
      const tmp = result[key];
      result[key] = result[swap[key]];
      result[swap[key]] = tmp;
    });
  }
  return result;
};

export const propertyFilterAgent: AgentFunction<{
  include?: Array<string>;
  exclude?: Array<string>;
  alter?: Record<string, Record<string, string>>;
  inject?: Array<Record<string, any>>;
  inspect?: Array<Record<string, any>>;
  swap?: Record<string, string>;
}> = async ({ namedInputs, params }) => {
  const { array } = namedInputs;
  const [input] = array;
  const { include, exclude, alter, inject, swap, inspect } = params;
  if (Array.isArray(input)) {
    return input.map((item, index) => applyFilter(item, index, array, include, exclude, alter, inject, swap, inspect));
  }
  return applyFilter(input, 0, array, include, exclude, alter, inject, swap, inspect);
};

const testInputs = { array:[
  [
    { color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
    { color: "blue", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
  ],
  "Tesla Motors",
]};

const propertyFilterAgentInfo: AgentFunctionInfo = {
  name: "propertyFilterAgent",
  agent: propertyFilterAgent,
  mock: propertyFilterAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "the array to apply filter",
      },
    },
    required: ["array"],
  },
  output: {
    type: "any",
  },
  samples: [
    {
      inputs: { array: [testInputs.array[0][0]] },
      params: { include: ["color", "model"] },
      result: { color: "red", model: "Model 3" },
    },
    {
      inputs: testInputs,
      params: { include: ["color", "model"] },
      result: [
        { color: "red", model: "Model 3" },
        { color: "blue", model: "Model Y" },
      ],
    },
    {
      inputs: testInputs,
      params: { exclude: ["color", "model"] },
      result: [
        { type: "EV", maker: "Tesla", range: 300 },
        { type: "EV", maker: "Tesla", range: 400 },
      ],
    },
    {
      inputs: testInputs,
      params: { alter: { color: { red: "blue", blue: "red" } } },
      result: [
        {
          color: "blue",
          model: "Model 3",
          type: "EV",
          maker: "Tesla",
          range: 300,
        },
        {
          color: "red",
          model: "Model Y",
          type: "EV",
          maker: "Tesla",
          range: 400,
        },
      ],
    },
    {
      inputs: testInputs,
      params: { inject: [{ propId: "maker", from: 1 }] },
      result: [
        {
          color: "red",
          model: "Model 3",
          type: "EV",
          maker: "Tesla Motors",
          range: 300,
        },
        {
          color: "blue",
          model: "Model Y",
          type: "EV",
          maker: "Tesla Motors",
          range: 400,
        },
      ],
    },
    {
      inputs: testInputs,
      params: { inject: [{ propId: "maker", from: 1, index: 0 }] },
      result: [
        {
          color: "red",
          model: "Model 3",
          type: "EV",
          maker: "Tesla Motors",
          range: 300,
        },
        {
          color: "blue",
          model: "Model Y",
          type: "EV",
          maker: "Tesla",
          range: 400,
        },
      ],
    },
    {
      inputs: testInputs,
      params: { swap: { maker: "model" } },
      result: [
        {
          color: "red",
          model: "Tesla",
          type: "EV",
          maker: "Model 3",
          range: 300,
        },
        {
          color: "blue",
          model: "Tesla",
          type: "EV",
          maker: "Model Y",
          range: 400,
        },
      ],
    },
    {
      inputs: testInputs,
      params: {
        inspect: [
          { propId: "isTesla", equal: "Tesla Motors" }, // from: 1 is implied
          { propId: "isGM", notEqual: "Tesla Motors", from: 1 },
        ],
      },
      result: [
        {
          color: "red",
          model: "Model 3",
          type: "EV",
          maker: "Tesla",
          range: 300,
          isTesla: true,
          isGM: false,
        },
        {
          color: "blue",
          model: "Model Y",
          type: "EV",
          maker: "Tesla",
          range: 400,
          isTesla: true,
          isGM: false,
        },
      ],
    },
  ],
  description: "Filter properties based on property name either with 'include' or 'exclude'",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default propertyFilterAgentInfo;
