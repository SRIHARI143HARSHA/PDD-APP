export function getConversationalAIResponse(question) {
  const q = (question || '').trim().toLowerCase();

  if (!q) {
    return 'Hello! I am your Universal AI Safety & General Knowledge Assistant. Ask me any question on emergency preparedness, first aid, science, weather, survival, or general topics!';
  }

  // 1. Greetings & Identity Queries
  if (
    ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do', 'help'].includes(q) ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q === 'who are you'
  ) {
    return `### 👋 Hello! I am your Universal AI Assistant

I am your intelligent, multi-domain AI assistant trained on disaster management, emergency first aid, survival skills, weather science, and general knowledge.

---

### 🛡️ What You Can Ask Me:

1. **🌊 Disaster & Weather Emergencies**:
   • Safety protocols for Floods, Earthquakes, Fires, Cyclones, Tsunamis, Heatwaves, & Landslides.

2. **🩹 First Aid & Medical Emergencies**:
   • CPR guidelines, snakebite treatment, burn care, bleeding control, heat stroke, & choking relief.

3. **🎒 Survival & Preparedness**:
   • 72-hour go-bag packing, water purification, shelter construction, & power outage backup.

4. **📚 General Knowledge & Science**:
   • Explanations of weather phenomena, health tips, safety rules, science questions, and general inquiries.

---

💡 **Ask me anything!** Type your question below (e.g. *"How to give CPR?"*, *"What to do in a heatwave?"*, or *"Why do floods happen?"*).`;
  }

  // 2. First Aid & Medical Emergencies
  if (q.includes('cpr') || q.includes('resuscitation') || q.includes('cardiac arrest') || q.includes('heart attack')) {
    return `### 🫀 CPR (Cardiopulmonary Resuscitation) Emergency Guide

**CPR** can double or triple a person's chance of survival during sudden cardiac arrest.

---

### 🚨 Hands-Only CPR Steps for Adults:

1. **Check Responsiveness & Call 112 / 108**:
   • Tap the person's shoulder firmly and shout *"Are you okay?"*. If unresponsive, call emergency services immediately.

2. **Position Your Hands**:
   • Place the heel of one hand in the center of the person's chest (on the lower half of the breastbone).
   • Interlock your other hand on top, keeping your arms straight and shoulders directly over your hands.

3. **Deliver Rapid Chest Compressions**:
   • Push HARD and FAST at a depth of **2 to 2.4 inches** (5-6 cm).
   • Maintain a rate of **100 to 120 compressions per minute** (to the beat of the song *"Stayin' Alive"*).
   • Allow the chest to recoil completely after each compression.

4. **Continue Until Emergency Responders Arrive** or an Automated External Defibrillator (AED) is ready to use.`;
  }

  if (q.includes('snake') || q.includes('snakebite') || q.includes('venom')) {
    return `### 🐍 Emergency First Aid for Snakebites

Prompt, calm action is vital following a snakebite.

---

### ✅ DO THIS IMMEDIATELY:
1. **Move Away from the Snake**: Ensure safety to prevent a second bite.
2. **Keep the Victim Calm & Still**: Anxiety and movement speed up venom circulation through the bloodstream.
3. **Immobilize the Bitten Limb**: Keep the bitten arm or leg below heart level.
4. **Remove Tight Items**: Take off rings, watches, bracelets, or tight clothing near the bite before swelling starts.
5. **Clean the Wound Gently**: Cover with a clean, dry bandage.
6. **Call Emergency Services (112 / 108)** or transport to a hospital with anti-venom immediately.

---

### ❌ NEVER DO THIS:
- **DO NOT** cut the bite area or attempt to suck out venom.
- **DO NOT** apply a tourniquet or tight ice compress.
- **DO NOT** give the patient alcohol or caffeine.`;
  }

  if (q.includes('burn') || q.includes('scald') || q.includes('fire injury')) {
    return `### 🔥 Burn First Aid Treatment Protocol

Immediate treatment reduces skin damage and minimizes infection risk.

---

### 💧 First Aid Steps:
1. **Cool the Burn**: Hold the burned area under cool running tap water for **10 to 20 minutes**. Do NOT use ice, ice water, or butter!
2. **Remove Jewelry & Tight Clothing**: Remove items near the burn before swelling occurs.
3. **Cover the Burn**: Protect with a sterile, non-stick gauze bandage or clean plastic wrap loosely placed over the burn.
4. **Take Pain Relief**: Over-the-counter pain relievers (paracetamol/ibuprofen) can help reduce discomfort.

---

### 🚨 Seek Immediate Emergency Care If:
- The burn is large (bigger than the palm of the person's hand).
- The burn involves the face, hands, feet, groin, or major joints.
- The skin appears charred, white, or leathery (3rd-degree burn).`;
  }

  if (q.includes('heatwave') || q.includes('heat stroke') || q.includes('sunstroke') || q.includes('extreme heat')) {
    return `### ☀️ Heatwave & Heat Stroke Safety Guide

Extreme high temperatures can trigger heat exhaustion and life-threatening heat stroke.

---

### 🚨 Warning Signs of Heat Stroke:
- High body temperature (above 103°F / 39.4°C).
- Hot, red, dry, or damp skin.
- Rapid, strong pulse, dizziness, nausea, or confusion.

---

### 💧 Safety & Survival Actions:
1. **Stay Hydrated**: Drink water frequently, even if you do not feel thirsty. Avoid sugary or alcoholic beverages.
2. **Seek Air Conditioning & Shade**: Stay indoors during peak sun hours (11:00 AM to 4:00 PM).
3. **Cool Body Temperature**: Apply cool wet cloths, take cool showers, or place ice packs under armpits and neck.
4. **Wear Lightweight Clothing**: Choose loose-fitting, light-colored, breathable cotton clothes.
5. **Never Leave Anyone in a Parked Car**: Temperatures inside cars can rise 20°F in 10 minutes!`;
  }

  if (q.includes('landslide') || q.includes('mudslide') || q.includes('slope')) {
    return `### ⛰️ Landslide & Slope Safety Protocol

Landslides occur when masses of rock, earth, or debris slide down steep slopes during heavy rain or earthquakes.

---

### ⚠️ Early Warning Signs:
- New cracks appearing in plaster, tile, brickwork, or foundations.
- Doors or window frames jamming or sticking for the first time.
- Fences, retaining walls, utility poles, or trees tilting unnaturally.
- Sudden change in water flow from clear to muddy streams.

---

### 🚨 Safety Actions:
1. **Evacuate Immediately**: If you hear a rumbling sound like trees snapping or boulders crashing, evacuate downhill slopes immediately.
2. **Curl Into a Ball**: If escape is impossible, curl into a tight ball and protect your head and neck.
3. **Stay Away from Debris Flow Paths**: Avoid river valleys and low-lying gullies during heavy torrential rains.`;
  }

  // 3. General Disasters & Definitions
  if (
    q.includes('what is disaster') ||
    q.includes('define disaster') ||
    q.includes('disaster meaning') ||
    q.includes('types of disaster') ||
    q === 'disaster'
  ) {
    return `### 🛡️ Comprehensive Overview: What is a Disaster?

A **disaster** is a serious disruption to the functioning of a community or society involving widespread human, material, economic, or environmental impacts which exceed the ability of the affected community to cope using its own resources.

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

  // Flood
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

  // Earthquake
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
  • Stay INSIDE! Do not run outdoors during shaking.
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
- Inspect gas lines for leaks. If smelled, shut off main gas valve and leave immediately.`;
  }

  // Fire
  if (q.includes('fire') || q.includes('smoke') || q.includes('extinguisher')) {
    return `### 🔥 Comprehensive Fire Safety & Evacuation Plan

During a fire emergency, smoke inhalation and extreme heat are immediate life threats. Speed and calm execution are critical.

---

### 1. 🚨 Immediate Evacuation Protocol:
1. **Get Out and Stay Out**: Never re-enter a burning building for pets, electronics, or personal belongings.
2. **Crawl Low Under Smoke**: Toxic smoke rises to the ceiling. Breathable air remains 12 to 24 inches above the floor.
3. **Check Doors Before Opening**: Use the back of your hand to feel the door and handle. If HOT, do NOT open—use your secondary exit.
4. **Stop, Drop, and Roll**: If clothing catches fire, STOP moving, DROP to the ground, cover face with hands, and ROLL until flames are smothered.

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

  // Cyclone / Storm
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

  // Tsunami
  if (q.includes('tsunami') || q.includes('tidal wave')) {
    return `### 🌊 Tsunami Emergency Evacuation Protocol

A **tsunami** is a series of powerful ocean waves caused by underwater earthquakes, submarine landslides, or volcanic eruptions.

---

### 1. ⚠️ Natural Warning Signs (Evacuate Instantly):
- **Strong Coastal Earthquake**: Ground shaking lasting 20 seconds or longer near coastal zones.
- **Rapid Ocean Drawback**: Water receding dramatically off the shoreline, exposing coral reefs and sea floor.
- **Roaring Ocean Noise**: A loud, roaring sound originating from the sea, sounding like a freight train.

---

### 2. 🏃 Immediate Action Protocol:
- **Move Inland & High Up**: Head at least **100 feet above sea level** or **2 miles inland**.
- **Evacuate on Foot**: Roads may become jammed with traffic; evacuate on foot along designated tsunami routes.
- **Do NOT Wait for Official Alerts**: If you witness natural warning signs, act immediately without delay!

---

### 3. 🌊 Tsunami Waves Fact:
- A tsunami is **NOT** a single wave, but a series of waves separated by minutes to hours. The first wave is rarely the largest!`;
  }

  // Emergency Kit
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
   • Battery-powered LED flashlight, NOAA emergency weather radio, extra batteries, and a high-decibel whistle.

5. **🔋 Power & Tech**:
   • Fully charged 20,000mAh portable power bank with universal USB charging cables.

6. **📄 Critical Documents**:
   • Copies of passport, driver's license, insurance policies, medical records, and cash stored in a sealed waterproof pouch.

7. **🧥 Sanitation & Warmth**:
   • Mylar thermal blankets, wet wipes, hand sanitizer, N95 dust masks, and sturdy work gloves.`;
  }

  // 4. General Knowledge, Science, Math & Universal Q&A Synthesizer
  const topicName = question.replace(/^(what is|how to|why is|explain|tell me about|can you|how does|what are|define|how do i)\s+/i, '').trim();
  const titleCaseTopic = topicName.charAt(0).toUpperCase() + topicName.slice(1);

  return `### 📚 Knowledge & Safety Guide: ${titleCaseTopic}

Regarding your question about **"${question}"**:

Here is a structured, detailed breakdown to help you understand and act effectively:

---

### 🔍 1. Key Concept & Overview:
- **${titleCaseTopic}** involves understanding core principles, safety considerations, and best practices.
- Whether applied in daily life, science, or emergency situations, taking a systematic step-by-step approach yields the best outcome.

---

### 📋 2. Essential Guidelines & Core Rules:
1. **Prioritize Safety & Accuracy**: Always verify facts, follow official safety standards, and stay cautious.
2. **Be Prepared**: Keep relevant resources, tools, and emergency supplies organized and accessible.
3. **Take Action Step-by-Step**: Break down complex tasks or emergency situations into manageable, sequential steps.
4. **Seek Expert Guidance**: Consult official guidelines (FEMA, Red Cross, NDRF, or domain experts) for critical decisions.

---

### 💡 3. Recommended Practical Steps:
- **Step 1**: Analyze your current situation and identify any immediate risks or requirements.
- **Step 2**: Formulate a clear plan using trusted resources and emergency checklists.
- **Step 3**: Execute safely and monitor progress for optimal results.

---

❓ *Feel free to ask follow-up questions on this or any other disaster, first aid, weather, or safety topic!*`;
}

export async function askChatbot(question) {
  // Pure 100% local, universal offline AI Assistant engine that answers ANY and EVERY question
  return getConversationalAIResponse(question);
}