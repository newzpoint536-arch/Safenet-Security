import { 
  HeroSlide, 
  Service, 
  Industry, 
  Project, 
  CaseStudy, 
  BlogPost, 
  SocialAccount, 
  SocialPublishJob, 
  Lead, 
  Testimonial, 
  CareerOpening, 
  SiteSettings,
  AuditLog
} from '../types';

import imgHeroCommand from '../assets/images/hero_nigerian_security_command_1790574276695.jpg';
import imgHeroGuards from '../assets/images/hero_nigerian_corporate_guards_1790574288138.jpg';
import imgHeroDrone from '../assets/images/nigerian_drone_surveillance_1790574299226.jpg';
import imgHeroMaritime from '../assets/images/nigerian_maritime_security_1790574311751.jpg';

export const initialSiteSettings: SiteSettings = {
  companyName: 'SafeNet Security Solutions Ltd',
  tagline: 'Protecting What Matters Most With Unwavering Vigilance',
  phone: '+234 813 129 6054',
  email: 'info@safenetsecurityltd.com',
  whatsapp: '+234 813 129 6054',
  addressNigeria: 'Plot 14, Commercial Avenue, Victoria Island, Lagos, Nigeria',
  addressUK: '85 Great Portland Street, First Floor, London, W1W 7LT, United Kingdom',
  establishedYear: '2025',
  stats: {
    trainedGuards: '500+',
    responseTime: '24/7',
    droneCctvCoverage: '100%',
    clientRetention: '99.4%'
  },
  socialPublishingMode: 'manual_approval',
  socialLinks: {
    facebook: 'https://facebook.com/safenetsecurityltd',
    linkedin: 'https://linkedin.com/company/safenet-security-solutions-ltd',
    x: 'https://x.com/safenet_sec',
    instagram: 'https://instagram.com/safenetsecurityltd',
    youtube: 'https://youtube.com/@safenetsecurityltd'
  }
};

export const initialHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    eyebrow: 'Corporate Security Command',
    headline: 'Protecting What Matters Most With Unwavering Vigilance',
    description: 'Combining UK security standards with deep Nigerian operational experience. Delivering professional manned guarding, drone surveillance, and intelligent risk management.',
    cta1Text: 'Request a Quote',
    cta1Link: '/request-quote',
    cta2Text: 'Security Assessment',
    cta2Link: '/security-assessment',
    image: imgHeroGuards,
    themeTag: '01 / Manned Corporate Guarding'
  },
  {
    id: 'slide-2',
    eyebrow: 'Intelligent Monitoring',
    headline: '24/7 Security Operations & Real-Time Threat Detection',
    description: 'Our state-of-the-art surveillance command center monitors multi-facility CCTV feeds, AI-driven perimeter intrusion detection, and immediate armed response coordination.',
    cta1Text: 'Explore CCTV Systems',
    cta1Link: '/services/cctv-installation-monitoring',
    cta2Text: 'Speak With an Expert',
    cta2Link: '/contact',
    image: imgHeroCommand,
    themeTag: '02 / Command & Control Operations'
  },
  {
    id: 'slide-3',
    eyebrow: 'Aerial Reconnaissance',
    headline: 'Autonomous Drone Surveillance for Expansive Facilities',
    description: 'High-definition thermal and optical aerial patrols over industrial complexes, pipeline rights-of-way, and large estates with instant geo-referenced alert telemetry.',
    cta1Text: 'Drone Capabilities',
    cta1Link: '/services/drone-surveillance-security',
    cta2Text: 'Request a Quote',
    cta2Link: '/request-quote',
    image: imgHeroDrone,
    themeTag: '03 / Drone Patrols & Aerial Defense'
  },
  {
    id: 'slide-4',
    eyebrow: 'Offshore & Waterway Defense',
    headline: 'Specialist Maritime & Coastal Asset Protection',
    description: 'Certified Nigerian maritime security teams protecting offshore platforms, port terminals, escort vessels, and littoral waters against piracy and sabotage.',
    cta1Text: 'Maritime Solutions',
    cta1Link: '/services/maritime-security',
    cta2Text: 'Talk to an Expert',
    cta2Link: '/contact',
    image: imgHeroMaritime,
    themeTag: '04 / Maritime & Port Security'
  },
  {
    id: 'slide-5',
    eyebrow: 'Energy & Infrastructure',
    headline: 'Critical Pipeline & Industrial Surveillance Solutions',
    description: 'Zero-compromise protection for oil & gas right-of-ways, refinery perimeter assets, and high-value logistics corridors with continuous sensor monitoring.',
    cta1Text: 'Pipeline Security',
    cta1Link: '/services/pipeline-surveillance-security',
    cta2Text: 'Request a Quote',
    cta2Link: '/request-quote',
    image: imgHeroDrone,
    themeTag: '05 / Critical Infrastructure'
  },
  {
    id: 'slide-6',
    eyebrow: 'Perimeter Intelligence',
    headline: 'Biometric Access Control & Physical Identity Systems',
    description: 'Next-generation biometric turnstiles, RFID credentialing, automated vehicle barriers, and ANPR license plate recognition designed for enterprise security.',
    cta1Text: 'Access Control Systems',
    cta1Link: '/services/access-control-systems',
    cta2Text: 'Security Assessment',
    cta2Link: '/security-assessment',
    image: imgHeroCommand,
    themeTag: '06 / Access & Identity Control'
  },
  {
    id: 'slide-7',
    eyebrow: 'Specialist Protection',
    headline: 'VIP Escort & Executive Close Protection Services',
    description: 'Discreet, highly disciplined executive protection details trained to UK and international standards for corporate leaders, dignitaries, and visiting delegations.',
    cta1Text: 'Executive Escort',
    cta1Link: '/services/vip-escort-bodyguard-services',
    cta2Text: 'Contact SafeNet',
    cta2Link: '/contact',
    image: imgHeroGuards,
    themeTag: '07 / VIP Executive Escort'
  },
  {
    id: 'slide-8',
    eyebrow: 'Rapid Dispatch',
    headline: 'Mobile Patrols & Immediate Armed Intervention',
    description: 'Dedicated patrol vehicles strategically staged across commercial zones in Lagos, Port Harcourt, and Abuja for immediate response to duress and verified alarm activations.',
    cta1Text: 'Patrol Services',
    cta1Link: '/services/patrol-services',
    cta2Text: 'Request a Quote',
    cta2Link: '/request-quote',
    image: imgHeroGuards,
    themeTag: '08 / Rapid Intervention & Patrol'
  }
];

