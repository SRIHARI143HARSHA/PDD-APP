# Java AI Chatbot & Tutor (Powered by Ollama llama3.2)

A modular, standalone **Java Swing Desktop Application** built using standard **Java 21 LTS** that serves as an interactive **Java Tutor and AI Code Assistant** powered by a local **Ollama (`llama3.2`)** backend API.

---

## 🌟 Key Features & AI Tutor Modes

1. 📚 **Java Tutor**: Explains Java fundamentals and Object-Oriented Programming (OOP) concepts in simple language with code examples (Inheritance, Polymorphism, Encapsulation, Abstraction, Classes & Objects).
2. 💻 **Code Generator**: Generates complete, compilable, and well-commented Java programs from natural language prompts.
3. 🔍 **Code Explainer**: Provides line-by-line breakdowns of complex Java code snippets.
4. 🛠️ **Error Fixer**: Diagnoses compilation/runtime errors (e.g. `NullPointerException`, syntax bugs) and provides corrected code.
5. 📝 **Assignments**: Generates practice exercises tailored to Beginner, Intermediate, and Advanced skill levels.
6. 🧩 **Interactive Quiz Mode**: Generates Java Multiple Choice Questions (MCQs), tracks score live, and renders instant correct answers with explanations.
7. 💬 **General Chat**: Answers any general questions outside Java.
8. ⚡ **Quick Shortcuts**: Pre-built one-click tutoring prompts for instant learning.

---

## 🛠️ Project Structure

```text
java-ollama-chatbot/
 ├── README.md
 └── src/
      ├── Main.java                 # Main application entrypoint
      ├── model/
      │    ├── ChatMessage.java     # Chat message data model
      │    ├── ChatManager.java     # In-memory session history manager
      │    ├── OllamaClient.java    # HTTP Client connecting to http://localhost:11434/api/generate
      │    ├── PromptManager.java   # System prompt builder & tutoring templates
      │    └── QuizManager.java     # MCQ quiz parsing, score tracking & answer evaluation
      └── ui/
           ├── MainFrame.java       # Main Desktop Window & Sidebar Mode Navigator
           ├── ChatPanel.java       # Scrollable chat UI with HTML code formatting
           ├── QuickActionsPanel.java# Preset shortcut buttons for OOP concepts & generators
           └── QuizPanel.java       # Interactive MCQ Quiz component with live score tracking
```

---

## 🚀 Setup & Execution Guide

### 1. Download & Install Ollama
1. Download **Ollama** from [https://ollama.com](https://ollama.com).
2. Open your terminal and pull the `llama3.2` model:
   ```bash
   ollama pull llama3.2
   ```
3. Start the Ollama local service (listens on `http://localhost:11434`):
   ```bash
   ollama serve
   ```

---

### 2. Compile & Run the Java Application

Open terminal in the `java-ollama-chatbot` directory:

#### Step 2.1: Compile Java Source Files
```bash
javac -d bin src/*.java src/model/*.java src/ui/*.java
```

#### Step 2.2: Run the Java Desktop GUI App
```bash
java -cp bin Main
```

---

## 🔌 How Java Communicates with Ollama

1. **HTTP Endpoint**: Sends `POST` requests to `http://localhost:11434/api/generate`.
2. **JSON Payload**:
   ```json
   {
     "model": "llama3.2",
     "prompt": "<System Instruction> + <User Task / Query>",
     "stream": false
   }
   ```
3. **Asynchronous Execution**: Uses `javax.swing.SwingWorker` to execute HTTP calls off the EDT (Event Dispatch Thread), keeping the UI 100% responsive with an animated thinking indicator (`⏳ Ollama (llama3.2) is generating response...`).
4. **Offline Resilience**: Automatically detects if Ollama is offline or if `llama3.2` is missing, displaying friendly error banners with instructions to run `ollama serve` and `ollama pull llama3.2`.
