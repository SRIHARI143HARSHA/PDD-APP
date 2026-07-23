import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || 'DUMMY_GEMINI_API_KEY';
const genAI = new GoogleGenerativeAI(API_KEY);

export function getConversationalAIResponse(question) {
  const q = (question || '').trim().toLowerCase();

  if (!q) {
    return 'Hello! I am your AI Safety Assistant. Ask me any question about disaster preparedness, emergency protocols, or safety guidelines!';
  }

  // Greetings & Identity Queries
  if (
    ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do', 'help'].includes(q) ||
    q.startsWith('hi ') ||
    q.startsWith('hello ')
  ) {
    return `Hello! 👋 I am your AI Safety & Emergency Preparedness Assistant, powered by advanced disaster management intelligence. 🤖✨

I can assist you with:
• 🌊 **Flood Safety**: Evacuation routes, higher ground rules, floodwater dangers, & property protection
• 🏠 **Earthquake Readiness**: Drop/Cover/Hold procedures & structural safety
• 🔥 **Fire Safety**: Smoke escape plans, P.A.S.S. extinguisher method, & smoke alarms
• 🌪️ **Cyclone & Storm Prep**: Window boarding, 72-hour emergency kits, & shelter rules
• 🌊 **Tsunami Warnings**: Coastal evacuation, natural warning signs, & high ground rules
• 🎒 **Emergency Survival Kits**: Essential checklist for water, food, first aid, & supplies

How can I help you stay safe and prepared today? Feel free to ask any question!`;
  }

  // "What is a disaster" / Definition queries
  if (
    q.includes('what is disaster') ||
    q.includes('define disaster') ||
    q.includes('disaster meaning') ||
    q.includes('what is a disaster') ||
    q.includes('types of disaster') ||
    q === 'disaster'
  ) {
    return `### 🛡️ What is a Disaster?

A **disaster** is a sudden, catastrophic event that causes severe disruption to a community or society, resulting in widespread human, material, economic, or environmental loss that exceeds local capacity to cope.

---

### 🌍 Primary Categories of Disasters:

1. **Natural Disasters**:
   • 🌊 **Hydrological**: Floods, Flash Floods, Tsunamis
   • 🏠 **Seismic & Geological**: Earthquakes, Landslides, Volcanic Eruptions
   • 🌪️ **Meteorological**: Cyclones, Typhoons, Hurricanes, Tornadoes, Heatwaves

2. **Human-Made & Technological Disasters**:
   • Industrial fires, chemical spills, structural collapses, and nuclear incidents.

---

### 💡 Why Preparedness Matters:
Being prepared reduces vulnerability, protects family members, minimizes property damage, and speeds up community recovery.

Would you like safety tips or an emergency checklist for a specific type of disaster?`;
  }

  // Definition of flood
  if (q.includes('what is flood') || q.includes('define flood') || q.includes('flood meaning')) {
    return 'A flood is an overflow of water onto dry land. If a flood warning is issued, move to higher ground immediately and avoid walking or driving through moving water.';
  }

  // Flood queries
  if (q.includes('flood')) {
    return `### 🌊 Flood Safety & Emergency Guidance

A **flood** is an overflow of water onto dry land, often caused by heavy rain, river overflow, or coastal storm surges.

---

### 🚀 Immediate Action Protocol:
1. **Move to Higher Ground**: Evacuate low-lying areas immediately and move to higher ground when flash flood alerts are issued.
2. **Turn Off Utilities**: Shut off main power and gas switches if safe to prevent electrocution or gas fires.
3. **Turn Around, Don't Drown**:
   • 6 inches of moving water can knock down an adult.
   • 12 inches can sweep away small cars.
   • 2 feet of rushing water will carry away trucks and SUVs.
4. **Avoid Floodwaters**: Never swim or walk through floodwater; it may contain toxic sewage, chemicals, or downed power lines.

Would you like advice on building a flood emergency kit or family evacuation plan?`;
  }

  // Earthquake queries
  if (q.includes('earthquake') || q.includes('tremor') || q.includes('seismic')) {
    return `### 🏠 Earthquake Safety Guidance

An **earthquake** is sudden ground shaking caused by tectonic plate movement beneath the Earth's surface.

---

### 🛡️ Core Emergency Action: Drop, Cover, and Hold On!

1. **DROP**: Drop onto your hands and knees to prevent being knocked over.
2. **COVER**: Cover your head and neck under a sturdy desk or table. If no shelter is nearby, cover your head with your arms against an interior wall.
3. **HOLD ON**: Hold on to your shelter until shaking completely stops.

---

### 📍 Location Rules:
• **If Indoors**: Stay inside! Move away from glass windows, mirrors, hanging objects, and tall unanchored furniture. Do NOT use elevators.
• **If Outdoors**: Move to an open area away from buildings, streetlights, trees, and utility wires.
• **If Driving**: Pull over to a safe clear spot, stop, engage the parking brake, and remain in the vehicle until shaking stops.`;
  }

  // Fire queries
  if (q.includes('fire') || q.includes('smoke') || q.includes('burn')) {
    return `### 🔥 Fire Safety & Evacuation Plan

When facing a building or wildfire emergency, rapid action saves lives.

---

### 🚨 Critical Evacuation Rules:
1. **Get Out and Stay Out**: Never go back inside a burning building for pets or belongings.
2. **Crawl Low Under Smoke**: Toxic smoke rises to the ceiling; cleaner air is 12-24 inches above the floor.
3. **Test Doors Before Opening**: Use the back of your hand to feel the door handle. If hot, do NOT open—use your secondary exit.
4. **Stop, Drop, and Roll**: If clothing catches fire, immediately stop, drop to the ground, cover your face, and roll until flames are out.

---

### 🧯 Using a Fire Extinguisher (P.A.S.S. Method):
• **P**ull the safety pin.
• **A**im at the base of the fire.
• **S**queeze the lever slowly.
• **S**weep side to side.`;
  }

  // Cyclone / Hurricane queries
  if (q.includes('cyclone') || q.includes('hurricane') || q.includes('typhoon') || q.includes('storm')) {
    return `### 🌪️ Cyclone & Hurricane Preparedness

Cyclones produce extreme winds, heavy rainfall, and coastal storm surges.

---

### 📋 Before the Storm:
• **Secure Windows & Doors**: Board up windows with storm shutters or marine plywood.
• **Clear Outdoors**: Move outdoor furniture, garbage cans, and loose items inside.
• **Prepare 72-Hour Kit**: Stock non-perishable food, bottled water (1 gallon/person/day), and power banks.

---

### 🏠 During the Storm:
• Stay in a windowless interior room, closet, or hallway on the lowest level.
• **Beware the Eye of the Storm**: If winds suddenly stop, do NOT go outside! The storm eye is temporary, and severe winds will resume from the opposite direction.`;
  }

  // Tsunami queries
  if (q.includes('tsunami') || q.includes('tidal wave')) {
    return `### 🌊 Tsunami Emergency Response

A **tsunami** is a series of giant ocean waves triggered by undersea earthquakes, landslides, or volcanic eruptions.

---

### ⚠️ Natural Warning Signs:
1. Strong earthquake near a coastal area.
2. Rapid recession of ocean water exposing the sea floor.
3. Loud roaring sound coming from the ocean (resembling a train or jet).

---

### 🏃 Immediate Action:
• **Head High & Inland Immediately**: Move at least 100 feet above sea level or 2 miles inland.
• **Do Not Wait for Official Warnings**: If you observe natural warning signs, evacuate instantly on foot.`;
  }

  // Emergency Kit / Preparedness Plan queries
  if (q.includes('kit') || q.includes('bag') || q.includes('prepare') || q.includes('supplies') || q.includes('plan')) {
    return `### 🎒 Essential Disaster Emergency Kit Checklist

Keep a 72-hour emergency go-bag accessible near your exit door:

---

### 🛒 Top 7 Essential Items:
1. **Water**: 1 gallon per person per day for at least 3 days.
2. **Food**: 3-day supply of non-perishable canned/packaged food + manual can opener.
3. **First Aid Kit**: Bandages, antiseptic wipes, sterile gauze, burn cream, & prescription meds.
4. **Flashlight & Radio**: Battery-powered or hand-crank flashlight and NOAA weather radio + extra batteries.
5. **Power Bank & Cables**: Fully charged portable phone charger.
6. **Important Documents**: Copies of ID, insurance policies, medical records in a waterproof bag.
7. **Whistle & Multi-Tool**: High-decibel emergency whistle to signal for help.`;
  }

  // General Fallback for any other question
  return `### 🛡️ Disaster Safety Assistance

Here is guidance regarding **"${question}"**:

For effective disaster safety and emergency response:
• **Stay Informed**: Monitor local weather alerts, emergency broadcasts, and government instructions.
• **Emergency Kit**: Maintain a 72-hour survival kit with water, food, first aid, and power banks.
• **Evacuation Plan**: Establish two family meeting points and know at least two evacuation routes from your area.
• **Emergency Contacts**: Keep national and local emergency numbers saved on your phone and written down.

Would you like detailed safety steps for a specific disaster like a **Flood**, **Earthquake**, **Fire**, **Cyclone**, or **Tsunami**?`;
}

export async function askChatbot(question) {
  try {
    if (process.env.GEMINI_API_KEY && API_KEY !== 'DUMMY_GEMINI_API_KEY') {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const prompt = `
You are a helpful, expert AI Disaster Preparedness and Emergency Assistant (like ChatGPT and Gemini AI).

Answer the user's question with clear formatting, markdown headers, and bullet points where helpful:
- Focus on practical safety, emergency guidance, definitions, and preparedness.
- Respond conversationally and warmly to greetings like "hi" or "hello".
- If asked "what is disaster", explain clearly with categories (Natural vs. Human-made) and safety tips.
- Keep answers informative, accurate, and easy to read.

User Question:
${question}
`;

      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      if (reply && reply.trim().length > 0) {
        return reply;
      }
    }
  } catch (error) {
    console.log('Gemini AI fallback active:', error.message || error);
  }

  return getConversationalAIResponse(question);
}