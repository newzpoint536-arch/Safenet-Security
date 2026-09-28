export interface PageSecurityContext {
  path: string;
  pageTitle: string;
  pageCategory: string;
  domain: string;
  badgeLabel: string;
  threatPriorities: string[];
  summary: string;
  starterPrompts: {
    icon: string;
    title: string;
    prompt: string;
  }[];
  contextBannerText: string;
  welcomeMessage: string;
  quickQuestions: string[];
}

const DEFAULT_CONTEXT: PageSecurityContext = {
  path: '/',
  pageTitle: 'Central Command Portal',
  pageCategory: 'Integrated Security Architecture',
  domain: 'Enterprise & Facility Protection',
  badgeLabel: 'Full Security Spectrum Active',
  threatPriorities: [
    'Physical perimeter intrusion & boundary breach',
    'Surveillance blind spots & delayed incident verification',
    'Unauthorized facility access & identity spoofing',
    'Kidnapping, transit ambush & VIP safety vectors'
  ],
  summary: 'SafeNet Security Solutions Ltd provides end-to-end corporate, industrial, and infrastructure defense across Nigeria with UK security standards, NSCDC Category A licensing, and ISO certifications.',
  contextBannerText: 'Universal Command Context • Monitoring Multi-Layered Threat Vectors',
  welcomeMessage: `**SafeNet Sentinel AI — Tactical Security Advisory Operational.**\n\nI am SafeNet's Senior AI Security Systems Architect, operating in synergy with our 24/7 Central Command Desk across Lagos, Abuja, and Port Harcourt.\n\nHow may I evaluate your security infrastructure today? You can ask me to:\n* **Formulate a multi-layered defense blueprint** for your corporate, industrial, or residential site.\n* **Calculate recommended guard force & shift rotations** based on facility dimensions.\n* **Recommend drone reconnaissance, biometric access gates, and thermal CCTV layouts**.\n* **Coordinate executive armored transit or rapid response protocols**.`,
  starterPrompts: [
    {
      icon: '🏢',
      title: 'Corporate HQ Security',
      prompt: 'Can you recommend an integrated perimeter security, CCTV, and access control architecture for our 8-storey corporate headquarters in Victoria Island, Lagos?'
    },
    {
      icon: '🛡️',
      title: 'Guarding & Shift Calculation',
      prompt: 'How many manned guards and supervisors are needed to secure a 10,000 sqm logistics warehouse operating 24/7 with 3 entry gates?'
    },
    {
      icon: '🚁',
      title: 'Drone Surveillance & Patrol',
      prompt: 'How does SafeNet deploy autonomous drone patrols for residential estates and oil & gas pipeline easements?'
    },
    {
      icon: '💼',
      title: 'VIP Airport Escort (MMIA)',
      prompt: 'We need executive close protection and B6 armored convoy pickup from Murtala Muhammed Airport (Lagos) to Ikoyi. What is the protocol?'
    },
    {
      icon: '🔍',
      title: 'Vulnerability Gap Audit',
      prompt: 'What are the top 5 physical security vulnerabilities commonly found in Nigerian commercial facilities, and how do we resolve them?'
    }
  ],
  quickQuestions: [
    'Recommend layered defense blueprint',
    'Calculate guard deployment for our facility',
    'Request 24/7 Command Desk dispatch'
  ]
};

