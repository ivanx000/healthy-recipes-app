🥗 AI Recipe Generator

An interactive web app that creates healthy, beautifully formatted recipes with images, powered by OpenAI GPT-4o-mini (for text) and Stability AI’s Stable Diffusion 3.5 Large (for visuals), via the Replicate API.
Simply describe what kind of meal you want — for example, “a quick vegan lunch with tofu and quinoa” — and the app will generate a complete recipe and matching image.

🚀 Features

🧠 AI-Generated Recipes: GPT-4o-mini writes structured, Markdown-formatted recipes with clear ingredients, steps, and nutrition notes.

🎨 Image Generation: Stable Diffusion 3.5 Large creates a realistic image of the dish.

💬 Dynamic Chat Interface: User prompts appear in speech bubbles, making interaction conversational.

⏳ Loading Feedback: Displays “…” and an estimated wait time while the model generates output.

🎨 Responsive UI: Clean, centered layout with matching image and text widths, auto-reflow on result.

🧩 Tech Stack
Layer	Technology
Frontend	React + Vite + Tailwind CSS
Backend / API	Node.js + Express
AI Models	OpenAI GPT-4o-mini
, Stability AI Stable Diffusion 3.5 Large

Integration	Replicate API
🧠 How It Works

The user enters a natural language prompt describing a recipe idea.

The app sends the text to GPT-4o-mini via Replicate with a carefully designed system prompt to produce a clean Markdown recipe.

The recipe title and ingredients are passed to Stable Diffusion 3.5 Large to generate a matching image.

The frontend displays both results in a unified, aesthetic layout.

⚙️ Setup & Installation
1️⃣ Clone the repository
git clone https://github.com/your-username/ai-recipe-generator.git
cd ai-recipe-generator

2️⃣ Install dependencies
npm install

3️⃣ Create a .env file

Add your Replicate API key:

REPLICATE_API_TOKEN=your_replicate_api_key_here

4️⃣ Run the development server
npm run dev


The app will open at http://localhost:5173

🧑‍🍳 Example Prompt

“Create a high-protein dinner recipe with salmon and quinoa.”

Output:

Grilled Lemon Herb Salmon Bowl
With complete ingredients list, cooking instructions, and a vibrant image of the final dish.

🧰 Key Files
File	Description
frontend/src/App.jsx	Main React interface and UI logic
backend/server.js	Handles Replicate API calls
.env	Stores your API token securely
README.md	Project documentation
🧑‍💻 Development Notes

Uses ReactMarkdown to render formatted text output.

Loading animation and delay estimate ensure smooth UX during model inference.

Frontend dynamically repositions elements after generation (title up, button down).

The UI matches image width and recipe text bubble for a cohesive look.
