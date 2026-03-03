export interface ScholarshipItem {
  id: string;
  name: string;
  type: "Merit" | "Government" | "Sports" | "Achievement" | "Industry" | "Exchange";
  amount: number;
  criteria: string;
  seats: number;
}

export interface CollegeItem {
  id: string;
  name: string;
  shortName: string;
  code: string;
  location: string;
  established: number;
  university: string;
  adminNote: string;
  scholarships: ScholarshipItem[];
}

export const COLLEGES: CollegeItem[] = [
  {
    id: "gmrit",
    name: "GMR Institute of Technology",
    shortName: "GMRIT",
    code: "GMRIT-2024",
    location: "Rajam, Srikakulam",
    established: 1997,
    university: "JNTU-GV",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "gm1", name: "Merit Scholarship (CGPA + Attendance)", type: "Merit", amount: 10000, criteria: "CGPA ≥ 9.0 and ≥ 90% attendance", seats: 120 },
      { id: "gm2", name: "Sports Scholarship", type: "Sports", amount: 8000, criteria: "State/National level sports performers", seats: 25 },
      { id: "gm3", name: "Special Achievement Award (Tech/Cultural)", type: "Achievement", amount: 7000, criteria: "Hackathon winners, cultural fest performers, competition achievers", seats: 40 },
      { id: "gm4", name: "Premium Paris Internship Exposure", type: "Industry", amount: 150000, criteria: "4th year students with 95%+ score, top faculty recommendations", seats: 5 },
      { id: "gm5", name: "International Exposure / Exchange (MoU Based)", type: "Exchange", amount: 50000, criteria: "Limited foreign visits/projects through university MoUs", seats: 10 },
      { id: "gm6", name: "Premium Industry Internships via T&P Cell", type: "Industry", amount: 15000, criteria: "High performers recommended to top companies by T&P Cell", seats: 30 },
      { id: "gm7", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category students", seats: 300 },
      { id: "gm8", name: "AP Post-Matric Scholarship (SC/ST)", type: "Government", amount: 85000, criteria: "SC/ST category as per AP social welfare norms", seats: 120 },
      { id: "gm9", name: "EBC Fee Reimbursement", type: "Government", amount: 65000, criteria: "Economically backward class, family income < ₹1L/year", seats: 80 },
      { id: "gm10", name: "Director's Gold Medal Award", type: "Merit", amount: 25000, criteria: "University rank holders / branch toppers", seats: 8 },
    ],
  },
  {
    id: "vignan",
    name: "Vignan's Institute of Information Technology",
    shortName: "VIIT",
    code: "VIGNAN-VZG",
    location: "Visakhapatnam",
    established: 2002,
    university: "JNTU-GV",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "vg1", name: "Academic Topper Award", type: "Merit", amount: 12000, criteria: "CGPA ≥ 9.0 with no backlogs", seats: 90 },
      { id: "vg2", name: "Girls in STEM Scholarship", type: "Achievement", amount: 9000, criteria: "Female students in core engineering branches", seats: 50 },
      { id: "vg3", name: "Sports Excellence Award", type: "Sports", amount: 7500, criteria: "University/state level medalists", seats: 20 },
      { id: "vg4", name: "Innovation & Research Grant", type: "Achievement", amount: 8000, criteria: "Published papers, patent filings, project expo winners", seats: 25 },
      { id: "vg5", name: "Industry Connect Internship Program", type: "Industry", amount: 12000, criteria: "Top 5% students placed through T&P cell partner companies", seats: 35 },
      { id: "vg6", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category", seats: 280 },
      { id: "vg7", name: "AP Post-Matric (SC/ST)", type: "Government", amount: 85000, criteria: "As per AP social welfare norms", seats: 150 },
      { id: "vg8", name: "Vignan Merit-cum-Means", type: "Merit", amount: 15000, criteria: "CGPA ≥ 8.5 and family income < ₹2.5L/year", seats: 60 },
    ],
  },
  {
    id: "srkr",
    name: "SRKR Engineering College",
    shortName: "SRKR",
    code: "SRKR-BVR",
    location: "Bhimavaram, West Godavari",
    established: 1980,
    university: "JNTU-K",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "sr1", name: "Merit Fee Concession", type: "Merit", amount: 10000, criteria: "Top 10% in branch rank with ≥ 85% attendance", seats: 100 },
      { id: "sr2", name: "Innovation & Project Grant", type: "Achievement", amount: 8500, criteria: "Patent holders, project competition winners, smart india hackathon", seats: 30 },
      { id: "sr3", name: "Sports Achievement Scholarship", type: "Sports", amount: 6000, criteria: "District/state level sports achievers", seats: 15 },
      { id: "sr4", name: "Industry Internship Sponsorship", type: "Industry", amount: 10000, criteria: "Students selected for premium industry internships", seats: 20 },
      { id: "sr5", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category", seats: 200 },
      { id: "sr6", name: "EBC Fee Reimbursement", type: "Government", amount: 65000, criteria: "Eligible EBC families, income < ₹1L/year", seats: 120 },
      { id: "sr7", name: "Chairman's Excellence Award", type: "Merit", amount: 20000, criteria: "Overall academic + extracurricular excellence", seats: 5 },
    ],
  },
  {
    id: "mvgr",
    name: "MVGR College of Engineering",
    shortName: "MVGR",
    code: "MVGR-VZN",
    location: "Vizianagaram",
    established: 1997,
    university: "JNTU-GV",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "mv1", name: "MVGR Merit Scholarship", type: "Merit", amount: 11000, criteria: "CGPA ≥ 8.8 with no backlogs", seats: 80 },
      { id: "mv2", name: "Leadership & Clubs Award", type: "Achievement", amount: 6000, criteria: "Outstanding performance in campus technical/cultural clubs", seats: 35 },
      { id: "mv3", name: "Sports Talent Recognition", type: "Sports", amount: 7000, criteria: "State/university level sports performers", seats: 18 },
      { id: "mv4", name: "Hackathon & Coding Champion", type: "Achievement", amount: 5000, criteria: "Winners of national coding contests & hackathons", seats: 20 },
      { id: "mv5", name: "Industry Exposure Program", type: "Industry", amount: 8000, criteria: "Selected students for partner company visits & projects", seats: 25 },
      { id: "mv6", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category", seats: 210 },
      { id: "mv7", name: "AP Post-Matric (SC/ST)", type: "Government", amount: 85000, criteria: "As per AP social welfare eligibility", seats: 100 },
    ],
  },
  {
    id: "vrsec",
    name: "VR Siddhartha Engineering College",
    shortName: "VRSEC",
    code: "VRSEC-VJA",
    location: "Vijayawada, Krishna",
    established: 1977,
    university: "JNTU-K",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "vr1", name: "Semester Topper Excellence Award", type: "Merit", amount: 12000, criteria: "Branch-wise semester toppers", seats: 85 },
      { id: "vr2", name: "Industry Internship Fast Track", type: "Industry", amount: 9500, criteria: "High performers recommended by T&P cell to MNCs", seats: 25 },
      { id: "vr3", name: "Cultural & Technical Fest Award", type: "Achievement", amount: 5000, criteria: "Winners of inter-college fests and technical events", seats: 30 },
      { id: "vr4", name: "Sports Scholarship", type: "Sports", amount: 8000, criteria: "National/state level sports achievers", seats: 15 },
      { id: "vr5", name: "International Conference Travel Grant", type: "Exchange", amount: 30000, criteria: "Students presenting papers at international conferences", seats: 8 },
      { id: "vr6", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category", seats: 260 },
      { id: "vr7", name: "AP Post-Matric (SC/ST)", type: "Government", amount: 85000, criteria: "As per AP social welfare norms", seats: 140 },
    ],
  },
  {
    id: "auce",
    name: "Andhra University College of Engineering",
    shortName: "AUCE",
    code: "AUCE-VSP",
    location: "Visakhapatnam",
    established: 1933,
    university: "Andhra University",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "au1", name: "University Gold Medal", type: "Merit", amount: 25000, criteria: "University rank holders across all branches", seats: 10 },
      { id: "au2", name: "AU Merit Scholarship", type: "Merit", amount: 15000, criteria: "CGPA ≥ 9.0 with consistent performance", seats: 100 },
      { id: "au3", name: "Research Fellowship Grant", type: "Achievement", amount: 20000, criteria: "Students with published research papers in indexed journals", seats: 15 },
      { id: "au4", name: "Sports Excellence Award", type: "Sports", amount: 10000, criteria: "National/inter-university sports champions", seats: 20 },
      { id: "au5", name: "International Exchange Program", type: "Exchange", amount: 75000, criteria: "Selected for partner university exchange (Japan, Germany MoUs)", seats: 6 },
      { id: "au6", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category", seats: 350 },
      { id: "au7", name: "AP Post-Matric (SC/ST)", type: "Government", amount: 85000, criteria: "As per AP social welfare norms", seats: 200 },
      { id: "au8", name: "EBC Fee Reimbursement", type: "Government", amount: 65000, criteria: "Economically backward class families", seats: 150 },
    ],
  },
  {
    id: "jntuk",
    name: "JNTU College of Engineering Kakinada",
    shortName: "JNTUK",
    code: "JNTUK-KKD",
    location: "Kakinada, East Godavari",
    established: 1946,
    university: "JNTU Kakinada",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "jk1", name: "JNTU Merit Scholarship", type: "Merit", amount: 15000, criteria: "CGPA ≥ 9.2 across all semesters", seats: 80 },
      { id: "jk2", name: "Research & Innovation Award", type: "Achievement", amount: 12000, criteria: "Patent filings, SIH winners, published research", seats: 20 },
      { id: "jk3", name: "Sports Scholarship", type: "Sports", amount: 8000, criteria: "Inter-university & national level athletes", seats: 25 },
      { id: "jk4", name: "Industry Partnership Internship", type: "Industry", amount: 10000, criteria: "Top performers selected for DRDO/ISRO/corporate internships", seats: 15 },
      { id: "jk5", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category", seats: 320 },
      { id: "jk6", name: "AP Post-Matric (SC/ST)", type: "Government", amount: 85000, criteria: "As per AP social welfare norms", seats: 180 },
      { id: "jk7", name: "Vice-Chancellor's Gold Medal", type: "Merit", amount: 30000, criteria: "University first rank holders", seats: 5 },
    ],
  },
  {
    id: "rvrjc",
    name: "RVR & JC College of Engineering",
    shortName: "RVR&JC",
    code: "RVRJC-GNT",
    location: "Guntur",
    established: 1985,
    university: "JNTU-K",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "rv1", name: "Academic Excellence Scholarship", type: "Merit", amount: 12000, criteria: "CGPA ≥ 9.0 and top 5% in branch", seats: 70 },
      { id: "rv2", name: "Startup & Innovation Grant", type: "Achievement", amount: 15000, criteria: "Students with startup ideas/prototypes selected by incubation cell", seats: 10 },
      { id: "rv3", name: "Sports Achievement Award", type: "Sports", amount: 6500, criteria: "State/national level sports performers", seats: 15 },
      { id: "rv4", name: "Technical Fest Champions Award", type: "Achievement", amount: 5000, criteria: "Winners of Abhisarga (annual tech fest) and inter-college events", seats: 30 },
      { id: "rv5", name: "Corporate Mentorship Program", type: "Industry", amount: 8000, criteria: "Selected students for industry mentorship & live projects", seats: 20 },
      { id: "rv6", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category", seats: 240 },
      { id: "rv7", name: "EBC Fee Reimbursement", type: "Government", amount: 65000, criteria: "Economically backward class families", seats: 110 },
    ],
  },
  {
    id: "pvpsit",
    name: "PVPSIT (Prasad V. Potluri Siddhartha IT)",
    shortName: "PVPSIT",
    code: "PVPSIT-VJA",
    location: "Vijayawada, Krishna",
    established: 1998,
    university: "JNTU-K",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "pv1", name: "Siddhartha Merit Award", type: "Merit", amount: 10000, criteria: "CGPA ≥ 8.5 with no backlogs", seats: 75 },
      { id: "pv2", name: "Coding & Hackathon Star", type: "Achievement", amount: 6000, criteria: "National hackathon winners, competitive programming achievers", seats: 25 },
      { id: "pv3", name: "Sports Scholarship", type: "Sports", amount: 5000, criteria: "District/state sports players", seats: 12 },
      { id: "pv4", name: "Industry Readiness Program", type: "Industry", amount: 7000, criteria: "Students completing premium industry certification programs", seats: 40 },
      { id: "pv5", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category", seats: 180 },
      { id: "pv6", name: "AP Post-Matric (SC/ST)", type: "Government", amount: 85000, criteria: "As per AP social welfare norms", seats: 90 },
    ],
  },
  {
    id: "raghu",
    name: "Raghu Engineering College",
    shortName: "REC",
    code: "RAGHU-VSP",
    location: "Visakhapatnam",
    established: 2003,
    university: "JNTU-GV",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "rg1", name: "Raghu Merit Scholarship", type: "Merit", amount: 8000, criteria: "CGPA ≥ 8.5 with ≥ 85% attendance", seats: 60 },
      { id: "rg2", name: "Cultural & Technical Achiever Award", type: "Achievement", amount: 5000, criteria: "Winners of campus fests, robotics, coding contests", seats: 20 },
      { id: "rg3", name: "Sports Recognition Award", type: "Sports", amount: 5000, criteria: "District/university level sports performers", seats: 10 },
      { id: "rg4", name: "Placement-Linked Scholarship", type: "Industry", amount: 6000, criteria: "Students placed in top companies with CTC > ₹6 LPA", seats: 30 },
      { id: "rg5", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category", seats: 150 },
      { id: "rg6", name: "EBC Fee Reimbursement", type: "Government", amount: 65000, criteria: "Economically backward class families", seats: 70 },
    ],
  },
];
