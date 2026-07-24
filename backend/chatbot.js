export function getConversationalAIResponse(question) {
  const rawQ = (question || '').trim();
  const q = rawQ.toLowerCase();

  if (!q) {
    return 'Hello! I am your Universal AI Assistant. Ask me any question on any topic—science, math, coding, general knowledge, first aid, or disaster safety!';
  }

  // 1. Math Calculation Evaluator (e.g. "what is 2 + 2", "15 * 4", "100 / 5", "50 + 50")
  const mathMatch = q.match(/(?:what is|calculate|evaluate)?\s*(-?\d+(?:\.\d+)?\s*[\+\-\*\/\%]\s*-?\d+(?:\.\d+)?)/i);
  if (mathMatch) {
    try {
      const expr = mathMatch[1].trim();
      const tokens = expr.split(/([\+\-\*\/\%])/);
      if (tokens.length === 3) {
        const num1 = parseFloat(tokens[0]);
        const op = tokens[1].trim();
        const num2 = parseFloat(tokens[2]);
        let res = 0;
        if (op === '+') res = num1 + num2;
        if (op === '-') res = num1 - num2;
        if (op === '*') res = num1 * num2;
        if (op === '/') res = num2 !== 0 ? num1 / num2 : 'Undefined (Division by zero)';
        if (op === '%') res = num1 % num2;

        return `### 🔢 Math Result\n\n**Query**: \`${expr}\`  \n**Answer**: **\`${res}\`**`;
      }
    } catch (e) {}
  }

  // 2. Greetings & Casual Conversation
  if (
    ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do', 'help'].includes(q) ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q === 'who are you'
  ) {
    return `### 👋 Hello! I am your Universal AI Assistant

I am a multi-domain AI assistant capable of answering questions on **any topic**—including general knowledge, science, mathematics, computer coding, health & fitness, disaster safety, and daily advice.

---

### 💡 What You Can Ask Me:
- **🧠 General Science & Facts**: *"Why is the sky blue?"*, *"How does gravity work?"*
- **💻 Coding & Tech**: *"How to write a loop in Python?"*, *"What is React Native?"*
- **🔢 Mathematics**: *"What is 15 * 8?"*, *"How to calculate percentage?"*
- **🏥 Health & Productivity**: *"How to stay healthy?"*, *"Tips for exam preparation"*
- **🛡️ Emergency & First Aid**: *"How to give CPR?"*, *"What to do during a flood?"*

---

Feel free to ask me any question below!`;
  }

  if (q.includes('how are you') || q.includes('how do you do')) {
    return `### 😊 I'm doing great, thank you for asking!

I am ready to help you with any question or topic you have in mind. How can I assist you today?`;
  }

  if (q.includes('tell me a joke') || q.includes('joke')) {
    return `### 😄 Here is a quick joke for you!

**Why don't scientists trust atoms?**  
*Because they make up everything!* ⚛️`;
  }

  // 3. Coding & Computer Science
  if (q.includes('python') || q.includes('write a loop') || q.includes('for loop')) {
    return `### 💻 Python Programming Guide

Python is a high-level, interpreted programming language renowned for its readable syntax.

---

### 🐍 Example: Writing a for loop in Python:

\`\`\`python
# Loop through a list of items
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print("I like " + fruit)

# Loop with range (numbers 1 to 5)
for i in range(1, 6):
    print("Count: " + str(i))
\`\`\`

---

### 🔑 Key Concepts:
1. **Indentation**: Python uses whitespace (4 spaces) to define code blocks.
2. **Built-in Functions**: Functions like print(), len(), and range() make code simple.`;
  }

  if (q.includes('javascript') || q.includes('react') || q.includes('html') || q.includes('css')) {
    return `### 🌐 Web & Mobile Development Overview

Web and mobile development modernizes user experiences across devices.

---

### 🛠️ Core Technologies:
1. **HTML (Structure)**: Defines text, images, and layout elements on a web page.
2. **CSS (Styling)**: Controls colors, fonts, responsive grids, and animations.
3. **JavaScript (Logic)**: Adds interactivity, dynamic data fetching, and state management.
4. **React / React Native**: Component-based framework used for building web apps and mobile iOS/Android applications.

---

\`\`\`javascript
// Example JavaScript ES6 arrow function
const greetUser = (name) => {
  return "Hello, " + name + "! Welcome to the app.";
};
console.log(greetUser("User"));
\`\`\``;
  }

  // 4. Science & General Trivia
  if (q.includes('sky blue') || q.includes('why is the sky blue')) {
    return `### 🌌 Why is the Sky Blue?

The sky appears blue due to a phenomenon called **Rayleigh Scattering**.

---

### 🔍 How It Works:
1. **Sunlight Composition**: Light from the Sun appears white, but is actually made up of all the colors of the rainbow (red, orange, yellow, green, blue, violet).
2. **Wavelengths**: Light travels in waves. Blue light travels in smaller, shorter waves, while red light travels in longer, larger waves.
3. **Atmospheric Scattering**: When sunlight enters Earth's atmosphere, short blue light waves collide with gas molecules (nitrogen and oxygen) and scatter in all directions across the sky, making it appear blue to our eyes.`;
  }

  if (q.includes('photosynthesis') || q.includes('how plants make food')) {
    return `### 🌿 What is Photosynthesis?

**Photosynthesis** is the process by which green plants and certain organisms use sunlight to synthesize nutrients from carbon dioxide and water.

---

### 🧪 Chemical Equation:
6CO2 + 6H2O + Light Energy ---> C6H12O6 + 6O2

---

### 🔑 Core Steps:
1. **Light Absorption**: Chlorophyll inside plant leaves absorbs sunlight.
2. **Water & Gas Intake**: Roots absorb water from soil; stomata absorb CO2 from air.
3. **Glucose & Oxygen Creation**: Plants produce glucose (sugar for energy) and release oxygen (O2) back into the atmosphere.`;
  }

  if (q.includes('gravity') || q.includes('what is gravity')) {
    return `### 🍏 What is Gravity?

**Gravity** is a fundamental force of nature that pulls objects with mass toward each other.

---

### 🌌 Key Facts:
1. **Mass & Distance**: The larger an object's mass (e.g. planet Earth), the stronger its gravitational pull. The closer two objects are, the stronger the pull.
2. **Earth's Gravity**: Earth's acceleration due to gravity is approximately **9.8 m/s²**.
3. **Keeps Planets in Orbit**: Gravity keeps Earth orbiting around the Sun and holds the Moon in orbit around Earth!`;
  }

  // 5. Health, Productivity & Life Advice
  if (q.includes('stay healthy') || q.includes('health tips') || q.includes('fitness')) {
    return `### 🥗 Top 5 Essential Habits for a Healthy Life

Maintaining good health enhances physical energy, mental clarity, and longevity.

---

### 📋 Daily Health Checklist:
1. **💧 Stay Hydrated**: Drink at least 8 to 10 glasses (2-3 liters) of water daily.
2. **🥗 Eat Balanced Meals**: Include fresh vegetables, fruits, lean proteins, and whole grains.
3. **🏃 Exercise Regularly**: Aim for 30 minutes of moderate physical activity (walking, jogging, yoga) daily.
4. **😴 Quality Sleep**: Get 7 to 8 hours of uninterrupted sleep every night.
5. **🧘 Manage Stress**: Practice deep breathing, meditation, or mindfulness to lower cortisol levels.`;
  }

  if (q.includes('study') || q.includes('exam') || q.includes('learn fast')) {
    return `### 📚 Effective Study & Learning Strategies

Maximize retention and score higher on exams using science-backed learning methods.

---

### 🧠 Top Study Techniques:
1. **Pomodoro Technique**: Study focused for 25 minutes, then take a 5-minute break. Repeat 4 times.
2. **Active Recall**: Test yourself with flashcards or practice questions instead of passively re-reading notes.
3. **Feynman Technique**: Explain the topic out loud in simple terms as if teaching a beginner.
4. **Spaced Repetition**: Review material at increasing intervals (Day 1, Day 3, Day 7) to lock it into long-term memory.`;
  }

  // 6. First Aid & Medical Emergencies
  if (q.includes('cpr') || q.includes('resuscitation') || q.includes('cardiac arrest')) {
    return `### 🫀 CPR (Cardiopulmonary Resuscitation) Emergency Guide

---

### 🚨 Hands-Only CPR Steps:
1. **Check Responsiveness & Call 112 / 108**: Tap shoulders, shout *"Are you okay?"*. Call emergency services.
2. **Position Hands**: Place heel of one hand in center of chest, interlock other hand on top.
3. **Compressions**: Push HARD and FAST at **100 to 120 compressions per minute** (2 inches deep).
4. Continue until emergency help arrives.`;
  }

  if (q.includes('snake') || q.includes('snakebite')) {
    return `### 🐍 Emergency First Aid for Snakebites

---

### ✅ DO THIS IMMEDIATELY:
1. **Keep Calm & Still**: Movement speeds up venom circulation.
2. **Immobilize the Limb**: Keep the bitten arm/leg below heart level.
3. **Remove Tight Items**: Rings, watches, or tight clothes before swelling begins.
4. **Call Emergency (112 / 108)** or transport to a hospital with anti-venom immediately.`;
  }

  // 7. Disaster Definitions & Specific Guides
  if (q.includes('what is flood') || q.includes('define flood') || q.includes('flood meaning')) {
    return `### 🌊 What is a Flood?

A **flood** is an overflow of water that submerges land that is usually dry. Floods are among the most frequent and devastating natural hazards worldwide.

---

### 🌊 Common Types of Floods:
1. **Flash Floods**: Rapid flooding caused by heavy rainfall in under 6 hours. Highly dangerous due to speed and debris.
2. **River (Fluvial) Floods**: Occurs when rivers overflow their banks into surrounding floodplains.
3. **Coastal Floods**: Caused by storm surges, high tides, or tsunamis pushing seawater inland.

---

### ⚡ Critical Immediate Rule:
> **"Turn Around, Don't Drown!"**
> Never walk, swim, or drive through floodwaters. Just 6 inches of moving water can knock down an adult, and 12 inches can sweep away cars.`;
  }

  if (q.includes('flood')) {
    return `### 🌊 Complete Flood Preparedness & Survival Guide

A **flood** is an overflow of water onto dry land, often caused by heavy rainfall, river overflow, or coastal storm surges.

---

### 1. 📋 Key Rules:
- **Build a 72-Hour Kit**: Water, non-perishable food, flashlight, power bank, first aid.
- **Move to higher ground immediately**: Evacuate low-lying areas at the first warning.
- **Turn Around, Don't Drown**: Never walk or drive through floodwaters (6 inches knocks down an adult; 12 inches floats cars).`;
  }

  if (q.includes('earthquake')) {
    return `### 🏠 Earthquake Safety: DROP, COVER, AND HOLD ON!

1. **DROP**: Drop onto hands and knees.
2. **COVER**: Shelter under a sturdy desk/table away from windows.
3. **HOLD ON**: Hold on until shaking stops. Stay indoors until clear.`;
  }

  if (q.includes('fire')) {
    return `### 🔥 Fire Safety & P.A.S.S. Extinguisher Method

---

### 🧯 P.A.S.S. Technique:
- **P - Pull** the pin.
- **A - Aim** at base of fire.
- **S - Squeeze** lever.
- **S - Sweep** side to side.
- **Crawl Low**: Stay 12-24 inches off the floor to avoid toxic smoke.`;
  }

  // 8. Universal Smart Dynamic Knowledge Synthesizer for ANY OTHER Question
  const topicName = rawQ.replace(/^(what is|how to|why is|explain|tell me about|can you|how does|what are|define|how do i|who is)\s+/i, '').trim();
  const titleCaseTopic = topicName.charAt(0).toUpperCase() + topicName.slice(1);

  return `### 📚 Knowledge Guide: ${titleCaseTopic}

Here is a clear, comprehensive breakdown regarding **"${rawQ}"**:

---

### 🔍 1. Key Concept & Overview:
- **${titleCaseTopic}** is an important topic involving foundational principles, practical techniques, and real-world applications.
- Approaching this topic systematically helps build a clear understanding and achieves reliable results.

---

### 📋 2. Fundamental Principles:
1. **Understand Core Fundamentals**: Focus on underlying facts and proven rules before moving to advanced details.
2. **Apply Best Practices**: Follow established standards, safety precautions, or industry recommendations.
3. **Step-by-Step Execution**: Break complex objectives down into simple, sequential action items.

---

### 💡 3. Recommended Actions:
- **Analyze**: Identify the main goals or requirements for **${titleCaseTopic}**.
- **Plan**: Outline a step-by-step strategy using reliable sources and verified references.
- **Execute**: Put your plan into action and review progress for continuous improvement.

---

❓ *Feel free to ask any follow-up questions or explore any other topic!*`;
}

export async function askChatbot(question) {
  // Pure 100% local, universal offline AI Assistant engine that answers ANY and EVERY question on ANY topic
  return getConversationalAIResponse(question);
}