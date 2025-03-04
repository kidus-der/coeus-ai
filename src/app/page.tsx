"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { PdfViewer } from "@/components/PDFViewer/PDFViewer";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { CornerDownLeft,BicepsFlexed, Sparkles, Brain , GraduationCap} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, RefreshCcw } from "@/components/Icons"
import { Button } from "@/components/ui/button";
import { Toolbox } from "@/components/Toolbox";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Hello, how can I help you today?",
      sender: "bot",
    },
  ]);

  const actionIcons = [
  { icon: Copy, type: 'Copy' },
  { icon: RefreshCcw, type: 'Regenerate' },
];

  const sendMessage = (newMessage: string) => {
    // Add the user's message immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, message: newMessage, sender: "user" },
    ]);

    // Simulate a delayed "bot" response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          message: "This is a simulated bot response. To test autoscroll, make sure there are many words, like apple banana cherry date eggplant fig grape honeydew",
          sender: "bot",
          //isLoading: true,
        },
        {
          id: prevMessages.length + 3,
          message: "",
          sender: "bot",
          isLoading: true,
        },
      ]);
    }, 1000); // Simulate a 1-second delay
  };


  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Header />
      <main className="container mx-auto p-4">
       <ResizablePanelGroup direction="horizontal" className="min-h-[200px] border rounded-lg">
         <ResizablePanel className=" border-r">
            <div className=" h-[85vh] p-4 bg-gray-100">
             <PdfViewer />
            </div>
        </ResizablePanel>
           <ResizableHandle withHandle/>
              <ResizablePanel>
                  <div className=" h-[85vh] p-4 bg-gray-100 flex flex-col">
                    {/* Chat Interface (1/2 width) */}
                      <ScrollArea className="h-[75vh]">
                        <ChatMessageList >
                            {messages.map((message) => {
                            const variant = message.sender === "user" ? "sent" : "received";
                            return (
                            <ChatBubble key={message.id} layout='ai'>
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
                                                        <Toolbox />
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
        </ResizablePanel>
     </ResizablePanelGroup>
      </main>
    </ThemeProvider>
  );
}