export type DemoTarget = {
  id: string;
  label: string;
  salaryLabel: string;
  difficulty: "Focused" | "Intermediate" | "Advanced";
  estimatedTimeline: string;
  description: string;
  milestones: string[];
  missingSignals: string[];
};

export const demoTargets: DemoTarget[] = [
  {
    id: "backend-developer",
    label: "Backend Developer",
    salaryLabel: "₹10–12 LPA",
    difficulty: "Focused",
    estimatedTimeline: "12–16 weeks",
    description:
      "A focused path from current backend experience toward stronger Java, APIs, databases, and application readiness.",
    milestones: ["Java", "REST APIs", "SQL", "Projects", "Resume", "Apply"],
    missingSignals: ["Java depth", "API projects", "Resume alignment"],
  },
  {
    id: "java-backend-engineer",
    label: "Java Backend Engineer",
    salaryLabel: "₹12–15 LPA",
    difficulty: "Intermediate",
    estimatedTimeline: "16–24 weeks",
    description:
      "A deeper path toward Spring Boot, security, Redis, system design, tailored resumes, and interview readiness.",
    milestones: [
      "Java",
      "Spring Boot",
      "Security",
      "Redis",
      "System Design",
      "Interview",
      "Offer",
    ],
    missingSignals: ["Spring Security", "Redis", "System design depth"],
  },
  {
    id: "senior-backend-engineer",
    label: "Senior Backend Engineer",
    salaryLabel: "₹18–20 LPA",
    difficulty: "Advanced",
    estimatedTimeline: "24–36 weeks",
    description:
      "An advanced trajectory focused on architecture, distributed systems, Kafka, leadership signals, and high-quality interview preparation.",
    milestones: [
      "Architecture",
      "Kafka",
      "Distributed Systems",
      "Cloud",
      "Leadership",
      "System Design",
      "Offer",
    ],
    missingSignals: [
      "Distributed systems evidence",
      "Architecture stories",
      "Senior-level project depth",
    ],
  },
];

export const landingDemoProfile = {
  label: "Demo profile",
  currentRole: ".NET Backend Developer",
  experience: "2 years",
  skills: ["C#", ".NET", "SQL", "React", "Java", "Spring Boot"],
};

export const landingDemoMission = [
  {
    id: 1,
    title: "Revise Spring Security",
    duration: "45 min",
    reason: "Improves backend role alignment",
  },
  {
    id: 2,
    title: "Solve 2 medium DSA problems",
    duration: "45 min",
    reason: "Builds interview readiness",
  },
  {
    id: 3,
    title: "Redis implementation practice",
    duration: "60 min",
    reason: "Closes a target-skill gap",
  },
];