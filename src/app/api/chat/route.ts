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
    if (body.pdfData?.base64) {
      parts.push({
        inlineData: {
          data: body.pdfData.base64,
          mimeType: "application/pdf"
        }
      });
    }
    
    console.log("Calling Gemini API...");
    
    // call Gemini API - without streaming for now
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }]
      });
      
      const response = result.response.text();
      console.log("Got response from Gemini:", response.substring(0, 100) + "...");
      
      return NextResponse.json({ response });
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
  const docContext = documentName 
    ? `based on the uploaded document "${documentName}"` 
    : "based on the uploaded document";
  
  switch (toolType) {
    case "studyPlan":
      return `Create a comprehensive study plan ${docContext}. Include key topics, recommended study hours, and learning objectives.`;
    case "quickSummary":
      return `Provide a concise summary ${docContext}. Highlight the main topics and key takeaways.`;
    case "detailedExplanation":
      return `Give a detailed explanation of the concepts ${docContext}. Break down complex ideas and provide examples where appropriate.`;
    case "practiceQuestions":
      return `Generate a set of practice questions ${docContext}. Include a mix of multiple choice and open-ended questions covering the main topics.`;
    default:
      return "I'm not sure what you're looking for. Could you please clarify?";
  }
}