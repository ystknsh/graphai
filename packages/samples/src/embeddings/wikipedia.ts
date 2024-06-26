import "dotenv/config";

import { graphDataTestRunner } from "@/utils/test_runner";
import * as agents from "@graphai/agents";

export const graph_data = {
  version: 0.3,
  nodes: {
    source: {
      value: {
        name: "Sam Bankman-Fried",
        topic: "sentence by the court",
        query: "describe the final sentence by the court for Sam Bank-Fried",
      },
    },
    wikipedia: {
      // Fetch an article from Wikipedia
      console: {
        before: "...fetching data from wikkpedia",
      },
      agent: "wikipediaAgent",
      inputs: [":source.name"],
      params: {
        lang: "en",
      },
    },
    chunks: {
      // Break that article into chunks
      console: {
        before: "...splitting the article into chunks",
      },
      agent: "stringSplitterAgent",
      inputs: [":wikipedia.content"],
    },
    embeddings: {
      // Get embedding vectors of those chunks
      console: {
        before: "...fetching embeddings for chunks",
      },
      agent: "stringEmbeddingsAgent",
      inputs: [":chunks.contents"],
    },
    topicEmbedding: {
      // Get embedding vector of the topic
      console: {
        before: "...fetching embedding for the topic",
      },
      agent: "stringEmbeddingsAgent",
      inputs: [":source.topic"],
    },
    similarityCheck: {
      // Get the cosine similarities of those vectors
      agent: "dotProductAgent",
      inputs: [":embeddings", ":topicEmbedding.$0"],
    },
    sortedChunks: {
      // Sort chunks based on those similarities
      agent: "sortByValuesAgent",
      inputs: [":chunks.contents", ":similarityCheck"],
    },
    referenceText: {
      // Generate reference text from those chunks (token limited)
      agent: "tokenBoundStringsAgent",
      inputs: [":sortedChunks"],
      params: {
        limit: 5000,
      },
    },
    prompt: {
      // Generate a prompt with that reference text
      agent: "stringTemplateAgent",
      inputs: [":source.query", ":referenceText.content"],
      params: {
        template: "Using the following document, ${0}\n\n${1}",
      },
    },
    RagQuery: {
      // Get the answer from LLM with that prompt
      console: {
        before: "...performing the RAG query",
      },
      agent: "openAIAgent",
      inputs: [":prompt"],
    },
    OneShotQuery: {
      // Get the answer from LLM without the reference text
      agent: "openAIAgent",
      inputs: [":source.query"],
    },
    RagResult: {
      agent: "copyAgent",
      inputs: [":RagQuery.choices.$0.message.content"],
      isResult: true,
    },
    OneShotResult: {
      agent: "copyAgent",
      inputs: [":OneShotQuery.choices.$0.message.content"],
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", "sample_wiki.log", graph_data, agents, () => {}, false);
  console.log(result);
};
if (process.argv[1] === __filename) {
  main();
}