export const PAGE_CONTEXT_REGISTRY: Record<string, Partial<PageSecurityContext>> = {
  // Maritime Security (Priority Focus)
  '/services/maritime-security': {
    pageTitle: 'Maritime Security',
    pageCategory: 'Offshore & Coastal Asset Protection',
    domain: 'Maritime, Offshore & Littoral Waters',
    badgeLabel: 'Maritime Threat Vector Prioritized',
    threatPriorities: [
      'Gulf of Guinea & Niger Delta piracy, armed boarding & hostage taking',
      'Illegal oil bunkering, crude siphoning & sea robbery',
      'Vessel anchorage vulnerability & unauthorized small-craft approaches',
      'ISPS Code compliance gaps in port facilities & private commercial jetties',
      'Ship-to-ship (STS) transfer security and littoral corridor transit risks'
    ],
    summary: 'Offshore platform defense, port facility security, escort patrol vessels, and counter-piracy operations in Nigerian waters complying with the ISPS Code and operating in coordination with the Nigerian Navy and NIMASA.',
    contextBannerText: 'Maritime Security Context Active • Prioritizing Gulf of Guinea Piracy, ISPS Code & Offshore Threats',
    welcomeMessage: `**SafeNet Sentinel AI — Maritime Security Command Active.**\n\nI am currently prioritizing **Maritime & Offshore Threat Vectors** based on your current view.\n\nOur specialized maritime defense framework encompasses:\n* **Counter-Piracy & Anti-Boarding**: Physical vessel hardening (razor wire, water cannons, citadels) and escort security in the Gulf of Guinea.\n* **ISPS Code Audits**: Comprehensive Port Facility Security Assessments (PFSA) and Plans (PFSP) for Nigerian jetties and terminals.\n* **Offshore Asset Defense**: Protection of oil platforms, FPSOs, flow stations, and support vessels against illegal bunkering.\n* **Armed Escort Coordination**: Tactical escort patrol vessels working under official liaison with the Nigerian Navy and NIMASA.\n\nWhat maritime security challenge or asset protection requirement can I evaluate for you?`,
    starterPrompts: [
      {
        icon: '⚓',
        title: 'Counter-Piracy Defense',
        prompt: 'How does SafeNet protect commercial tankers and cargo vessels against armed boarding and piracy in the Gulf of Guinea?'
      },
      {
        icon: '🛡️',
        title: 'ISPS Code Port Audit',
        prompt: 'What are the essential requirements for securing a private jetty or port terminal under the ISPS Code in Nigeria?'
      },
      {
        icon: '🚢',
        title: 'Naval Escort Coordination',
        prompt: 'How do you coordinate armed escort patrol boats with the Nigerian Navy and NIMASA for high-risk offshore transits?'
      },
      {
        icon: '🛢️',
        title: 'Offshore Platform Security',
        prompt: 'What multi-layered defense architecture protects offshore oil rigs, FPSOs, and flow stations against illegal bunkering?'
      },
      {
        icon: '🌊',
        title: 'STS Transfer Protection',
        prompt: 'What security protocols are required during Ship-to-Ship (STS) crude and product transfers in Nigerian offshore anchorages?'
      }
    ],
    quickQuestions: [
      'Piracy countermeasures in Gulf of Guinea',
      'ISPS Code compliance checklist',
      'Offshore patrol boat coordination'
    ]
  },

  // Pipeline Surveillance Security
  '/services/pipeline-surveillance-security': {
    pageTitle: 'Pipeline Surveillance Security',
    pageCategory: 'Critical Energy Infrastructure Protection',
    domain: 'Oil & Gas Transmission Easements',
    badgeLabel: 'Pipeline Threat Vector Prioritized',
    threatPriorities: [
      'Artisanal illegal oil bunkering & valve vandalism',
      'Easement physical encroachment & remote valve station tampering',
      'Sabotage of crude and gas transmission right-of-ways',
      'Delayed leak & breach detection in remote Niger Delta terrains'
    ],
    summary: 'Autonomous drone patrols, ground telemetry, fiber optic acoustic leak detection, and rapid armed intervention along oil and gas pipeline right-of-ways.',
    contextBannerText: 'Pipeline Security Context Active • Prioritizing Bunkering, Easement Sabotage & Aerial Patrols',
    welcomeMessage: `**SafeNet Sentinel AI — Critical Pipeline Infrastructure Command Active.**\n\nI am prioritizing threat mitigation for **Pipeline & Industrial Right-of-Ways**:\n* **Thermal Drone Easement Patrols**: Pre-programmed flight paths detecting thermal anomalies and illegal excavation.\n* **Fiber Optic Acoustic Sensing**: Instant geo-located alerts on ground digging or pipe tapping within meters.\n* **Hardened Valve Stations**: Anti-ram physical enclosures with solar power and remote biometric locks.\n* **Rapid Interdiction**: Mobile tactical response teams dispatched upon verified telemetry alerts.\n\nHow can I help secure your pipeline network?`,
    starterPrompts: [
      {
        icon: '🛢️',
        title: 'Illegal Tapping Prevention',
        prompt: 'How does SafeNet detect and neutralize illegal pipeline tapping and hot-bunkering before crude is stolen?'
      },
      {
        icon: '🚁',
        title: 'Aerial Easement Patrols',
        prompt: 'What drone surveillance specifications do you use to patrol a 75 km pipeline right-of-way in the Niger Delta?'
      },
      {
        icon: '📡',
        title: 'Acoustic Fiber Sensors',
        prompt: 'How does fiber-optic distributed acoustic sensing (DAS) detect ground excavation near buried pipelines?'
      },
      {
        icon: '🔒',
        title: 'Valve Station Defense',
        prompt: 'What physical security measures are recommended to harden remote manifold valve pits against sabotage?'
      }
    ],
    quickQuestions: [
      'Hot-tap bunkering detection',
      'Drone pipeline patrol pricing',
      'Acoustic fiber sensor layout'
    ]
  },

  // Drone Surveillance
  '/services/drone-surveillance-security': {
    pageTitle: 'Drone Surveillance Security',
    pageCategory: 'Aerial Reconnaissance & Intelligence',
    domain: 'Aerial Facility & Perimeter Reconnaissance',
    badgeLabel: 'Aerial Threat Vector Prioritized',
    threatPriorities: [
      'Perimeter blind spots across vast acreage & rough terrains',
      'Nighttime intrusion through unlit perimeter woods and brush',
      'Slow human motorized patrol cycle times',
      'Hostile surveillance and pre-attack probing by intruders'
    ],
    summary: 'Autonomous and piloted unmanned aerial security patrols delivering thermal reconnaissance, orthomosaic mapping, and rapid perimeter verification under NCAA commercial license.',
    contextBannerText: 'Drone Reconnaissance Context Active • Prioritizing Aerial Thermal Surveillance & Perimeter Patrols',
    welcomeMessage: `**SafeNet Sentinel AI — Aerial Drone Operations Command Active.**\n\nI am prioritizing **Aerial Reconnaissance & UAV Perimeter Patrols**:\n* **Dual Thermal/Optical Payloads**: Spotting intruders in pitch darkness or dense vegetation via infrared FLIR.\n* **Automated Docking Stations**: Scheduled continuous perimeter overflights without manual battery swaps.\n* **NCAA Certified Operations**: 100% compliant flight authorizations and licensed Nigerian pilots.\n* **Command Center Uplink**: Real-time encrypted 4K video feeds beamed to ground tactical teams.\n\nWhat aerial surveillance parameters would you like to review?`,
    starterPrompts: [
      {
        icon: '🚁',
        title: 'Thermal Night Patrols',
        prompt: 'What thermal cameras and detection ranges do your drones offer for night security on a 500-hectare estate?'
      },
      {
        icon: '⏱️',
        title: 'Alarm Response Scramble',
        prompt: 'How quickly can a SafeNet drone scramble to verify a perimeter fence tripwire alarm?'
      },
      {
        icon: '📋',
        title: 'NCAA Flight Compliance',
        prompt: 'How do you handle NCAA flight clearances and airspace permissions for commercial drone surveillance in Nigeria?'
      },
      {
        icon: '🔋',
        title: 'Autonomous Drone-in-a-Box',
        prompt: 'How does an autonomous drone-in-a-box docking station work for 24/7 unpiloted perimeter patrols?'
      }
    ],
    quickQuestions: [
      'Drone thermal detection range',
      'Autonomous drone dock specs',
      'Estate aerial patrol cost'
    ]
  },

  // CCTV Installation & Monitoring
  '/services/cctv-installation-monitoring': {
    pageTitle: 'CCTV Installation & Monitoring',
    pageCategory: 'Intelligent Surveillance Systems',
    domain: 'Command Video Surveillance & Analytics',
    badgeLabel: 'CCTV & Video Analytics Prioritized',
    threatPriorities: [
      'Perimeter scaling and blind spot infiltration',
      'Internal inventory shrinkage and unauthorized night movements',
      'Camera tampering, cable cutting and intentional blinding',
      'Delayed review of passive video recordings after incidents occur'
    ],
    summary: 'High-definition IP surveillance cameras, optical zoom domes, AI tripwires, and 24/7 centralized monitoring with real-time escalation from our command centre.',
    contextBannerText: 'Surveillance Context Active • Prioritizing AI Video Analytics, Command Center & Perimeter Tripwires',
    welcomeMessage: `**SafeNet Sentinel AI — Surveillance Command Active.**\n\nI am prioritizing **Commercial CCTV Architecture & 24/7 Remote Monitoring**:\n* **AI Behavioral Analytics**: Optical tripwires, line-crossing alarms, and loitering detection.\n* **Command Center Dispatch**: Live monitoring from our Victoria Island and Abuja control desks.\n* **Power Resilience**: Solar and online double-conversion UPS preventing camera dropouts during power outages.\n* **Mobile Executive Uplink**: Encrypted multi-factor streaming directly to executive phones.\n\nWhat facility surveillance questions can I answer for you?`,
    starterPrompts: [
      {
        icon: '📹',
        title: 'Perimeter Tripwire Layout',
        prompt: 'How do AI optical tripwires and perimeter thermal CCTV prevent false alarms from stray animals or wind?'
      },
      {
        icon: '🏢',
        title: 'Command Center Monitoring',
        prompt: 'How does SafeNet 24/7 Central Monitoring Station handle confirmed intrusion alerts in Lagos?'
      },
      {
        icon: '⚡',
        title: 'Power Outage Resilience',
        prompt: 'What backup power configuration ensures 100% continuous CCTV recording during generator switchovers?'
      },
      {
        icon: '💾',
        title: 'Video Retention & Cloud Storage',
        prompt: 'What are the recommended video storage retention times and bandwidth requirements for a 64-camera facility?'
      }
    ],
    quickQuestions: [
      'Eliminate CCTV false alarms',
      'Remote command center fees',
      'Solar CCTV specs for warehouses'
    ]
  },

  // Access Control Systems
  '/services/access-control-systems': {
    pageTitle: 'Access Control Systems',
    pageCategory: 'Identity & Physical Access Control',
    domain: 'Perimeter Entry & Biometric Verification',
    badgeLabel: 'Access & Identity Threat Vectors Prioritized',
    threatPriorities: [
      'Tailgating into corporate floors, server rooms & executive offices',
      'Card cloning, lost badges and unauthorized credential sharing',
      'Unscreened visitor vehicle entry & gatehouse bottlenecks',
      'Lack of time-stamped digital audit logs for compliance'
    ],
    summary: 'Biometric facial recognition, fingerprint turnstiles, anti-tailgating speed gates, automated number plate recognition (ANPR), and hydraulic road blockers.',
    contextBannerText: 'Access Control Context Active • Prioritizing Biometrics, Anti-Tailgating & Vehicle Barriers',
    welcomeMessage: `**SafeNet Sentinel AI — Identity & Access Control Command Active.**\n\nI am prioritizing **Biometric Access Architecture & Perimeter Gate Defense**:\n* **Touchless Facial Recognition**: Anti-spoofing liveness verification with sub-second authentication.\n* **Anti-Tailgating Speed Gates**: Optical infrared beams preventing secondary entries on a single badge swipe.\n* **ANPR Vehicle Barriers**: Automatic scanning of authorized license plates with hydraulic rising bollards.\n* **Visitor Management**: Pre-authorized QR codes and digital passport/ID scanning.\n\nWhat access security system are you planning to deploy?`,
    starterPrompts: [
      {
        icon: '🪪',
        title: 'Anti-Tailgating Speed Gates',
        prompt: 'What speed gate and turnstile configuration do you recommend for a corporate lobby with 1,200 daily employees?'
      },
      {
        icon: '🚗',
        title: 'ANPR Vehicle Barriers',
        prompt: 'How does automated number plate recognition (ANPR) integrate with hydraulic road blockers for executive vehicle lanes?'
      },
      {
        icon: '🔒',
        title: 'Server Room Biometric Locks',
        prompt: 'What dual-factor biometric access control and audit logging is required for banking data centers and server vaults?'
      },
      {
        icon: '📱',
        title: 'Visitor QR Code System',
        prompt: 'How does SafeNet digital visitor management software handle pre-registration and instant host notifications?'
      }
    ],
    quickQuestions: [
      'Turnstile throughput calculation',
      'Hydraulic bollard crash ratings',
      'Biometric visitor management setup'
    ]
  },

  // Armed & Unarmed Security Guards
  '/services/armed-unarmed-security-guards': {
    pageTitle: 'Armed & Unarmed Security Guards',
    pageCategory: 'Manned Guarding & Tactical Response',
    domain: 'Physical Ground Force Deployment',
    badgeLabel: 'Manned Guarding Threat Vectors Prioritized',
    threatPriorities: [
      'Guard sleeping on night shift, vigilance fatigue & unattended posts',
      'Compromised or untrained guards failing vehicle search protocols',
      'Perimeter fence breaches unobserved by static guards',
      'Lack of rapid armed supervisory backup during armed robbery attempts'
    ],
    summary: 'Rigorously vetted, biometric-profiled, combat-trained Nigerian security operatives equipped with RFID electronic patrol wands and backed by armed mobile supervisors.',
    contextBannerText: 'Manned Guarding Context Active • Prioritizing Guard Calculations, Vetting & Patrol Verification',
    welcomeMessage: `**SafeNet Sentinel AI — Manned Guarding Command Active.**\n\nI am prioritizing **Manned Guarding Logistics & Post Order Architecture**:\n* **Guard Headcount & Shift Sizing**: Determining exact personnel numbers based on square meterage, gates, and risk profile.\n* **Vetting Standards**: Multi-tier background checks, criminal record verification, and psychological screening.\n* **Digital Patrol Verification**: Mandatory RFID checkpoint wanding every 30 minutes with live command telemetry.\n* **Armed Supervisor Squads**: Unannounced night inspection rounds and immediate armed tactical backup.\n\nWhat facility can I size a guard deployment for?`,
    starterPrompts: [
      {
        icon: '🛡️',
        title: 'Guard Force Headcount Sizing',
        prompt: 'How many security guards, patrol operatives, and supervisors are needed to secure a 15,000 sqm manufacturing plant with 2 gates operating 24/7?'
      },
      {
        icon: '⏱️',
        title: 'Night Vigilance Enforcement',
        prompt: 'How do you guarantee that security guards stay awake and actively patrol premises throughout the night shift?'
      },
      {
        icon: '📋',
        title: 'Vetting & Training Standards',
        prompt: 'What background vetting, criminal checks, and physical training do SafeNet security officers undergo before deployment?'
      },
      {
        icon: '🚨',
        title: 'Armed Supervisor Backup',
        prompt: 'How quickly does an armed mobile supervision unit respond if on-site guards encounter armed intruders?'
      }
    ],
    quickQuestions: [
      'Calculate guard numbers for my site',
      'Guard vetting & training manual',
      'RFID electronic patrol wand proof'
    ]
  },

  // VIP Escort & Bodyguard Services
  '/services/vip-escort-bodyguard-services': {
    pageTitle: 'VIP Escort & Bodyguard Services',
    pageCategory: 'Executive & Close Protection',
    domain: 'Executive Protection & Armored Transit',
    badgeLabel: 'Executive Threat Vectors Prioritized',
    threatPriorities: [
      'Targeted kidnapping for ransom along highway & inter-state routes',
      'Airport corridor ambushes and hostile surveillance tracking',
      'Armed robbery during traffic congestion in major metropolitan zones',
      'Unscreened crowd surges and public dignitary harassment'
    ],
    summary: 'Certified Close Protection Officers (CPOs) trained to UK standards, B6/B7 armored luxury convoys, official armed police escort coordination, and expedited airport VIP protocol.',
    contextBannerText: 'Executive Protection Context Active • Prioritizing Armored Convoys, Airport VIP & Close Protection',
    welcomeMessage: `**SafeNet Sentinel AI — Executive Close Protection Command Active.**\n\nI am prioritizing **VIP Protection, Armored Transit & Motorcade Security**:\n* **Certified CPOs**: Discreet, highly trained close protection specialists operating to UK executive protection standards.\n* **Armored Fleet (B6/B7)**: Certified bullet-resistant Land Cruisers and luxury SUVs with run-flat tires.\n* **Airport Protocol (MMIA & Abuja)**: Airside tarmac pickup, expedited diplomatic customs clearance, and secure transit.\n* **Satellite Convoy Telematics**: Real-time vehicle tracking with covert duress transmitters.\n\nWhat executive itinerary or protection requirement can I coordinate for you?`,
    starterPrompts: [
      {
        icon: '💼',
        title: 'Lagos Airport to Ikoyi Escort',
        prompt: 'What is the full protocol and armored vehicle configuration for picking up an international CEO at Murtala Muhammed Airport (Lagos) and escorting them to Ikoyi?'
      },
      {
        icon: '🛡️',
        title: 'B6 vs B7 Armored SUV Specs',
        prompt: 'What ballistic protection levels do B6 and B7 armored vehicles provide against military assault rifles (AK-47 / 7.62mm)?'
      },
      {
        icon: '🗺️',
        title: 'Inter-State Highway Convoy',
        prompt: 'What security precautions and escort details are required for corporate executives traveling by road between Lagos, Port Harcourt, or Abuja?'
      },
      {
        icon: '🎖️',
        title: 'Official Armed Police Liaison',
        prompt: 'How does SafeNet coordinate official armed escort personnel from the Nigeria Police Force for corporate delegations?'
      }
    ],
    quickQuestions: [
      'Book airport armored transfer',
      'B6 armor certification details',
      'Daily CPO bodyguard rates'
    ]
  },

  // Security Assessment Page
  '/security-assessment': {
    pageTitle: 'Facility Security Assessment',
    pageCategory: 'Risk Assessment & Vulnerability Audit',
    domain: 'Physical Security Gap Analysis',
    badgeLabel: 'Vulnerability Analysis Mode Active',
    threatPriorities: [
      'Unmitigated perimeter vulnerabilities & access loopholes',
      'Inadequate guard force deployment ratios',
      'Critical surveillance blind zones & recording gaps',
      'Non-compliance with NSCDC and ISO 18788 operational standards'
    ],
    summary: 'Interactive security risk calculator and physical gap audit evaluating threat vectors across corporate, industrial, and residential properties in Nigeria.',
    contextBannerText: 'Vulnerability Assessment Mode • Ready to Audit Facility Weak Points & Formulate Defense Specs',
    welcomeMessage: `**SafeNet Sentinel AI — Vulnerability Audit Architect Active.**\n\nI am actively configured to conduct a **Facility Risk Assessment**.\n\nProvide me with basic details regarding your facility:\n1. **Facility Type & Location** (e.g., Commercial Tower in Victoria Island, Factory in Ikeja, Tank Farm in Port Harcourt)\n2. **Estimated Footprint** (e.g., 2,500 sqm, 5 floors, 3 access gates)\n3. **Current Protective Posture** (e.g., 4 unverified guards, analog cameras)\n4. **Primary Threat Concerns** (e.g., perimeter breaches, armed burglary, internal theft)\n\nI will instantly formulate a prioritized vulnerability breakdown, defense score, and recommended countermeasure blueprint!`,
    starterPrompts: [
      {
        icon: '🏢',
        title: 'Audit a Commercial Building',
        prompt: 'Evaluate the physical security vulnerabilities of a 12-storey commercial banking tower in Marina, Lagos, with basement parking and 400 daily visitors.'
      },
      {
        icon: '🏭',
        title: 'Audit an Industrial Warehouse',
        prompt: 'Conduct a gap analysis for a 20,000 sqm distribution hub in Ogun State with 6 loading bays and high-value consumer electronics.'
      },
      {
        icon: '🏡',
        title: 'Audit a Gated Estate',
        prompt: 'What physical security vulnerabilities typically exist in a 150-unit residential gated estate in Lekki, and how do we solve them?'
      },
      {
        icon: '🎯',
        title: 'Vulnerability Scoring Criteria',
        prompt: 'What mathematical metrics and threat vectors does SafeNet use to score facility security vulnerabilities from 0 to 100?'
      }
    ],
    quickQuestions: [
      'Calculate risk score for my building',
      'Common security mistakes in Lagos',
      'Schedule on-site security surveyor'
    ]
  },

  // Request a Quote
  '/request-quote': {
    pageTitle: 'Request a Quote',
    pageCategory: 'Commercial Estimating & Proposals',
    domain: 'Security Force Sizing & Hardware Estimating',
    badgeLabel: 'Quotation Specialist Mode Active',
    threatPriorities: [
      'Budget allocation vs risk exposure imbalances',
      'Over-spending on inefficient guard shifts without technology',
      'Under-deploying critical electronic surveillance barriers'
    ],
    summary: 'Custom proposal generation, guard deployment calculations, and electronic security pricing tailored to Nigerian enterprise budgets.',
    contextBannerText: 'Quotation Desk Context • Calculating Force Requirements & Equipment Estimates',
    welcomeMessage: `**SafeNet Sentinel AI — Commercial Proposals Desk Active.**\n\nI am ready to help you formulate a customized security scope and estimate for your property.\n\nTell me:\n* What service(s) do you require? (Manned Guarding, CCTV, Drone Patrols, Access Gates, Maritime Escort, VIP Transit)\n* What is the location and operational scale?\n* What is your timeline for mobilization?\n\nI can calculate recommended guard counts, equipment quantities, and structure a formal proposal overview.`,
    starterPrompts: [
      {
        icon: '💰',
        title: 'Guarding Force Cost Estimation',
        prompt: 'What are the budgetary factors in calculating the monthly cost for 12 professional corporate security officers working 12-hour rotating shifts in Lagos?'
      },
      {
        icon: '📹',
        title: 'Turnkey CCTV Project Pricing',
        prompt: 'What are the main components and cost drivers for a complete commercial 32-camera AI IP CCTV installation with 24/7 command center monitoring?'
      },
      {
        icon: '⏱️',
        title: 'Mobilization Timeline',
        prompt: 'How quickly can SafeNet deploy trained security officers and command center communications to a new facility in Lagos or Abuja?'
      }
    ],
    quickQuestions: [
      'Guard force pricing breakdown',
      'Turnkey CCTV project scope',
      'Mobilization timeframe'
    ]
  },

  // Licences & Compliance
  '/licences-compliance': {
    pageTitle: 'Licences & Regulatory Compliance',
    pageCategory: 'Regulatory Governance & Accreditations',
    domain: 'Legal Compliance & Standard Operating Procedures',
    badgeLabel: 'Regulatory Compliance Active',
    threatPriorities: [
      'Legal liability and police prosecution from hiring unlicensed private security contractors',
      'Failure of NSCDC Category A compliance audits in Nigeria',
      'Breach of ISO 18788 and ISO 9001 quality management procedures'
    ],
    summary: 'SafeNet operates under Category A licensing by the Nigeria Security and Civil Defence Corps (NSCDC) and complies with ISO 9001:2015 and ISO 18788 international standards.',
    contextBannerText: 'Compliance Context Active • Demonstrating NSCDC Licensing, ISO 18788 & Legal Standards',
    welcomeMessage: `**SafeNet Sentinel AI — Compliance & Legal Governance Active.**\n\nI am configured to provide verification of SafeNet's **Regulatory Accreditations and Industry Certifications**:\n* **NSCDC Category A License**: Fully authorized for private security operations, guard contracting, and security engineering across Nigeria.\n* **ISO 18788**: Security Operations Management System certification conforming to international standards.\n* **ISO 9001:2015**: Quality Management certification ensuring structured supervision.\n* **NCAA Authorized**: Certified commercial unmanned aircraft (drone) flight operations.\n\nWhat compliance or licensing questions can I clarify?`,
    starterPrompts: [
      {
        icon: '📜',
        title: 'NSCDC Category A License',
        prompt: 'Why is it critical for Nigerian corporate enterprises to only hire NSCDC Category A licensed private security contractors?'
      },
      {
        icon: '🏆',
        title: 'ISO 18788 Security Standard',
        prompt: 'What does SafeNet certification under ISO 18788 (Security Operations Management) mean for client liability and service quality?'
      },
      {
        icon: '⚖️',
        title: 'Armed Force Regulations',
        prompt: 'How does Nigerian law regulate armed security, and how does SafeNet legally coordinate armed escorts with the Police and Civil Defence Corps?'
      }
    ],
    quickQuestions: [
      'Verify NSCDC Category A status',
      'ISO 18788 security audit proof',
      'Armed escort legal framework'
    ]
  },

  // Oil & Gas Industry
  '/industries/oil-gas-petrochemical': {
    pageTitle: 'Oil & Gas Petrochemical Security',
    pageCategory: 'Industrial Sector Protection',
    domain: 'Petrochemical, Energy & Offshore Assets',
    badgeLabel: 'Oil & Gas Threat Vectors Prioritized',
    threatPriorities: [
      'Crude oil theft, illegal bunkering & pipeline hot-tapping',
      'Kidnapping of expatriate and national technical personnel for ransom',
      'Hostile community encroachments & flow station shutdowns',
      'Offshore terminal and FPSO security breaches'
    ],
    summary: 'Dedicated defense architectures for upstream flow stations, midstream pipeline corridors, downstream tank farms, and offshore export terminals across the Niger Delta and Gulf of Guinea.',
    contextBannerText: 'Oil & Gas Sector Active • Prioritizing Hydrocarbon Asset Defense, Bunkering & Personnel Safety',
    welcomeMessage: `**SafeNet Sentinel AI — Oil & Gas Security Specialist Active.**\n\nI am prioritizing **Energy Sector Defense in the Niger Delta and Offshore Waters**:\n* **Flow Station & Tank Farm Perimeter Defense**: Thermal radar, anti-climb barriers, and rapid interdiction teams.\n* **Pipeline Integrity**: Aerial UAV patrols and distributed acoustic fiber sensors.\n* **Expatriate & Crew Travel Security**: B6 armored convoys and armed government escort coordination.\n* **Offshore Security**: Fast patrol escort boats complying with ISPS Code protocols.\n\nWhat energy sector asset can I advise on?`,
    starterPrompts: [
      {
        icon: '🛢️',
        title: 'Tank Farm Perimeter Defense',
        prompt: 'What physical security and thermal camera configuration is required to protect a 50,000 MT fuel depot tank farm?'
      },
      {
        icon: '🚁',
        title: 'Pipeline Hot-Tap Detection',
        prompt: 'How do you deploy automated drone surveillance to locate illegal crude siphoning along swamp pipeline easements?'
      },
      {
        icon: '🛡️',
        title: 'Niger Delta Crew Transit',
        prompt: 'What are the travel security standard operating procedures for escorting expatriate engineering teams in the Niger Delta?'
      }
    ],
    quickQuestions: [
      'Tank farm thermal perimeter specs',
      'Swamp pipeline patrol methods',
      'Niger Delta armored escort protocol'
    ]
  },

  // Maritime & Ports Industry
  '/industries/maritime-ports-logistics': {
    pageTitle: 'Maritime, Ports & Logistics',
    pageCategory: 'Industrial Sector Protection',
    domain: 'Port Terminals & Supply Chains',
    badgeLabel: 'Maritime & Port Threats Prioritized',
    threatPriorities: [
      'Port terminal cargo theft, container broaching & smuggling',
      'Gulf of Guinea vessel piracy & illegal boarding at anchorages',
      'ISPS Code compliance penalties and terminal shutdown risks',
      'Waterway sabotage and riverine transport ambushes'
    ],
    summary: 'Comprehensive port facility security plans, dockside access control, container yard CCTV analytics, and naval escort logistics.',
    contextBannerText: 'Maritime & Port Logistics Active • Prioritizing ISPS Code, Cargo Defense & Escort Vessels',
    welcomeMessage: `**SafeNet Sentinel AI — Maritime & Port Logistics Command Active.**\n\nI am prioritizing **Port Infrastructure, Shipping & Supply Chain Defense**:\n* **ISPS Code Compliance**: Designated Port Facility Security Officer (PFSO) advisory and audits.\n* **Container Terminal Access**: Biometric driver verification, ANPR gates, and cargo seal tracking.\n* **Anchorage Security**: Escort patrol vessels maintaining security perimeters around commercial shipping.\n* **Waterway Security**: Rapid interdiction gunboats protecting logistics barges.\n\nHow can I support your port or shipping security requirements?`,
    starterPrompts: [
      {
        icon: '⚓',
        title: 'Port Terminal ISPS Compliance',
        prompt: 'What are the required physical access and surveillance measures for a commercial shipping terminal under the ISPS Code in Lagos?'
      },
      {
        icon: '📦',
        title: 'Container Yard Cargo Protection',
        prompt: 'How does SafeNet prevent container broaching and internal theft in high-volume bonded logistics terminals?'
      },
      {
        icon: '🚢',
        title: 'Anchorage Escort Patrol Boats',
        prompt: 'How do armed escort patrol boats protect commercial bulk carriers waiting in offshore Nigerian anchorages?'
      }
    ],
    quickQuestions: [
      'ISPS terminal audit requirements',
      'Container yard anti-theft tech',
      'Escort boat booking procedures'
    ]
  },

  // Financial & Banking Industry
  '/industries/financial-banking-institutions': {
    pageTitle: 'Financial & Banking Institutions',
    pageCategory: 'Industrial Sector Protection',
    domain: 'Cash-in-Transit & High-Security Vaults',
    badgeLabel: 'Banking Threat Vectors Prioritized',
    threatPriorities: [
      'Armed bank branch raids & explosives against ATM vaults',
      'Cash-in-Transit (CIT) bullion van ambushes on inter-city roads',
      'Internal fraud, vault collusion and unauthorized night access',
      'Customer ATM skimming and vestibule muggings'
    ],
    summary: 'Armored bullion logistics, vault time-delay biometric controls, central monitoring of ATM panic triggers, and vetted banking security officers.',
    contextBannerText: 'Banking & Financial Context Active • Prioritizing Cash-in-Transit, Vaults & Branch Defense',
    welcomeMessage: `**SafeNet Sentinel AI — Banking & Financial Security Specialist Active.**\n\nI am prioritizing **Financial Institution Security, Bullion Logistics & Vault Defense**:\n* **Cash-in-Transit (CIT)**: Armored bullion vans with satellite GPS geo-fencing and remote engine kill switches.\n* **Vault Security**: Multi-party biometric verification and seismic vibration intrusion sensors.\n* **Branch & ATM Security**: 24/7 central alarm monitoring with immediate armed police dispatch.\n* **Executive Safety**: Close protection for managing directors and board members.\n\nWhat banking security vector can I evaluate?`,
    starterPrompts: [
      {
        icon: '🏦',
        title: 'Bank Branch Defense Matrix',
        prompt: 'What physical security architecture prevents armed intrusions at commercial bank branches in Nigeria?'
      },
      {
        icon: '🚐',
        title: 'Armored Cash-in-Transit (CIT)',
        prompt: 'What security specifications and communication fail-safes are built into SafeNet armored bullion transit vehicles?'
      },
      {
        icon: '🔒',
        title: 'Vault Multi-Party Access',
        prompt: 'How do multi-party dual-custody biometric locks and seismic sensors protect bank treasury vaults?'
      }
    ],
    quickQuestions: [
      'Bullion van tracking telemetry',
      'Bank branch alarm dispatch time',
      'ATM seismic sensor integration'
    ]
  },

  // Real Estate & Gated Communities
  '/industries/real-estate-residential': {
    pageTitle: 'Real Estate & Residential Communities',
    pageCategory: 'Industrial Sector Protection',
    domain: 'Gated Estates & High-Value Residential',
    badgeLabel: 'Residential Threat Vectors Prioritized',
    threatPriorities: [
      'Residential estate perimeter breaches and fence scaling',
      'Unauthorized contractor/artisan infiltration into gated estates',
      'Armed home invasion and nighttime burglary',
      'Gate access bottlenecks and visitor screening disputes'
    ],
    summary: 'Integrated estate security combining automated resident WhatsApp OTP access codes, ANPR boom barriers, canine K9 night patrols, and 24/7 emergency dispatch.',
    contextBannerText: 'Residential Estate Context Active • Prioritizing Community Safety, Gate Tech & K9 Patrols',
    welcomeMessage: `**SafeNet Sentinel AI — Residential & Estate Security Specialist Active.**\n\nI am prioritizing **Gated Community, Estate & Private Residence Defense**:\n* **Smart Gate Access**: Automated resident OTP codes, ANPR vehicle cameras, and visitor passcodes.\n* **Canine K9 Patrols**: Experienced guard dogs and handlers conducting perimeter night sweeps.\n* **Estate Patrols**: Rapid-response motorcycles and patrol vehicles inside estate corridors.\n* **Resident Panic Network**: Direct gatehouse and command center dispatch alerts.\n\nWhat estate security challenge can I address?`,
    starterPrompts: [
      {
        icon: '🏡',
        title: 'Estate Gate Automation',
        prompt: 'How does an automated visitor access code system improve security and eliminate bottlenecks at a 300-home estate gate?'
      },
      {
        icon: '🐕',
        title: 'K9 Night Perimeter Patrols',
        prompt: 'How do trained security guard dogs (K9s) deter intruders from scaling residential perimeter walls at night?'
      },
      {
        icon: '🚨',
        title: 'Resident Emergency Panic App',
        prompt: 'How does a mobile or WhatsApp resident panic system notify the gatehouse and SafeNet command center during a home intrusion?'
      }
    ],
    quickQuestions: [
      'Estate gate access software',
      'K9 patrol pricing for estates',
      'Perimeter electric fence specs'
    ]
  },

  // Contact Page
  '/contact': {
    pageTitle: 'Command Centre Contact',
    pageCategory: 'Operations Contact & Dispatch',
    domain: 'Rapid Dispatch & Client Communications',
    badgeLabel: 'Emergency Dispatch Mode Active',
    threatPriorities: [
      'Urgent on-site security incidents requiring immediate armed dispatch',
      'Emergency deployment of static guards within 24 hours',
      'Immediate crisis evacuation and VIP safe haven extraction'
    ],
    summary: 'Direct connection to SafeNet 24/7 Command Centres in Victoria Island (Lagos) and Abuja, offering emergency dispatch and operational consultations.',
    contextBannerText: 'Command Desk Contact • Direct Line to Operations Controllers & Rapid Deployment Units',
    welcomeMessage: `**SafeNet Sentinel AI — Operations Control Desk Active.**\n\nI can directly assist you with reaching SafeNet's 24/7 Operations Desk:\n* **Emergency Dispatch**: Immediate armed supervisor response across Lagos and Abuja.\n* **Rapid Mobilization**: Deploying vetted security guards to urgent facility sites.\n* **Direct Channels**: Phone (+234 813 129 6054) and WhatsApp 24/7 hotline.\n\nAre you experiencing an immediate security incident, or requesting a deployment consultation?`,
    starterPrompts: [
      {
        icon: '🚨',
        title: 'Emergency Response Dispatch',
        prompt: 'We have an active security concern at our facility in Lagos. How quickly can SafeNet dispatch a mobile supervisor or armed patrol unit?'
      },
      {
        icon: '📞',
        title: 'Direct WhatsApp Line',
        prompt: 'Can you provide the direct WhatsApp and telephone contact for the SafeNet Senior Operations Commander on duty?'
      },
      {
        icon: '🏢',
        title: 'Office Locations & Visits',
        prompt: 'Where are SafeNet physical Command Centres located in Lagos, Abuja, and the United Kingdom?'
      }
    ],
    quickQuestions: [
      'Emergency response time in Lagos',
      'Direct operations phone number',
      'Request physical site survey'
    ]
  },

  // Frequently Asked Questions (FAQ)
  '/faq': {
    pageTitle: 'Frequently Asked Questions (FAQ)',
    pageCategory: 'Operational Intelligence & FAQs',
    domain: 'Security Protocols, Licensing & Technical FAQs',
    badgeLabel: 'FAQ & Advisory Context Active',
    threatPriorities: [
      'Unlicensed security operators & regulatory compliance penalties',
      'Inadequate guard vetting & insider threat infiltration',
      'Surveillance system failure during grid power outages',
      'Maritime piracy & armed escort coordination gaps'
    ],
    summary: 'Comprehensive operational answers regarding NSCDC Category A licensing, guard screening, 24/7 CCTV power resilience, autonomous drone approvals, and maritime defense.',
    contextBannerText: 'FAQ Intelligence Active • Answering Technical, Licensing, and Operational Inquiries',
    welcomeMessage: `**SafeNet Sentinel AI — FAQ & Security Advisory Operational.**\n\nI can answer any operational, technical, or legal security inquiry regarding SafeNet's services in Nigeria:\n* **Accreditation & Standards**: NSCDC Category A, ISO 9001/18788, UK operational protocols.\n* **Guard Force Deployment**: 6-week training, biometric background vetting, shift patterns.\n* **AI Surveillance**: CCTV backup power solutions, encrypted remote monitoring, drone permits.\n* **Maritime & Escorts**: ISPS Code compliance, Navy coordination, CEN B6 armored convoys.\n\nWhat security question can I resolve for you?`,
    starterPrompts: [
      {
        icon: '📜',
        title: 'NSCDC Category A Licensing',
        prompt: 'What legal certifications and NSCDC licensing does SafeNet hold for private security operations in Nigeria?'
      },
      {
        icon: '🛡️',
        title: 'Guard Vetting & Screening',
        prompt: 'What exact vetting, police CID checks, and biometric procedures are conducted on SafeNet security guards?'
      },
      {
        icon: '⚡',
        title: 'CCTV Power Resilience',
        prompt: 'How do SafeNet CCTV cameras and command center links stay operational 24/7 during Nigerian power outages?'
      },
      {
        icon: '⚓',
        title: 'Maritime Escort Coordination',
        prompt: 'How does SafeNet coordinate armed escort vessels with the Nigerian Navy and NIMASA in the Gulf of Guinea?'
      }
    ],
    quickQuestions: [
      'NSCDC Category A license details',
      'Guard vetting & background checks',
      'How to request an on-site survey'
    ]
  }
};