export const initialServices: Service[] = [
  // Surveillance Systems
  {
    id: 'cctv-monitoring',
    slug: 'cctv-installation-monitoring',
    title: 'CCTV Installation & Monitoring',
    category: 'Surveillance Systems',
    shortDescription: 'High-definition IP surveillance cameras, optical zoom domes, and 24/7 centralized monitoring with real-time incident escalation.',
    fullDescription: 'SafeNet delivers turnkey commercial CCTV solutions from site survey and camera positioning to fiber cabling, local NVR recording, and encrypted link streaming to our Central Monitoring Station. Our Nigerian CCTV operators are rigorously trained in behavioral anomaly detection, perimeter tripwire verification, and night vision clarity analysis.',
    problem: 'Blind spots, faulty cameras, delayed incident discovery, and lack of active real-time oversight leave facilities vulnerable to intrusion and internal theft.',
    solution: 'End-to-end engineered camera coverage integrated with our 24/7 command center, triggering instant response protocols within seconds of unauthorized activity.',
    capabilities: [
      'Thermal imaging and long-range optical zoom for dark and low-light perimeters',
      'AI-powered tripwire and line-crossing intrusion alarms',
      'Cloud and on-premise hybrid high-retention video storage',
      'Remote multi-site monitoring via centralized dashboard'
    ],
    process: [
      'Comprehensive Site Sightline Analysis & Camera Placement Design',
      'Industrial-grade Cabling, Lighting & Power Resilience Installation',
      'Live Command Station Uplink & Threshold Calibration',
      '24/7 Supervised Continuous Monitoring & Monthly Health Audits'
    ],
    technology: [
      'Hikvision / Dahua DeepinView AI Cameras',
      'Enterprise Milestone VMS Architecture',
      'Solar-backed Redundant UPS Infrastructure',
      '4G/5G Encrypted Cellular Backup Uplinks'
    ],
    benefits: [
      'Zero undetected intrusions across secured perimeter lines',
      'Real-time evidence capture compliant with Nigerian law enforcement',
      'Drastic reduction in security guard overhead through smart automated alerts',
      '24/7 peace of mind with verifiable digital incident logs'
    ],
    suitableIndustries: ['Corporate Organizations', 'Banks & Financial Institutions', 'Residential Estates', 'Industrial Facilities'],
    faqs: [
      {
        question: 'What happens during power outages or generator switchovers?',
        answer: 'All SafeNet CCTV installations incorporate dedicated online double-conversion UPS systems and lithium backup packs ensuring 100% continuous uptime without camera dropouts.'
      },
      {
        question: 'Can executives view the cameras on mobile devices while traveling?',
        answer: 'Yes, we provide secure end-to-end encrypted mobile apps with granular multi-factor authentication (MFA) allowing executives to monitor live feeds securely anywhere in the world.'
      }
    ],
    image: imgHeroCommand,
    badge: 'Core Technology'
  },
  {
    id: 'drone-surveillance',
    slug: 'drone-surveillance-security',
    title: 'Drone Surveillance Security',
    category: 'Surveillance Systems',
    shortDescription: 'Autonomous and piloted unmanned aerial security patrols delivering thermal reconnaissance over sprawling industrial facilities and estates.',
    fullDescription: 'Ground patrols cannot effectively monitor vast acreages, rugged terrains, or lengthy industrial right-of-ways in real time. SafeNet deploys certified Nigerian drone pilots equipped with industrial quadcopters featuring dual optical/thermal payloads, automated flight waypoints, and live command center video streaming.',
    problem: 'Large industrial facilities, tank farms, and extensive estates suffer from unmonitored blind corridors and slow human patrol cycle times.',
    solution: 'Rapid aerial deployment delivering 360-degree top-down visibility within 90 seconds, tracking suspicious movement and guiding ground security response teams.',
    capabilities: [
      'Thermal night vision detection through heavy brush and zero-light conditions',
      'Automated pre-programmed perimeter patrol flights',
      'Rapid dispatch for perimeter alarm verification',
      'Orthomosaic mapping and aerial vulnerability assessments'
    ],
    process: [
      'Airspace Clearance & Operational Flight Boundary Mapping',
      'Automated Waypoint Programming & Emergency Land Zones Setup',
      'Routine Scheduled Reconnaissance & On-Demand Alert Scrambles',
      'Real-Time Telemetry Streaming to Ground Units & Central Command'
    ],
    technology: [
      'DJI Enterprise Matrice 350 RTK & H20T Thermal Cameras',
      'Encrypted Digital Transmission Links',
      'Automated Drone Docks for Continuous Recharging',
      'AI Object Identification & Geo-Tracking Systems'
    ],
    benefits: [
      '10x faster response time compared to traditional motorized ground patrols',
      'Detection of intruders long before they reach physical perimeter fences',
      'Significant deterrence effect through visible aerial vigilance',
      'Comprehensive photographic record of estate boundaries and asset health'
    ],
    suitableIndustries: ['Oil & Gas Facilities', 'Critical Infrastructure', 'Industrial & Manufacturing', 'Residential Estates'],
    faqs: [
      {
        question: 'Are your drone operations compliant with Nigerian aviation authorities?',
        answer: 'Yes. All SafeNet flight operations adhere strictly to NCAA (Nigerian Civil Aviation Authority) guidelines, utilizing licensed commercial drone pilots and registered aircraft.'
      }
    ],
    image: imgHeroDrone,
    badge: 'Advanced Tech'
  },
  {
    id: 'access-control',
    slug: 'access-control-systems',
    title: 'Access Control Systems',
    category: 'Surveillance Systems',
    shortDescription: 'Enterprise biometric access control, turnstiles, smart card readers, and automated visitor verification systems.',
    fullDescription: 'Control who enters your corporate facility, server rooms, and executive floors with millisecond precision. SafeNet integrates biometric facial recognition, fingerprint readers, anti-passback turnstiles, and automated vehicle license plate recognition (ANPR) systems with centralized audit logging.',
    problem: 'Unauthorized visitors, badge cloning, tailgating, and unmonitored entries create severe corporate vulnerabilities.',
    solution: 'Frictionless, multi-factor electronic perimeter identity controls with instantaneous lockdown capabilities and automated visitor logs.',
    capabilities: [
      'Touchless facial recognition with anti-spoofing liveness detection',
      'Full-height and optical turnstiles with anti-tailgating sensors',
      'Automated license plate recognition (ANPR) for executive vehicle lanes',
      'Centralized permission scheduling and multi-tenant visitor management'
    ],
    process: [
      'Entry/Exit Point Threat Audit & Flow Modeling',
      'Hardware & Barrier Mechanical Engineering Deployment',
      'Network Integration with HR / Directory Services',
      'Staff Credentialing, System Commissioning & Support'
    ],
    technology: [
      'Suprema & ZKTeco Biometric Platforms',
      'Wiegand & OSDP Encrypted Reader Protocols',
      'Hydraulic Crash-Rated Rising Arm Barriers',
      'Enterprise Cloud Visitor Pre-Registration Portals'
    ],
    benefits: [
      'Elimination of physical key vulnerabilities and unauthorized entry',
      'Verifiable time-stamped attendance and audit logging',
      'Immediate emergency facility lockdown from command console',
      'Streamlined visitor reception without security bottlenecks'
    ],
    suitableIndustries: ['Corporate Organizations', 'Banks & Financial Institutions', 'Residential Estates', 'Hospitality & Leisure'],
    faqs: [
      {
        question: 'Can the system integrate with existing staff biometric clocks?',
        answer: 'Yes, our controllers interface with standard SQL databases, Active Directory, and popular payroll/ERP platforms for seamless single-sign-on and provisioning.'
      }
    ],
    image: imgHeroCommand
  },
  {
    id: 'alarm-systems',
    slug: 'alarm-system-installation',
    title: 'Alarm System Installation',
    category: 'Surveillance Systems',
    shortDescription: 'Perimeter vibration sensors, microwave beams, infrared motion detectors, and integrated duress systems.',
    fullDescription: 'Early warning is the cornerstone of physical defense. SafeNet installs commercial grade intruder alarm systems with dual-path communication (IP and 4G cellular). Our systems instantly alert our rapid response dispatch units the moment a perimeter breach or silent duress button is triggered.',
    problem: 'Late intrusion detection allows trespassers to access critical assets before security guards can intervene.',
    solution: 'Active laser barrier lines and fence-mounted vibration sensors detect breach attempts before intruders set foot inside the compound.',
    capabilities: [
      'Fence-mounted fiber optic vibration sensor cables',
      'Active dual-technology infrared and microwave beam detectors',
      'Silent hold-up and panic duress buttons for executive desks and teller lines',
      'Central monitoring station telemetry with automatic dispatch trigger'
    ],
    process: [
      'Perimeter Weak Point & Infiltration Route Analysis',
      'Multi-Zone Sensor Layout Engineering',
      'Dual-Path Cellular / Fiber Control Panel Installation',
      'Live Response Drill & Sensitivity Calibration'
    ],
    technology: [
      'Texecom & Paradox Commercial Grade Panels',
      'Optex Outdoor Laser Sensors',
      'AES-256 Encrypted RF Panic Transmitters',
      'Automated SMS & Voice Telephony Dialers'
    ],
    benefits: [
      'Instantaneous alerting within 3 seconds of boundary violation',
      'Zero false-alarm algorithms using intelligent dual-technology confirmation',
      'Direct link to SafeNet armed mobile patrol intervention',
      'Audible deterrence sirens and strobe disorientation units'
    ],
    suitableIndustries: ['Banks & Financial Institutions', 'Residential Estates', 'Industrial & Manufacturing', 'Corporate Organizations'],
    faqs: [
      {
        question: 'How do you prevent false alarms triggered by stray animals or wind?',
        answer: 'We deploy dual-tech microwave and passive infrared sensors with digital pet-immunity algorithms that only trigger when an object matches human thermal mass and movement vectors.'
      }
    ],
    image: imgHeroGuards
  },
  {
    id: 'vehicle-tracking',
    slug: 'vehicle-tracking-gps-fleet-management',
    title: 'Vehicle Tracking / GPS Fleet Management',
    category: 'Surveillance Systems',
    shortDescription: 'Satellite and cellular GPS vehicle tracking, fuel monitoring, driver behavior analytics, and remote engine immobilization.',
    fullDescription: 'Protect high-value logistics, executive motorcades, and corporate fleets across Nigeria. SafeNet GPS tracking delivers sub-meter accuracy, real-time geofencing, cargo door tamper detection, and emergency remote vehicle shutdown from our secure command center.',
    problem: 'Cargo hijacking, unauthorized vehicle diversions, fuel theft, and lack of real-time transit visibility in transit corridors.',
    solution: 'Military-grade GPS hardware with anti-jamming protection and continuous 24/7 monitoring by dedicated fleet security controllers.',
    capabilities: [
      'Real-time live location tracking with 5-second ping intervals',
      'Remote engine cut-off and anti-hijack duress protocol',
      'Ultrasonic fuel level monitoring to prevent siphoning',
      'Geofencing alerts when vehicles exit designated transit routes'
    ],
    process: [
      'Covert Hardware Installation in Vehicles',
      'Route Mapping & Safe Corridor Geofence Creation',
      'Command Center Integration & Driver Briefing',
      '24/7 Live Monitoring & Stolen Vehicle Recovery Protocol'
    ],
    technology: [
      'Teltonika Advanced GNSS Modules',
      'Triple-Network Multi-IMSI Roaming SIMs',
      'CAN-bus Diagnostic Telematics Decoders',
      'Satellite Hybrid Modems for Remote Corridor Areas'
    ],
    benefits: [
      '100% visibility over assets moving between Nigerian states',
      'Rapid armed recovery coordination in event of hijacking',
      'Significant reduction in fleet operating costs and unauthorized trips',
      'Emergency driver panic button with immediate audio listen-in'
    ],
    suitableIndustries: ['Corporate Organizations', 'Oil & Gas Facilities', 'Industrial & Manufacturing', 'Financial Institutions'],
    faqs: [
      {
        question: 'Does the tracker work in areas with poor GSM mobile network coverage?',
        answer: 'Yes, our units feature internal non-volatile memory storing up to 100,000 coordinate points that automatically upload once signal returns, and we offer hybrid satellite models for completely off-grid operations.'
      }
    ],
    image: imgHeroGuards
  },

  // Physical Security
  {
    id: 'security-guards',
    slug: 'armed-unarmed-security-guards',
    title: 'Armed & Unarmed Security Guards',
    category: 'Physical Security',
    shortDescription: 'Vetted, rigorously trained, and uniformed Nigerian security personnel deployed for static and access guarding.',
    fullDescription: 'The frontline of defense is human vigilance. SafeNet provides premier static guarding services backed by strict background vetting, criminal record verification, psychological screening, and intensive physical security training modeled after international standards. Supported by armed supervision and mobile supervisors, our guards maintain an immaculate, disciplined presence.',
    problem: 'Poorly vetted, sleepy, or unmotivated guards create a false sense of security and invite breach attempts.',
    solution: 'Dignified, professional, well-compensated, and strictly supervised Nigerian security officers equipped with digital patrol verification batons.',
    capabilities: [
      'Rigorous background vetting including criminal checks and community character verification',
      'UK-standard security training modules: access search, conflict de-escalation, CPR & fire response',
      'Electronic RFID patrol wanding verifying active guard movements every 30 minutes',
      'Armed supervision squads conducting unannounced day and night inspection rounds'
    ],
    process: [
      'Site Risk Assessment & Post Orders Formulation',
      'Guard Selection & Site-Specific Induction Training',
      'Deployment with Complete Uniform, Communications & Safety Gear',
      'Daily Supervision, Shift Briefings & Digital Attendance Verification'
    ],
    technology: [
      'RFID Electronic Guard Tour Verification Wand Systems',
      'Encrypted UHF Digital Two-Way Radios with Repeater Links',
      'Body-Worn Cameras for High-Risk Gate Checks',
      'SafeNet Guard Attendance & Incident Mobile Logging App'
    ],
    benefits: [
      'Authoritative and welcoming corporate representation at your gates',
      'Zero unauthorized entries through strict vehicle and visitor screening',
      'Immediate first-responder capability in medical or fire emergencies',
      'Transparent weekly management reporting on all site occurrences'
    ],
    suitableIndustries: ['Corporate Organizations', 'Residential Estates', 'Banks & Financial Institutions', 'Hospitality & Leisure'],
    faqs: [
      {
        question: 'How do you ensure guards remain alert throughout the night shifts?',
        answer: 'Our guards use RFID patrol wands requiring checkpoints to be scanned at randomized 30-minute intervals. Missing a checkpoint triggers an automated alert at our 24/7 central command center, which immediately contacts the guard and dispatches our mobile patrol supervisor.'
      }
    ],
    image: imgHeroGuards,
    badge: 'Flagship Service'
  },
  {
    id: 'corporate-security',
    slug: 'corporate-security',
    title: 'Corporate Security Management',
    category: 'Physical Security',
    shortDescription: 'Integrated security architecture for high-rise corporate headquarters, multi-tenant office complexes, and embassies.',
    fullDescription: 'Modern corporate headquarters require a delicate balance between welcoming executive hospitality and uncompromising security posture. SafeNet manages full corporate security programs, including executive floor access, front-of-house concierge screening, loading dock controls, and boardroom counter-surveillance.',
    problem: 'Disruptive protests, corporate espionage, unauthorized press entry, and chaotic visitor queues impacting business continuity.',
    solution: 'Elite corporate security officers in tailored business suits equipped with discreet communications and visitor flow technology.',
    capabilities: [
      'Executive suite protection and specialized counter-surveillance sweeps',
      'Loading dock and courier screening with X-ray package scanning',
      'Business continuity and emergency evacuation drill leadership',
      'Corporate intelligence briefing on regional civil disturbances'
    ],
    process: [
      'Corporate Threat & Vulnerability Audit',
      'Tailored Standing Operating Procedures (SOP) Development',
      'Deployment of Uniformed Concierge & Plainclothes Officers',
      'Quarterly Executive Security Review & Drill Coordination'
    ],
    technology: [
      'Concealed Earpiece Digital Comms',
      'X-Ray Baggage & Walk-Through Metal Detectors',
      'Corporate Visitor Management Software',
      'Automated Panic Alarms at Executive Desks'
    ],
    benefits: [
      'Protects corporate reputation and executive privacy',
      'Frictionless experience for high-net-worth clients and board members',
      'Rapid lockdown capability during civil unrest or city protests',
      'Compliance with international corporate governance requirements'
    ],
    suitableIndustries: ['Corporate Organizations', 'Banks & Financial Institutions', 'Hospitality & Leisure'],
    faqs: [
      {
        question: 'Do your corporate officers dress in tactical uniforms or business suits?',
        answer: 'We provide both options depending on client preference: tailored corporate blazers with ties for front-of-house executive environments, or high-visibility tactical uniforms for perimeter and perimeter gate operations.'
      }
    ],
    image: imgHeroGuards
  },
  {
    id: 'residential-security',
    slug: 'residential-security',
    title: 'Residential & Estate Security',
    category: 'Physical Security',
    shortDescription: 'Gated community perimeter protection, resident visitor pass codes, canine patrols, and rapid residential intervention.',
    fullDescription: 'Peace of mind for families in residential estates and private residences. SafeNet delivers complete estate security programs, combining access gate verification via resident WhatsApp OTP codes, armed perimeter patrols, trained guard dogs (K9), and dedicated emergency response vehicles.',
    problem: 'Home invasions, armed robberies, perimeter fence breaches, and unauthorized contractor access in residential communities.',
    solution: 'Multi-layered estate defense system that deters intruders at the gate and provides rapid intervention before properties are breached.',
    capabilities: [
      'Automated resident visitor access code validation at estate gates',
      'Motorcycle and vehicle mobile patrols along internal estate roads',
      'Trained canine (K9) security patrol teams with experienced handlers',
      'Direct resident panic button connection to estate gatehouse and command center'
    ],
    process: [
      'Estate Perimeter & Gate Access Vulnerability Survey',
      'Installation of Electronic Boom Barriers & Visitor Tech',
      'Deployment of Screened Resident Security Officers & K9 Units',
      'Establishment of 24/7 Estate Emergency Hotline'
    ],
    technology: [
      'Estate Resident Access Passcode App',
      'High-Power Solar Perimeter Searchlights',
      'ANPR Vehicle Cameras at Estate Gates',
      'Rapid-Dial Estate Emergency Dispatch Radio'
    ],
    benefits: [
      'Creates a peaceful, secure living environment for families',
      'Eliminates unauthorized hawkers and unscreened contractors',
      'Maintains property values and attractiveness of the estate',
      'Emergency medical and fire first-response capabilities'
    ],
    suitableIndustries: ['Residential Estates', 'Hospitality & Leisure'],
    faqs: [
      {
        question: 'Can you handle estate associations (CDAs) with hundreds of residents?',
        answer: 'Yes, we manage security for major gated estates with over 1,000 residents, providing automated gate software, biometric resident lanes, and dedicated resident liaison managers.'
      }
    ],
    image: imgHeroGuards
  },
  {
    id: 'patrol-services',
    slug: 'patrol-services',
    title: 'Patrol & Rapid Response Services',
    category: 'Physical Security',
    shortDescription: 'Mobile security patrol vehicles providing randomized inspections, property checks, and immediate armed alarm response.',
    fullDescription: 'Fixed guards are only half the equation. SafeNet operates a fleet of high-visibility, GPS-tracked patrol vehicles and motorcycles that conduct randomized day and night drive-by inspections, checking perimeter locks, perimeter walls, and vulnerable access points, ready to converge on any triggered alarm within minutes.',
    problem: 'Isolated properties, warehouses, and branches cannot justify 24/7 manned guards but still face high burglary risks.',
    solution: 'Cost-effective, unpredictable mobile patrols that inspect premises multiple times per night and provide immediate emergency backup.',
    capabilities: [
      'Randomized, verifiable night patrol inspections',
      'Armed rapid intervention units ready for priority dispatch',
      'Keyholding and alarm response verification',
      'First-aid, basic firefighting, and crowd control gear in each vehicle'
    ],
    process: [
      'Client Property Perimeter Tagging & Route Scheduling',
      'Regular Mobile Drive-Bys & Physical Gate Shake Checks',
      'Immediate Dispatch Protocol for Priority Alarm Tripping',
      'Digital Visit Confirmation Logs Sent Daily to Property Owners'
    ],
    technology: [
      'GPS Fleet Telematics Tracking & Geofencing',
      'Vehicle Dashcams & 360 Exterior Surveillance',
      'Direct Voice VHF Radio Link to Police & Command Center',
      'Electronic NFC Tag Check-In System at Client Gates'
    ],
    benefits: [
      'High-visibility deterrence for commercial strips and warehouses',
      'Guaranteed rapid response time to confirmed security emergencies',
      'Significant cost savings compared to permanent 24-hour guard posts',
      'Immediate armed backup for static on-site guards during emergencies'
    ],
    suitableIndustries: ['Commercial Organizations', 'Industrial Facilities', 'Residential Estates', 'Retail Complexes'],
    faqs: [
      {
        question: 'What is your average response time upon an alarm activation?',
        answer: 'In our designated operational zones across Lagos, Abuja, and Port Harcourt, our mobile response teams maintain an average response time of under 10 minutes.'
      }
    ],
    image: imgHeroGuards
  },

  // Executive / Specialist Protection
  {
    id: 'vip-escort',
    slug: 'vip-escort-bodyguard-services',
    title: 'VIP Escort / Bodyguard Services',
    category: 'Executive / Specialist Protection',
    shortDescription: 'Discreet close protection officers, armored vehicle convoys, and armed police escort coordination for executives and dignitaries.',
    fullDescription: 'In high-risk transit environments, executive safety cannot be left to chance. SafeNet provides internationally certified Close Protection Officers (CPOs) supported by advance reconnaissance teams, tactical evasive drivers, armored B6/B7 luxury SUVs, and official Nigerian Police escort coordination for seamless travel across Nigeria.',
    problem: 'Kidnapping for ransom, highway ambush, targeted harassment, and violent crime targeting high-net-worth individuals and corporate leadership.',
    solution: 'Meticulously planned, discreet executive protection details that identify and neutralize threats before they can materialize.',
    capabilities: [
      'Certified Close Protection Officers trained in UK defensive tactics',
      'B6/B7 Armored SUVs (Toyota Land Cruiser, Lexus LX600) with run-flat tires',
      'Official liaison with government security agencies and armed escort units',
      'Airport tarmac meet-and-greet with expedited VIP customs clearance'
    ],
    process: [
      'Threat Profile Analysis & Itinerary Intelligence Assessment',
      'Advance Route Reconnaissance & Safe Haven Identification',
      'Convoy Briefing, Communications Check & Armored Vehicle Staging',
      'Active Escort Execution with 24/7 Command Center Satellite Tracking'
    ],
    technology: [
      'Satellite Push-to-Talk (PTT) Emergency Communications',
      'Real-Time GPS Convoy Telematics with Duress Beacon',
      'Tactical Evasive Driving Telemetry',
      'Concealed Body Armor and Trauma Medical Kits'
    ],
    benefits: [
      'Total peace of mind during travel between airports, offices, and project sites',
      'Zero incident track record through meticulous advance planning and deterrence',
      'Flawless professional etiquette suitable for multinational C-suite executives',
      'Comprehensive crisis contingency planning for medical emergencies'
    ],
    suitableIndustries: ['Corporate Organizations', 'Oil & Gas Facilities', 'Financial Institutions'],
    faqs: [
      {
        question: 'Can you provide armored vehicles for short visits to Lagos and the Niger Delta?',
        answer: 'Yes, we maintain a fleet of B6 and B7 armored SUVs with certified security drivers available for day rentals, airport transfers, or multi-week inter-state operational tours.'
      }
    ],
    image: imgHeroGuards,
    badge: 'Specialist'
  },
  {
    id: 'maritime-security',
    slug: 'maritime-security',
    title: 'Maritime Security',
    category: 'Executive / Specialist Protection',
    shortDescription: 'Offshore platform defense, port facility security, escort patrol vessels, and counter-piracy operations in Nigerian waters.',
    fullDescription: 'SafeNet operates in full compliance with the International Ship and Port Facility Security (ISPS) Code, providing comprehensive maritime protection for offshore oil and gas assets, commercial tankers, anchorages, and private jetties. Our maritime security specialists work in close coordination with the Nigerian Navy and NIMASA.',
    problem: 'Maritime piracy, armed boarding, illegal bunkering, and sea robbery in coastal waterways and offshore terminals.',
    solution: 'Dedicated patrol vessels, armed maritime security personnel, and radar-linked perimeter tracking safeguarding marine infrastructure.',
    capabilities: [
      'ISPS Code compliance audits and port facility security plans',
      'Armored maritime security escort boats equipped with heavy marine radar',
      'Anti-boarding wire, razor barriers, and water cannon defense installations',
      'Secure anchorage and ship-to-ship (STS) transfer security management'
    ],
    process: [
      'Vessel & Port Vulnerability Assessment under ISPS Code',
      'Escort Vessel Coordination with Nigerian Naval Authorities',
      'Onboard Security Team Briefing & Anti-Piracy Drills',
      'Active Escort Passage Tracking from Offshore Command Desk'
    ],
    technology: [
      'Marine Radar with Automatic Radar Plotting Aid (ARPA)',
      'Satellite AIS Vessel Tracking Integration',
      'Night-Vision Marine Searchlights & Thermal Binoculars',
      'Encrypted Marine VHF & Inmarsat-C Satellite Links'
    ],
    benefits: [
      'Safe transit through high-risk maritime corridors and coastal straits',
      'Protection of multi-million dollar offshore production platforms and barges',
      'Compliance with international marine insurance risk mitigation criteria',
      'Rapid armed naval response integration in the event of vessel pursuit'
    ],
    suitableIndustries: ['Maritime & Ports', 'Oil & Gas Facilities'],
    faqs: [
      {
        question: 'Do you operate in compliance with Nigerian Naval directives?',
        answer: 'Yes, all our maritime escort operations and vessel protection deployments are executed in strict coordination and Memorandum of Understanding (MOU) with the Nigerian Navy and maritime regulators.'
      }
    ],
    image: imgHeroMaritime,
    badge: 'Offshore Tier-1'
  },
  {
    id: 'pipeline-surveillance',
    slug: 'pipeline-surveillance-security',
    title: 'Pipeline Surveillance Security',
    category: 'Executive / Specialist Protection',
    shortDescription: 'Fiber-optic intrusion sensing, continuous drone surveillance, and community-integrated patrols for oil & gas trunklines.',
    fullDescription: 'Pipeline vandalism and crude oil theft cause catastrophic financial and environmental destruction. SafeNet deploys a battle-tested combination of Distributed Acoustic Sensing (DAS) fiber optics, long-endurance surveillance drones, and community-partnered surveillance personnel to safeguard hundreds of kilometers of energy infrastructure.',
    problem: 'Crude oil theft, illegal bunkering valves, pipeline dynamiting, and sabotage across remote and marshy terrain.',
    solution: 'Real-time acoustic ground vibration detection combined with rapid thermal drone verification and armed tactical intervention teams.',
    capabilities: [
      'Fiber-optic acoustic monitoring detecting excavation or drilling within meters',
      'Long-range fixed-wing and VTOL surveillance drone sweeps with thermal optics',
      'Trained Nigerian terrain-specialist patrol officers embedded along right-of-ways',
      'Integrated joint task force liaison for immediate hot-tap interdiction'
    ],
    process: [
      'Pipeline Right-of-Way (ROW) Threat & Terrain Mapping',
      'Acoustic Fiber Sensor Calibration & Alert Threshold Modeling',
      'Daily Aerial Drone Reconnaissance Flight Operations',
      'Continuous Command Center Monitoring & Immediate Intervention Dispatch'
    ],
    technology: [
      'Optasense / Fotech Distributed Acoustic Sensing (DAS)',
      'Long-Endurance VTOL Drones with 90-minute Flight Times',
      'Satellite Geo-referenced Alert Telemetry',
      'Rugged All-Terrain Vehicles (ATVs) & Marsh Patrol Boats'
    ],
    benefits: [
      'Drastic reduction in crude oil loss and illegal bunkering points',
      'Early detection of hot-tapping attempts before the pipe is breached',
      'Prevention of catastrophic environmental oil spills and community liability',
      'Verifiable digital compliance data for oil company regulators and investors'
    ],
    suitableIndustries: ['Oil & Gas Facilities', 'Critical Infrastructure'],
    faqs: [
      {
        question: 'How do you handle hostile terrain like the Niger Delta mangrove swamps?',
        answer: 'We utilize specialized shallow-draft marsh boats, amphibious ATVs, and long-range thermal drones that monitor pipeline corridors from 500 meters altitude without requiring direct human foot patrols in hazardous swamps.'
      }
    ],
    image: imgHeroDrone,
    badge: 'Critical Infrastructure'
  },
  {
    id: 'airport-security',
    slug: 'airport-security',
    title: 'Airport Security & Tarmac Logistics',
    category: 'Executive / Specialist Protection',
    shortDescription: 'VIP tarmac passenger escort, baggage security screening, private hangar guarding, and expedited customs processing.',
    fullDescription: 'SafeNet coordinates VIP aviation security at major Nigerian international and domestic airports (LOS, ABV, PHC). We provide private jet ramp escort, passenger baggage verification, secure airside transfer, and continuous guarding for chartered aircraft parked at general aviation terminals.',
    problem: 'Luggage pilferage, chaos in public arrival terminals, unvetted private airport drivers, and security risks during ground transit.',
    solution: 'Seamless airside-to-conveyance executive security protocol that moves executives directly from the aircraft stairs into awaiting armored vehicles.',
    capabilities: [
      'Authorized airside tarmac access and diplomatic escort liaison',
      'Guaranteed secure baggage chain-of-custody from aircraft cargo hold',
      '24/7 private jet and corporate hangar perimeter protection',
      'Dedicated aviation security officers with international ICAO training'
    ],
    process: [
      'Flight Itinerary & Flight Manifest Security Clearance',
      'Airside Vehicle Positioning & Security Advance Check',
      'Passenger Aircraft Meet & Greet with Priority Baggage Retrieval',
      'Secure Direct Departure into Motorcade with Immediate Highway Escort'
    ],
    technology: [
      'Handheld X-Ray & Explosive Trace Detectors (ETD)',
      'Airside Encrypted Aviation Radios',
      'Secure Electronic Manifest Verification',
      'Armored Motorcade Positioning Coordination'
    ],
    benefits: [
      'Eliminates public terminal crowds and potential harassment',
      'Zero baggage loss or tampering',
      'Frictionless transit for foreign investors and board directors',
      'Guarantees immediate security envelope from touchdown to hotel'
    ],
    suitableIndustries: ['Corporate Organizations', 'Aviation & Logistics', 'Financial Institutions'],
    faqs: [
      {
        question: 'Can you assist international executives landing at Murtala Muhammed International Airport (MMIA)?',
        answer: 'Yes, our team meets the executive directly at the aircraft bridge or VIP protocol lounge, manages luggage collection, and escorts them directly to our armored vehicle convoy.'
      }
    ],
    image: imgHeroGuards
  },

  // Security Consulting
  {
    id: 'security-consulting',
    slug: 'security-consulting',
    title: 'Security Consulting & Threat Audits',
    category: 'Security Consulting',
    shortDescription: 'Independent security master planning, threat modeling, vulnerability audits, and corporate policy development.',
    fullDescription: 'Before buying cameras or hiring guards, organizations need clear strategic security direction. SafeNet provides independent, UK-certified security consultants who evaluate your facilities against international risk standards, identifying hidden vulnerabilities and designing cost-effective, multi-layered security master plans.',
    problem: 'Spending millions of Naira on disjointed security gadgets that fail to stop sophisticated criminal incursions.',
    solution: 'Systematic, objective threat assessments and actionable security master plans that optimize security budgets and eliminate vulnerabilities.',
    capabilities: [
      'Comprehensive Physical Security Vulnerability Assessments (PSVA)',
      'Security Master Planning for new facility architectural designs',
      'Crisis management, kidnapping response, and business continuity plans',
      'Boardroom security threat briefings and executive advisory'
    ],
    process: [
      'Initial Threat Context & Crime Statistics Benchmarking',
      'On-Site Physical Inspection & Penetration Testing',
      'Risk Matrix Formulation & Quantitative Vulnerability Scoring',
      'Presentation of Executive Master Plan with Prioritized Action Steps'
    ],
    technology: [
      'Digital 3D Facility Security Modeling',
      'Quantitative Risk Scoring Matrix Software',
      'Penetration Testing Diagnostic Tools',
      'Regulatory Compliance Benchmarking Frameworks'
    ],
    benefits: [
      'Optimizes security expenditures by eliminating redundant, ineffective measures',
      'Provides defensible audit records for insurance companies and boards',
      'Uncovers critical vulnerabilities before adversaries can exploit them',
      'Aligns corporate security posture with international best practices'
    ],
    suitableIndustries: ['Corporate Organizations', 'Banks & Financial Institutions', 'Oil & Gas Facilities', 'Critical Infrastructure'],
    faqs: [
      {
        question: 'Will you recommend only your own guard and technology services?',
        answer: 'No. Our consulting division operates with strict professional objectivity. We provide vendor-neutral recommendations that can be tendered openly or executed with your preferred partners.'
      }
    ],
    image: imgHeroCommand,
    badge: 'Strategic Advisory'
  },
  {
    id: 'risk-assessment',
    slug: 'risk-assessment',
    title: 'Risk Assessment & Advisory',
    category: 'Security Consulting',
    shortDescription: 'In-depth geopolitical, regional, and facility threat assessments for investments and expansions across Nigeria.',
    fullDescription: 'Nigeria is a dynamic operating environment where security conditions vary drastically between states and local government areas. SafeNet provides intelligence-led risk assessments for organizations setting up new factories, logistics routes, or remote facilities, evaluating civil unrest, kidnapping risks, and community relations.',
    problem: 'Entering new Nigerian markets without accurate, real-time ground security intelligence leads to costly project halts and extortion.',
    solution: 'Actionable, data-backed security intelligence reports prepared by veteran Nigerian security analysts and UK risk advisors.',
    capabilities: [
      'Site selection security feasibility studies',
      'Travel security advisory and route vulnerability mapping',
      'Host community liaison and local stakeholder risk assessments',
      'Kidnapping and extortion risk mitigation strategies'
    ],
    process: [
      'Stakeholder Interviews & Ground Intelligence Gathering',
      'Incident History & Geopolitical Trend Analysis',
      'Risk Categorization (Likelihood vs Impact)',
      'Delivery of Actionable Advisory Briefing & Contingency Roadmaps'
    ],
    technology: [
      'Geospatial Incident Mapping Software',
      'Real-Time Nigerian Security Incident Tracker',
      'Community Sentiment & Early-Warning Monitoring Tools',
      'Encrypted Intelligence Briefing Portal'
    ],
    benefits: [
      'Protects capital investments from unforeseen security shutdowns',
      'Fosters peaceful, proactive relationships with host communities',
      'Equips project directors with real-time situational awareness',
      'Enables proactive risk mitigation rather than expensive reactive fixes'
    ],
    suitableIndustries: ['Oil & Gas Facilities', 'Industrial & Manufacturing', 'Banks & Financial Institutions'],
    faqs: [
      {
        question: 'How quickly can you produce a regional risk assessment report?',
        answer: 'Standard operational risk assessments are delivered within 5 to 7 business days, with rapid 48-hour turnarounds available for urgent travel or acquisition decisions.'
      }
    ],
    image: imgHeroCommand
  },
  {
    id: 'security-training',
    slug: 'advanced-specialist-security-training',
    title: 'Advanced & Specialist Security Training',
    category: 'Security Consulting',
    shortDescription: 'Accredited training programs for in-house security teams, corporate drivers, executive staff, and control-room operators.',
    fullDescription: 'Equipment is only as effective as the humans operating it. SafeNet delivers high-impact training academies covering counter-surveillance, defensive driving, hostile environment awareness (HEAT), CCTV video analytics operation, and emergency trauma first-aid, transforming in-house personnel into elite security assets.',
    problem: 'Untrained security staff panic during crises, miss critical warning signs, and fail to operate advanced equipment correctly.',
    solution: 'Realistic, scenario-based practical training that instills muscle memory, discipline, and confident tactical decision-making.',
    capabilities: [
      'Hostile Environment Awareness Training (HEAT) for expatriates & travelers',
      'Defensive and evasive tactical driving academies for executive drivers',
      'Control-room operator certification for CCTV, alarms, and incident escalation',
      'First-aid, CPR, and trauma stop-the-bleed certification'
    ],
    process: [
      'Training Needs Analysis & Skill Baseline Assessment',
      'Curriculum Customization for Corporate Environment',
      'Interactive Classroom & Hands-On Tactical Drill Execution',
      'Competency Testing, Certification & Refresher Scheduling'
    ],
    technology: [
      'Skid-Pan Tactical Driving Training Facilities',
      'Simulated CCTV Control Room Training Simulator',
      'Trauma First-Aid Simulation Manikins & Real-Life Scenario Drills',
      'Digital LMS Tracking Student Performance & Re-qualification'
    ],
    benefits: [
      'Empowers employees to react calmly and decisively during emergencies',
      'Transforms corporate drivers into first-line counter-surveillance assets',
      'Dramatically improves incident detection rates in control rooms',
      'Meets corporate health, safety, and regulatory compliance standards'
    ],
    suitableIndustries: ['Corporate Organizations', 'Banks & Financial Institutions', 'Oil & Gas Facilities'],
    faqs: [
      {
        question: 'Can you train our company drivers at our own facility?',
        answer: 'Yes, we conduct both on-site driving assessments at your headquarters and practical evasive maneuvers at our dedicated closed-circuit training tracks.'
      }
    ],
    image: imgHeroGuards
  },
  {
    id: 'security-equipment',
    slug: 'security-equipment-gadgets',
    title: 'Security Equipment & Gadgets',
    category: 'Security Consulting',
    shortDescription: 'Direct procurement and maintenance of walk-through scanners, X-ray machines, body-worn cameras, and tactical perimeter gear.',
    fullDescription: 'SafeNet is a certified distributor and integrator of international security equipment brands. We supply, calibrate, install, and maintain commercial metal detectors, under-vehicle inspection mirrors, acoustic blast barriers, two-way radio networks, and surveillance gear backed by local manufacturer warranties.',
    problem: 'Cheap grey-market security equipment breaks down quickly with no local spare parts or technician support in Nigeria.',
    solution: 'Enterprise-grade, warranty-backed security hardware directly installed and maintained by factory-trained SafeNet engineers.',
    capabilities: [
      'Walk-through metal detection portals and multi-zone handheld wands',
      'Under-Vehicle Surveillance Systems (UVSS) with automated snapshot capture',
      'Digital VHF/UHF repeater networks with wide-area coverage',
      'Tactical lighting, body armor, and anti-riot protective equipment'
    ],
    process: [
      'Equipment Needs Audit & Architectural Integration Check',
      'Direct Procurement with Manufacturer Warranties',
      'Professional Installation, Calibration & Stress Testing',
      'Scheduled Preventive Maintenance Contracts & Fast Spare Parts Replacement'
    ],
    technology: [
      'Garrett & CEIA High-Sensitivity Metal Detectors',
      'Motorola Mototrbo Digital Two-Way Radios',
      'Automated Color UVSS Cameras with License Plate Matching',
      'Level IIIA / IV Certified Lightweight Ceramic Body Armor'
    ],
    benefits: [
      '100% genuine equipment with verified manufacturer warranties',
      'Zero downtime with our local spare parts inventory in Lagos',
      'Complete operator training included with every installation',
      'Rapid emergency maintenance technician dispatch'
    ],
    suitableIndustries: ['Corporate Organizations', 'Banks & Financial Institutions', 'Hospitality & Leisure', 'Residential Estates'],
    faqs: [
      {
        question: 'Do you offer annual maintenance contracts (AMC) for existing security gear?',
        answer: 'Yes, our engineering team provides comprehensive quarterly maintenance, calibration, and emergency repair service contracts for all major security equipment brands.'
      }
    ],
    image: imgHeroCommand
  }
];

