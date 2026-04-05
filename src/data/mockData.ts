export interface UserProfile {
  id: string;
  name: string;
  college: string;
  bio: string;
  skills: string[];
  preferredRole: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  githubLink: string;
  avatar: string;
  lastUpdated: Date;
  likedYou?: boolean;
}

export interface Hackathon {
  id: string;
  title: string;
  organization: string;
  description: string;
  posterImage: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  venue: string;
  mode: "online" | "offline" | "hybrid";
  prizeDetails: string;
  registrationLink: string;
  interestedCount: number;
  status: "upcoming" | "ongoing" | "ended";
}

export interface Match {
  id: string;
  user: UserProfile;
  matchedAt: Date;
  lastMessage?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

const avatars = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jude",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
];

export const mockProfiles: UserProfile[] = [
  {
    id: "1", name: "Arjun Patel", college: "IIT Bombay",
    bio: "Full-stack dev passionate about AI/ML. Love building products that solve real problems.",
    skills: ["React", "Python", "TensorFlow", "Node.js"],
    preferredRole: "Full Stack Developer", experienceLevel: "advanced",
    githubLink: "https://github.com/arjun", avatar: avatars[0],
    lastUpdated: new Date("2026-04-04"), likedYou: true,
  },
  {
    id: "2", name: "Sneha Sharma", college: "BITS Pilani",
    bio: "UI/UX designer who codes. Figma wizard and accessibility advocate.",
    skills: ["Figma", "React", "Tailwind CSS", "TypeScript"],
    preferredRole: "UI/UX Designer", experienceLevel: "intermediate",
    githubLink: "https://github.com/sneha", avatar: avatars[1],
    lastUpdated: new Date("2026-04-03"),
  },
  {
    id: "3", name: "Rohan Gupta", college: "NIT Trichy",
    bio: "Backend enthusiast. Love microservices, databases, and scalable systems.",
    skills: ["Go", "PostgreSQL", "Docker", "Kubernetes"],
    preferredRole: "Backend Developer", experienceLevel: "advanced",
    githubLink: "https://github.com/rohan", avatar: avatars[2],
    lastUpdated: new Date("2026-04-05"), likedYou: true,
  },
  {
    id: "4", name: "Priya Nair", college: "IIIT Hyderabad",
    bio: "ML researcher exploring NLP and computer vision. Open source contributor.",
    skills: ["Python", "PyTorch", "NLP", "Computer Vision"],
    preferredRole: "ML Engineer", experienceLevel: "advanced",
    githubLink: "https://github.com/priya", avatar: avatars[3],
    lastUpdated: new Date("2026-04-02"),
  },
  {
    id: "5", name: "Karthik Reddy", college: "VIT Vellore",
    bio: "Mobile dev building cross-platform apps. Flutter and React Native enthusiast.",
    skills: ["Flutter", "React Native", "Firebase", "Dart"],
    preferredRole: "Mobile Developer", experienceLevel: "intermediate",
    githubLink: "https://github.com/karthik", avatar: avatars[4],
    lastUpdated: new Date("2026-04-01"),
  },
  {
    id: "6", name: "Ananya Singh", college: "DTU Delhi",
    bio: "Blockchain dev and Web3 builder. Smart contracts and DeFi protocols.",
    skills: ["Solidity", "Ethereum", "React", "Web3.js"],
    preferredRole: "Blockchain Developer", experienceLevel: "intermediate",
    githubLink: "https://github.com/ananya", avatar: avatars[5],
    lastUpdated: new Date("2026-03-30"), likedYou: true,
  },
  {
    id: "7", name: "Vikram Joshi", college: "IISC Bangalore",
    bio: "DevOps engineer automating everything. CI/CD pipelines and cloud infra.",
    skills: ["AWS", "Terraform", "Jenkins", "Python"],
    preferredRole: "DevOps Engineer", experienceLevel: "advanced",
    githubLink: "https://github.com/vikram", avatar: avatars[6],
    lastUpdated: new Date("2026-04-04"),
  },
  {
    id: "8", name: "Meera Krishnan", college: "Anna University",
    bio: "Frontend specialist with an eye for animation and micro-interactions.",
    skills: ["React", "GSAP", "Three.js", "TypeScript"],
    preferredRole: "Frontend Developer", experienceLevel: "intermediate",
    githubLink: "https://github.com/meera", avatar: avatars[7],
    lastUpdated: new Date("2026-04-05"),
  },
];

