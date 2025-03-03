"use client";
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { PdfViewer } from "@/components/PDFViewer/PDFViewer";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { CornerDownLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Hello, how can I help you today?",
      sender: "bot",
    },
  ]);

  const [minHeight, setMinHeight] = useState<number | null>(500);

  const sendMessage = (newMessage: string) => {
    // Basic implementation, you'll connect this to the AI later
    setMessages([
      ...messages,
      { id: messages.length + 1, message: newMessage, sender: "user" },
    ]);
  };


  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Header />
      <main className="container mx-auto p-4 flex">
        {/* PDF Viewer (1/2 width, including file upload) */}

        <div className="w-1/2 h-[85vh] p-4 bg-gray-100">
          <PdfViewer />
        </div>

        {/* Chat Interface (1/2 width) */}
        <div className="w-1/2 h-[85vh] p-4 bg-gray-100 flex flex-col">
          {/* Use shadcn's ScrollArea for custom scrollbar */}
          <ScrollArea className="h-[75vh]">
            <ChatMessageList >
              {messages.map((message) => {
                const variant = message.sender === "user" ? "sent" : "received";
                return (
                  <ChatBubble key={message.id} variant={variant}>
                    <ChatBubbleAvatar
                      fallback={variant === "sent" ? "US" : "AI"}
                    />
                    <ChatBubbleMessage isLoading={message.isLoading}>
                      {message.message}
                    </ChatBubbleMessage>
                  </ChatBubble>
                );
              })}
            </ChatMessageList>
          </ScrollArea>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const message = formData.get("message") as string;
              if (!message) return;
              sendMessage(message);
              e.currentTarget.reset();
            }}
            className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          >
            <ChatInput
              placeholder="Type your message here..."
              name="message"
              className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  // Check for Enter key (without Shift)
                  e.preventDefault(); // Prevent newline
                  const form = e.target.form;
                  if (form) {
                    form.requestSubmit(); // Trigger the form submission
                  }
                }
              }}
            />
            <div className="flex items-center p-3 pt-0">
              <Button
                size="sm"
                className="ml-auto gap-1.5"
                type="submit"
              >
                Send Message
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </main>
    </ThemeProvider>
  );
}