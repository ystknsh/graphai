import type { NodeDataParams, ResultData, DataSource, NodeData } from "./type";
import type { GraphAI } from "./graphai";
import { NodeState } from "./type";
export declare class Node {
    nodeId: string;
    params: NodeDataParams;
    sources: Record<string, DataSource>;
    inputs: Array<string>;
    pendings: Set<string>;
    waitlist: Set<string>;
    state: NodeState;
    agentId?: string;
    fork?: number;
    forkIndex?: number;
    result: ResultData;
    retryLimit: number;
    retryCount: number;
    transactionId: undefined | number;
    timeout?: number;
    error?: Error;
    isStaticNode: boolean;
    outputs?: Record<string, string>;
    private graph;
    constructor(nodeId: string, forkIndex: number | undefined, data: NodeData, graph: GraphAI);
    asString(): string;
    private retry;
    removePending(nodeId: string): void;
    pushQueueIfReady(): void;
    injectValue(value: ResultData): void;
    private setResult;
    execute(): Promise<void>;
}