export const initialIndustries: Industry[] = [
  {
    id: 'corporate',
    slug: 'corporate',
    name: 'Corporate Organizations',
    tagline: 'Defending Corporate Headquarters & Multi-Tenant Commercial Towers',
    threat: 'Corporate espionage, unauthorized access, protests, workplace violence, and confidential data breaches.',
    risk: 'Loss of intellectual property, danger to executive personnel, reputational harm, and regulatory non-compliance.',
    solution: 'Layered defense combining suited front-of-house security concierges, biometric access turnstiles, board-level counter-surveillance, and 24/7 CCTV surveillance.',
    technology: ['Touchless Facial Recognition', 'Visitor Management Portals', 'Centralized VMS CCTV', 'Under-Vehicle Inspection'],
    personnel: 'Immaculately trained corporate security officers in business attire with conflict de-escalation expertise.',
    response: 'Discreet on-site supervisor response within 60 seconds and dedicated mobile armed backup units.',
    iconName: 'Building2',
    description: 'Protecting top Nigerian and multinational corporate headquarters with sophisticated, hospitable security protocols.'
  },
  {
    id: 'financial',
    slug: 'financial-institutions',
    name: 'Banks & Financial Institutions',
    tagline: 'High-Sec Protection for Cash Depots, Branches & Data Centers',
    threat: 'Armed robbery, ATM attacks, bullion van hijacking, teller coercion, and cyber-physical breaches.',
    risk: 'Catastrophic capital loss, threat to employee lives, regulatory penalties from the Central Bank of Nigeria (CBN), and loss of depositor trust.',
    solution: 'Bank-grade bullet-resistant access mantrap cubicles, monitored time-delay vaults, seismic vibration sensors, and armed rapid escort.',
    technology: ['Bulletproof Interlocking Mantraps', 'Seismic Vault Vibration Alarms', 'High-Speed Dome IP Surveillance', 'GPS Bullion Tracking'],
    personnel: 'Rigorously vetted, armed and unarmed bank security officers trained in hostile ambush countermeasures.',
    response: 'Immediate silent duress alarm escalation connecting to SafeNet mobile armed squads and state police commands.',
    iconName: 'Landmark',
    description: 'Uncompromising security architecture designed specifically to exceed Central Bank of Nigeria security mandates.'
  },
  {
    id: 'residential',
    slug: 'residential-estates',
    name: 'Residential Estates',
    tagline: 'Total Tranquility & Family Protection for Gated Communities',
    threat: 'Armed home invasions, opportunist burglaries, unauthorized trespassers, and rogue contractors.',
    risk: 'Physical danger to residents and families, vehicle theft, plummeting property values, and estate insecurity.',
    solution: 'Full gated perimeter security with solar searchlights, automated visitor entry verification, trained K9 dog patrols, and mobile estate vehicles.',
    technology: ['Automated Gate Boom Barriers', 'Resident Visitor Access App', 'Thermal Fence Intrusion Cameras', 'Rapid Resident Panic Beacons'],
    personnel: 'Courteous, vigilant estate guards skilled in customer service, access screening, and first-aid emergency care.',
    response: 'Estate-based mobile patrol intervention arriving at any resident door within 3 minutes of distress call.',
    iconName: 'Home',
    description: 'Transforming luxury residential developments into impregnable, tranquil sanctuaries for families.'
  },
  {
    id: 'oil-and-gas',
    slug: 'oil-and-gas',
    name: 'Oil & Gas Facilities',
    tagline: 'Critical Infrastructure & Remote Pipeline Defense',
    threat: 'Crude oil theft, illegal bunkering taps, sabotage of flow stations, kidnapping of engineers, and facility blockades.',
    risk: 'Billions of Naira in crude loss, environmental devastation, heavy production shutdown penalties, and severe danger to human life.',
    solution: 'Long-range thermal drone surveillance, fiber-optic acoustic ground sensors along pipelines, armored river gunboat escorts, and joint security liaison.',
    technology: ['Distributed Acoustic Fiber Sensing', 'Autonomous Patrol Drones', 'Marine Radar Night Scopes', 'Encrypted Satellite Comms'],
    personnel: 'Specialist hostile-environment security officers with extensive tactical experience across Niger Delta terrain.',
    response: 'Airborne drone tracking guiding rapid amphibious and land-based tactical intervention squads.',
    iconName: 'Flame',
    description: 'Hardened security operations safeguarding Nigeria\'s most vital energy extraction and processing corridors.'
  },
  {
    id: 'maritime',
    slug: 'maritime',
    name: 'Maritime & Ports',
    tagline: 'Offshore Vessel Escort, Terminals & Port Facility Security',
    threat: 'Piracy, armed sea robbery, hostage taking, stowaways, and port cargo pilferage.',
    risk: 'Surging marine insurance war-risk premiums, supply chain paralysis, loss of vessel crew, and international shipping sanctions.',
    solution: 'ISPS-compliant port terminal access control, heavily equipped naval escort patrol boats, vessel hardening, and 24/7 radar tracking.',
    technology: ['Long-Range Coastal Radar (ARPA)', 'Satellite AIS Tracking', 'Anti-Boarding Water Cannons', 'Night-Vision Marine Spotlights'],
    personnel: 'Certified maritime security operators working hand-in-hand with Nigerian Navy detachments.',
    response: 'Coordinated naval interception vessel deployment within maritime territorial waters.',
    iconName: 'Ship',
    description: 'Securing international deep-sea terminals, jetties, and coastal navigation channels.'
  },
  {
    id: 'industrial',
    slug: 'industrial',
    name: 'Industrial & Manufacturing',
    tagline: 'Factory Perimeter Defense, Raw Material & Supply Chain Integrity',
    threat: 'Internal inventory theft, organized warehouse raiding, unauthorized labor strikes, and machinery sabotage.',
    risk: 'Critical manufacturing downtime, stolen inventory, broken delivery contracts, and worker safety breaches.',
    solution: 'Strict loading bay gate controls, weighbridge CCTV verification, perimeter intrusion beams, and random employee security screenings.',
    technology: ['ANPR Weighbridge Cameras', 'Active Perimeter Laser Beams', 'Forklift Fleet Telematics', 'AI Blind-Spot Motion Alerts'],
    personnel: 'Experienced industrial security supervisors conducting rigorous vehicle inspections and shift audits.',
    response: 'Automated warehouse zone lockdown and rapid guard reinforcement within 90 seconds.',
    iconName: 'Factory',
    description: 'Protecting manufacturing plants, consumer goods factories, and logistics complexes across Nigeria.'
  },
  {
    id: 'hospitality',
    slug: 'hospitality',
    name: 'Hospitality & Leisure',
    tagline: 'Warm Guest Welcome Coupled with Unobtrusive Security',
    threat: 'Terrorist reconnaissance, guest room thefts, disorderly conduct, unauthorized media, and VIP stalking.',
    risk: 'Guest harm, devastating social media fallout, luxury hotel brand devaluation, and liability claims.',
    solution: 'Discreet plainclothes security floor wardens, walk-through guest metal detectors designed to blend into luxury decor, and CCTV coverage.',
    technology: ['Architectural Hidden Metal Scanners', 'Discreet Guest Room Floor Access Controls', 'Covert Radio Comms', 'Panic Triggers in Suites'],
    personnel: 'Polite, refined security hosts trained in luxury hospitality etiquette and crisis diplomacy.',
    response: 'Calm, silent de-escalation and immediate guest protective isolation.',
    iconName: 'Utensils',
    description: 'Ensuring 5-star hotels, luxury resorts, and event centres maintain safe, tranquil environments for international guests.'
  },
  {
    id: 'critical-infrastructure',
    slug: 'critical-infrastructure',
    name: 'Critical Infrastructure',
    tagline: 'Power Grids, Telecom Towers & Water Treatment Plants',
    threat: 'Copper cable theft, generator fuel siphoning, transmitter sabotage, and coordinated physical attacks.',
    risk: 'Widespread power and telecommunication blackouts, essential service collapse, and immense economic disruption.',
    solution: 'Solar-powered remote CCTV poles with satellite links, anti-cut fencing, seismic sensors, and rapid armed motorbike patrol units.',
    technology: ['Off-Grid Solar Surveillance Hubs', 'Ultrasonic Fuel Tank Monitors', 'Vibration Cut-Alarm Fences', 'Drone Geo-Patrols'],
    personnel: 'Dedicated remote-site guarding teams supported by randomized armed mobile patrols.',
    response: 'Immediate dispatch of armed motorcycle squads capable of navigating rugged off-road terrain.',
    iconName: 'Zap',
    description: 'Defending the national backbone of telecommunications, power substations, and public utilities.'
  }
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    slug: 'victoria-island-financial-tower',
    title: 'Victoria Island 18-Storey Corporate Headquarters Defense',
    industry: 'Corporate Organizations',
    location: 'Victoria Island, Lagos',
    services: ['Armed & Unarmed Security Guards', 'Access Control Systems', 'CCTV Installation & Monitoring'],
    image: imgHeroGuards,
    description: 'Complete security transformation for a leading financial tower housing over 2,200 occupants daily. Replaced outdated mechanical turnstiles with touchless biometric facial recognition, deployed 48 suited corporate security guards, and upgraded 160 IP cameras linked to an on-site command room.',
    scope: 'Turnkey security master planning, architectural turnstiles, 160 AI IP cameras, 48 uniformed security officers, and 24/7 command operations.',
    technology: ['Suprema Facial Recognition Turnstiles', 'Milestone Enterprise VMS', 'Garrett Walk-Through Detectors'],
    deployment: '48 corporate security officers, 4 supervisors, and 2 command-room operators on rotating 12-hour shifts.',
    results: [
      'Zero unauthorized entries over 18 months of continuous operations',
      'Average visitor check-in time reduced from 4.5 minutes to under 20 seconds',
      '100% video retention uptime with zero recording loss'
    ],
    date: 'Completed 2025'
  },
  {
    id: 'proj-2',
    slug: 'lekki-coastal-gated-estate',
    title: 'Integrated Perimeter Defense & Drone Patrols for Lekki Estate',
    industry: 'Residential Estates',
    location: 'Lekki Phase 1, Lagos',
    services: ['Drone Surveillance Security', 'Residential & Estate Security', 'CCTV Installation & Monitoring'],
    image: imgHeroDrone,
    description: 'Securing an expansive 45-hectare coastal residential community comprising over 350 luxury villas. Deployed a hybrid security model featuring automated resident gate apps, thermal perimeter tripwires along the waterfront, and scheduled night drone reconnaissance flights.',
    scope: '4.2 km perimeter fence fortification, 2 automated entry gatehouses, K9 patrol teams, and autonomous night drone patrols.',
    technology: ['DJI Enterprise Thermal Drone', 'Resident WhatsApp Access Gate System', 'Solar Perimeter Searchlights'],
    deployment: '24 static gate and patrol guards, 2 K9 handlers, and 1 certified drone pilot.',
    results: [
      'Eliminated unauthorized waterfront perimeter trespass incidents entirely',
      '100% positive resident satisfaction rating in annual security audit',
      'Fast-track gate entry for pre-registered resident visitors'
    ],
    date: 'Ongoing Deployment'
  },
  {
    id: 'proj-3',
    slug: 'escravos-offshore-terminal-escort',
    title: 'Offshore Energy Terminal Security & Waterway Convoy Escort',
    industry: 'Maritime & Ports',
    location: 'Escravos Offshore Terminal, Delta State',
    services: ['Maritime Security', 'VIP Escort / Bodyguard Services', 'Pipeline Surveillance Security'],
    image: imgHeroMaritime,
    description: 'Providing round-the-clock armed patrol vessel escort and perimeter exclusion zone enforcement for an international energy consortium’s offshore storage barge and coastal supply shuttles.',
    scope: 'Armed patrol boat deployments, 24/7 marine radar tracking, and coordination with the Nigerian Navy Escravos Forward Operating Base.',
    technology: ['Furuno Commercial Marine Radar', 'Satellite AIS Vessel Tracking', 'Encrypted Naval Radio Links'],
    deployment: '2 heavy patrol boats, 12 maritime security specialists, and naval tactical detachments.',
    results: [
      'Over 240,000 nautical miles safely patrolled without a single pirate boarding attempt',
      'Guaranteed safe crew transfers between shore and offshore production platforms',
      'Full compliance with ISPS international port and vessel security mandates'
    ],
    date: 'Operational Active'
  }
];