/**
 * Resolves full security context for any currentPath in the application
 */
export function getPageSecurityContext(currentPath: string): PageSecurityContext {
  // Normalize path
  const cleanPath = (currentPath || '/').trim();
  const normalizedPath = cleanPath.length > 1 && cleanPath.endsWith('/') 
    ? cleanPath.slice(0, -1) 
    : cleanPath;

  // 1. Direct registry match
  if (PAGE_CONTEXT_REGISTRY[normalizedPath]) {
    return {
      ...DEFAULT_CONTEXT,
      ...PAGE_CONTEXT_REGISTRY[normalizedPath],
      path: normalizedPath
    };
  }

  // 2. Specific check for maritime variants (e.g. /services/maritime, /services/maritime-security, etc.)
  if (normalizedPath.includes('maritime')) {
    return {
      ...DEFAULT_CONTEXT,
      ...PAGE_CONTEXT_REGISTRY['/services/maritime-security'],
      path: normalizedPath
    };
  }

  // 3. Specific check for drone variants
  if (normalizedPath.includes('drone')) {
    return {
      ...DEFAULT_CONTEXT,
      ...PAGE_CONTEXT_REGISTRY['/services/drone-surveillance-security'],
      path: normalizedPath
    };
  }

  // 4. Specific check for pipeline variants
  if (normalizedPath.includes('pipeline')) {
    return {
      ...DEFAULT_CONTEXT,
      ...PAGE_CONTEXT_REGISTRY['/services/pipeline-surveillance-security'],
      path: normalizedPath
    };
  }

  // 5. Specific check for CCTV variants
  if (normalizedPath.includes('cctv')) {
    return {
      ...DEFAULT_CONTEXT,
      ...PAGE_CONTEXT_REGISTRY['/services/cctv-installation-monitoring'],
      path: normalizedPath
    };
  }

  // 6. Specific check for VIP / bodyguard variants
  if (normalizedPath.includes('vip') || normalizedPath.includes('bodyguard') || normalizedPath.includes('escort')) {
    return {
      ...DEFAULT_CONTEXT,
      ...PAGE_CONTEXT_REGISTRY['/services/vip-escort-bodyguard-services'],
      path: normalizedPath
    };
  }

  // 7. Specific check for guards variants
  if (normalizedPath.includes('guard')) {
    return {
      ...DEFAULT_CONTEXT,
      ...PAGE_CONTEXT_REGISTRY['/services/armed-unarmed-security-guards'],
      path: normalizedPath
    };
  }

  // 8. Specific check for access control
  if (normalizedPath.includes('access-control')) {
    return {
      ...DEFAULT_CONTEXT,
      ...PAGE_CONTEXT_REGISTRY['/services/access-control-systems'],
      path: normalizedPath
    };
  }

  // 9. Specific check for assessment / audit
  if (normalizedPath.includes('assessment') || normalizedPath.includes('audit')) {
    return {
      ...DEFAULT_CONTEXT,
      ...PAGE_CONTEXT_REGISTRY['/security-assessment'],
      path: normalizedPath
    };
  }

  // 10. Specific check for quote
  if (normalizedPath.includes('quote')) {
    return {
      ...DEFAULT_CONTEXT,
      ...PAGE_CONTEXT_REGISTRY['/request-quote'],
      path: normalizedPath
    };
  }

  // 11. Generic fallback with path name derivation
  const segment = normalizedPath.split('/').filter(Boolean).pop() || '';
  if (segment) {
    const formattedTitle = segment
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      ...DEFAULT_CONTEXT,
      path: normalizedPath,
      pageTitle: formattedTitle,
      pageCategory: normalizedPath.startsWith('/services') 
        ? 'Specialized Security Capability' 
        : normalizedPath.startsWith('/industries') 
          ? 'Industry Sector Security' 
          : 'Corporate Security Operations',
      badgeLabel: `${formattedTitle} Context Active`,
      contextBannerText: `${formattedTitle} Sector • AI Security Advice Grounded in Current Page`,
      welcomeMessage: `**SafeNet Sentinel AI — ${formattedTitle} Sector Active.**\n\nI have synchronized with your current view on **${formattedTitle}**.\n\nI am prioritizing relevant physical security threats, recommended protective postures, and operational blueprints tailored to this operational sector.\n\nHow can SafeNet protect your assets in this area?`
    };
  }

  return {
    ...DEFAULT_CONTEXT,
    path: '/'
  };
}
