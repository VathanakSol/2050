'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { sendMessage, ChatMessage } from '@/app/actions/chat';
import { parseAIResponse } from '@/lib/codeParser';
import { ModelSwitcher } from './ModelSwitcher';
import { ChatSkeletonLoader } from './ChatSkeletonLoader';

export function ChatWindow() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentModel, setCurrentModel] = useState<'general' | 'code-fixer'>('general');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (message: string, file?: { name: string; content: string; language: string }) => {
        // Add user message to chat
        const userMessage: ChatMessage = {
            role: 'user',
            parts: message,
            metadata: file ? {
                fileName: file.name,
                language: file.language,
                originalCode: file.content
            } : undefined
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Send message to AI with conversation history, selected model, and optional file
            const response = await sendMessage(messages, message, currentModel, file);

            let parsedResponse;
            if (currentModel === 'code-fixer') {
                // Parse response if it's from Code Fixer
                parsedResponse = parseAIResponse(response, currentModel);
            }

            // Add AI response to chat
            const aiMessage: ChatMessage = {
                role: 'model',
                parts: response,
                model: currentModel,
                metadata: parsedResponse ? {
                    originalCode: parsedResponse.originalCode,
                    fixedCode: parsedResponse.fixedCode,
                    language: parsedResponse.language || file?.language,
                    fileName: file?.name
                } : undefined
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            // Add error message to chat
            const errorMessage: ChatMessage = {
                role: 'model',
                parts: 'Sorry, I encountered an error. Please try again.',
                model: 'general',
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
                        <ModelSwitcher currentModel={currentModel} onModelChange={setCurrentModel} />

                        {/* Centered Input */}
                        <div className="bg-white border-2 border-white shadow-[6px_6px_0px_0px_#00FFF0] p-2">
                            <ChatInput
                                onSend={handleSendMessage}
                                disabled={isLoading}
                                showFileUpload={currentModel === 'code-fixer'}
                            />
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
                <div className="sticky top-0 z-10 bg-[#10162F]/95 backdrop-blur-sm pb-4 pt-2">
                    <ModelSwitcher currentModel={currentModel} onModelChange={setCurrentModel} />
                </div>

                {messages.map((msg, index) => (
                    <ChatMessageComponent
                        key={index}
                        role={msg.role}
                        content={msg.parts}
                        model={msg.model}
                    />
                ))}

                {/* Skeleton Loading for AI Response */}
                {isLoading && (
                    <ChatSkeletonLoader model={currentModel} />
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t-2 border-black">
                <ChatInput
                    onSend={handleSendMessage}
                    disabled={isLoading}
                    showFileUpload={currentModel === 'code-fixer'}
                />
            </div>
        </div>
    );
}
