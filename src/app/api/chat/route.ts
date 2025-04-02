import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.0-flash";

export async function POST(req: NextRequest) {
  try {
    console.log("API handler called");
    
    const body = await req.json();
    console.log("Request body received:", JSON.stringify({
      messageContent: body.message,
      hasPdf: !!body.pdfData,
      toolType: body.toolType
    }));
    
    // get the model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // create prompt
    let prompt = "";
    if (body.toolType) {
      prompt = getToolboxPrompt(body.toolType, body.pdfData?.name);
    } else {
      prompt = body.message || "Hello";
    }
    
    console.log("Using prompt:", prompt);
    
    // build content array
    const parts = [];
    
    // add text prompt
    parts.push({ text: prompt });
    
    // add PDF content if available
    if (body.pdfFiles && body.pdfFiles.length > 0) {
      // Add information about which PDFs we're using
      const pdfNames = body.pdfFiles.map(pdf => pdf.name).join('", "');
      const pdfContext = body.pdfFiles.length > 1 
        ? `I'm analyzing multiple PDFs: "${pdfNames}". ` 
        : `I'm analyzing the PDF: "${pdfNames}". `;
      
      parts[0].text = pdfContext + parts[0].text;
      
      // Add each PDF to the parts array
      body.pdfFiles.forEach(pdf => {
        if (pdf.base64) {
          parts.push({
            inlineData: {
              data: pdf.base64,
              mimeType: "application/pdf"
            }
          });
        }
      });
    }
    
    console.log("Calling Gemini API with streaming...");
    
    // Use streaming response
    try {
      // Create a new ReadableStream
      const stream = new ReadableStream({
        async start(controller) {
          // Call Gemini API with streaming
          const streamingResult = await model.generateContentStream({
            contents: [{ role: "user", parts }]
          });
          
          // Process each chunk as it arrives
          for await (const chunk of streamingResult.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              // Send the chunk to the client
              controller.enqueue(new TextEncoder().encode(JSON.stringify({ chunk: chunkText }) + "\n"));
            }
          }
          
          controller.close();
        },
        cancel() {
          console.log("Stream was cancelled by the client");
        }
      });
      
      // Return a streaming response
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        }
      });
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
      return NextResponse.json(
        { error: "Error from Gemini API", details: geminiError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}

// get predefined prompts for toolbox buttons
function getToolboxPrompt(toolType, documentName) {
  // Handle multiple document names
  let docContext;
  if (Array.isArray(documentName)) {
    if (documentName.length > 1) {
      const docNames = documentName.join('", "');
      docContext = `the uploaded documents "${docNames}"`;
    } else if (documentName.length === 1) {
      docContext = `the uploaded document "${documentName[0]}"`;
    } else {
      docContext = "the uploaded document";
    }
  } else {
    docContext = documentName 
      ? `the uploaded document "${documentName}"` 
      : "the uploaded document";
  }
  
  switch (toolType) {
    case "studyPlan":
      return `You are an expert educational consultant tasked with creating a personalized study plan based on ${docContext}. 

Analyze the document thoroughly and create a comprehensive, structured study plan that includes:
1. A clear breakdown of all key topics and subtopics in order of logical progression
2. Specific learning objectives for each section
3. Recommended study time allocation for each topic based on complexity
4. Suggested learning activities and exercises for each topic
5. Milestones to track progress
6. Resources or references that complement the material (if applicable)

Format your response with clear headings, bullet points, and a visually organized structure. The study plan should be practical, actionable, and tailored specifically to the content in the document.`;
    
    case "quickSummary":
      return `You are a skilled content analyst tasked with creating a concise yet comprehensive summary of ${docContext}.

Analyze the document and provide a well-structured summary that:
1. Captures the essential information and main arguments
2. Highlights key concepts, findings, or conclusions
3. Preserves the logical flow of ideas from the original document
4. Omits unnecessary details while retaining critical points
5. Uses clear, precise language

Your summary should be approximately 1/5 the length of the original document. Format it with appropriate headings and bullet points where helpful. Focus on delivering maximum value and clarity in minimum space.`;
    
    case "detailedExplanation":
      return `You are an expert educator tasked with providing a detailed, accessible explanation of the concepts in ${docContext}.

Analyze the document thoroughly and create a comprehensive explanation that:
1. Identifies and explains all key concepts, theories, and terminology
2. Breaks down complex ideas into clear, understandable components
3. Provides relevant examples, analogies, or case studies to illustrate concepts
4. Connects related ideas and shows how they build upon each other
5. Addresses potential points of confusion or misconception
6. Includes visual descriptions or diagrams where appropriate

Your explanation should be thorough yet accessible, using clear language while maintaining academic rigor. Format your response with appropriate headings, numbered lists, and paragraph breaks for readability.`;
    
    case "practiceQuestions":
      return `You are an experienced assessment designer tasked with creating high-quality practice questions based on ${docContext}.

Analyze the document thoroughly and create a comprehensive set of practice questions that:
1. Cover all major topics and concepts in the document
2. Include a mix of question types:
   - Multiple-choice questions with 4 options and one correct answer
   - Short-answer questions requiring brief explanations
   - Analytical questions that test deeper understanding
3. Range in difficulty from basic recall to advanced application
4. Are clearly worded and unambiguous
5. Include the correct answer and explanation for each question

Format your response with clear numbering, organized sections by topic, and separate the questions from answers. Aim to create 10-15 questions that thoroughly test understanding of the material.`;
    
    default:
      return "I'm an AI assistant ready to help you with this document. Could you please clarify what specific information or analysis you're looking for?";
  }
}