export const mockHackathons: Hackathon[] = [
  {
    id: "h1", title: "HackIndia 2026", organization: "HackIndia Foundation",
    description: "India's largest student hackathon. Build innovative solutions for real-world problems across 8 tracks including AI, Blockchain, Healthcare, and Sustainability.",
    posterImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
    startDate: new Date("2026-05-15"), endDate: new Date("2026-05-17"),
    registrationDeadline: new Date("2026-05-10"),
    venue: "Bangalore International Exhibition Centre", mode: "offline",
    prizeDetails: "₹10L+ in prizes", registrationLink: "https://hackindia.xyz",
    interestedCount: 2340, status: "upcoming",
  },
  {
    id: "h2", title: "CodeStorm Online", organization: "TechCorp Labs",
    description: "48-hour online hackathon focused on building developer tools and open-source projects.",
    posterImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    startDate: new Date("2026-04-20"), endDate: new Date("2026-04-22"),
    registrationDeadline: new Date("2026-04-18"),
    venue: "Online (Discord + Devpost)", mode: "online",
    prizeDetails: "$5,000 in prizes", registrationLink: "https://codestorm.dev",
    interestedCount: 1560, status: "upcoming",
  },
  {
    id: "h3", title: "AI Builders Jam", organization: "Google Developer Groups",
    description: "Build AI-powered applications using Google's latest APIs and tools. Mentorship from Google engineers included.",
    posterImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
    startDate: new Date("2026-04-01"), endDate: new Date("2026-04-07"),
    registrationDeadline: new Date("2026-03-28"),
    venue: "Hybrid - Multiple cities", mode: "hybrid",
    prizeDetails: "Google Cloud credits + swag", registrationLink: "https://gdg.dev/aijam",
    interestedCount: 3200, status: "ongoing",
  },
  {
    id: "h4", title: "Web3 Buildathon", organization: "Ethereum India",
    description: "Build decentralized applications on Ethereum. Workshops on Solidity, DeFi, and NFTs.",
    posterImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
    startDate: new Date("2026-06-01"), endDate: new Date("2026-06-03"),
    registrationDeadline: new Date("2026-05-25"),
    venue: "IIT Delhi Campus", mode: "offline",
    prizeDetails: "₹5L + Internship opportunities", registrationLink: "https://ethindia.co",
    interestedCount: 890, status: "upcoming",
  },
];

export const mockMatches: Match[] = [
  {
    id: "m1", user: mockProfiles[0], matchedAt: new Date("2026-04-04"),
    lastMessage: "Hey! Want to team up for HackIndia?",
  },
  {
    id: "m2", user: mockProfiles[2], matchedAt: new Date("2026-04-03"),
    lastMessage: "Your Go projects look amazing!",
  },
  {
    id: "m3", user: mockProfiles[5], matchedAt: new Date("2026-04-02"),
    lastMessage: "Let's build something with Web3 🚀",
  },
];

export const mockMessages: Record<string, Message[]> = {
  m1: [
    { id: "msg1", senderId: "1", text: "Hey! I saw your profile. Your ML projects are impressive!", timestamp: new Date("2026-04-04T10:00:00") },
    { id: "msg2", senderId: "me", text: "Thanks! I love your full-stack work too.", timestamp: new Date("2026-04-04T10:05:00") },
    { id: "msg3", senderId: "1", text: "Hey! Want to team up for HackIndia?", timestamp: new Date("2026-04-04T10:10:00") },
  ],
  m2: [
    { id: "msg4", senderId: "3", text: "Your Go projects look amazing!", timestamp: new Date("2026-04-03T14:00:00") },
  ],
  m3: [
    { id: "msg5", senderId: "me", text: "Hi Ananya! Love your blockchain work.", timestamp: new Date("2026-04-02T09:00:00") },
    { id: "msg6", senderId: "6", text: "Let's build something with Web3 🚀", timestamp: new Date("2026-04-02T09:15:00") },
  ],
};