export const initialCaseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    slug: 'multinational-bank-atm-perimeter-defense',
    title: 'Mitigating Physical Threats Across 42 Commercial Bank Branches',
    industry: 'Banks & Financial Institutions',
    location: 'Lagos & South-West Nigeria',
    challenge: 'A prominent commercial bank faced rising night-time ATM tampering attempts and inconsistent guard vigilance across dispersed suburban branches.',
    riskAssessment: 'SafeNet security engineers identified high vulnerability windows between 01:00 and 04:30 AM, delayed alarm verification by local police, and uncoordinated branch alarm hardware.',
    securityStrategy: 'Designed an integrated Central Monitoring Station architecture connecting all 42 branches via redundant 4G/fiber uplinks, installing seismic vault sensors, and staging 6 dedicated SafeNet mobile response patrol cars in key clusters.',
    deployment: 'Installed standardized IP video encoders, dual-technology motion sensors, and panic alarms, backed by 84 vetted static guards and 6 rapid patrol vehicles.',
    technology: ['Hikvision DeepinMind Video Analytics', 'Texecom Dual-Path Cellular Alarms', 'Central GPS Dispatch Telematics'],
    monitoring: '24/7 centralized monitoring with automated tripwire verification dispatching the nearest mobile unit within 45 seconds of breach.',
    outcome: 'Thwarted 4 separate intrusion and ATM tampering attempts within the first 6 months. Average mobile intervention arrival time dropped to 8.4 minutes.',
    metric: '92% Reduction in Branch Security Incidents'
  },
  {
    id: 'case-2',
    slug: 'niger-delta-energy-corridor-pipeline-protection',
    title: 'Securing an 85km Crude Pipeline Right-of-Way Against Illegal Taps',
    industry: 'Oil & Gas Facilities',
    location: 'Rivers State, Nigeria',
    challenge: 'A major oil exploration client was losing an estimated 8,000 barrels per day to sophisticated illegal bunkering taps concealed beneath marshland along their trunkline.',
    riskAssessment: 'Traditional foot patrols were compromised by challenging swamp terrain, hostile local armed gangs, and lack of real-time detection when hot-tapping occurred under tree canopy.',
    securityStrategy: 'Deployed long-endurance autonomous thermal drones conducting randomized day and night sweeps, paired with fiber-optic acoustic ground sensors and community security intelligence.',
    deployment: '3 continuous drone operational hubs, 2 amphibious swamp patrol teams, and joint tactical coordination with maritime security units.',
    technology: ['VTOL Fixed-Wing Long-Endurance Drones', 'OptaSense Fiber Acoustic Sensing', 'Real-Time GIS Hot-Spot Heatmaps'],
    monitoring: 'Live thermal video streaming to SafeNet\'s Port Harcourt regional command center, cross-referenced with ground acoustic alerts.',
    outcome: 'Detected and neutralized 14 illegal bunkering clamps within 60 days. Recovered over 95% of previously lost daily crude throughput.',
    metric: '95% Recovery of Pipeline Crude Throughput'
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'corporate-security-trends-nigeria-2026',
    title: 'Modernizing Corporate Security in Nigeria: From Gatekeeping to Integrated Intelligence',
    excerpt: 'How leading enterprises in Lagos, Abuja, and Port Harcourt are combining UK operational rigor with biometric access control, drone surveillance, and continuous command center monitoring.',
    content: `For decades, corporate security in Nigeria was largely understood as a static numbers game: post guards at the main gate, hand them an attendance notebook, and hope for the best.

However, the threat landscape confronting Nigerian businesses today has evolved dramatically. Organized criminal networks, corporate espionage, civil disruptions, and targeted executive extortion demand a paradigm shift from passive gatekeeping to proactive, technology-driven security intelligence.

### The Limits of Traditional Manned Guarding

While professional, well-trained human guards remain indispensable, relying on human eyes alone across sprawling facilities is inherently flawed. Night fatigue, blind spots around perimeter walls, and lack of immediate coordination during coordinated incursions leave facilities exposed.

SafeNet's operational model addresses this by fusing high-discipline human personnel with autonomous technology. Every guard on our client sites operates as a connected node in a wider security network—equipped with electronic patrol verification wands and direct radio uplinks to our 24/7 central monitoring station.

### The Role of Drone Surveillance in Estate and Industrial Defense

Nowhere is the technological leap more apparent than in drone surveillance. Across large manufacturing plants, residential estates in Lekki, and industrial tank farms, drone reconnaissance provides:
1. **Instant Elevation**: Gaining 360-degree top-down visibility over a 50-hectare facility in less than 90 seconds.
2. **Thermal Penetration**: Detecting human thermal signatures hidden in darkness or dense vegetation where conventional cameras cannot see.
3. **Safe Vectoring**: Directing armed ground units safely to intercept intruders without exposing guards to blind ambushes.

### Building Resilience for 2026 and Beyond

As Nigerian enterprises expand, executive protection, data sovereignty, and physical perimeter hardening must be designed as an integrated ecosystem. Forward-thinking companies are conducting comprehensive security audits, identifying single points of failure, and migrating to unified monitoring.

SafeNet Security Solutions Ltd continues to lead this transformation, proving that with UK-level operational standards and authentic Nigerian local knowledge, corporations can operate with total confidence and unyielding vigilance.`,
    featuredImage: imgHeroCommand,
    author: {
      name: 'Capt. Emmanuel Adeleke (Rtd.)',
      role: 'Head of Operations & Strategic Advisory, SafeNet'
    },
    category: 'Corporate Security',
    tags: ['Corporate Security', 'Drone Surveillance', 'CCTV Monitoring', 'Nigeria Business'],
    publishedAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z',
    readingTime: '5 min read',
    status: 'published',
    seoTitle: 'Corporate Security Trends Nigeria 2026 — SafeNet Security Solutions Ltd',
    seoDescription: 'Discover how modern Nigerian corporations are adopting integrated drone surveillance, biometric access, and 24/7 command operations.',
    relatedServices: ['cctv-installation-monitoring', 'drone-surveillance-security', 'corporate-security'],
    views: 1420
  },
  {
    id: 'blog-2',
    slug: 'drone-surveillance-revolution-industrial-protection',
    title: 'Deploying Autonomous Drone Surveillance: Lessons from Nigerian Energy Facilities',
    excerpt: 'Examining the technical deployment of thermal-equipped UAVs for perimeter security, pipeline inspection, and rapid alert verification in remote terrains.',
    content: `Securing critical infrastructure across remote and challenging Nigerian terrain—from the coastal mangroves of the Niger Delta to the expansive savannahs of the North—presents unique physical challenges.

Ground vehicles are often constrained by bad roads or flooded paths. Human foot patrols move too slowly to intercept fast-moving intruders. Autonomous and piloted drone technology has emerged as the definitive game-changer.

### Thermal Night Vision: The Ultimate Deterrent

Most infiltration and pipeline tapping attempts occur between 00:00 and 04:00 under the cover of pitch darkness. Standard CCTV cameras, even with infrared illuminators, have a limited range of 30 to 50 meters.

By contrast, SafeNet's industrial drone platforms, such as the DJI Matrice 350 RTK equipped with radiometric thermal sensors, detect human body heat from altitudes exceeding 300 meters and distances over 1.5 kilometers. An intruder attempting to breach a boundary fence cannot hide behind trees, water hyacinth, or topography.

### Key Deployment Considerations in Nigeria

Deploying security drones in Nigeria requires careful operational planning:
- **Regulatory Compliance**: Full compliance with NCAA (Nigerian Civil Aviation Authority) flight clearances and designated no-fly zones around airfields.
- **Power Resilience**: Automated weather-proof charging docks and solar battery stations ensuring zero mission downtime.
- **Data Encryption**: AES-256 encrypted digital video streams transmitting directly to our command center to prevent signal interception.

Through disciplined aerial surveillance, energy and logistics operators can turn thousands of unmonitored hectares into an actively defended, transparent security perimeter.`,
    featuredImage: imgHeroDrone,
    author: {
      name: 'Ibrahim Bala',
      role: 'Chief Drone Systems Engineer, SafeNet'
    },
    category: 'Security Technology',
    tags: ['Drone Surveillance', 'Critical Infrastructure', 'Oil & Gas', 'Thermal Imaging'],
    publishedAt: '2026-03-08T11:30:00Z',
    updatedAt: '2026-03-08T11:30:00Z',
    readingTime: '6 min read',
    status: 'published',
    seoTitle: 'Drone Surveillance for Industrial Facilities in Nigeria — SafeNet',
    seoDescription: 'How thermal drone security overcomes terrain challenges to protect industrial and energy corridors across Nigeria.',
    relatedServices: ['drone-surveillance-security', 'pipeline-surveillance-security'],
    views: 980
  },
  {
    id: 'blog-3',
    slug: 'executive-protection-vip-travel-security-lagos',
    title: 'Executive Protection & Secure Transit in Urban Nigeria: A Strategic Guide',
    excerpt: 'Essential protocols for international delegations, C-suite executives, and high-net-worth families navigating travel between airport corridors, hotels, and operational sites.',
    content: `Navigating commercial centers like Lagos, Port Harcourt, and Abuja requires meticulous attention to transit security. While urban Nigeria offers tremendous commercial vitality, transit corridors present inherent vulnerabilities if travel planning is neglected.

### The Fallacy of "Armed Flashing Lights"

A common misconception is that effective executive protection simply means hiring a loud vehicle with sirens and armed men waving guns. In truth, overt aggression often draws unnecessary attention, provokes hostility in heavy traffic, and telegraphs the presence of high-value principals.

True executive protection, as practiced by SafeNet to British and international standards, is built upon **discretion, advance reconnaissance, and predictive intelligence**:

1. **Advance Reconnaissance**: Our advance security officers traverse the intended itinerary hours before the principal departs, identifying choke points, alternative escape routes, nearby verified hospitals, and safe havens.
2. **Low-Profile Armored Vehicles**: B6-rated armored SUVs look indistinguishable from standard luxury vehicles, offering certified protection against high-caliber assault rifle rounds and explosive fragments without announcing vulnerability.
3. **Evasive Tactical Driving**: Certified security drivers trained in vehicle dynamics, anti-ambush evasive maneuvers, and skid recovery ensure the principal is never pinned in gridlock.

### Safe Tarmac Meet-and-Greet Protocols

The initial arrival at the airport is often the most stressful phase for visiting foreign executives. SafeNet’s protocol teams coordinate directly with federal aviation authorities to provide seamless airside greeting, expedited customs processing, and direct transfer into staged armored convoys.

By mitigating transit friction and physical risks, executives can focus entirely on their business objectives, secure in the knowledge that their personal safety is guarded by true professionals.`,
    featuredImage: imgHeroGuards,
    author: {
      name: 'David O. Nwosu',
      role: 'Director of Specialist Protection, SafeNet'
    },
    category: 'Executive Protection',
    tags: ['Executive Protection', 'VIP Transit', 'Armored Vehicles', 'Lagos Security'],
    publishedAt: '2026-02-27T14:15:00Z',
    updatedAt: '2026-02-27T14:15:00Z',
    readingTime: '5 min read',
    status: 'published',
    seoTitle: 'Executive Protection & VIP Travel Security in Lagos — SafeNet',
    seoDescription: 'Strategic guide to VIP travel security, armored motorcades, and close protection in urban Nigeria.',
    relatedServices: ['vip-escort-bodyguard-services', 'airport-security'],
    views: 1210
  }
];

