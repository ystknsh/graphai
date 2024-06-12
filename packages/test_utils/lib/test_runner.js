"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentTestRunner = exports.rejectTest = exports.rejectFileTest = exports.graphDataTestRunner = exports.fileTestRunner = exports.readGraphData = void 0;
const graphai_1 = require("graphai");
const defaultTestAgents = __importStar(require("@graphai/vanilla"));
const agent_filters_1 = require("@graphai/agent_filters");
const file_utils_1 = require("./file_utils");
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = __importDefault(require("node:test"));
const readGraphData = (base_dir, file) => {
    const file_path = path_1.default.resolve(base_dir) + "/.." + file;
    return (0, file_utils_1.readGraphaiData)(file_path);
};
exports.readGraphData = readGraphData;
const fileTestRunner = async (base_dir, file, agentFunctionInfoDictionary, callback = () => { }) => {
    return await (0, exports.graphDataTestRunner)(base_dir, file, (0, exports.readGraphData)(base_dir, file), agentFunctionInfoDictionary, callback);
};
exports.fileTestRunner = fileTestRunner;
const graphDataTestRunner = async (base_dir, logFileName, graph_data, agentFunctionInfoDictionary, callback = () => { }, all = true) => {
    const agentFilters = [
        {
            name: "namedInputValidatorFilter",
            agent: agent_filters_1.namedInputValidatorFilter,
        },
    ];
    const baseDir = path_1.default.resolve(base_dir) + "/../logs/";
    (0, file_utils_1.mkdirLogDir)(baseDir);
    const log_path = baseDir + (0, file_utils_1.fileBaseName)(logFileName) + ".log";
    const graph = new graphai_1.GraphAI(graph_data, { ...defaultTestAgents, ...agentFunctionInfoDictionary }, { agentFilters });
    if (process.argv[2] === "-v") {
        graph.onLogCallback = utils_1.callbackLog;
    }
    callback(graph);
    const results = await graph.run(all);
    fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
    return results;
};
exports.graphDataTestRunner = graphDataTestRunner;
const rejectFileTest = async (base_dir, file, errorMessage, agentFunctionInfoDictionary = {}, validationError = true) => {
    return await (0, exports.rejectTest)(base_dir, (0, exports.readGraphData)(base_dir, file), errorMessage, agentFunctionInfoDictionary, validationError);
};
exports.rejectFileTest = rejectFileTest;
const rejectTest = async (base_dir, graphdata, errorMessage, agentFunctionInfoDictionary = {}, validationError = true) => {
    await node_assert_1.default.rejects(async () => {
        await (0, exports.graphDataTestRunner)(base_dir, __filename, graphdata, { ...defaultTestAgents, ...agentFunctionInfoDictionary });
    }, { name: "Error", message: validationError ? new graphai_1.ValidationError(errorMessage).message : errorMessage });
};
exports.rejectTest = rejectTest;
// for agent
const agentTestRunner = async (agentInfo) => {
    const { agent, samples, inputs: inputSchema } = agentInfo;
    if (samples.length === 0) {
        console.log(`test ${agentInfo.name}: No test`);
    }
    else {
        for await (const sampleKey of samples.keys()) {
            (0, node_test_1.default)(`test ${agentInfo.name} ${sampleKey}`, async () => {
                const { params, inputs, result, graph } = samples[sampleKey];
                const flatInputs = Array.isArray(inputs) ? inputs : [];
                const namedInputs = Array.isArray(inputs) ? {} : inputs;
                const actual = await agent({
                    ...graphai_1.defaultTestContext,
                    params,
                    inputs: flatInputs,
                    inputSchema,
                    namedInputs,
                    graphData: graph,
                });
                node_assert_1.default.deepStrictEqual(actual, result);
            });
        }
    }
};
exports.agentTestRunner = agentTestRunner;
