# Ollama AI Backend Bridge (`disaster-app-backend`)

Dedicated Node/Express API bridge connecting the **Expo React Native Disaster Preparedness Application** to a local **Ollama LLM**.

---

## 🚀 Step-by-Step Setup Instructions

### 1. Install & Run Ollama
1. Download and install **Ollama** from [https://ollama.com](https://ollama.com).
2. Open a terminal and pull your desired local LLM model (default is `llama3.2`):
   ```bash
   ollama pull llama3.2
   ```
3. Start the Ollama local service (runs on `http://localhost:11434` by default):
   ```bash
   ollama serve
   ```

---

### 2. Configure & Start the Backend Server
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies (Express & CORS):
   ```bash
   npm install
   ```
3. (Optional) Copy `.env.example` to `.env` to customize settings:
   ```env
   PORT=5000
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   The backend API will run on **`http://localhost:5000`** with endpoint `POST /api/chat`.

---

### 3. Configure Expo App (`EXPO_PUBLIC_API_URL`)
- **Local Web / Desktop Testing**:
  In root directory `.env`:
  ```env
  EXPO_PUBLIC_API_URL=http://localhost:5000
  ```
- **Physical Mobile Device Testing (over LAN)**:
  In root directory `.env`:
  ```env
  EXPO_PUBLIC_API_URL=http://<YOUR-COMPUTER-LAN-IP>:5000
  ```
  *(Replace `<YOUR-COMPUTER-LAN-IP>` with your Wi-Fi IP address e.g. `http://192.168.1.5:5000`)*

---

### 4. Test the AI Chatbot
1. Open the app in your browser or phone (`npx expo start --web`).
2. Open the **Disaster AI Assistant** tab.
3. Ask any safety question (e.g., *"What should I do during heavy rain?"*).
4. The AI uses live weather context & active alerts from the application to provide clear, actionable disaster safety guidance!
