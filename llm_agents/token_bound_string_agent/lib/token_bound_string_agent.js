"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenBoundStringsAgent = void 0;
const tiktoken_1 = require("tiktoken");
const defaultMaxToken = 5000;
const encoder = (0, tiktoken_1.get_encoding)("cl100k_base");
// This agent generate a reference string from a sorted array of strings,
// adding one by one until the token count exceeds the specified limit.
// Parameters:
//  limit?: number; // specifies the maximum token count. The default is 5000.
// namedInputs:
//  chunks: Array<string>; // array of string sorted by relevance.
// Returns:
//  { content: string, tokenCount: number, endIndex: number } // reference text
const tokenBoundStringsAgent = async ({ params, namedInputs }) => {
    const contents = namedInputs.chunks;
    const limit = params?.limit ?? defaultMaxToken;
    const addNext = (total, index) => {
        const length = encoder.encode(contents[index] + "\n").length;
        if (total + length < limit && index + 1 < contents.length) {
            return addNext(total + length, index + 1);
        }
        return { endIndex: index + 1, tokenCount: total };
    };
    const { endIndex, tokenCount } = addNext(0, 0);
    const content = contents
        .filter((value, index) => {
        return index < endIndex;
    })
        .join("\n");
    return { content, tokenCount, endIndex };
};
exports.tokenBoundStringsAgent = tokenBoundStringsAgent;
const tokenBoundStringsAgentInfo = {
    name: "tokenBoundStringsAgent",
    agent: exports.tokenBoundStringsAgent,
    mock: exports.tokenBoundStringsAgent,
    inputs: {
        type: "object",
        properties: {
            chunks: {
                type: "array",
                description: "an array of strings",
            },
        },
    },
    output: {
        type: "object",
        properties: {
            content: {
                type: "string",
                description: "token bound string",
            },
            tokenCount: {
                type: "number",
                description: "token count",
            },
            endIndex: {
                type: "number",
                description: "number of chunks",
            },
        },
    },
    samples: [
        {
            inputs: {
                chunks: [
                    "Here's to the crazy ones. The misfits. The rebels. The troublemakers.",
                    "The round pegs in the square holes. The ones who see things differently.",
                    "They're not fond of rules. And they have no respect for the status quo.",
                    "You can quote them, disagree with them, glorify or vilify them.",
                    "About the only thing you can't do is ignore them.",
                    "Because they change things.",
                    "They push the human race forward.",
                    "And while some may see them as the crazy ones, we see genius.",
                    "Because the people who are crazy enough to think they can change the world, are the ones who do.",
                ],
            },
            params: {
                limit: 80,
            },
            result: {
                content: "Here's to the crazy ones. The misfits. The rebels. The troublemakers.\n" +
                    "The round pegs in the square holes. The ones who see things differently.\n" +
                    "They're not fond of rules. And they have no respect for the status quo.\n" +
                    "You can quote them, disagree with them, glorify or vilify them.\n" +
                    "About the only thing you can't do is ignore them.\n" +
                    "Because they change things.",
                tokenCount: 79,
                endIndex: 6,
            },
        },
    ],
    description: "token bound Agent",
    category: [],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/llm_agents/token_bound_string_agent/src/token_bound_string_agent.ts",
    package: "@graphai/token_bound_string_agent",
    license: "MIT",
};
exports.default = tokenBoundStringsAgentInfo;
