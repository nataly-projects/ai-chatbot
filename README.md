# AI Chatbot Application
This project is an AI Chatbot application that allows users to interact with conversational AI models from multiple AI services, such as OpenAI and Anthropic. The chatbot supports conversation context, streaming responses, multi-session chat management, and automatic session saving.

## Features
 - Multi-Session Management: Users can start new chat sessions, continue existing ones, and switch between them. Each chat session is saved and can be reloaded when the user revisits the application.
 - AI Chat Integration: The application integrates with both OpenAI and Anthropic APIs, allowing users to toggle between AI services and select different models.
 - Conversation Context: The bot can remember previous inputs, allowing for conversational context to be maintained across interactions.
 - Streaming Responses: AI responses are displayed incrementally, simulating a "typing" effect, rather than arriving all at once.
 - Session Auto-Save: The application automatically saves each session to local storage, allowing users to resume previous sessions after refreshing the browser.
 - Dynamic Model Selection: Based on the selected AI service (OpenAI or Anthropic), the model dropdown dynamically updates with the available models for that service.

## Summary of the Approach
The application is built with React and TypeScript, using Material UI for the user interface. It leverages the flexibility of React components and hooks to manage state, API calls, and the chatbot’s conversation flow.

 - React Hooks: The project makes extensive use of hooks such as useState, useEffect, and useCallback to handle the state of the messages, the current AI service, and the chatbot session.
 - Local Storage: The application uses the browser’s local storage to save sessions. This allows users to reload the application and continue previous chats.
 - Multi-API Support: The chatbot is capable of switching between multiple AI services (OpenAI and Anthropic) and their respective models, using a dynamic dropdown for model selection.
 - Streaming Response Handling: For each user message, a streaming AI response is fetched from the API, and the response is displayed gradually to simulate a typing effect.
 - Component-Based Architecture: The UI is split into reusable components such as ChatUi, ServiceToggle, ChatSession, and SessionList. Each component is designed to be modular and easy to extend.

## Running the Project
### Prerequisites
Before running the project, ensure you have the following tools installed:

- Node.js
 - npm: Comes with Node.js

### Instructions
 - Clone the repository:
git clone https://github.com/your-username/ai-chatbot.git

- Navigate into the project directory:
cd ai-chatbot

 - Install dependencies:
npm install

 - Create an .env file in the root directory and add the API keys for OpenAI and Anthropic:
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key

- Start the development server:
npm run dev