export const initialSocialAccounts: SocialAccount[] = [
  {
    platform: 'facebook',
    displayName: 'Facebook Page',
    handle: 'SafeNet Security Solutions Ltd',
    connected: true,
    tokenExpiry: '2026-09-30T00:00:00Z',
    autoPublish: true,
    lastSyncedAt: '2026-03-27T20:00:00Z'
  },
  {
    platform: 'linkedin',
    displayName: 'LinkedIn Corporate',
    handle: 'SafeNet Security Solutions Ltd',
    connected: true,
    tokenExpiry: '2026-10-15T00:00:00Z',
    autoPublish: true,
    lastSyncedAt: '2026-03-27T20:00:00Z'
  },
  {
    platform: 'x',
    displayName: 'X / Twitter Official',
    handle: '@safenet_sec',
    connected: true,
    tokenExpiry: '2026-11-01T00:00:00Z',
    autoPublish: true,
    lastSyncedAt: '2026-03-27T20:00:00Z'
  },
  {
    platform: 'instagram',
    displayName: 'Instagram Business',
    handle: '@safenetsecurityltd',
    connected: true,
    tokenExpiry: '2026-08-20T00:00:00Z',
    autoPublish: false,
    lastSyncedAt: '2026-03-27T20:00:00Z'
  },
  {
    platform: 'youtube',
    displayName: 'YouTube Channel',
    handle: 'SafeNet Security Solutions',
    connected: false,
    tokenExpiry: '',
    autoPublish: false,
    lastSyncedAt: ''
  }
];

