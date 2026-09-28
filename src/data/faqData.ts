export interface SiteFaqItem {
  id: string;
  category: 'general' | 'guarding' | 'surveillance' | 'maritime' | 'executive' | 'compliance';
  categoryLabel: string;
  question: string;
  answer: string;
  relatedServiceSlug?: string;
}

export const COMPREHENSIVE_FAQS: SiteFaqItem[] = [
  // General & Accreditation
  {
    id: 'faq-gen-1',
    category: 'compliance',
    categoryLabel: 'Licensing & Compliance',
    question: 'Is SafeNet Security Solutions Ltd fully licensed to operate private security in Nigeria?',
    answer: 'Yes. SafeNet Security Solutions Ltd is officially licensed under Category A (highest tier) by the Nigeria Security and Civil Defence Corps (NSCDC) under the Private Guard Companies Act. We are also certified under ISO 9001:2015 (Quality Management) and ISO 18788 (Security Operations Management), operating to international British security intelligence standards.',
    relatedServiceSlug: 'armed-unarmed-security-guards'
  },
  {
    id: 'faq-gen-2',
    category: 'general',
    categoryLabel: 'General Operations',
    question: 'Where are SafeNet’s operational headquarters and regional command offices located?',
    answer: 'Our Nigerian Corporate Headquarters and 24/7 Central Command Operations Centre are located in Victoria Island, Lagos, with regional deployment offices and rapid response units across Abuja FCT, Port Harcourt (Trans-Amadi / Onne), and nationwide transit corridors. Our international compliance office is based in London, UK.',
    relatedServiceSlug: 'cctv-installation-monitoring'
  },
  {
    id: 'faq-gen-3',
    category: 'general',
    categoryLabel: 'General Operations',
    question: 'How quickly can SafeNet deploy security personnel or technical systems to a new facility?',
    answer: 'For emergency deployments, our rapid mobilization team can dispatch vetted guards within 24 to 48 hours following an initial threat survey. Full electronic surveillance, perimeter biometric gates, and customized Command Centre telemetry typically deploy within 5 to 10 business days.',
    relatedServiceSlug: 'access-control-systems'
  },

  // Manned Guarding & Vetting
  {
    id: 'faq-guard-1',
    category: 'guarding',
    categoryLabel: 'Manned Guarding',
    question: 'What vetting and background screening procedures are conducted on SafeNet security guards?',
    answer: 'Every SafeNet security operative undergoes rigorous multi-layer vetting: criminal record clearance via the Nigerian Police Force CID, 10-finger biometric capture, three verified family and community guarantors, address verification, medical fitness examinations, and psychometric screening before undergoing our 6-week security training academy.',
    relatedServiceSlug: 'armed-unarmed-security-guards'
  },
  {
    id: 'faq-guard-2',
    category: 'guarding',
    categoryLabel: 'Manned Guarding',
    question: 'Can SafeNet provide armed security escort and armed static defense in Nigeria?',
    answer: 'In Nigeria, private security guards are legally unarmed by statute. SafeNet operates specialized armed protective details through formal operational Memoranda of Understanding (MoU) with the Nigeria Police Force (MOPOL / Counter-Terrorism Unit) and the Nigerian Military, pairing our senior tactical supervisors and certified Close Protection Officers with authorized armed units.',
    relatedServiceSlug: 'armed-unarmed-security-guards'
  },
  {
    id: 'faq-guard-3',
    category: 'guarding',
    categoryLabel: 'Manned Guarding',
    question: 'How are guard shifts structured to prevent fatigue and maintain alertness?',
    answer: 'SafeNet enforces strict 12-hour maximum shift rotations (Day/Night) with mandatory rest cycles and relief personnel. Every guard station is equipped with digital RFID guard tour patrol wands requiring hourly checkpoint scans, backed by surprise physical inspections from our roving mobile patrol supervisors.',
    relatedServiceSlug: 'armed-unarmed-security-guards'
  },

  // Surveillance & Technology
  {
    id: 'faq-surv-1',
    category: 'surveillance',
    categoryLabel: 'Surveillance & AI Systems',
    question: 'How do SafeNet CCTV systems remain online during Nigerian power outages and generator switchovers?',
    answer: 'All SafeNet CCTV and intrusion detection installations integrate double-conversion online UPS units, commercial lithium iron phosphate (LiFePO4) battery banks, and automatic voltage regulation. This guarantees 100% continuous surveillance with zero camera downtime during grid fluctuations or generator maintenance.',
    relatedServiceSlug: 'cctv-installation-monitoring'
  },
  {
    id: 'faq-surv-2',
    category: 'surveillance',
    categoryLabel: 'Surveillance & AI Systems',
    question: 'Can corporate clients monitor their facility cameras remotely on smartphones or laptops?',
    answer: 'Yes. SafeNet provides encrypted enterprise mobile and desktop client applications featuring end-to-end TLS/AES-256 encryption and multi-factor authentication (MFA). Corporate security directors can view live high-definition streams and search historical incident recordings from anywhere globally.',
    relatedServiceSlug: 'cctv-installation-monitoring'
  },
  {
    id: 'faq-surv-3',
    category: 'surveillance',
    categoryLabel: 'Surveillance & AI Systems',
    question: 'What regulatory authorizations are required for autonomous security drone surveillance in Nigeria?',
    answer: 'SafeNet operates all unmanned aerial vehicles (UAVs) in full compliance with the Nigerian Civil Aviation Authority (NCAA) regulations and holds security clearances from the Office of the National Security Adviser (ONSA). All flights are piloted by NCAA-licensed commercial drone operators using geo-fenced flight corridors.',
    relatedServiceSlug: 'drone-surveillance-security'
  },

  // Maritime & Offshore
  {
    id: 'faq-mar-1',
    category: 'maritime',
    categoryLabel: 'Maritime & Offshore',
    question: 'What counter-piracy capabilities does SafeNet deploy in the Gulf of Guinea and Niger Delta?',
    answer: 'SafeNet deploys hardened security escort vessels (SEVs) outfitted with ballistic protection and high-output water cannons, operating under official joint coordination with the Nigerian Navy and NIMASA. We implement vessel hardening (razor wire, citadel design, anti-boarding acoustic devices) and provide onboard armed transit security teams.',
    relatedServiceSlug: 'maritime-security'
  },
  {
    id: 'faq-mar-2',
    category: 'maritime',
    categoryLabel: 'Maritime & Offshore',
    question: 'Are SafeNet port facility security officers (PFSO) certified under the ISPS Code?',
    answer: 'Yes. Our maritime security leadership holds certified Port Facility Security Officer (PFSO) and Company Security Officer (CSO) credentials under the International Ship and Port Facility Security (ISPS) Code. We conduct mandatory Port Facility Security Assessments (PFSA) and draft compliant security plans for private commercial jetties and terminals.',
    relatedServiceSlug: 'maritime-security'
  },

  // Executive Protection & Convoy
  {
    id: 'faq-exec-1',
    category: 'executive',
    categoryLabel: 'Executive VIP Protection',
    question: 'What ballistic protection ratings do SafeNet armored vehicles offer for executive transit?',
    answer: 'Our executive fleet comprises European-engineered SUVs and sedans certified to CEN Level B6 and B7 ballistic standards. They withstand high-powered rifle rounds (including 7.62x51mm NATO and 7.62x39mm AK-47) and incorporate floor blast-protection blankets against fragmentation grenades and improvised explosive devices (IEDs).',
    relatedServiceSlug: 'vip-escort-bodyguard-services'
  },
  {
    id: 'faq-exec-2',
    category: 'executive',
    categoryLabel: 'Executive VIP Protection',
    question: 'Do you provide airport tarmac greeting and executive protocol clearance in Lagos and Abuja?',
    answer: 'Yes. SafeNet provides complete tarmac and executive protocol reception at Murtala Muhammed International Airport (MMIA Lagos) and Nnamdi Azikiwe International Airport (Abuja). Our teams manage secure escort through VIP customs, immigration processing, baggage retrieval, and direct armored convoy transfer.',
    relatedServiceSlug: 'vip-escort-bodyguard-services'
  },

  // Commercial & Contracts
  {
    id: 'faq-comm-1',
    category: 'general',
    categoryLabel: 'Contracts & Engagements',
    question: 'How do I request a formal proposal and security vulnerability assessment for my facility?',
    answer: 'You can request a proposal directly via our website by navigating to the "Request a Quote" or "Security Assessment" pages, calling our 24/7 Command Desk at +234 813 129 6054, or chatting with our AI Sentinel agent. A senior security surveyor will conduct an on-site audit and provide a detailed blueprint within 48 hours.',
    relatedServiceSlug: 'security-assessment'
  }
];
