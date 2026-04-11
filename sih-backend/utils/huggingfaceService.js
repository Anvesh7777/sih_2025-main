// utils/huggingfaceService.js
const { HfInference } = require("@huggingface/inference");
console.log("TOKEN BEING USED BY CODE:", process.env.HF_TOKEN);
const hf = new HfInference(process.env.HF_TOKEN);

// Define the model we want to use
const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2";

const getHfResponse = async (userMessage) => {
    try {
        const systemPrompt = `You are "Genie", a friendly and supportive AI college counselor...`; // Your full prompt

        let fullResponse = "";
        const stream = hf.chatCompletionStream({
            model: MODEL_NAME, // Use the constant here
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            max_tokens: 200,
        });

        for await (const chunk of stream) {
            fullResponse += chunk.choices[0]?.delta?.content || "";
        }

        return fullResponse || "I'm not sure how to respond to that.";

    } catch (error) {
        console.error("Hugging Face API Error:", error);
        // Check if the error is due to the model loading
        if (error.message.includes('is currently loading')) {
            return `The AI model is currently warming up. Please try again in a moment. (${error.message})`;
        }
        return "I'm currently having trouble connecting to my AI brain. Please check the API token and model status.";
    }
};

module.exports = { getHfResponse };