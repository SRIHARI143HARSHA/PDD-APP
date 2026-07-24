export function getConversationalAIResponse(question) {
  const q = (question || '').trim().toLowerCase();

  if (!q) {
    return 'Hello! I am your AI Disaster Safety & Emergency Assistant. Ask me any question about disaster preparedness, emergency protocols, or survival guidelines!';
  }

  // Greetings & Identity Queries
  if (
    ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do', 'help'].includes(q) ||
    q.startsWith('hi ') ||
    q.startsWith('hello ')
  ) {
    return `### 👋 Hello! I am your AI Emergency & Preparedness Assistant

Powered by comprehensive global disaster management knowledge, I am here to provide instant, life-saving guidance for any natural or human-made emergency.

---

### 🛡️ What I Can Assist You With:

1. **🌊 Flood & Water Safety**:
   • Flash flood warning actions, higher ground protocols, and "Turn Around Don't Drown" rules.

2. **🏠 Earthquake Safety**:
   • Drop, Cover, and Hold On techniques, indoor/outdoor positioning, and aftershock safety.

3. **🔥 Fire & Wildfire Evacuation**:
   • P.A.S.S. fire extinguisher method, smoke crawling rules, and family evacuation planning.

4. **🌪️ Cyclone & Tropical Storm Prep**:
   • Emergency window boarding, 72-hour survival kit creation, and storm eye dangers.

5. **🌊 Tsunami Hazards**:
   • Coastal natural warning signs, 100ft elevation rules, and immediate evacuation actions.

6. **🎒 Emergency Survival Kit Checklists**:
   • Complete 72-hour go-bag essentials (water, rations, first aid, power banks, & documentation).

---

💡 **Pro Tip**: Type any safety question below (e.g., *"What to do during a flood?"* or *"How to prepare an emergency kit?"*).`;
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
    return `### 🛡️ Comprehensive Overview: What is a Disaster?

A **disaster** is a serious disruption to the functioning of a community or society involving widespread human, material, economic, or environmental impacts which exceed the ability of the affected community or society to cope using its own resources.

---

### 🌍 Primary Categories of Disasters:

#### 1. 🌊 Natural Disasters
- **Hydrological**: Floods, flash floods, river breaches, and coastal storm surges.
- **Geological & Seismic**: Earthquakes, landslides, tsunamis, and volcanic eruptions.
- **Meteorological**: Cyclones, typhoons, hurricanes, tornadoes, severe heatwaves, and blizzards.

#### 2. 🔥 Human-Made & Technological Disasters
- Industrial plant explosions, toxic chemical leaks, structural collapses, hazardous material spills, and nuclear incidents.

---

### 📋 Key Phases of Emergency Management:
1. **Mitigation**: Structural reinforcements, flood barriers, and safety zoning.
2. **Preparedness**: Emergency survival kits, evacuation plans, and warning system subscriptions.
3. **Response**: Immediate search and rescue, medical first aid, and shelter deployment.
4. **Recovery**: Rebuilding infrastructure, restoring utilities, and psychological support.

---

### 📞 Essential National Emergency Hotlines (India):
- **National Emergency Number**: 112
- **Disaster Management (NDRF)**: 1078
- **Fire Brigade**: 101
- **Ambulance Service**: 102 / 108`;
  }

  // Definition of flood
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

  // Flood queries
  if (q.includes('flood')) {
    return `### 🌊 Complete Flood Preparedness & Survival Guide

A **flood** is an overflow of water onto dry land, often caused by heavy rainfall, river overflow, or coastal storm surges.

---

### 1. 📋 Pre-Flood Preparation Checklist:
- **Build a 72-Hour Kit**: Pack bottled water (1 gallon/person/day), non-perishable food, flashlight, power bank, and first aid.
- **Protect Essential Documents**: Place insurance policies, IDs, and birth certificates in a sealed waterproof bag.
- **Elevate Electronics & Valuables**: Move appliances, chargers, and furniture above ground level.
- **Know your elevation & routes**: Identify higher ground evacuation shelters in your municipality.

---

### 2. 🚨 During-Flood Survival Rules:
- **Move to higher ground immediately**: Evacuate low-lying areas at the first warning.
- **Turn Off Utilities**: Shut off main circuit breakers and gas valves if safe to do so.
- **Turn Around, Don't Drown**:
  • **6 inches** of moving water can knock down an adult.
  • **12 inches** of water will float small vehicles.
  • **2 feet** of rushing water will carry away SUVs and trucks.
- **Avoid Floodwater Contact**: Floodwater contains sewage, toxic chemicals, sharp metal debris, and active electrical currents from downed power lines.

---

### 3. 🛡️ Post-Flood Safety & Recovery:
- Return home only after local emergency authorities declare the area safe.
- Do NOT consume food or water exposed to floodwater. Use boiled or bottled water exclusively.
- Take photos of property damage before beginning cleanup for insurance claims.`;
  }

  // Earthquake queries
  if (q.includes('earthquake') || q.includes('tremor') || q.includes('seismic')) {
    return `### 🏠 Comprehensive Earthquake Safety & Survival Protocol

An **earthquake** is a sudden, violent shaking of the ground caused by tectonic plate movement along fault lines.

---

### 1. 🛡️ Core Emergency Action: DROP, COVER, AND HOLD ON!

1. **DROP**: Drop down onto your hands and knees to prevent being thrown to the ground.
2. **COVER**: Cover your head and neck under a sturdy desk or heavy table. If no table is nearby, shelter against an interior wall away from windows.
3. **HOLD ON**: Hold on to your shelter with one hand and protect your head/neck until shaking completely stops.

---

### 2. 📍 Location-Specific Action Plan:

- **If Indoors**:
  • Stay INSIDE! Do not run outdoors during shaking (most injuries occur from falling exterior masonry).
  • Stay away from glass windows, mirrors, hanging fixtures, and unanchored bookcases.
  • Do NOT use elevators!

- **If Outdoors**:
  • Move to an open area clear of buildings, power lines, streetlights, trees, and overpasses.
  • Drop to the ground and cover your head.

- **If Driving**:
  • Safely pull over to the side of the road away from bridges, overpasses, and power lines.
  • Keep your seatbelt fastened until shaking stops.

---

### 3. 🚨 Post-Earthquake Recovery Steps:
- Expect **aftershocks**—be ready to Drop, Cover, and Hold On again.
- Check yourself and family for injuries; apply first aid.
- Inspect gas lines for leaks (sniff for gas smell). If smelled, shut off main gas valve and leave immediately.`;
  }

  // Fire queries
  if (q.includes('fire') || q.includes('smoke') || q.includes('burn')) {
    return `### 🔥 Comprehensive Fire Safety & Evacuation Plan

During a fire emergency, smoke inhalation and extreme heat are immediate life threats. Speed and calm execution are critical.

---

### 1. 🚨 Immediate Evacuation Protocol:
1. **Get Out and Stay Out**: Never re-enter a burning building for pets, electronics, or personal belongings.
2. **Crawl Low Under Smoke**: Toxic smoke rises to the ceiling. Breathable air remains 12 to 24 inches above the floor.
3. **Check Doors Before Opening**: Use the back of your hand to feel the door and handle. If HOT, do NOT open—use your secondary exit.
4. **Stop, Drop, and Roll**: If your clothing catches fire, immediately STOP moving, DROP to the ground, cover your face with your hands, and ROLL back and forth until flames are smothered.

---

### 2. 🧯 Using a Fire Extinguisher (The P.A.S.S. Technique):
- **P - Pull**: Pull the safety pin located at the top of the extinguisher.
- **A - Aim**: Aim low at the **base** of the fire, not at the flames.
- **S - Squeeze**: Squeeze the lever slowly and evenly.
- **S - Sweep**: Sweep the nozzle side to side across the base of the fire until extinguished.

---

### 3. 📋 Home Fire Prevention Rules:
- Test smoke alarms monthly and replace batteries annually.
- Keep flammable items at least 3 feet away from heaters and stoves.
- Establish two escape routes from every bedroom in your home.`;
  }

  // Cyclone / Hurricane queries
  if (q.includes('cyclone') || q.includes('hurricane') || q.includes('typhoon') || q.includes('storm')) {
    return `### 🌪️ Cyclone & Tropical Storm Safety Masterclass

**Cyclones** generate damaging destructive winds, torrential rainfall, severe storm surges, and localized tornadoes.

---

### 1. 📋 Pre-Cyclone Preparation Checklist:
- **Board Up Windows**: Install storm shutters or 5/8-inch marine plywood over windows.
- **Secure Loose Outdoor Items**: Bring patio furniture, trash cans, bicycles, and garden tools indoors.
- **Stock Emergency Rations**: Maintain a 72-hour supply of non-perishable food, bottled water, flashlight, and power banks.
- **Fuel Vehicles & Power Banks**: Charge all mobile devices and fill your vehicle's fuel tank.

---

### 2. 🏠 During-Cyclone Survival Rules:
- Stay in an interior windowless room, hallway, or bathroom on the lowest floor.
- Keep away from glass doors and windows.
- **⚠️ Beware the Eye of the Storm**: If winds suddenly drop to dead calm, **DO NOT GO OUTSIDE!** You are inside the storm's eye; violent winds will resume shortly from the opposite direction.

---

### 3. 🚨 Post-Cyclone Precautions:
- Stay clear of fallen power lines and flooded roadways.
- Inspect home structures for damage before entering.
- Use battery-powered flashlights instead of candles to prevent gas explosion hazards.`;
  }

  // Tsunami queries
  if (q.includes('tsunami') || q.includes('tidal wave')) {
    return `### 🌊 Tsunami Emergency Evacuation Protocol

A **tsunami** is a series of powerful ocean waves caused by underwater earthquakes, submarine landslides, or volcanic eruptions.

---

### 1. ⚠️ Natural Warning Signs (Evacuate Instantly):
- **Strong Coastal Earthquake**: Ground shaking lasting 20 seconds or longer near coastal zones.
- **Rapid Ocean Drawback**: Water receding dramatically off the shoreline, exposing coral reefs and sea floor.
- **Roaring Ocean Noise**: A loud, roaring sound originating from the sea, sounding like a freight train or jet engine.

---

### 2. 🏃 Immediate Action Protocol:
- **Move Inland & High Up**: Head at least **100 feet above sea level** or **2 miles inland**.
- **Evacuate on Foot**: Roads may become jammed with traffic; evacuate on foot along designated tsunami routes.
- **Do NOT Wait for Official Alerts**: If you witness natural warning signs, act immediately without delay!

---

### 3. 🌊 Tsunami Waves Fact:
- A tsunami is **NOT** a single wave, but a series of waves separated by minutes to hours. The first wave is rarely the largest! Stay away from coastal zones until official clearance is given.`;
  }

  // Emergency Kit / Preparedness Plan queries
  if (q.includes('kit') || q.includes('bag') || q.includes('prepare') || q.includes('supplies') || q.includes('plan')) {
    return `### 🎒 Complete 72-Hour Disaster Emergency Kit Checklist

Every household should maintain a portable, durable **Go-Bag** stored near an exit doorway for immediate evacuation.

---

### 🛒 Top Essential Items Checklist:

1. **💧 Water**:
   • 1 gallon (3.8 liters) per person per day for a minimum of 3 days (for drinking and sanitation).

2. **🥫 Food**:
   • 3-day supply of non-perishable canned meat, dried fruits, energy bars, and a manual can opener.

3. **🩹 First Aid Kit**:
   • Sterile gauze pads, adhesive bandages, antiseptic wipes, burn ointment, scissors, tweezers, and a 14-day supply of personal prescription medications.

4. **🔦 Lighting & Communication**:
   • Battery-powered or hand-crank LED flashlight, NOAA emergency weather radio, extra batteries, and a high-decibel whistle.

5. **🔋 Power & Tech**:
   • Fully charged 20,000mAh portable power bank with universal USB charging cables.

6. **📄 Critical Documents**:
   • Copies of passport, driver's license, insurance policies, medical records, and cash stored in a sealed waterproof pouch.

7. **🧥 Sanitation & Warmth**:
   • Mylar thermal blankets, wet wipes, hand sanitizer, N95 dust masks, and sturdy work gloves.`;
  }

  // General Fallback for any other question
  return `### 🛡️ Expert Disaster Safety Guidance

Regarding your query on **"${question}"**:

Disaster preparedness requires proactive planning, quick decision-making, and access to verified emergency resources.

---

### 📋 4 Fundamental Rules for Any Emergency:

1. **Stay Informed**:
   • Subscribe to official weather alerts, municipal warning broadcasts, and emergency radio feeds.

2. **Maintain a 72-Hour Go-Bag**:
   • Store water, non-perishable food, first aid, power banks, and essential documents near your home exit.

3. **Establish a Family Emergency Plan**:
   • Designate two meeting points (one outside your home, one outside your neighborhood) and emergency contacts.

4. **Know Your Local Evacuation Routes**:
   • Identify primary and secondary evacuation paths out of your district.

---

❓ Would you like detailed step-by-step protocols for a specific emergency such as a **Flood**, **Earthquake**, **Fire**, **Cyclone**, or **Tsunami**?`;
}

export async function askChatbot(question) {
  // Pure 100% local, self-contained AI Chatbot engine operating without external API keys
  return getConversationalAIResponse(question);
}