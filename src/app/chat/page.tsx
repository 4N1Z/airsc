'use client';

import { ToolInvocation } from 'ai';
import { Message, useChat } from 'ai/react';
import { useRef, useEffect } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } = useChat({
    api: '/api/chat',
    maxSteps: 5,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex w-full justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col w-full max-w-3xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 mb-[76px]">
          {messages?.map((m: Message) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                m.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white shadow-sm text-gray-800'
              }`}>
                {m.content}
                {m.toolInvocations?.map((tool: ToolInvocation) => (
                  <div key={tool.toolCallId} className="mt-2 text-sm">
                    {'result' in tool ? (
                      <div className="opacity-75">{tool.result}</div>
                    ) : tool.toolName === 'askForConfirmation' ? (
                      <div className="space-x-2">
                        <button onClick={() => addToolResult({ toolCallId: tool.toolCallId, result: 'Yes' })}
                          className="px-2 py-1 bg-white/20 rounded hover:bg-white/30">
                          Yes
                        </button>
                        <button onClick={() => addToolResult({ toolCallId: tool.toolCallId, result: 'No' })}
                          className="px-2 py-1 bg-white/20 rounded hover:bg-white/30">
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="opacity-75">Processing...</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="fixed bottom-0 w-full max-w-3xl bg-white border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Message..."
              className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}