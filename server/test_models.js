const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in .env");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // There isn't a direct listModels in the SDK for clients usually without auth,
    // but we can test a few common ones.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        await model.generateContent("hi");
        console.log(`- ${modelName}: AVAILABLE`);
      } catch (e) {
        console.log(`- ${modelName}: FAILED (${e.message})`);
      }
    }
  } catch (error) {
    console.error("Error testing models:", error.message);
  }
}

run();
