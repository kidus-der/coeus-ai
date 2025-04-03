"use client";
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { MultiPdfViewer } from "@/components/PDFViewer/MultiPDFViewer";
import { PDFSelector } from "@/components/PDFViewer/PDFSelector";
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
  // Store original prompt data for regeneration
  promptData?: {
    message?: string;
    toolType?: string;
    pdfIds?: string[];
  };
}

interface PDFFile {
  id: string;
  name: string;
  base64: string;
}

export default function Home() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello, how can I help you today? Upload a PDF to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfSelectorOpen, setIsPdfSelectorOpen] = useState(false);
  const [currentToolType, setCurrentToolType] = useState<string | undefined>();
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
  
  // handle PDF upload or removal
  const handlePdfUpload = (data: PDFFile[]) => {
    setPdfFiles(data);
    
    if (data.length === 0) {
      // All PDFs were removed, add a message indicating this
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `pdf-removed-${Date.now()}`,
          role: "assistant",
          content: "All PDFs have been removed. Please upload a new document to continue.",
        },
      ]);
    } else if (data.length > pdfFiles.length) {
      // New PDF was uploaded, add a welcome message
      const newPdfs = data.filter(pdf => !pdfFiles.some(existingPdf => existingPdf.id === pdf.id));
      if (newPdfs.length > 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `pdf-welcome-${Date.now()}`,
            role: "assistant",
            content: `I've processed ${newPdfs.length > 1 ? 'your documents' : `your document "${newPdfs[0].name}"`}. You can ask me questions about ${newPdfs.length > 1 ? 'them' : 'it'} or use the toolbox buttons below to generate specific content.`,
          },
        ]);
      }
    }
  };
  
  // Handle PDF selection for toolbox functions
  const handlePdfSelection = (selectedPdfIds: string[]) => {
    const selectedPdfs = pdfFiles.filter(pdf => selectedPdfIds.includes(pdf.id));
    
    if (selectedPdfs.length === 0 || !currentToolType) return;
    
    // Now call the toolbox function with the selected PDFs
    handleToolboxWithSelectedPdfs(currentToolType, selectedPdfIds);
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
    
    // Create a unique ID for the assistant message
    const assistantMessageId = `assistant-${Date.now()}`;
    
    // If we have multiple PDFs and no specific selection, use all PDFs
    const pdfIds = pdfFiles.map(pdf => pdf.id);
    
    // Add an initial loading message from the assistant
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        isLoading: true,
        promptData: {
          message: input,
          pdfIds: pdfIds
        }
      },
    ]);
    
    try {
      // call API with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          pdfFiles: pdfFiles.filter(pdf => pdfIds.includes(pdf.id)),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      // Process the streaming response
      const reader = response.body.getReader();
      let accumulatedContent = "";
      
      // Update the loading state to false but keep the empty content
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, isLoading: false }
            : msg
        )
      );
      
      // Read and process chunks as they arrive
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        
        // Process each line in the chunk (there might be multiple JSON objects)
        const lines = chunk.split("\n").filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const { chunk: chunkText } = JSON.parse(line);
            
            if (chunkText) {
              // Accumulate the content
              accumulatedContent += chunkText;
              
              // Update the message with the accumulated content
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            }
          } catch (e) {
            console.error("Error parsing chunk:", e, line);
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Update the assistant message to show the error
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "I'm sorry, I encountered an error. Please try again.",
                isLoading: false,
              }
            : msg
        )
      );
      
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // handle toolbox button clicks
  const handleToolboxClick = async (toolType) => {
    // check if PDFs are uploaded
    if (pdfFiles.length === 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `tool-no-pdf-${Date.now()}`,
          role: "assistant",
          content: "Please upload a PDF document first before using the toolbox features.",
        },
      ]);
      return;
    }
    
    // If we have multiple PDFs, open the PDF selector
    if (pdfFiles.length > 1) {
      setCurrentToolType(toolType);
      setIsPdfSelectorOpen(true);
      return;
    }
    
    // If we only have one PDF, use it directly
    const pdfIds = [pdfFiles[0].id];
    handleToolboxWithSelectedPdfs(toolType, pdfIds);
  };
  
  // Handle toolbox with selected PDFs
  const handleToolboxWithSelectedPdfs = async (toolType, pdfIds) => {
    // Add user message
    const userMessage = {
      id: `tool-user-${Date.now()}`,
      role: "user",
      content: `Generate a ${getToolName(toolType)}`,
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    // Create a unique ID for the assistant message
    const assistantMessageId = `tool-response-${Date.now()}`;
    
    // Get the selected PDFs
    const selectedPdfs = pdfFiles.filter(pdf => pdfIds.includes(pdf.id));
    
    // Add an initial loading message from the assistant
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        isLoading: true,
        promptData: {
          toolType: toolType,
          pdfIds: pdfIds
        }
      },
    ]);
    
    try {
      // call API with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: toolType,
          pdfFiles: selectedPdfs,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      // Process the streaming response
      const reader = response.body.getReader();
      let accumulatedContent = "";
      
      // Update the loading state to false but keep the empty content
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, isLoading: false }
            : msg
        )
      );
      
      // Read and process chunks as they arrive
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        
        // Process each line in the chunk (there might be multiple JSON objects)
        const lines = chunk.split("\n").filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const { chunk: chunkText } = JSON.parse(line);
            
            if (chunkText) {
              // Accumulate the content
              accumulatedContent += chunkText;
              
              // Update the message with the accumulated content
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            }
          } catch (e) {
            console.error("Error parsing chunk:", e, line);
          }
        }
      }
    } catch (error) {
      console.error("Error using toolbox:", error);
      
      // Update the assistant message to show the error
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "I'm sorry, I encountered an error while generating content. Please try again.",
                isLoading: false,
              }
            : msg
        )
      );
      
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
        // Find the message to regenerate
        const messageToRegenerate = messages.find(msg => msg.id === messageId);
        
        // Check if we have the original prompt data
        if (messageToRegenerate && messageToRegenerate.promptData) {
          // Create a new message ID for the regenerated response
          const regeneratedMessageId = `regenerated-${Date.now()}`;
          
          // Replace the current message with a loading message
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === messageId ? {
                ...msg,
                id: regeneratedMessageId,
                content: "",
                isLoading: true
              } : msg
            )
          );
          
          setIsLoading(true);
          
          // Call the API with the same prompt data
          (async () => {
            try {
              const { message, toolType, pdfIds } = messageToRegenerate.promptData;
              
              // Get the selected PDFs
              const selectedPdfs = pdfFiles.filter(pdf => pdfIds?.includes(pdf.id));
              
              // Determine which API call to make based on the prompt data
              const apiRequestBody = toolType 
                ? { toolType, pdfFiles: selectedPdfs } 
                : { message, pdfFiles: selectedPdfs };
              
              const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(apiRequestBody),
              });
              
              if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
              }
              
              // Process the streaming response
              const reader = response.body.getReader();
              let accumulatedContent = "";
              
              // Update the loading state to false but keep the empty content
              setMessages(prevMessages =>
                prevMessages.map(msg =>
                  msg.id === regeneratedMessageId
                    ? { 
                        ...msg, 
                        content: accumulatedContent,
                        promptData: messageToRegenerate.promptData // Preserve the original promptData
                      }
                    : msg
                )
              );
              
              // Read and process chunks as they arrive
              while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                  // Set isLoading to false when streaming is complete
                  setMessages(prevMessages =>
                    prevMessages.map(msg =>
                      msg.id === regeneratedMessageId
                        ? { 
                            ...msg, 
                            content: accumulatedContent,
                            isLoading: false 
                          }
                        : msg
                    )
                  );
                  break;
                }
                
                // Convert the chunk to text
                const chunk = new TextDecoder().decode(value);
                
                // Process each line in the chunk (there might be multiple JSON objects)
                const lines = chunk.split("\n").filter(line => line.trim());
                
                for (const line of lines) {
                  try {
                    const { chunk: chunkText } = JSON.parse(line);
                    
                    if (chunkText) {
                      // Accumulate the content
                      accumulatedContent += chunkText;
                      
                      // Update the message with the accumulated content
                      setMessages(prevMessages =>
                        prevMessages.map(msg =>
                          msg.id === regeneratedMessageId
                            ? { ...msg, content: accumulatedContent, isLoading: false }
                            : msg
                        )
                      );
                    }
                  } catch (e) {
                    console.error("Error parsing chunk:", e, line);
                  }
                }
              }
            } catch (error) {
              console.error("Error regenerating message:", error);
              
              // Update the message to show the error
              setMessages(prevMessages =>
                prevMessages.map(msg =>
                  msg.id === regeneratedMessageId
                    ? {
                        ...msg,
                        content: "I'm sorry, I encountered an error while regenerating the response. Please try again.",
                        isLoading: false,
                      }
                    : msg
                )
              );
              
              toast.error("Failed to regenerate response. Please try again.");
            } finally {
              setIsLoading(false);
            }
          })();
        } else {
          toast.error("Cannot regenerate this message. Original prompt data is missing.");
        }
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
        {/* PDF Selector Dialog */}
        <PDFSelector
          pdfFiles={pdfFiles}
          isOpen={isPdfSelectorOpen}
          setIsOpen={setIsPdfSelectorOpen}
          onSelect={handlePdfSelection}
          toolType={currentToolType}
          multiSelect={true}
        />
        
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[200px] border rounded-lg"
        >
          <ResizablePanel className="border-r">
            <div className="h-[85vh] p-4 bg-gray-100 flex flex-col">
              {/* PDF viewer content */}
              <MultiPdfViewer onPdfUpload={handlePdfUpload} maxFiles={3} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className="h-[85vh] p-4 bg-gray-100 flex flex-col">
              {/* Chat Interface */}
              <ScrollArea className="h-[85vh]" ref={scrollRef}>
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