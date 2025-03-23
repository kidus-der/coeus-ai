"use client";
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { PdfViewer } from "@/components/PDFViewer/PDFViewer";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleAction,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { CornerDownLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Toolbox } from "@/components/Toolbox";
import { toast } from "sonner";
import { Copy, RefreshCcw } from "@/components/Icons";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// define a message type with unique IDs
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export default function Home() {
  const [pdfData, setPdfData] = useState(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello, how can I help you today? Upload a PDF to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  
  // define action icons
  const actionIcons = [
    { icon: Copy, type: "Copy" },
    { icon: RefreshCcw, type: "Regenerate" },
  ];
  
  // auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current as HTMLElement;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);
  
  // handle PDF upload
  const handlePdfUpload = (data) => {
    setPdfData(data);
    
    // add a welcome message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `pdf-welcome-${Date.now()}`,
        role: "assistant",
        content: `I've processed your document "${data.name}". You can ask me questions about it or use the toolbox buttons below to generate specific content.`,
      },
    ]);
  };
  
  // handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          pdfData: pdfData,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // add assistant response
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response || "I'm sorry, I couldn't process your request.",
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // add error message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ]);
      
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // handle toolbox button clicks
  const handleToolboxClick = async (toolType) => {
    // Add user message
    const userMessage = {
      id: `tool-user-${Date.now()}`,
      role: "user",
      content: `Generate a ${getToolName(toolType)}`,
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    // check if PDF is uploaded
    if (!pdfData) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `tool-no-pdf-${Date.now()}`,
          role: "assistant",
          content: "Please upload a PDF document first before using the toolbox features.",
        },
      ]);
      setIsLoading(false);
      return;
    }
    
    try {
      // call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: toolType,
          pdfData: pdfData,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // add assistant response
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `tool-response-${Date.now()}`,
          role: "assistant",
          content: data.response || "I'm sorry, I couldn't process your request.",
        },
      ]);
    } catch (error) {
      console.error("Error using toolbox:", error);
      
      // add error message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `tool-error-${Date.now()}`,
          role: "assistant",
          content: "I'm sorry, I encountered an error while generating content. Please try again.",
        },
      ]);
      
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // handle action button clicks
  const handleActionClick = (type, messageId, content) => {
    switch (type) {
      case "Copy":
        navigator.clipboard.writeText(content)
          .then(() => toast.success("Copied to clipboard"))
          .catch(() => toast.error("Failed to copy to clipboard"));
        break;
      case "Regenerate":
        // For now, just show a toast. We'll implement regeneration functionality later
        toast.info("Regenerate feature is coming soon");
        break;
      default:
        break;
    }
  };
  
  function getToolName(toolType) {
    switch (toolType) {
      case "studyPlan": return "Study Plan";
      case "quickSummary": return "Quick Summary";
      case "detailedExplanation": return "Detailed Explanation";
      case "practiceQuestions": return "Practice Questions";
      default: return toolType;
    }
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Header />
      <main className="container mx-auto p-4">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[200px] border rounded-lg"
        >
          <ResizablePanel className="border-r">
            <div className="h-[85vh] p-4 bg-gray-100">
              <PdfViewer onPdfUpload={handlePdfUpload} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className="h-[85vh] p-4 bg-gray-100 flex flex-col">
              {/* Chat Interface */}
              <ScrollArea className="h-[75vh]" ref={scrollRef}>
                <ChatMessageList>
                  {messages.map((message) => (
                    <ChatBubble key={message.id} layout="ai">
                      <ChatBubbleAvatar
                        fallback={message.role === "user" ? "US" : "AI"}
                      />
                      <ChatBubbleMessage isLoading={message.isLoading}>
                        {message.content}

                        {/* Action buttons for AI messages only */}
                        {message.role === "assistant" && !message.isLoading && (
                          <div className="flex mt-2 justify-end">
                            {actionIcons.map(({ icon: Icon, type }) => (
                              <ChatBubbleAction
                                className="size-6"
                                key={type}
                                icon={<Icon className="size-3" />}
                                onClick={() => handleActionClick(type, message.id, message.content)}
                              />
                            ))}
                          </div>
                        )}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  ))}
                </ChatMessageList>
              </ScrollArea>
              <form
                onSubmit={handleSendMessage}
                className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1 mt-4"
              >
                <ChatInput
                  placeholder="Type your message here..."
                  name="message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  disabled={isLoading}
                />
                <div className="flex items-center p-3 pt-0">
                  <Toolbox onToolClick={handleToolboxClick} />
                  <Button 
                    size="sm" 
                    className="ml-auto gap-1.5" 
                    type="submit" 
                    disabled={isLoading}
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