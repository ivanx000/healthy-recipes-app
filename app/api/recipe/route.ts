import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Step 1: Generate recipe text
    const recipeText = await replicate.run("openai/gpt-4o-mini", {
        input: {
          prompt: `Generate a healthy recipe based on the following user request: ${prompt}
      
      Requirements:
      - Output in **valid Markdown only**
      - Recipe title at the top as H2 (##) in bold
      - Ingredients section:
        - Start with "**Ingredients**" in bold
        - Use bullets for each ingredient with amounts
      - Instructions section:
        - Start with "**Instructions**" in bold
        - Use a numbered list for each step
      - Include optional nutritional benefits at the bottom in italics
      - Do not include unnecessary spaces around punctuation
      - Ensure consistent formatting for all sections`,
          system_prompt: "Output the recipe in clean, readable Markdown format only",
          reasoning_effort: "high",
        },
      });
      
    // Step 2: Generate image of the dish
    const imagePrompt = `A beautifully plated healthy meal based on this recipe: ${recipeText}`;
    const imageOutput: any = await replicate.run("stability-ai/stable-diffusion-3.5-large", {
      input: {
        prompt: imagePrompt,
        width: 512,
        height: 512,
      },
    });

    // Extract actual image URL from the output
    const imageUrl = Array.isArray(imageOutput) ? imageOutput[0].url() : undefined;

    if (!imageUrl) {
      throw new Error("Image generation failed or output is empty.");
    }

    return NextResponse.json({ recipe: recipeText, image: imageUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
