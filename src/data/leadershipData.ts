import imgAmurun from '../assets/images/DR (CHIEF) OGHENEOVOH AMURUN.jpg';
import imgPaulWhite from '../assets/images/DR PAUL WHITE.jpg';
import imgHarryAde from '../assets/images/ENGR HARRY HIIFAN ADE.jpg';
import imgAnthonia from '../assets/images/ANTHONIA IKEDIASI FCMGR.jpg';
import imgAssayGodspower from '../assets/images/Assay Godspower.jpg';

export interface LeadershipProfile {
  id: string;
  name: string;
  designation: string;
  bio: string;
  image: string;
}

export const LEADERSHIP_PROFILES: LeadershipProfile[] = [
  {
    id: 'ogheneovoh-amurun',
    name: 'DR (CHIEF) OGHENEOVOH AMURUN',
    designation: 'CHAIRMAN AND CEO',
    image: imgAmurun,
    bio: 'He brings over 20 years of UK security and criminal investigation expertise. A PhD-qualified Criminal Investigator, he combines operational excellence with academic authority. His background in intelligence-led investigations, specialist training, and strategic leadership ensures Safenet Security Solutions delivers ethical, innovative, and highly effective protection for clients, assets, and critical infrastructure.'
  },
  {
    id: 'paul-white',
    name: 'DR. PAUL WHITE',
    designation: 'DIRECTOR OF TRAINING',
    image: imgPaulWhite,
    bio: 'He brings extensive military, academic, and specialist security expertise to Safenet Security Solution. A PhD holder in Criminal Psychology, he has trained senior police officers and security professionals in leadership and strategic threat management. His disciplined, mission-focused approach ensures our personnel are exceptionally prepared to address modern security challenges with professionalism and precision.'
  },
  {
    id: 'harry-hiifan-ade',
    name: 'ENGR. HARRY HIIFAN ADE',
    designation: 'MANAGING DIRECTOR',
    image: imgHarryAde,
    bio: 'He brings over 22 years of senior leadership in Nigeria’s security sector. A Mechanical Engineering graduate and Certified Security Specialist, he has extensive experience across oil and gas, construction, and private security industries. As a member of ASIS International, he delivers strategic, industry-aligned security solutions with operational excellence.'
  },
  {
    id: 'anthonia-ikediasi',
    name: 'ANTHONIA IKEDIASI FCMGR',
    designation: 'DIRECTOR, LEGAL & STRATEGY',
    image: imgAnthonia,
    bio: 'She is a UK- and Nigeria-qualified lawyer with extensive international experience in regulatory compliance, risk management, and security-sector governance. Combining global best practices with strong local legal insight, she strengthens Safenet’s strategic framework, ensures operational integrity, and drives sustainable growth through proactive risk management and client-focused, ethical leadership.'
  },
  {
    id: 'assay-godspower',
    name: 'ASSAY GODSPOWER',
    designation: 'BRANCH MANAGER, DELTA STATE',
    image: imgAssayGodspower,
    bio: 'Assay Godspower is a Certified Security Specialist (CSS). He is also Safety/Security Consultant and a Conference Speaker with 17 years experience in educating corporate organizations, individuals on preventing loss, property damage, crime reduction and to stop fatalities in the workplace. He serve as a Consultant providing lifesaving services to a wide range of prospect across Schools, Manufacturing, Engineering, Hospitality, Educational Sector, Oil and Gas Companies. Assay Godspower is a Member of the Institute of Safety Professionals of Nigeria (ISPON), and a Member of the Nigerian Institute of Industrial Security (NIIS). He is also the Head of Safety Division, of the Medical Health and Safety Department, Desopadec. Lastly, he is the Manager, Safenet Security Solutions limited, Delta State Branch, Effurun/Sapele Road, Effurun, Delta State.'
  }
];
