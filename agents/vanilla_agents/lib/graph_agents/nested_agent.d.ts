import { AgentFunction } from "graphai";
import { GraphData } from "graphai/lib/type";
export declare const getNestedGraphData: (graphData: GraphData | string | undefined, inputs: Array<any>) => GraphData;
export declare const nestedAgent: AgentFunction<{
    namedInputs?: Array<string>;
}>;
declare const nestedAgentInfo: {
    name: string;
    agent: AgentFunction<{
        namedInputs?: string[] | undefined;
    }>;
    mock: AgentFunction<{
        namedInputs?: string[] | undefined;
    }>;
    samples: never[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default nestedAgentInfo;
