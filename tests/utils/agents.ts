import { AgentFunctionDictonary } from "@/graphai";
import {
  sleeperAgent,
  sleeperAgentDebug,
  nestedAgent,
  mapAgent,
  totalAgent,
  bypassAgent,
  echoAgent,
  copyMessageAgent,
  mergeNodeIdAgent,
  countingAgent,
} from "@/experimental_agents";

export const defaultTestAgents: AgentFunctionDictonary = {
  bypassAgent,
  echoAgent,
  copyMessageAgent,
  mergeNodeIdAgent,
  sleeperAgent,
  sleeperAgentDebug,
  nestedAgent,
  mapAgent,
  totalAgent,
  countingAgent,
};