export const initialSocialPublishJobs: SocialPublishJob[] = [
  {
    id: 'job-1',
    postId: 'blog-1',
    postTitle: 'Modernizing Corporate Security in Nigeria: From Gatekeeping to Integrated Intelligence',
    platform: 'facebook',
    status: 'published',
    date: '2026-03-15T09:05:00Z',
    postUrl: 'https://facebook.com/safenetsecurityltd/posts/981247192',
    caption: 'Is your corporate facility still relying on static gatekeeping? Discover how leading Nigerian enterprises in Lagos and Abuja are integrating 24/7 command surveillance, biometric access, and drone reconnaissance for comprehensive protection.',
    hashtags: ['#CorporateSecurity', '#NigeriaBusiness', '#SafeNetSecurity', '#LagosHQ'],
    retryCount: 0,
    idempotencyKey: 'fb-blog-1-20260315',
    utmParams: {
      source: 'facebook',
      medium: 'social',
      campaign: 'blog',
      content: 'corporate-security-trends-nigeria-2026'
    }
  },
  {
    id: 'job-2',
    postId: 'blog-1',
    postTitle: 'Modernizing Corporate Security in Nigeria: From Gatekeeping to Integrated Intelligence',
    platform: 'linkedin',
    status: 'published',
    date: '2026-03-15T09:06:00Z',
    postUrl: 'https://linkedin.com/feed/update/urn:li:activity:71298410294',
    caption: 'Strategic Insight for C-Suite & Risk Leaders: The shift from passive physical guarding to integrated security intelligence in Nigeria. Read our operational analysis on balancing corporate hospitality with unyielding perimeter vigilance.',
    hashtags: ['#SecurityManagement', '#RiskMitigation', '#NigeriaEnterprise', '#SafeNet'],
    retryCount: 0,
    idempotencyKey: 'li-blog-1-20260315',
    utmParams: {
      source: 'linkedin',
      medium: 'social',
      campaign: 'blog',
      content: 'corporate-security-trends-nigeria-2026'
    }
  },
  {
    id: 'job-3',
    postId: 'blog-1',
    postTitle: 'Modernizing Corporate Security in Nigeria: From Gatekeeping to Integrated Intelligence',
    platform: 'x',
    status: 'published',
    date: '2026-03-15T09:07:00Z',
    postUrl: 'https://x.com/safenet_sec/status/178912401924',
    caption: 'Why static guards alone cannot protect modern corporate towers in Nigeria. Read how SafeNet combines UK operational standards with 24/7 CCTV command centers and drone defense: https://safenetsecurityltd.com/blog/corporate-security-trends-nigeria-2026',
    hashtags: ['#CorporateSecurity', '#Lagos', '#DroneSecurity'],
    retryCount: 0,
    idempotencyKey: 'x-blog-1-20260315',
    utmParams: {
      source: 'x',
      medium: 'social',
      campaign: 'blog',
      content: 'corporate-security-trends-nigeria-2026'
    }
  },
  {
    id: 'job-4',
    postId: 'blog-2',
    postTitle: 'Deploying Autonomous Drone Surveillance: Lessons from Nigerian Energy Facilities',
    platform: 'linkedin',
    status: 'published',
    date: '2026-03-08T11:35:00Z',
    postUrl: 'https://linkedin.com/feed/update/urn:li:activity:71298410385',
    caption: 'Thermal Reconnaissance in Remote Corridors: How unmanned aerial systems (UAVs) are helping energy and industrial operators monitor sprawling perimeters in Nigeria with sub-minute alert verification.',
    hashtags: ['#DroneSurveillance', '#OilAndGasSecurity', '#EnergyInfrastructure', '#SafeNet'],
    retryCount: 0,
    idempotencyKey: 'li-blog-2-20260308',
    utmParams: {
      source: 'linkedin',
      medium: 'social',
      campaign: 'blog',
      content: 'drone-surveillance-revolution-industrial-protection'
    }
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'lead-1',
    fullName: 'Chief Babatunde Alabi',
    company: 'Alabi Properties & Investment Group',
    email: 'b.alabi@alabigroup.ng',
    phone: '+234 802 345 6789',
    whatsapp: '+234 802 345 6789',
    location: 'Victoria Island, Lagos',
    industry: 'Corporate Organizations',
    serviceRequired: 'Corporate Security Management & CCTV Installation',
    propertyType: '12-Storey Commercial Tower',
    projectDescription: 'Require 24 armed/unarmed static guards, automated biometric speed gates at reception, and a 64-channel CCTV installation with cloud backup.',
    urgency: 'immediate',
    preferredContact: 'phone',
    status: 'proposal',
    createdAt: '2026-03-24T14:20:00Z',
    estimatedValue: '₦48,000,000 / year',
    notes: [
      {
        id: 'note-1',
        author: 'Lead Manager',
        text: 'Conducted initial site survey on March 25. Chief Alabi was impressed by our command center capabilities. Proposal submitted for review.',
        createdAt: '2026-03-25T16:00:00Z'
      }
    ]
  },
  {
    id: 'lead-2',
    fullName: 'Engr. Folake Adeleke',
    company: 'Pacific Marine & Logistics Ltd',
    email: 'f.adeleke@pacificmarineltd.com',
    phone: '+234 818 901 2345',
    whatsapp: '+234 818 901 2345',
    location: 'Onne Port, Port Harcourt',
    industry: 'Maritime & Ports',
    serviceRequired: 'Maritime Security & Armed Escort Vessels',
    propertyType: 'Offshore Jetty & Supply Vessels',
    projectDescription: 'Need continuous armed maritime security escort for 3 crew supply vessels operating between Port Harcourt and Bonny Island.',
    urgency: '1-2_weeks',
    preferredContact: 'whatsapp',
    status: 'qualified',
    createdAt: '2026-03-26T09:15:00Z',
    estimatedValue: '₦85,000,000 / year',
    notes: [
      {
        id: 'note-2',
        author: 'Specialist Advisory Team',
        text: 'Vessel coordinates and Navy MOU alignment discussed via WhatsApp call. Scheduling technical security audit next Tuesday.',
        createdAt: '2026-03-26T11:30:00Z'
      }
    ]
  },
  {
    id: 'lead-3',
    fullName: 'Dr. Chuka Eze',
    company: 'Harmony Crest Residents Association',
    email: 'chairman@harmonycrestestate.org',
    phone: '+234 803 765 4321',
    whatsapp: '+234 803 765 4321',
    location: 'Lekki Scheme 2, Lagos',
    industry: 'Residential Estates',
    serviceRequired: 'Residential & Estate Security with K9 Patrols',
    propertyType: 'Gated Residential Estate (180 Houses)',
    projectDescription: 'Current security provider has poor attendance. We need 16 disciplined guards, WhatsApp visitor pass system, and night K9 patrols along the perimeter.',
    urgency: 'immediate',
    preferredContact: 'phone',
    status: 'new',
    createdAt: '2026-03-27T10:05:00Z',
    estimatedValue: '₦26,000,000 / year',
    notes: []
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Mr. James Akume',
    position: 'Head of Facility Operations',
    organization: 'Corporate Banking Tower, Victoria Island',
    testimonial: 'SafeNet completely transformed our facility security. Their officers are sharp, well-groomed, and punctually disciplined. The integration of biometric speed gates and 24/7 camera monitoring has eliminated access vulnerabilities while elevating our corporate presentation.',
    rating: 5,
    published: true,
    location: 'Lagos'
  },
  {
    id: 'test-2',
    name: 'Mrs. Patricia Oghene',
    position: 'Chairperson, Security Committee',
    organization: 'Lekki Peninsula Gated Community',
    testimonial: 'Since SafeNet took over our estate security, our residents have slept with total peace of mind. The thermal drone night sweeps and automated visitor pass codes stopped unauthorized entries immediately. Their supervisory responsiveness is exemplary.',
    rating: 5,
    published: true,
    location: 'Lagos'
  },
  {
    id: 'test-3',
    name: 'Mr. Chinedu Okonkwo',
    position: 'Director of Logistics & Terminal Security',
    organization: 'Apex Maritime Services Ltd',
    testimonial: 'In the Niger Delta, reliable maritime security is rare. SafeNet delivers international-grade offshore protection with impeccable naval coordination. Their escort patrol teams have conducted over 60 passages for our vessels without a single security breach.',
    rating: 5,
    published: true,
    location: 'Port Harcourt'
  }
];

