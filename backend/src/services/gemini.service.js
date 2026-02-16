import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Convert file to Gemini-readable format
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mimeType,
    },
  };
}

export const extractInvoiceData = async (filePath) => {
  try {
    // 🔴 UPDATE: Changed from 'gemini-1.5-flash' to 'gemini-2.0-flash'
    // If '2.0' fails, try 'gemini-1.5-flash-latest'
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert Invoice Parser for a Fintech Application.
      Analyze the attached invoice PDF and extract the following details strictly in JSON format.
      
      Return ONLY the JSON. Do not add markdown formatting (like \`\`\`json).

      Required Fields:
      1. invoice_number (String)
      2. po_number (String or null if missing)
      3. invoice_date (ISO Date String YYYY-MM-DD)
      4. due_date (ISO Date String YYYY-MM-DD)
      5. seller_gstin (String - 15 chars)
      6. buyer_gstin (String - 15 chars)
      7. buyer_name (String)
      8. total_amount (Number - Remove currency symbols)
      9. buyer_email (String or null)
      10. items_summary (String - A short summary of what was sold, e.g., "Industrial Sensors")

      If any field is missing or unreadable, set it to null.
      Ensure high accuracy for GSTINs and Amounts.
    `;

    const filePart = fileToGenerativePart(filePath, "application/pdf");

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();

    // Cleanup: Remove markdown if Gemini adds it accidentally
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanedText);

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("Failed to extract data from Invoice");
  }
};