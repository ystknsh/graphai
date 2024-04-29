"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalAgent = void 0;
const totalAgent = async ({ inputs }) => {
    return inputs.reduce((result, input) => {
        const inputArray = Array.isArray(input) ? input : [input];
        inputArray.forEach((innerInput) => {
            Object.keys(innerInput).forEach((key) => {
                const value = innerInput[key];
                if (result[key]) {
                    result[key] += value;
                }
                else {
                    result[key] = value;
                }
            });
        });
        return result;
    }, {});
};
exports.totalAgent = totalAgent;
// for test and document
const sampleInputs = [{ a: 1 }, { a: 2 }, { a: 3 }];
const sampleParams = {};
const sampleResult = { a: 6 };
const sample2Inputs = [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]];
const sample2Params = {};
const sample2Result = { a: 6, b: -4, c: 10, d: -10 };
//
const totalAgentInfo = {
    name: "totalAgent",
    agent: exports.totalAgent,
    mock: exports.totalAgent,
    samples: [
        {
            inputs: sampleInputs,
            params: sampleParams,
            result: sampleResult,
        },
        {
            inputs: sample2Inputs,
            params: sample2Params,
            result: sample2Result,
        },
    ],
    description: "Returns the sum of input values",
    category: [],
    author: "Satoshi Nakajima",
    repository: "https://github.com/snakajima/graphai",
    license: "MIT",
};
exports.default = totalAgentInfo;