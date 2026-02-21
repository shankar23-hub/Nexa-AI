import { GoogleGenAI } from "@google/genai";
import { Staff } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeProjectDistribution(projectDescription: string, staffList: Staff[]) {
  const model = "gemini-3-flash-preview";
  
  const staffContext = staffList.map(s => `- ${s.name} (Skills: ${s.skills}, Languages: ${s.languages})`).join("\n");
  
  const prompt = `
    As an expert IT Project Manager, analyze the following project and distribute tasks among the available staff members.
    
    Project Description:
    ${projectDescription}
    
    Available Staff:
    ${staffContext}
    
    Please provide a detailed distribution of work. For each staff member, explain why they were chosen for their specific tasks based on their skills.
    Format the response in clear Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Failed to analyze project distribution. Please check your API key or try again later.";
  }
}
