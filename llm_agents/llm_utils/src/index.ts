// typo (todo remove later)
export type GrapAILLInputType = string | (string | undefined)[] | undefined;

export type GrapAILLMInputBase = {
  prompt?: GrapAILLInputType;
  system?: GrapAILLInputType;
  mergeablePrompts?: GrapAILLInputType;
  mergeableSystem?: GrapAILLInputType;
};

// valid
export type GraphAILLInputType = string | (string | undefined)[] | undefined;

export type GraphAILLMInputBase = {
  prompt?: GraphAILLInputType;
  system?: GraphAILLInputType;
  mergeablePrompts?: GraphAILLInputType;
  mergeableSystem?: GraphAILLInputType;
};

export const flatString = (input: GraphAILLInputType): string => {
  return Array.isArray(input) ? input.filter((a) => a).join("\n") : (input ?? "");
};

export const getMergeValue = (
  namedInputs: GraphAILLMInputBase,
  params: GraphAILLMInputBase,
  key: "mergeablePrompts" | "mergeableSystem",
  values: GraphAILLInputType,
): string => {
  const inputValue = namedInputs[key];
  const paramsValue = params[key];

  return inputValue || paramsValue ? [flatString(inputValue), flatString(paramsValue)].filter((a) => a).join("\n") : flatString(values);
};

type GraphAILlmMessageRole = "user" | "system" | "assistant";
type GraphAILlmMessageContent = string | string[] | Record<string, unknown>;

export type GraphAILlmMessage<ContetType = GraphAILlmMessageContent> = {
  role: GraphAILlmMessageRole;
  content: ContetType;
};

export const getMessages = <ContetType = GraphAILlmMessageContent>(
  systemPrompt?: string,
  messages?: GraphAILlmMessage<ContetType>[],
): GraphAILlmMessage<ContetType>[] => {
  const messagesCopy = [...(systemPrompt ? [{ role: "system" as const, content: systemPrompt as ContetType }] : []), ...(messages ?? [])];
  return messagesCopy;
};
