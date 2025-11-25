'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { sendMessage, ChatMessage } from '@/app/actions/chat';

export function ChatWindow() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (message: string) => {
        // Add user message to chat
        const userMessage: ChatMessage = {
            role: 'user',
            parts: message,
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Send message to AI with conversation history
            const response = await sendMessage(messages, message);

            // Add AI response to chat
            const aiMessage: ChatMessage = {
                role: 'model',
                parts: response,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            // Add error message to chat
            const errorMessage: ChatMessage = {
                role: 'model',
                parts: 'Sorry, I encountered an error. Please try again.',
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (messages.length === 0) {
        return (
            <div className="flex flex-col flex-grow border-2 border-black shadow-[8px_8px_0px_0px_#10162F] bg-[#10162F] h-full">
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl space-y-6">


                        {/* Centered Input */}
                        <div className="bg-white border-2 border-white shadow-[6px_6px_0px_0px_#00FFF0] p-2">
                            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
                        </div>


                    </div>
                </div>
            </div>
        );
    }

    // Regular chat view with messages
    return (
        <div className="flex flex-col flex-grow border-2 border-black shadow-[8px_8px_0px_0px_#10162F] bg-white h-full">
            {/* Chat Messages Area */}
            <div className="flex-grow overflow-y-auto md:p-6 bg-[#10162F] space-y-2">
                {messages.map((msg, index) => (
                    <ChatMessageComponent
                        key={index}
                        role={msg.role}
                        content={msg.parts}
                    />
                ))}

                {/* Skeleton Loading for AI Response */}
                {isLoading && (
                    <div className="flex w-full justify-start mb-6">
                        <div className="w-full p-4 rounded-lg border bg-[#1F2937] text-gray-100 border-gray-700 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-600/50">
                                <div className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></div>
                                <span className="text-xs font-bold opacity-70 uppercase tracking-wider">
                                    Gemini AI
                                </span>
                            </div>

                            {/* Skeleton Loading Animation */}
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-gray-700 rounded-md w-full"></div>
                                <div className="h-4 bg-gray-700 rounded-md w-11/12"></div>
                                <div className="h-4 bg-gray-700 rounded-md w-4/5"></div>
                                <div className="h-4 bg-gray-700 rounded-md w-full"></div>
                                <div className="h-4 bg-gray-700 rounded-md w-3/4"></div>
                            </div>

                            {/* Typing Indicator */}
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-700/50">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-accent-mint rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-accent-mint rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-accent-mint rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-xs text-gray-400 italic">Generating response...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t-2 border-black">
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
        </div>
    );
}