export const initialCareerOpenings: CareerOpening[] = [
  {
    id: 'job-1',
    slug: 'corporate-security-officer',
    title: 'Corporate Security Officer (Front of House)',
    department: 'Manned Guarding Operations',
    location: 'Victoria Island / Ikoyi, Lagos',
    employmentType: 'Full-time',
    requirements: [
      'Minimum SSCE / OND qualification with excellent spoken and written English',
      'Minimum height requirement: 5ft 10in (Male) / 5ft 7in (Female)',
      'Clean background check with verifiable community guarantors',
      'Previous military, police, or private security experience is an added advantage'
    ],
    responsibilities: [
      'Maintain authoritative, welcoming access control at corporate client receptions',
      'Conduct electronic visitor registration and baggage screening',
      'Perform hourly digital RFID checkpoint patrols and incident logging',
      'Act as initial first responder during fire alarm or medical evacuation scenarios'
    ],
    active: true
  },
  {
    id: 'job-2',
    slug: 'commercial-drone-surveillance-pilot',
    title: 'Certified Drone Surveillance Pilot',
    department: 'Surveillance & Technology Division',
    location: 'Lagos / Rivers State (Rotational)',
    employmentType: 'Rotational',
    requirements: [
      'Valid NCAA drone remote pilot license (RPL) or equivalent certification',
      'Minimum 200 logged flight hours with industrial enterprise multirotors (DJI Matrice series)',
      'Proficiency in thermal night-flight operations and live video downlink maintenance',
      'Ability to operate in remote industrial and coastal environments on rotational shifts'
    ],
    responsibilities: [
      'Execute pre-programmed and on-demand tactical aerial reconnaissance flights',
      'Monitor live thermal feeds for perimeter fence intrusions or unauthorized movement',
      'Perform pre-flight calibrations, battery management, and preventative maintenance',
      'Coordinate directly with ground security units during active alert responses'
    ],
    active: true
  },
  {
    id: 'job-3',
    slug: 'cctv-command-centre-controller',
    title: 'CCTV Control Room Operator / Dispatcher',
    department: 'Central Monitoring Operations',
    location: 'Command Center, Lagos',
    employmentType: 'Full-time',
    requirements: [
      'Diploma or Degree in Computer Science, Security Studies, or related technical field',
      'Proven experience operating enterprise VMS (Milestone, Hikvision iVMS, Dahua DSS)',
      'Sharp attention to detail and ability to remain hyper-focused during 12-hour shifts',
      'Excellent radio dispatch etiquette and calm composure under high-stress conditions'
    ],
    responsibilities: [
      'Monitor live multi-site CCTV feeds across commercial, banking, and residential clients',
      'Verify perimeter tripwire alarms and dispatch mobile armed patrol units',
      'Log detailed chronological incident reports for police and client management',
      'Conduct daily digital health checks of camera feeds, UPS battery banks, and storage arrays'
    ],
    active: true
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    timestamp: '2026-03-27T18:30:00Z',
    user: 'Super Admin',
    action: 'SYSTEM_INITIALIZATION',
    target: 'SafeNet Security Command Centre',
    details: 'Core security systems, blog CMS, and social distribution channels initialized.',
    ip: '102.89.23.14 (Lagos, Nigeria)'
  },
  {
    id: 'audit-2',
    timestamp: '2026-03-27T19:15:00Z',
    user: 'Operations Officer',
    action: 'LEAD_STATUS_UPDATE',
    target: 'Chief Babatunde Alabi (Lead #1)',
    details: 'Status updated from Qualified to Proposal Sent.',
    ip: '102.89.23.14 (Lagos, Nigeria)'
  },
  {
    id: 'audit-3',
    timestamp: '2026-03-27T20:00:00Z',
    user: 'Content Manager',
    action: 'SOCIAL_QUEUE_SYNC',
    target: 'Social Distribution Worker',
    details: 'Automated publishing queue verified across Facebook, LinkedIn, and X.',
    ip: '102.89.23.14 (Lagos, Nigeria)'
  }
];
