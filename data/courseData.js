export const courseData = {
  "Flood Safety": {
    image: require('../assets/images/flood.jpg'),
    heroImage: require('../assets/images/Disaster.png'),
    title: "Flood Safety",
    category: "FLOOD SAFETY",
    description: "Learn how to prepare for floods, protect property, and evacuate safely.",
    content: "Floods are among the most common and destructive natural disasters worldwide. Preparation and early evacuation save lives.",
    video: 'https://www.youtube.com/watch?v=43M5mZuzHF8',
    totalLessons: 6,
    lessons: [
      {
        id: 1,
        title: "Understanding Flood Warning Signals",
        content: `Floods occur when water overflows onto land that is normally dry, caused by heavy rainfall, river overflow, coastal storm surges, or dam failures.

1. Flood Watch vs. Flood Warning:
• Flood Watch: Environmental conditions favor flooding in your region. Prepare your emergency kit, monitor weather reports, and ensure communication devices are charged.
• Flood Warning: Hazardous flooding is already occurring or imminent. Take defensive action immediately and prepare for rapid evacuation.

2. Flash Flood Alerts:
Flash floods develop rapidly within minutes or hours of heavy rainfall or sudden structural breach. They carry extreme momentum capable of sweeping away trees, structures, and vehicles. Move to high ground immediately without waiting for formal instructions.

3. Warning Sirens & Official Emergency Broadcasts:
Pay attention to automated weather sirens, emergency SMS broadcasts, NOAA weather radios, and local authority alerts.`,
        keyRule: "Never ignore an official flood evacuation warning.",
        proTip: "Keep a battery-powered or hand-crank NOAA emergency weather radio set to your local frequency. Power grids and cellular towers often fail early during major flash flood events.",
        mythVsFact: {
          myth: "Shallow floodwater is safe to walk or drive through if you move slowly.",
          fact: "Just 6 inches of moving water can sweep a person away, and 12 inches can carry away a car.",
        },
        checklist: [
          "Set up automated weather alert notifications on mobile phones",
          "Identify local river gage stations and flood monitoring websites",
          "Confirm nearest elevated shelter locations",
        ],
        remember: [
          "Flood Watch = High probability; prepare emergency supplies",
          "Flood Warning = Active danger; take defensive action immediately",
          "Flash Floods can develop in minutes without prior warning",
          "Monitor official NOAA weather radio or emergency SMS alerts",
        ],
      },
      {
        id: 2,
        title: "Preparing Before a Flood",
        content: `Comprehensive pre-disaster planning dramatically increases family survival rates and minimizes financial loss.

1. Household Risk Assessment:
Determine if your residence sits within a 100-year floodplain or low-lying coastal basin. Identify historical local crest levels for neighboring rivers and streams.

2. Family Evacuation & Meeting Strategy:
Establish primary and secondary evacuation routes leading to designated high-ground shelters. Designate an out-of-town emergency contact person whom all family members can notify if separated.

3. Property & Document Protection:
• Elevate critical electrical appliances, heating units, and circuit breakers above baseline flood heights.
• Install check valves in sewer traps to prevent floodwater backflow.
• Seal important documents inside double-zippered waterproof bags stored in portable safes.`,
        keyRule: "Secure documents in waterproof containers and charge devices before storm systems arrive.",
        proTip: "Store digital copies of essential legal IDs, deeds, and insurance policies on an encrypted flash drive stored in your watertight emergency pouch.",
        mythVsFact: {
          myth: "Standard homeowners insurance covers flood damage automatically.",
          fact: "Flood insurance must be purchased separately through NFIP or specialized insurers and usually requires a 30-day waiting period.",
        },
        checklist: [
          "Photograph all rooms and valuable possessions for insurance records",
          "Test sump pumps and install battery backup systems",
          "Charge heavy-duty external power banks",
        ],
        remember: [
          "Identify local elevated emergency evacuation shelters",
          "Store legal IDs and insurance deeds in waterproof pouches",
          "Elevate electrical appliances above flood baseline level",
          "Maintain charged heavy-duty power banks and phones",
        ],
      },
      {
        id: 3,
        title: "Building an Emergency Flood Kit",
        content: `A well-stocked 72-hour emergency go-bag guarantees self-sufficiency when clean water, electrical grids, and commercial stores are rendered inaccessible.

Essential Survival Kit Items:
• Clean Drinking Water: Minimum 1 gallon per person per day for 3 to 7 days.
• Non-Perishable Food: High-calorie canned meats, fruits, energy bars, and a manual can opener.
• Medical & Sanitation Supplies: First aid kit, 14-day prescription supply, disinfectant wipes, and hygiene items.
• Power & Light: Waterproof LED flashlights, extra batteries, solar/hand-crank emergency radio.
• Emergency Tools: Multi-tool knife, duct tape, safety whistle, emergency cash in small denominations.`,
        keyRule: "Store your flood kit in an easily accessible, elevated location near your primary exit.",
        proTip: "Include water purification tablets or a portable 0.1-micron water filter in your kit in case your bottled water supply runs low during extended isolations.",
        mythVsFact: {
          myth: "You can drink tap water during a flood as long as it looks clear.",
          fact: "Floodwaters frequently contaminate municipal water lines underground with bacteria and chemicals without changing water clarity.",
        },
        checklist: [
          "Pack 1 gallon of water per person per day for 3-7 days",
          "Include a non-electric manual can opener",
          "Add 14-day supply of personal prescription medications",
        ],
        remember: [
          "Water ration: 1 gallon per person per day for 3 to 7 days",
          "Include non-perishable food, manual opener, and first aid kit",
          "Keep flashlights, battery radios, and dry footwear ready",
          "Keep cash in small bills stored in waterproof bags",
        ],
      },
      {
        id: 4,
        title: "Safe Evacuation During Flooding",
        content: `When evacuation directives are issued, immediately execute your plan using pre-identified high-ground routes.

1. Walking & Wading Hazards:
• Never walk through moving floodwater. Water just 6 inches deep flowing at moderate speed can knock a fully grown adult off their feet.
• Hidden sinkholes, open manhole covers, submerged sharp metal, and downed electrical lines pose severe hazards.

2. Vehicle Navigation Dangers:
• Never attempt to drive through flooded roads or underpasses.
• Just 12 inches of rushing floodwater can stall a car and carry away small vehicles. 24 inches can sweep away trucks and SUVs.`,
        keyRule: "Turn Around, Don't Drown.",
        proTip: "If driving and your car stalls in rising water, abandon it immediately and climb to higher ground if you can do so safely. Vehicles can quickly become submerged traps.",
        mythVsFact: {
          myth: "Heavy SUVs and 4x4 trucks can drive safely through deep floodwaters.",
          fact: "Water creates buoyant force underneath large vehicles. Just 2 feet of moving water can float an 8,000 lb truck.",
        },
        checklist: [
          "Turn off main electrical breaker before evacuating if safe",
          "Lock all doors and windows before leaving",
          "Follow designated emergency evacuation signs exclusively",
        ],
        remember: [
          "6 inches of rushing water can knock an adult off their feet",
          "12 inches of flowing water can float and sweep away small cars",
          "Never walk or drive through submerged roadways or bridges",
          "Keep children away from storm drains and swollen culverts",
        ],
      },
      {
        id: 5,
        title: "Safety After a Flood",
        content: `Post-flood environments present persistent, invisible hazards even after surface waters recede.

1. Safe Return Protocol:
Re-enter flooded neighborhoods ONLY after local emergency management officials issue an official all-clear directive.

2. Water Contamination Hazards:
Treat all floodwater as hazardous waste contaminated with raw sewage, chemical runoff, and decaying matter.

3. Electrical & Structural Safety:
Stay clear of fallen utility wires and flooded electrical meters. Wear thick rubber boots, heavy leather gloves, and N95 respirators during cleanup.`,
        keyRule: "Assume all standing floodwater is toxic, bio-hazardous, and electrically live.",
        proTip: "Take photos of water high-water marks on exterior and interior walls before beginning water extraction—insurance adjusters use these marks to verify flood depth.",
        mythVsFact: {
          myth: "Power lines in floodwater are turned off automatically by electric companies.",
          fact: "Downed lines can remain energized and electrify standing water dozens of feet around them without visible sparking.",
        },
        checklist: [
          "Wear thick leather gloves and rubber boots during cleanup",
          "Boil municipal tap water for at least 1 minute before drinking",
          "Report sagging power lines to emergency services",
        ],
        remember: [
          "Return only after official municipal clearance",
          "Avoid contact with raw sewage and chemical floodwater",
          "Boil drinking water until local testing certifies safety",
          "Inspect electrical panels and gas lines before re-entry",
        ],
      },
      {
        id: 6,
        title: "Flood Recovery and Community Safety",
        content: `Orderly community recovery depends on systematic hazard mitigation, utility verification, and assistance for vulnerable residents.

1. Utility Restoration Protocol:
Have licensed electricians and certified gas technicians thoroughly inspect breaker panels, wiring, gas lines, and appliances before restoring main utility service.

2. Mold & Debris Remediation:
Remove and dispose of flood-damaged drywall, insulation, carpets, and porous furnishings within 24 to 48 hours to prevent toxic black mold proliferation.`,
        keyRule: "Verify electrical and gas safety with certified professionals before power restoration.",
        proTip: "Use commercial dehumidifiers and heavy-duty air movers while wearing N95 masks during structural drying to prevent airborne mold spore inhalation.",
        mythVsFact: {
          myth: "Bleach completely kills mold on wet drywall and porous wood.",
          fact: "Bleach only kills surface mold on non-porous materials. Porous items like drywall must be cut out and replaced.",
        },
        checklist: [
          "Cut out wet drywall 12 inches above the high-water line",
          "Disinfect all hard non-porous surfaces with dilute bleach",
          "Submit detailed damage photographic evidence to insurance claims",
        ],
        remember: [
          "Check on vulnerable neighbors and elderly residents safely",
          "Photograph and document all property damage for insurance",
          "Remediate wet drywall within 48 hours to prevent toxic mold",
          "Update household flood emergency plans based on lessons learned",
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'What is the key difference between a Flood Watch and a Flood Warning?',
        options: ['Watch means prepare; Warning means flooding is occurring or imminent', 'They mean the exact same thing', 'Watch is worse than Warning', 'Warning means sunny weather'],
        answer: 'Watch means prepare; Warning means flooding is occurring or imminent',
      },
      {
        question: 'What is the slogan for safe driving during flood conditions?',
        options: ['Turn Around, Don\'t Drown', 'Speed Up to Cross', 'Drive in the Middle', 'Wait in the Car'],
        answer: 'Turn Around, Don\'t Drown',
      },
      {
        question: 'How much rushing floodwater can knock an adult off their feet?',
        options: ['6 inches', '2 feet', '4 feet', '10 inches'],
        answer: '6 inches',
      },
      {
        question: 'How much moving floodwater can carry away a small vehicle?',
        options: ['12 inches', '3 inches', '5 feet', '8 feet'],
        answer: '12 inches',
      },
      {
        question: 'Why is post-flood water dangerous?',
        options: ['It is contaminated with sewage, chemicals, and debris', 'It is too cold', 'It is clear', 'It smells like rain'],
        answer: 'It is contaminated with sewage, chemicals, and debris',
      },
      {
        question: 'What should you do before turning electrical power back on after a flood?',
        options: ['Have certified technicians inspect the system', 'Turn it on immediately', 'Touch the wires', 'Pour water on outlets'],
        answer: 'Have certified technicians inspect the system',
      },
      {
        question: 'What should you store in waterproof containers prior to a flood?',
        options: ['Important identification and insurance documents', 'Spare shoes only', 'Paper books', 'Toys'],
        answer: 'Important identification and insurance documents',
      },
      {
        question: 'When should you return to a flooded home after evacuation?',
        options: ['Only when local authorities declare it safe', 'As soon as rain stops', 'At night', 'Immediately'],
        answer: 'Only when local authorities declare it safe',
      },
      {
        question: 'How much drinking water should be stored per person in an emergency kit?',
        options: ['1 gallon per person per day', '1 cup per person per day', '1 bottle total', 'None needed'],
        answer: '1 gallon per person per day',
      },
      {
        question: 'What should you do if flash flood warnings are issued for your area?',
        options: ['Move to high ground immediately', 'Go to the basement', 'Drive to the river', 'Wait in your yard'],
        answer: 'Move to high ground immediately',
      },
    ],
  },

  "Earthquake Safety": {
    image: require('../assets/images/earthquake.jpg'),
    heroImage: require('../assets/images/Disaster.png'),
    title: "Earthquake Safety",
    category: "EARTHQUAKE SAFETY",
    description: "Practice drop, cover, and hold on responses when the ground shakes.",
    content: "Earthquakes occur without warning. Practice Drop, Cover, and Hold On to minimize injury risk.",
    video: 'https://www.youtube.com/watch?v=BLEPakj1YTY',
    totalLessons: 6,
    lessons: [
      {
        id: 1,
        title: "Understanding Earthquakes",
        content: `Earthquakes are sudden release of stored energy in the Earth's crust caused by tectonic plate movement along fault lines.

1. Unpredictable Nature:
Seismic events occur abruptly without advance atmospheric or electronic warning signs. Ground motion can range from minor tremors to violent accelerations capable of destroying heavy structures.

2. Primary & Secondary Hazards:
• Primary Hazard: Severe ground shaking leading to structural collapse, wall failure, and bridge shear.
• Secondary Hazards: Soil liquefaction, landslides, tsunami generation, gas line fires, and aftershock sequences.`,
        keyRule: "Recognize seismic hazards and prepare indoor spaces in advance.",
        proTip: "Conduct earthquake drills with family members twice a year so that Drop, Cover, and Hold On becomes an immediate muscle memory reaction.",
        mythVsFact: {
          myth: "Earthquakes only happen along major coastal fault lines.",
          fact: "Intraplate earthquakes can occur far from plate boundaries in central and eastern regions unexpectedly.",
        },
        checklist: [
          "Identify safe shelter zones under sturdy tables in every room",
          "Keep emergency flashlights next to all household beds",
          "Learn how to shut off main household gas and water valves",
        ],
        remember: [
          "Earthquakes strike suddenly without advance warning",
          "Secondary hazards include fires, landslides, and aftershocks",
          "Structural securing dramatically reduces non-structural injuries",
        ],
      },
      {
        id: 2,
        title: "Preparing Your Home",
        content: `Securing heavy interior objects prevents up to 90% of non-structural earthquake injuries during sudden ground displacement.

1. Anchoring Furniture & Appliances:
• Fasten tall bookcases, dressers, China cabinets, and water heaters directly to wall studs using heavy-duty metal L-brackets or nylon straps.
• Store heavy books, metal cookware, and glass items on lower shelves.

2. Securing Fixtures & Utilities:
• Hang heavy mirrors, framed art, and clocks away from beds, sofas, and desks.
• Install flexible stainless steel connectors on all gas appliances to prevent fuel line rupture during shaking.`,
        keyRule: "Anchor top-heavy furniture and appliances directly to structural wall studs.",
        proTip: "Apply transparent safety film to large glass windows and patio doors to prevent glass from shattering inward during severe ground vibration.",
        mythVsFact: {
          myth: "Heavy water heaters stay upright on their own during earthquakes.",
          fact: "Unanchored water heaters frequently topple over, breaking gas lines and sparking residential fires while wasting clean emergency water.",
        },
        checklist: [
          "Anchor bookcases and cabinets to studs using L-brackets",
          "Install automatic gas shut-off valves or flexible gas hoses",
          "Place child safety latches on upper kitchen cabinets",
        ],
        remember: [
          "Anchor heavy bookcases, cabinets, and water heaters to studs",
          "Keep heavy objects on bottom shelves away from sleeping areas",
          "Install flexible gas connectors to prevent post-quake fires",
        ],
      },
      {
        id: 3,
        title: "Drop, Cover and Hold On",
        content: `The globally standardized lifesaving protocol during seismic shaking is Drop, Cover, and Hold On.

Step-by-Step Action:
1. DROP onto your hands and knees immediately. Position yourself so you cannot be thrown down by violent ground motions.
2. COVER your head, neck, and torso under a sturdy table, desk, or workbench. If no sturdy shelter is within reach, crawl next to an interior wall and cover your head with your arms.
3. HOLD ON to your shelter leg with one hand until all shaking stops. Be ready to move with your shelter.`,
        keyRule: "DROP to knees, COVER head/neck under shelter, and HOLD ON until shaking stops.",
        proTip: "If you use a wheelchair, lock the wheels immediately upon feeling shaking, bend forward, and cover your head and neck with your arms and a pillow.",
        mythVsFact: {
          myth: "Standing under a doorway is the safest place during an earthquake.",
          fact: "Modern doorways are no stronger than surrounding walls and do not protect against flying or falling objects. Take cover under a table.",
        },
        checklist: [
          "Drop to hands and knees immediately when shaking starts",
          "Cover head and neck beneath sturdy desk or table",
          "Hold on to table leg until ground shaking ceases",
        ],
        remember: [
          "DROP, COVER, HOLD ON is the proven gold standard",
          "Do NOT run outside while ground shaking is active",
          "Do NOT stand in doorways; seek sturdy table shelter",
        ],
      },
      {
        id: 4,
        title: "Earthquake Safety Indoors and Outdoors",
        content: `Your immediate protective actions depend on your environment when ground acceleration starts.

1. Indoor Safety Protocol:
• Stay inside. Position yourself away from windows, architectural glass, hanging fixtures, and tall cabinets.

2. Outdoor Safety Protocol:
• Move quickly into an open field away from high-rise buildings, utility wires, streetlights, and overpasses.

3. Vehicle Safety Protocol:
• Safely pull your vehicle to the shoulder away from overpasses, bridges, power lines, and signs. Set emergency brake.`,
        keyRule: "If outdoors, move immediately to an open area away from structures and utility poles.",
        proTip: "If driving inside a parking garage, pull over between vehicle rows or next to structural pillars rather than under upper floor beam spans.",
        mythVsFact: {
          myth: "Running outside during an earthquake gets you to open safety faster.",
          fact: "Most injuries occur when people try to run outside and get struck by falling glass, bricks, and roof tiles.",
        },
        checklist: [
          "Indoors: Stay away from glass, mirrors, and exterior walls",
          "Outdoors: Move to open space away from power lines and brick walls",
          "In Car: Pull over safely away from overpasses and remain belted inside",
        ],
        remember: [
          "Indoors: Stay inside under sturdy furniture away from glass",
          "Outdoors: Move to open ground away from power lines and buildings",
          "In Vehicle: Stop safely away from overpasses and remain inside",
        ],
      },
      {
        id: 5,
        title: "Aftershocks and Immediate Response",
        content: `Aftershocks are secondary seismic tremors that occur following the main shock, capable of collapsing previously weakened structures.

1. Immediate Post-Quake Response:
• Expect aftershocks. Be prepared to Drop, Cover, and Hold On again.
• Check yourself and family members for lacerations and crushing injuries. Apply first aid immediately.

2. Gas & Electrical Inspection:
• If you smell gas or hear a hissing pipe, turn off the main gas valve if safe, open windows, and evacuate immediately.
• Never strike matches or switch electrical appliances if gas leaks are suspected. Use stairs exclusively—never enter elevators.`,
        keyRule: "Anticipate aftershocks and check for gas leaks immediately after shaking stops.",
        proTip: "Store a gas shutoff wrench tied directly to your main outdoor gas meter so you don't lose time searching for tools during post-quake emergencies.",
        mythVsFact: {
          myth: "You should turn off your main gas valve immediately after every earthquake.",
          fact: "Only turn off main gas if you smell gas odor, hear hissing, or suspect damage. Turning gas back on requires a licensed gas utility technician.",
        },
        checklist: [
          "Check family members for injuries and administer first aid",
          "Inspect gas lines; turn off main valve ONLY if gas is smelled",
          "Use stairwells exclusively; stay completely out of elevators",
        ],
        remember: [
          "Aftershocks can trigger collapse in damaged buildings",
          "Never light open flames if gas odor is present",
          "Use staircases exclusively; never use elevators after quakes",
        ],
      },
      {
        id: 6,
        title: "Post-Earthquake Recovery",
        content: `Systematic post-seismic evaluation prevents secondary injuries and secures long-term safety.

1. Structural Stability Inspection:
Thoroughly examine home foundations, load-bearing walls, chimneys, and roof structures for deep diagonal shear cracks before stepping inside.

2. Environmental Clean-Up:
• Clean up spilled medicines, bleach, fuel, and flammable liquids with proper ventilation.
• Monitor official emergency radio broadcasts for clean water distribution and relief locations.`,
        keyRule: "Inspect foundation integrity and structural shear before re-entering buildings.",
        proTip: "Do not use your telephone except to report life-threatening medical or fire emergencies—keep circuits open for official emergency dispatchers.",
        mythVsFact: {
          myth: "If a chimney looks intact outside, it is safe to light a fireplace fire.",
          fact: "Earthquakes frequently crack internal chimney flue tiles invisibly, creating severe carbon monoxide and house fire hazards when lit.",
        },
        checklist: [
          "Check foundation and chimney walls for deep structural cracks",
          "Clean hazardous liquid spills while wearing protective gear",
          "Document damage with high-resolution photos for insurance claims",
        ],
        remember: [
          "Verify structural foundation stability before re-entering",
          "Safely clean hazardous chemical and fuel spills",
          "Photograph all damage for official insurance records",
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'What is the official procedure to protect yourself during earthquake shaking?',
        options: ['Drop, Cover, and Hold On', 'Run outside immediately', 'Stand in a doorway', 'Use an elevator'],
        answer: 'Drop, Cover, and Hold On',
      },
      {
        question: 'Why should you NOT run outside while shaking is occurring?',
        options: ['Falling exterior bricks and glass cause major injuries', 'It is too cold outside', 'It slows down traffic', 'It is dangerous to touch trees'],
        answer: 'Falling exterior bricks and glass cause major injuries',
      },
      {
        question: 'Where should you take cover if indoors during a quake?',
        options: ['Under a sturdy table or desk', 'Next to a glass window', 'By a tall unsecured bookshelf', 'Inside an elevator'],
        answer: 'Under a sturdy table or desk',
      },
      {
        question: 'What should you do if you are outdoors when an earthquake starts?',
        options: ['Move to an open area away from buildings and power lines', 'Stand under a bridge', 'Lean against a glass building', 'Climb a tree'],
        answer: 'Move to an open area away from buildings and power lines',
      },
      {
        question: 'What are secondary tremors after an earthquake called?',
        options: ['Aftershocks', 'Tsunamis', 'Hurricanes', 'Sub-faults'],
        answer: 'Aftershocks',
      },
      {
        question: 'What should you do if you smell gas after an earthquake?',
        options: ['Turn off main valve if safe, open windows, and exit immediately', 'Light a match to find the leak', 'Turn on all light switches', 'Stay in the kitchen'],
        answer: 'Turn off main valve if safe, open windows, and exit immediately',
      },
      {
        question: 'Why should heavy bookcases and furniture be anchored to wall studs?',
        options: ['To prevent them from tipping over and causing injuries during shaking', 'To save floor space', 'To make them look nicer', 'To block doorways'],
        answer: 'To prevent them from tipping over and causing injuries during shaking',
      },
      {
        question: 'What should you do if you are driving when an earthquake hits?',
        options: ['Pull over safely away from overpasses and stay in car', 'Speed up over the bridge', 'Stop under a power line', 'Get out and run on highway'],
        answer: 'Pull over safely away from overpasses and stay in car',
      },
      {
        question: 'Why should elevators NOT be used after an earthquake?',
        options: ['Elevator shafts and power lines may be damaged', 'They are too fast', 'They are expensive', 'They waste battery'],
        answer: 'Elevator shafts and power lines may be damaged',
      },
      {
        question: 'What should you check before re-entering a building after a major earthquake?',
        options: ['Inspect for structural foundation cracks and gas hazards', 'Check if the TV works', 'See if doors are painted', 'Check weather outside'],
        answer: 'Inspect for structural foundation cracks and gas hazards',
      },
    ],
  },

  "Fire Safety": {
    image: require('../assets/images/fire.jpg'),
    heroImage: require('../assets/images/Disaster.png'),
    title: "Fire Safety",
    category: "FIRE SAFETY",
    description: "Master fire prevention, extinguisher operation, and building escape routes.",
    content: "Fire emergencies spread rapidly. Install smoke detectors and learn safe evacuation procedures.",
    video: 'https://www.youtube.com/watch?v=7Jm6fY5g0nI',
    totalLessons: 6,
    lessons: [
      {
        id: 1,
        title: "Understanding Fire Hazards",
        content: `Fire emergencies can engulf residential rooms in under two minutes, generating lethal smoke temperatures exceeding 1,000°F (537°C).

1. Primary Home Fire Hazards:
• Unattended Stove Cooking: Leading cause of home fires. Grease overheats and ignites rapidly.
• Electrical Misuse: Overloaded power strips, pinched cords under rugs, and faulty circuit breakers.
• Heating Equipment: Space heaters placed within 3 feet of bedding, curtains, or paper.
• Open Flames: Unattended candles, matches, and improper disposal of smoking materials.`,
        keyRule: "Never leave cooking food or open flames unattended.",
        proTip: "Keep a lid or baking sheet next to your stove when cooking. If a grease fire starts, slide the lid over the pan to smother flames and turn off heat immediately.",
        mythVsFact: {
          myth: "Pouring water on a kitchen grease fire puts it out quickly.",
          fact: "Water causes boiling grease to instantly explode into a massive fireball. Never use water on oil or electrical fires.",
        },
        checklist: [
          "Never leave stoves or ovens unattended while cooking",
          "Inspect extension cords for frayed insulation or hot plugs",
          "Keep flammable liquids in certified metal safety cans",
        ],
        remember: [
          "Unattended cooking is the leading cause of residential fires",
          "Fires can double in size every 30 seconds",
          "Never run extension cords beneath carpets or doors",
        ],
      },
      {
        id: 2,
        title: "Fire Prevention at Home",
        content: `Active preventive maintenance significantly mitigates fire risks in residential properties.

1. Cooking & Electrical Safety Guidelines:
• Keep cooking areas free of pot holders, dish towels, and food packaging.
• Clean stove hood exhaust vents regularly to eliminate flammable grease build-up.
• Replace cords showing cracked insulation or loose plug prongs.

2. Heating Safety Standards:
• Keep all portable space heaters at least 3 feet away from bedding, drapes, and wooden furniture.
• Turn off space heaters when leaving rooms or sleeping.`,
        keyRule: "Maintain at least 3 feet of clearance around all heating units.",
        proTip: "Plug high-draw heating appliances directly into wall outlets rather than light-duty extension cords or multi-plug adapters.",
        mythVsFact: {
          myth: "Most fire fatalities are caused by direct flame burns.",
          fact: "Super-heated toxic smoke and carbon monoxide inhalation cause over 75% of fire fatalities before flames reach victims.",
        },
        checklist: [
          "Keep 3 feet clearance around space heaters",
          "Clean grease build-up off stoves and hoods",
          "Replace cracked or frayed electrical cords immediately",
        ],
        remember: [
          "Keep 3 feet clearance around space heaters",
          "Clean grease build-up off stoves and hoods",
          "Replace cracked or frayed electrical cords immediately",
        ],
      },
      {
        id: 3,
        title: "Smoke Alarms and Early Warning",
        content: `Functional smoke detectors cut the risk of dying in a home fire by 50%.

1. Installation Guidelines:
• Install smoke alarms inside every bedroom, outside sleeping areas, and on every level of the home.
• Interconnect all smoke alarms so when one sounds, they all sound.

2. Inspection & Maintenance:
• Test smoke alarms monthly by pressing the test button.
• Replace batteries annually or when the low-battery warning chirps.
• Replace smoke detector units completely every 10 years.`,
        keyRule: "Test smoke detectors monthly and replace units every 10 years.",
        proTip: "Vacuum dust gently off smoke alarm sensor covers every 6 months to prevent false alarms and ensure maximum smoke sensitivity.",
        mythVsFact: {
          myth: "Smoke alarms wake you up automatically if smoke enters your bedroom.",
          fact: "Deep sleep reduces your sense of smell. Interconnected loud audible alarms are necessary to awaken sleeping residents.",
        },
        checklist: [
          "Press smoke alarm test buttons once every month",
          "Replace smoke detector batteries annually",
          "Replace smoke alarm units completely every 10 years",
        ],
        remember: [
          "Test smoke alarms monthly",
          "Install interconnected alarms on every home level",
          "Replace detector units every 10 years",
        ],
      },
      {
        id: 4,
        title: "Safe Fire Evacuation",
        content: `When a fire occurs, immediate, disciplined evacuation is your single highest survival priority.

1. Door Temperature Check:
Feel closed door handles and frames with the back of your hand before opening. If hot, DO NOT open the door—use an secondary escape window or exit.

2. Smoke Inhalation Protocol:
Crawl low beneath toxic smoke. Smoke rises quickly, leaving cleaner air 12 to 24 inches above the floor.

3. Assembly & Stay Out Rule:
Establish a fixed family meeting spot outside (e.g., neighbor's mailbox). Once outside, STAY OUT. Never re-enter a burning building.`,
        keyRule: "Crawl low under smoke and never re-enter a burning building.",
        proTip: "Practice your family escape plan in total darkness with eyes closed to simulate thick black smoke conditions.",
        mythVsFact: {
          myth: "You have plenty of time (10+ minutes) to gather valuables before leaving a burning house.",
          fact: "Flashover can occur in under 3 minutes. You must evacuate within seconds of hearing a fire alarm.",
        },
        checklist: [
          "Check doors for heat using back of hand before opening",
          "Crawl low under smoke to breathe cleaner air",
          "Once outside, STAY OUT; call emergency services from outside",
        ],
        remember: [
          "Check doors for heat using back of hand before opening",
          "Crawl low under smoke to breathe cleaner air",
          "Once outside, STAY OUT; call emergency services from outside",
        ],
      },
      {
        id: 5,
        title: "Using Fire Extinguishers Safely",
        content: `Operate portable fire extinguishers ONLY for small, contained fires when you have a clear, unblocked escape route.

The PASS Method:
• P - PULL the safety pin to break the tamper seal.
• A - AIM low at the base of the fire, not at the flames.
• S - SQUEEZE the lever handle to release extinguishing agent.
• S - SWEEP side to side across the base of the fuel source.

CRITICAL SAFETY PRIORITY:
If the fire is spreading, generating heavy smoke, or threatening your exit, EVACUATE immediately and call emergency services.`,
        keyRule: "PASS: Pull, Aim, Squeeze, Sweep. Safe evacuation ALWAYS takes priority.",
        proTip: "Keep an ABC multi-purpose fire extinguisher in your kitchen and another near your workshop or garage.",
        mythVsFact: {
          myth: "An extinguisher will spray continuously for several minutes.",
          fact: "Most standard residential extinguishers discharge completely in just 10 to 15 seconds.",
        },
        checklist: [
          "P - Pull pin to break tamper seal",
          "A - Aim nozzle low at base of fire",
          "S - Squeeze handle lever smoothly",
          "S - Sweep side to side across base of flames",
        ],
        remember: [
          "P - Pull pin",
          "A - Aim at base of fire",
          "S - Squeeze lever handle",
          "S - Sweep side to side across fuel base",
        ],
      },
      {
        id: 6,
        title: "After a Fire",
        content: `Post-fire protocols protect against structural collapse and chemical toxicity.

1. Re-Entry Regulations:
Do not enter a fire-damaged structure until cleared by the local fire department chief.

2. Structural & Utility Inspections:
• Watch for compromised roof joists, floor sagging, and toxic residue.
• Have certified electricians inspect wiring before main breaker activation.
• Discard all food, drinks, and medicines exposed to heat or smoke.`,
        keyRule: "Wait for official fire department clearance before re-entering buildings.",
        proTip: "Contact your insurance company immediately to secure emergency lodging and living expense funds.",
        mythVsFact: {
          myth: "Canned food exposed to high fire heat is safe if the cans are intact.",
          fact: "Extreme heat can activate spoilage bacteria and degrade tin can linings. Discard all fire-exposed food.",
        },
        checklist: [
          "Re-enter structure only after fire department clearance",
          "Discard all smoke or heat-exposed food and medications",
          "Have electrical systems certified before power restoration",
        ],
        remember: [
          "Re-enter only after official fire department clearance",
          "Discard all smoke-exposed food, water, and medicine",
          "Have electrical systems certified before power restoration",
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'What does the PASS acronym stand for when operating a fire extinguisher?',
        options: ['Pull, Aim, Squeeze, Sweep', 'Push, Align, Spray, Stop', 'Press, Aim, Shake, Sweep', 'Pull, Arm, Squeeze, Stop'],
        answer: 'Pull, Aim, Squeeze, Sweep',
      },
      {
        question: 'Where should you aim a fire extinguisher nozzle when fighting a small fire?',
        options: ['At the base of the fire', 'At the top of the smoke', 'In the air', 'At the ceiling'],
        answer: 'At the base of the fire',
      },
      {
        question: 'What should you do if a fire is spreading rapidly or filling the room with heavy smoke?',
        options: ['Evacuate immediately and call emergency services', 'Keep using extinguisher', 'Open all windows', 'Hide in the bathroom'],
        answer: 'Evacuate immediately and call emergency services',
      },
      {
        question: 'Why should you crawl low under smoke during a building fire evacuation?',
        options: ['Toxic smoke and heat rise, leaving cleaner air near the floor', 'It is faster to crawl', 'To avoid tripping', 'To stay quiet'],
        answer: 'Toxic smoke and heat rise, leaving cleaner air near the floor',
      },
      {
        question: 'How often should smoke alarm batteries be tested?',
        options: ['Once a month', 'Every 5 years', 'Only when beep sounds', 'Never'],
        answer: 'Once a month',
      },
      {
        question: 'What should you do before opening a closed door during a building fire?',
        options: ['Touch the door handle with back of hand to check for heat', 'Kick it open', 'Look through keyhole', 'Open it quickly'],
        answer: 'Touch the door handle with back of hand to check for heat',
      },
      {
        question: 'How far should space heaters be kept from blankets, curtains, and furniture?',
        options: ['At least 3 feet', '6 inches', '1 foot', 'Distance doesn\'t matter'],
        answer: 'At least 3 feet',
      },
      {
        question: 'What is the rule about returning inside a burning structure?',
        options: ['Once outside, STAY OUT. Never re-enter', 'Go back for toys', 'Go back for clothes', 'Re-enter to check rooms'],
        answer: 'Once outside, STAY OUT. Never re-enter',
      },
      {
        question: 'What should you do if your clothes catch fire?',
        options: ['Stop, Drop, and Roll', 'Run outside', 'Wave arms', 'Fan the flames'],
        answer: 'Stop, Drop, and Roll',
      },
      {
        question: 'When should smoke detector units be completely replaced?',
        options: ['Every 10 years', 'Every 20 years', 'Every month', 'Only when broken'],
        answer: 'Every 10 years',
      },
    ],
  },

  "Cyclone Preparedness": {
    image: require('../assets/images/cyclone.jpg'),
    heroImage: require('../assets/images/Disaster.png'),
    title: "Cyclone Preparedness",
    category: "CYCLONE PREPAREDNESS",
    description: "Secure property and assemble supplies before severe wind storms.",
    content: "Cyclones generate severe wind and storm surge. Secure property and store 72-hour emergency kits.",
    video: 'https://www.youtube.com/watch?v=t2f6m3M4k7Y',
    totalLessons: 6,
    lessons: [
      {
        id: 1,
        title: "Understanding Cyclones",
        content: `Cyclones (hurricanes/typhoons) are massive rotating storm systems generating sustained winds over 74 mph (119 km/h) with extreme rainfall and storm surges.

1. Anatomy of a Cyclone:
• The Eye: A deceptively calm, low-pressure center. When the eye passes directly over you, winds drop to near zero, but extreme winds will resume abruptly from the opposite direction.
• The Eyewall: Surrounds the eye and contains the most violent winds and heaviest rainfall.`,
        keyRule: "Beware of the calm eye of the storm—winds will return suddenly.",
        proTip: "Never venture outside when winds die down during a cyclone—you are likely inside the eye and violent winds will resume from the opposite direction within minutes.",
        mythVsFact: {
          myth: "Opening windows on the side of your home opposite the storm relieves internal air pressure.",
          fact: "Opening windows allows high winds to enter and lift roofs off structures. Keep all windows completely closed and shuttered.",
        },
        checklist: [
          "Identify your local storm surge vulnerability zone",
          "Inspect storm shutters and emergency window plywood sheets",
          "Stock up on 72-hour non-perishable supplies",
        ],
        remember: [
          "Cyclones generate extreme winds and coastal storm surges",
          "The eye is deceptively calm before winds return from opposite direction",
          "Eyewalls carry the storm's most destructive forces",
        ],
      },
      {
        id: 2,
        title: "Cyclone Alerts and Warning Levels",
        content: `Understanding meteorology advisory stages empowers timely home reinforcement and evacuation.

Advisory Levels:
• Cyclone Watch: Issued 48 hours prior to expected storm landfall. Inspect storm shutters and replenish emergency kits.
• Cyclone Warning: Issued 24 hours prior. Finalize property securing and move to interior shelter.
• Evacuation Directive: Mandatory order to clear low-lying coastal zones immediately.`,
        keyRule: "Evacuate immediately when official cyclone evacuation directives are issued.",
        proTip: "Fill bathtub and extra clean buckets with tap water before landfall—this provides non-potable water for flushing toilets when utility power fails.",
        mythVsFact: {
          myth: "Taping a big 'X' with masking tape on windows prevents glass from shattering.",
          fact: "Tape does not prevent glass breakage and creates larger, more dangerous flying shards. Use real storm shutters or 5/8-inch plywood.",
        },
        checklist: [
          "Cyclone Watch = 48 hours notice; inspect storm shutters",
          "Cyclone Warning = 24 hours notice; complete indoor preparations",
          "Evacuate coastal zones immediately when directed by authorities",
        ],
        remember: [
          "Cyclone Watch = 48 hours notice; inspect storm shutters",
          "Cyclone Warning = 24 hours notice; complete indoor preparations",
          "Evacuate coastal zones immediately when directed by authorities",
        ],
      },
      {
        id: 3,
        title: "Preparing Your Home",
        content: `Reinforcing your dwelling protects structural integrity against high-velocity wind pressure.

1. Window & Roof Reinforcement:
• Install storm shutters or board up all exterior glass with 5/8-inch exterior plywood.
• Secure loose roof tiles, clear gutters, and trim dead tree branches overhangs near rooflines.

2. Outdoor Debris Clearance:
Move all patio furniture, trash cans, grills, and potted plants indoors—high winds transform loose objects into dangerous airborne projectiles.`,
        keyRule: "Board up windows and secure outdoor items that can become flying missiles.",
        proTip: "Set your refrigerator and freezer to their coldest settings before the storm hits. Keep doors closed to preserve food for up to 48 hours during power outages.",
        mythVsFact: {
          myth: "Tying down patio furniture with light rope is sufficient for high cyclone winds.",
          fact: "Winds over 100 mph can easily snap light ropes. Move all loose outdoor furniture inside your garage or home.",
        },
        checklist: [
          "Board up windows with 5/8-inch plywood",
          "Move loose patio furniture and trash cans inside",
          "Trim dead tree branches near rooflines",
        ],
        remember: [
          "Board up windows with 5/8-inch plywood",
          "Move loose patio furniture and trash cans inside",
          "Trim dead tree branches near rooflines",
        ],
      },
      {
        id: 4,
        title: "Emergency Supplies",
        content: `Stocking emergency supplies guarantees self-sufficiency during multi-day power outages.

72-Hour Supply Kit:
• 3 to 7-day supply of clean drinking water (1 gallon per person/day).
• Non-perishable canned food and manual can opener.
• Battery-powered weather radio, flashlights, and extra batteries.
• Heavy-duty power banks for mobile phones.
• Emergency cash and essential medications in waterproof pouches.`,
        keyRule: "Prepare a minimum 72-hour survival kit in waterproof containers.",
        proTip: "Keep emergency cash in small $5 and $10 bills stored in ziplock bags—electronic card readers and ATMs will not function during regional power grid outages.",
        mythVsFact: {
          myth: "You can rely on cell phones for storm updates throughout a cyclone.",
          fact: "Cell towers frequently lose power or become overloaded. A battery or hand-crank NOAA radio is vital.",
        },
        checklist: [
          "Stock 72-hour water and canned food supplies",
          "Maintain battery radios for weather broadcasts",
          "Keep medicines and cash in waterproof bags",
        ],
        remember: [
          "Stock 72-hour water and canned food supplies",
          "Maintain battery radios for weather broadcasts",
          "Keep medicines and cash in waterproof bags",
        ],
      },
      {
        id: 5,
        title: "Staying Safe During a Cyclone",
        content: `Disciplined indoor protocol during peak storm conditions minimizes injury risk.

1. Indoor Sheltering Rules:
• Stay indoors away from windows, sliding glass doors, and exterior walls.
• Shelter in an interior windowless room, hallway, or closet on the lowest floor.
• Keep emergency radio tuned to local weather broadcasts.
• Never venture outside during the calm eye of the cyclone.`,
        keyRule: "Shelter in an interior room away from exterior windows.",
        proTip: "If high winds compromise your roof structure, shield yourself under a mattress or sturdy dining table in an interior hallway.",
        mythVsFact: {
          myth: "Riding out a cyclone in a mobile home is safe if it is anchored.",
          fact: "Mobile homes are extremely vulnerable to cyclone winds. Evacuate to a designated community storm shelter.",
        },
        checklist: [
          "Stay indoors away from glass windows and doors",
          "Shelter in an interior hallway or closet",
          "Do not venture out during the storm eye",
        ],
        remember: [
          "Stay indoors away from glass windows and doors",
          "Shelter in an interior hallway or closet",
          "Do not venture out during the storm eye",
        ],
      },
      {
        id: 6,
        title: "Safety After a Cyclone",
        content: `Post-storm environments present hazardous electrical, water, and structural risks.

1. Post-Storm Guidance:
• Wait for official all-clear announcements before stepping outdoors.
• Stay clear of downed electrical wires, flooded roads, and fallen trees.
• Use flashlights instead of candles to inspect home damage to avoid gas explosion hazards.
• Photograph structural damage for insurance claims and report utility failures.`,
        keyRule: "Stay clear of fallen power lines and flooded areas after storm passes.",
        proTip: "Report fallen utility wires immediately to local emergency services and treat all downed cables as live and high voltage.",
        mythVsFact: {
          myth: "It is safe to use gas generators inside your garage if the door is partially open.",
          fact: "Generators emit deadly carbon monoxide gas. Run generators outdoors at least 20 feet away from windows and doors.",
        },
        checklist: [
          "Wait for official municipal all-clear advice",
          "Report downed power lines immediately",
          "Use flashlights instead of candles indoors",
        ],
        remember: [
          "Wait for official municipal all-clear advice",
          "Report downed power lines immediately",
          "Use flashlights instead of candles indoors",
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'What is the calm center of a cyclone called?',
        options: ['The Eye', 'The Core', 'The Apex', 'The Peak'],
        answer: 'The Eye',
      },
      {
        question: 'What happens after the eye of a cyclone passes over your location?',
        options: ['Severe winds resume suddenly from the opposite direction', 'The storm is completely finished', 'Sunny warm weather starts', 'Heavy snow begins'],
        answer: 'Severe winds resume suddenly from the opposite direction',
      },
      {
        question: 'Why should loose yard furniture and trash cans be secured before a cyclone?',
        options: ['High winds turn them into dangerous flying debris', 'To keep them clean', 'To save space', 'To prevent rain damage'],
        answer: 'High winds turn them into dangerous flying debris',
      },
      {
        question: 'How many hours before landfall is a Cyclone Warning typically issued?',
        options: ['24 hours', '72 hours', '5 minutes', '1 week'],
        answer: '24 hours',
      },
      {
        question: 'Where is the safest place to shelter inside a home during a cyclone?',
        options: ['In an interior windowless room or closet on the lowest floor', 'Next to large glass windows', 'On the roof', 'In the attic'],
        answer: 'In an interior windowless room or closet on the lowest floor',
      },
      {
        question: 'Why should flashlights be used instead of candles during post-cyclone home inspection?',
        options: ['To prevent fire hazards from unsuspected gas leaks', 'Flashlights are brighter', 'Candles melt', 'Candles attract insects'],
        answer: 'To prevent fire hazards from unsuspected gas leaks',
      },
      {
        question: 'How many days of emergency food and water should a cyclone kit contain?',
        options: ['At least 3 to 7 days', '1 meal', '12 hours', '3 weeks'],
        answer: 'At least 3 to 7 days',
      },
      {
        question: 'What should you do if an official cyclone evacuation order is issued for your area?',
        options: ['Evacuate immediately along designated safe routes', 'Wait until winds reach peak', 'Go to the beach to watch waves', 'Ignore order'],
        answer: 'Evacuate immediately along designated safe routes',
      },
      {
        question: 'What is a major coastal hazard caused by cyclone winds pushing sea water inland?',
        options: ['Storm surge', 'Avalanche', 'Drought', 'Heat wave'],
        answer: 'Storm surge',
      },
      {
        question: 'What should you avoid touching outdoors after a cyclone passes?',
        options: ['Fallen electrical power lines and standing floodwater', 'Dry ground', 'Concrete steps', 'Bricks'],
        answer: 'Fallen electrical power lines and standing floodwater',
      },
    ],
  },

  "Tsunami Preparedness": {
    image: require('../assets/images/tsunami.jpg'),
    heroImage: require('../assets/images/Disaster.png'),
    title: "Tsunami Preparedness",
    category: "TSUNAMI PREPAREDNESS",
    description: "Recognize natural coastal warning signs and move to high ground fast.",
    content: "Tsunamis produce fast-moving ocean wave series. Recognize natural coastal warning signs and move inland.",
    video: 'https://www.youtube.com/watch?v=Wx9vPv-T51I',
    totalLessons: 6,
    lessons: [
      {
        id: 1,
        title: "Understanding Tsunamis",
        content: `A tsunami is a series of massive ocean waves caused by underwater subduction zone earthquakes, volcanic collapse, or marine landslides.

1. Velocity & Wave Series:
• Tsunami waves cross deep ocean basins at speeds exceeding 500 mph (800 km/h).
• A tsunami is NOT a single wave, but a series of surge waves separated by minutes to hours. The first wave is rarely the largest wave.`,
        keyRule: "Tsunamis are a series of waves—the first wave is rarely the largest.",
        proTip: "Never assume a tsunami event is over after the first wave passes. Wave series can continue impacting coastlines for 12 to 24 hours.",
        mythVsFact: {
          myth: "A tsunami is just a huge curling surfing wave.",
          fact: "A tsunami acts like an rapidly rising wall of water or violent fast-rising tide carrying dangerous debris inland.",
        },
        checklist: [
          "Identify local coastal tsunami hazard maps and evacuation zones",
          "Locate high ground at least 100 feet above sea level",
          "Practice foot evacuation routes with family members",
        ],
        remember: [
          "Tsunamis are triggered by underwater subduction quakes",
          "Waves travel at 500+ mph across deep oceans",
          "The first wave is rarely the largest wave",
        ],
      },
      {
        id: 2,
        title: "Natural Tsunami Warning Signs",
        content: `Recognizing natural coastal warning signs provides vital minutes to escape before electronic sirens sound.

3 Primary Natural Warning Signs:
1. Strong Coastal Quake: Severe or long-lasting ground shaking felt near shoreline areas.
2. Rapid Ocean Drawdown: Sea water recedes suddenly far out to sea, exposing reefs, seabed, and flopping fish.
3. Roaring Ocean Sound: A loud roaring noise coming from the ocean, resembling a freight train or jet engine.`,
        keyRule: "If you feel a strong coastal quake or see ocean water recede, move inland immediately.",
        proTip: "If you notice the ocean receding unexpectedly, run inland immediately. Do not walk out onto the exposed seabed to collect shells or fish.",
        mythVsFact: {
          myth: "Official sirens will always sound before a tsunami wave hits.",
          fact: "Near-source earthquakes can generate tsunamis that hit coastlines in under 15 minutes—before official alerts can process.",
        },
        checklist: [
          "Strong coastal earthquake shaking",
          "Rapid ocean water receding exposing sea floor",
          "Loud roaring sound from the ocean",
        ],
        remember: [
          "Strong coastal earthquake shaking",
          "Rapid ocean water receding exposing sea floor",
          "Loud roaring sound from the ocean",
        ],
      },
      {
        id: 3,
        title: "Official Warning Systems",
        content: `Official coastal sirens and emergency radio broadcasts issue alerts based on deep ocean DART buoy sensors.

Alert Levels:
• Tsunami Advisory: Strong ocean currents expected near shoreline. Stay off beaches.
• Tsunami Warning: Dangerous widespread coastal surge flooding imminent. Evacuate inland immediately.`,
        keyRule: "Heed official tsunami sirens and advisory broadcasts instantly.",
        proTip: "Save emergency evacuation map images on your mobile phone gallery so they are accessible offline during cell tower failures.",
        mythVsFact: {
          myth: "Tsunami advisories are just minor warnings you can ignore.",
          fact: "Advisories signal dangerous strong currents capable of sweeping swimmers and boats out to sea.",
        },
        checklist: [
          "Advisory = Dangerous currents near shore",
          "Warning = Imminent coastal surge; evacuate inland",
          "Listen to official NOAA and municipal siren systems",
        ],
        remember: [
          "Advisory = Dangerous currents near shore",
          "Warning = Imminent coastal surge; evacuate inland",
          "Listen to official NOAA and municipal siren systems",
        ],
      },
      {
        id: 4,
        title: "Evacuation Routes and Higher Ground",
        content: `Speed is essential when clearing coastal tsunami hazard zones.

1. High Ground Standards:
Move inland or climb up to high ground at least 100 feet (30 meters) above sea level immediately.

2. Foot Evacuation & Vertical Shelter:
• Evacuate on foot if vehicle traffic gridlock occurs.
• If high ground is unreachable, use Vertical Evacuation: climb to the 3rd floor or higher of a reinforced concrete building.`,
        keyRule: "Evacuate inland or to high ground at least 100 feet above sea level.",
        proTip: "If driving causes traffic gridlock near coastal bottlenecks, abandon your vehicle safely and continue evacuating uphill on foot instantly.",
        mythVsFact: {
          myth: "Any multi-story building can serve as a vertical tsunami shelter.",
          fact: "Only engineered, reinforced concrete or steel frame structures (3rd floor+) can withstand heavy tsunami hydrodynamic impact.",
        },
        checklist: [
          "Evacuate to high ground at least 100 feet above sea level",
          "Evacuate on foot if roads become congested",
          "Use 3rd floor or higher of concrete buildings as vertical shelter",
        ],
        remember: [
          "Evacuate to high ground at least 100 feet above sea level",
          "Evacuate on foot if roads become congested",
          "Use 3rd floor or higher of concrete buildings as vertical shelter",
        ],
      },
      {
        id: 5,
        title: "What To Do During a Tsunami",
        content: `Actions to take when tsunami waves impact coastal zones.

1. High Ground Security:
Remain at high ground until emergency management issues an official clearance. Never go down to the beach to watch a tsunami wave arrive.

2. Marine Safety:
Ships in deep water (over 100 fathoms) should stay offshore where tsunami waves pass unnoticed beneath the surface.`,
        keyRule: "Never go to the shore to watch a tsunami.",
        proTip: "If caught in tsunami water, hold onto floating large debris, roof structures, or sturdy trees to keep your head above water.",
        mythVsFact: {
          myth: "Boats tied to docks in harbor piers are safe during tsunamis.",
          fact: "Tsunami currents in harbors tear docks apart and smash vessels into seawalls. Deep offshore water (100+ fathoms) is much safer.",
        },
        checklist: [
          "Never go to the beach to view tsunami waves",
          "Deep ocean vessels should remain offshore in deep water",
          "Remain at high ground until official all-clear advice",
        ],
        remember: [
          "Never go to the beach to view tsunami waves",
          "Deep ocean vessels should remain offshore in deep water",
          "Remain at high ground until official all-clear advice",
        ],
      },
      {
        id: 6,
        title: "Returning Safely After a Tsunami",
        content: `Safe post-tsunami actions protect against secondary wave hazards and toxic floodwater.

Post-Tsunami Recovery:
• Tsunami wave series can continue arriving for up to 24 hours.
• Stay away from flooded coastal zones until authorities declare it safe.
• Avoid contact with contaminated standing water and inspect structural foundations before entering buildings.`,
        keyRule: "Wait for official all-clear clearance—waves can arrive for 24 hours.",
        proTip: "Do not eat any shellfish, fish, or marine life found stranded on land post-tsunami—they are likely contaminated by biohazards.",
        mythVsFact: {
          myth: "Once the tide goes back out after a tsunami wave, the danger is over.",
          fact: "Tsunami wave trains can produce multiple destructive crests separated by hours.",
        },
        checklist: [
          "Tsunami wave series can persist for up to 24 hours",
          "Return only after official all-clear announcement",
          "Avoid contaminated standing water and damaged structures",
        ],
        remember: [
          "Tsunami wave series can persist for up to 24 hours",
          "Return only after official all-clear announcement",
          "Avoid contaminated standing water and damaged structures",
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'What are the three natural warning signs of an impending coastal tsunami?',
        options: [
          'Strong earthquake, rapid ocean water receding, and loud roaring ocean noise',
          'Heavy rain, thunder, and lightning',
          'High heat, calm sea, and red sky',
          'Strong wind, fog, and high tide',
        ],
        answer: 'Strong earthquake, rapid ocean water receding, and loud roaring ocean noise',
      },
      {
        question: 'What should you do immediately if you observe ocean water receding rapidly exposing the sea floor?',
        options: [
          'Run inland and toward high ground immediately',
          'Walk out onto sea floor to pick up fish',
          'Take photographs near the water',
          'Wait for official siren to sound',
        ],
        answer: 'Run inland and toward high ground immediately',
      },
      {
        question: 'Is the first tsunami wave usually the largest?',
        options: [
          'No, tsunamis are a series of waves and later waves are often much larger',
          'Yes, the first wave is always the largest and only wave',
          'Tsunamis only consist of one small splash',
          'The third wave is always dry',
        ],
        answer: 'No, tsunamis are a series of waves and later waves are often much larger',
      },
      {
        question: 'How high above sea level should you aim to evacuate during a tsunami warning?',
        options: ['At least 100 feet above sea level', '5 feet', '10 feet', 'Level with the beach'],
        answer: 'At least 100 feet above sea level',
      },
      {
        question: 'What is vertical tsunami evacuation?',
        options: [
          'Evacuating to the 3rd floor or higher of a sturdy reinforced concrete building',
          'Climbing a wooden ladder on the beach',
          'Standing on a car',
          'Jumping in a pool',
        ],
        answer: 'Evacuating to the 3rd floor or higher of a sturdy reinforced concrete building',
      },
      {
        question: 'What should boats in deep ocean water do during a tsunami warning?',
        options: ['Stay out in deep water', 'Return quickly to shallow harbor piers', 'Anchor near the beach', 'Tie to the dock'],
        answer: 'Stay out in deep water',
      },
      {
        question: 'Why is it dangerous to go to the beach to watch a tsunami?',
        options: [
          'Tsunami waves travel extremely fast and by the time you see it, it is too late to escape',
          'The beach is too crowded',
          'The sand is wet',
          'You will get sunburned',
        ],
        answer: 'Tsunami waves travel extremely fast and by the time you see it, it is too late to escape',
      },
      {
        question: 'How long can dangerous tsunami wave activity persist following an earthquake?',
        options: ['Up to 24 hours', '10 minutes', '1 hour only', '5 minutes'],
        answer: 'Up to 24 hours',
      },
      {
        question: 'What is the primary cause of major tsunamis?',
        options: ['Underwater earthquakes along subduction zones', 'Wind storms', 'High summer tides', 'Rainfall'],
        answer: 'Underwater earthquakes along subduction zones',
      },
      {
        question: 'When is it safe to return to low-lying coastal areas after a tsunami?',
        options: ['Only after local authorities give the official all-clear signal', 'Immediately after first wave passes', 'When water turns clear', 'At sunset'],
        answer: 'Only after local authorities give the official all-clear signal',
      },
    ],
  },

  "Landslide Safety": {
    image: require('../assets/images/earthquake.jpg'),
    heroImage: require('../assets/images/Disaster.png'),
    title: "Landslide & Slope Safety",
    category: "LANDSLIDE SAFETY",
    description: "Identify slope instability warning signs, mudslide risks, and downhill evacuation safety.",
    content: "Landslides and debris flows strike rapidly on steep slopes during heavy rains. Early warning recognition saves lives.",
    video: 'https://www.youtube.com/watch?v=BLEPakj1YTY',
    totalLessons: 6,
    lessons: [
      {
        id: 1,
        title: "Understanding Landslides and Debris Flows",
        content: `Landslides occur when soil, rock, and organic debris slide down a slope due to gravity, water saturation, or seismic shaking.

1. Types of Slope Failure:
• Mudslides & Debris Flows: Rapid rivers of liquid mud, boulders, trees, and water carrying immense momentum down mountain channels.
• Rockfalls: Sudden free-fall of large boulders detachment from cliff faces.

2. Triggers:
• Prolonged Heavy Rainfall: Water saturates hillside soil layers, reducing friction and causing slope liquefaction.
• Human Interventions: Deforestation, illegal hill cutting, and poor drainage construction.`,
        keyRule: "Recognize that intense rainfall on steep terrain increases landslide risk exponentially.",
        proTip: "Listen for unusual rumbling sounds or snapping trees on steep hillsides during heavy monsoon rains.",
        mythVsFact: {
          myth: "Landslides only happen on extreme, vertical mountain cliffs.",
          fact: "Debris flows can occur on moderate slopes as low as 15 degrees if soil is completely water-saturated.",
        },
        checklist: [
          "Identify hillside drainage channels near your residence",
          "Check local geological hazard maps for slope instability zones",
          "Monitor rainfall accumulation gauges during severe weather",
        ],
        remember: [
          "Heavy rainfall saturates soil and triggers rapid debris flows",
          "Debris flows travel rapidly down stream channels and valleys",
          "Unusual tree snapping or soil shifting signals imminent failure",
        ],
      },
      {
        id: 2,
        title: "Early Warning Signs of Slope Failure",
        content: `Recognizing early environmental indicators allows timely evacuation before catastrophic slope collapse.

1. Structural Indicators:
• New cracks opening in plaster, brickwork, foundations, or paved roads.
• Doors and window frames sticking or jamming unexpectedly due to ground tilting.

2. Environmental Warning Signs:
• Trees, utility poles, or retaining walls leaning downhill.
• Sudden change from clear stream water to muddy, sediment-choked torrents.
• Faint rumbling sounds that gradually increase in volume as a debris flow approaches.`,
        keyRule: "Evacuate immediately upon detecting leaning trees, cracking foundations, or sudden mud torrents.",
        proTip: "If you observe new cracks in retaining walls or hillside soil, notify local emergency management and neighbors downhill instantly.",
        mythVsFact: {
          myth: "Landslides give plenty of advance warning time before sliding.",
          fact: "Initial soil movement can accelerate into a 35 mph debris torrent within seconds.",
        },
        checklist: [
          "Inspect exterior retaining walls for new tilting or bulging",
          "Watch for new cracks in driveway pavement and house foundations",
          "Listen for deep subterranean rumbling or cracking sounds",
        ],
        remember: [
          "Leaning utility poles and trees indicate active ground movement",
          "Sticking doors and windows signal structural foundation tilting",
          "Sudden muddy stream runoff warns of upstream soil erosion",
        ],
      },
      {
        id: 3,
        title: "Pre-Landslide Safety & Home Protection",
        content: `Proactive land management and structural drainage engineering minimize landslide vulnerability.

1. Drainage Control:
• Install flexible downspouts to direct rainwater away from steep slope edges.
• Maintain cleared culverts, swales, and retaining wall weep holes to prevent water ponding.

2. Vegetation Protection:
• Retain deep-rooted native trees and groundcover on steep slopes to anchor topsoil layers.
• Avoid heavy landscaping fill or unpermitted hill excavations near home foundations.`,
        keyRule: "Direct surface runoff water away from slope edges using proper drainage channels.",
        proTip: "Plant deep-rooted groundcover like vetiver grass on exposed embankments to naturally stabilize topsoil against erosion.",
        mythVsFact: {
          myth: "Cutting down large trees on a hillside prevents them from falling during slides.",
          fact: "Tree roots hold soil together like a structural mesh. Removing trees increases landslide risk significantly.",
        },
        checklist: [
          "Clean rainwater gutters and direct downspouts away from slopes",
          "Plant native deep-rooted vegetation on steep embankments",
          "Consult geotechnical engineers before cutting into hillsides",
        ],
        remember: [
          "Proper drainage prevents water saturation on slope banks",
          "Tree roots stabilize topsoil and absorb groundwater excess",
          "Keep retaining wall weep holes clear of dirt and debris",
        ],
      },
      {
        id: 4,
        title: "Immediate Action During a Landslide",
        content: `Immediate response actions when a landslide or mudslide occurs in your vicinity.

1. If Indoors:
• If evacuation is impossible, move to an upper floor on the side of the building OPPOSITE the approaching slide.
• Curl into a tight ball, cover your head and neck with your arms, and take shelter under heavy furniture.

2. If Outdoors or Driving:
• Run across the path of the slide toward high, stable ground—never run directly downhill in front of a debris flow!
• If driving, watch for collapsed pavement, mud on roadways, and falling boulders near mountain road cuts.`,
        keyRule: "Run perpendicular to the slide path toward high ground—never run downhill ahead of it.",
        proTip: "Debris flows travel along natural drainage ravines. Move out of stream valleys and gully floors immediately during torrential storms.",
        mythVsFact: {
          myth: "You can easily outrun a fast-moving mudslide downhill.",
          fact: "Debris flows move up to 35 mph, carrying boulders and trees. Move sideways out of its path to safety.",
        },
        checklist: [
          "Run sideways (perpendicular) away from the path of mudflows",
          "Move to upper floors on the opposite side if trapped inside",
          "Curling into a ball protecting head if caught in debris",
        ],
        remember: [
          "Run perpendicular across the slide path to high ground",
          "Stay completely clear of river channels and gully bottoms",
          "Protect head and neck if caught inside a sliding structure",
        ],
      },
      {
        id: 5,
        title: "Evacuation Protocol for Hillside Communities",
        content: `Orderly evacuation saves lives when landslide warnings are declared for high-risk mountain sectors.

1. Pre-Designated Evacuation Routes:
Know primary and secondary downhill and ridge evacuation routes away from unstable gullies.

2. Emergency Go-Bag & Relocation:
Evacuate early at night if intense rainfall persists—most catastrophic landslide fatalities occur while residents sleep during nighttime storms.`,
        keyRule: "Evacuate high-risk hillside homes early before nighttime heavy rainstorms intensify.",
        proTip: "Keep a battery-powered flashlight and sturdy hiking boots next to your bed during monsoon storms in mountain regions.",
        mythVsFact: {
          myth: "You should wait for an official evacuation order before leaving an unstable hillside.",
          fact: "Landslides can cut off roads and power in seconds. Evacuate voluntarily if you hear soil cracking or see mud movement.",
        },
        checklist: [
          "Pack a 72-hour emergency kit with water, flashlight, and IDs",
          "Identify secondary ridge evacuation routes out of your valley",
          "Evacuate voluntarily before darkness if heavy rains continue",
        ],
        remember: [
          "Evacuate early before nighttime storm peak",
          "Use ridge roads rather than stream valley channels",
          "Take emergency survival kits and essential medical supplies",
        ],
      },
      {
        id: 6,
        title: "Post-Landslide Recovery & Community Safety",
        content: `Post-slide environments present severe secondary hazards including secondary slides and broken utility lines.

1. Secondary Slide Hazards:
Stay clear of the slide area—additional secondary slides can occur hours or days later on adjacent unstable slopes.

2. Utility & Environmental Inspection:
• Check for broken gas, water, and electrical lines. Report utility damage to emergency response authorities immediately.
• Re-enter damaged structures only after certified geotechnical engineers certify ground stability.`,
        keyRule: "Stay away from slide areas; secondary landslides can occur without warning.",
        proTip: "Photograph all structural and property damage for insurance and disaster relief claims before initiating debris removal.",
        mythVsFact: {
          myth: "Once a landslide stops, the slope is completely safe and stabilized.",
          fact: "Unstable soil masses and overhangs frequently collapse in secondary slides after initial movement.",
        },
        checklist: [
          "Stay clear of active slide zones and mud deposits",
          "Report downed utility poles and cracked roads to authorities",
          "Have geotechnical experts evaluate slope stability before rebuilding",
        ],
        remember: [
          "Secondary slides can occur without warning on destabilized slopes",
          "Report broken gas and water mains to emergency services",
          "Obtain professional engineering clearance before structural re-entry",
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'What is a primary natural trigger for rapid landslides and debris flows?',
        options: ['Prolonged heavy rainfall that saturates soil layers', 'Freezing weather only', 'High winds without rain', 'Direct sunlight'],
        answer: 'Prolonged heavy rainfall that saturates soil layers',
      },
      {
        question: 'Which way should you run if caught outdoors near an approaching landslide?',
        options: [
          'Run perpendicular (sideways) across the slide path toward high ground',
          'Run straight downhill ahead of the slide',
          'Stand still in the gully',
          'Run into the mudflow',
        ],
        answer: 'Run perpendicular (sideways) across the slide path toward high ground',
      },
      {
        question: 'What is a common early warning sign of hillside slope instability?',
        options: [
          'Leaning utility poles, trees, and new foundation cracks',
          'Clear blue skies',
          'Dry riverbeds',
          'High outdoor humidity',
        ],
        answer: 'Leaning utility poles, trees, and new foundation cracks',
      },
      {
        question: 'Why should deep-rooted native trees NOT be cut down on steep hillsides?',
        options: [
          'Their roots anchor topsoil layers together and absorb excess groundwater',
          'They attract rain',
          'They block sunlight',
          'They make noise',
        ],
        answer: 'Their roots anchor topsoil layers together and absorb excess groundwater',
      },
      {
        question: 'What sound often signals an approaching debris flow?',
        options: [
          'Deep rumbling or roaring sound like a train, accompanied by tree snapping',
          'Whistling wind',
          'High pitch beep',
          'Silence',
        ],
        answer: 'Deep rumbling or roaring sound like a train, accompanied by tree snapping',
      },
      {
        question: 'Where should you shelter inside if trapped in a building during a landslide?',
        options: [
          'On an upper floor on the side of the building OPPOSITE the slide',
          'In the basement',
          'Near exterior windows facing the hill',
          'In the garage',
        ],
        answer: 'On an upper floor on the side of the building OPPOSITE the slide',
      },
      {
        question: 'Why is it dangerous to return to a slide area immediately after it stops?',
        options: [
          'Secondary landslides can occur on destabilized slopes without warning',
          'The mud is too hot',
          'It is illegal',
          'Animals are nearby',
        ],
        answer: 'Secondary landslides can occur on destabilized slopes without warning',
      },
      {
        question: 'How fast can rapid debris flows travel down mountain channels?',
        options: ['Up to 35 mph (56 km/h)', '1 mph', '100 mph', '5 mph'],
        answer: 'Up to 35 mph (56 km/h)',
      },
      {
        question: 'What should you do with rainwater downspouts near steep slopes?',
        options: [
          'Direct downspout runoff away from steep slope edges using drains',
          'Pour water directly onto slope edge',
          'Block downspouts',
          'Dig holes under walls',
        ],
        answer: 'Direct downspout runoff away from steep slope edges using drains',
      },
      {
        question: 'When should residents of high-risk mountain slopes consider evacuating during severe storms?',
        options: [
          'Early before nighttime storm peak and heavy rainfall accumulation',
          'After the house starts sliding',
          'Only at midnight',
          'Never',
        ],
        answer: 'Early before nighttime storm peak and heavy rainfall accumulation',
      },
    ],
  },
};