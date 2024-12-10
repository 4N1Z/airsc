"use client";

import { Message, useChat } from "ai/react";
import { useRef, useEffect } from "react";
import { ResearchPaper } from "@/utils/ai-components/research-paper";
import { searchSemanticScholar } from "../action/semantic-scholar/search";
import Markdown from "react-markdown";

export default function ResearchChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/research-paper",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex w-full justify-center min-h-screen bg-gray-900">
      {/* <button
        onClick={async () => {
          const papers = await searchSemanticScholar("llm", 5, "relevance");
          console.log(papers);
        }}
      >
        Click me for Research Paper
      </button> */}
      <div className="flex flex-col w-full max-w-3xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 mb-[76px]">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                <Markdown>{message.content}</Markdown>
                {/* {message.content} */}
{/* 
                {message.toolInvocations?.map((toolInvocation) => {
                  const { toolName, toolCallId, state } = toolInvocation;

                  if (state === "result") {
                    if (toolName === "getResearchPaper") {
                      const papers = toolInvocation.result;
                      return (
                        <div key={toolCallId} className="mt-3 space-y-3">
                          {papers.map((paper: any, index: number) => (
                            // <ResearchPaper key={index} {...paper} />
                          ))}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={toolCallId}
                        className="mt-2 bg-gray-700/50 rounded-lg p-2 text-sm"
                      >
                        <div className="text-gray-300">
                          {JSON.stringify(toolInvocation.result, null, 2)}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={toolCallId}
                      className="mt-2 text-sm text-gray-300"
                    >
                      Searching papers...
                    </div>
                  );
                })} */}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="fixed bottom-0 w-full max-w-3xl bg-gray-800 border-t border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about research papers..."
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border-gray-600 border text-gray-100 
                placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
