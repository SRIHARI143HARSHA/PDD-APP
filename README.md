# Disaster Preparedness App & Ollama AI Assistant 👋

Expo React Native Disaster Preparedness Application with real-time weather alerts, emergency guides, interactive map layers, and a local **Ollama AI Assistant**.

---

## 🤖 Ollama AI Disaster Chatbot Setup

### Architecture:
```
Expo React Native App
       ↓ (POST /api/chat via EXPO_PUBLIC_API_URL)
Node.js / Express Backend (backend/server.js)
       ↓ (OLLAMA_BASE_URL)
Local Ollama Server (http://localhost:11434)
       ↓
Local LLM (OLLAMA_MODEL e.g. llama3.2)
```

---

### Step-by-Step Execution:

#### 1. Download & Start Ollama
1. Download Ollama from [https://ollama.com](https://ollama.com).
2. Download your preferred model (default `llama3.2`):
   ```bash
   ollama pull llama3.2
   ```
3. Run Ollama:
   ```bash
   ollama serve
   ```

#### 2. Start Express Backend Bridge (`backend/`)
```bash
cd backend
npm install
npm start
```
The server starts on `http://localhost:5000`.

#### 3. Start Expo App (`frontend/`)
- Configure `EXPO_PUBLIC_API_URL` in `.env`:
  - Web/Desktop: `EXPO_PUBLIC_API_URL=http://localhost:5000`
  - Mobile/Physical Phone: `EXPO_PUBLIC_API_URL=http://<YOUR-LAN-IP>:5000`
- Launch Expo:
  ```bash
  npx expo start --web
  ```

---

## 🧪 Testing the AI Chatbot
1. Open the **Disaster AI Assistant** tab.
2. Ask: *"What should I do during heavy rain?"* -> Receives structured safety guidance.
3. Ask: *"What is the current weather?"* -> Answers using live Open-Meteo telemetry & active alerts passed from the app context.
4. Stop Ollama to verify the offline status card: `"AI assistant is currently unavailable."` with **Retry** button.

---

## 📁 Repository Structure
- `frontend/`: Expo React Native screens, components, and navigation.
- `backend/`: Isolated Node/Express server bridge (`backend/server.js`) connecting to Ollama.
- `data/`: Disaster course and safety content.
- `__tests__/`: Automated Jest test suites (10 test suites, 362 tests passing).
