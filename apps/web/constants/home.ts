import rocket from "@/public/graphics/rocket.png";
import trophy from "@/public/graphics/trophy.png";
import folder from "@/public/graphics/folder.png";
import computer from "@/public/graphics/computer.png";
import documents from "@/public/graphics/documents.png";
import chat from "@/public/graphics/chat.png";
import { Stat, Event, Sponsor, QandA } from "@/types/home";

import EventPlaceholder from "@/public/placeholder/event.png";
import AiCompanion from "@/public/pastEvents/event-ai-companion.png";
import BOT from "@/public/pastEvents/event-bot.png";
import Bonfire from "@/public/pastEvents/event-eot-bonfire.png";
import Estimathon from "@/public/pastEvents/event-eot-estimathon.png";
import Langchain from "@/public/pastEvents/event-intro-to-langchain.png";
import Karaoke from "@/public/pastEvents/event-karaoke.png";
import Point72 from "@/public/pastEvents/event-point72-panel.png";
import SpeedFriending from "@/public/pastEvents/event-speed-friending.png";
import Trivia from "@/public/pastEvents/event-trivia.png";

import MathsocLogo from "@/public/logos/mathsoc.png";
import MEF from "@/public/logos/mef.png";
import Techyon from "@/public/logos/techyon.png";

export const WHAT_WE_DO_CARDS = [
  {
    title: "Workshops",
    description:
      "Join us for workshops, where we teach a variety of Data Science topics.",
    graphic: rocket,
  },
  {
    title: "CxC",
    description: "Stay tuned for our CxC hackathon, happening this winter!",
    graphic: trophy,
  },
  {
    title: "Project Program",
    description:
      "Collaborate with fellow students on any project of your choice.",
    graphic: folder,
  },
  {
    title: "E-Leetcoding",
    description:
      "Prepare for technical interviews with our weekly Leetcoding sessions.",
    graphic: computer,
  },
  {
    title: "Reading Groups",
    description:
      "Learn about the latest developments in Data Science and Machine Learning.",
    graphic: documents,
  },
  {
    title: "Social Events",
    description:
      "Come hang out with us and meet other students interested in Data Science!",
    graphic: chat,
  },
];

export const CLUB_STATS: Stat[] = [
  {
    id: "workshops-held",
    title: "Workshops Held",
    stat: 100,
    suffix: "+",
  },
  {
    id: "current-members",
    title: "Current Members",
    stat: 300,
    suffix: "+",
  },
  {
    id: "instagram-followers",
    title: "Instagram Followers",
    stat: 4000,
    suffix: "+",
  },
];

export const PAST_EVENTS: Event[] = [
  {
    id: "1",
    title: "Upper Year Co-op Panel",
    image: EventPlaceholder,
  },
  {
    id: "2",
    title: "BOT ",
    image: BOT,
  },
  {
    id: "3",
    title: "Point72 Q&A Panel",
    image: Point72,
  },
  {
    id: "4",
    title: "Karaoke Night",
    image: Karaoke,
  },
  {
    id: "5",
    title: "How to Build an AI Companion",
    image: AiCompanion,
  },
  {
    id: "6",
    title: "EOT Estimathon",
    image: Estimathon,
  },
  {
    id: "7",
    title: "Bonfire",
    image: Bonfire,
  },
  {
    id: "8",
    title: "Speed Friending",
    image: SpeedFriending,
  },
  {
    id: "9",
    title: "DSC Trivia Night",
    image: Trivia,
  },
  {
    id: "10",
    title: "Intro to Langchain",
    image: Langchain,
  },
];

export const CURRENT_SPONSORS: Sponsor[] = [
  { name: "MathSoc", logo: MathsocLogo },
  { name: "MEF", logo: MEF },
  { name: "Techyon", logo: Techyon, link: "https://techyon.org/" },
];

export const GENERAL_FAQ: QandA[] = [
  {
    id: "1",
    question: "What is DSC?",
    answer: `We are a MathSoc club dedicated to building a community of students passionate about exploring the field of Data Science. DSC hosts a number of workshops and events throughout the term, mostly academic focused (see below). Our iconic mascots include Echo the Whale, Sharkira, and Bert!`,
  },
  {
    id: "2",
    question: "What are some events DSC hosts?",
    answer: `1. Intro workshops on data tools that will look great on your resume :)\nE.g. Pandas, Tableau, Build Your Own DS Project, Machine Learning Algorithms\n2. Industry professionals/alumni/upper-year panels to help students explore more of the field and opportunities\nE.g. Data Science Across Sectors, Upper Year Co-Op Panel, Company Collabs and Info Sessions\n3. Technical interview prep and resume reviews by experienced upper-year mentors and Data Science Office Hours\n4. Hackathons to apply your learning and create cool projects\nEg. CxC (Data Hackathon) and Project Program\n5. Social events to connect with other students (Karaoke, Speed Friending, Trivia)\n6. Reading groups targeted to intermediate/advanced members where execs present ML research papers (Eg. NLP, computer vision)\n7. Visit our BOT (beginning of term event) for more events introductions!`,
  },
  {
    id: "3",
    question: "Do I need to major in Data Science?",
    answer:
      "No! We welcome UWaterloo undergraduate students of any level of study/program/faculty.",
  },
  {
    id: "4",
    question: "How often do I have to go to the events and when are they?",
    answer: `All of our events are OPTIONAL! We do NOT have a set schedule for most events, so look out for the newest info/updates on our Instagram/Discord.`,
  },
  {
    id: "5",
    question: "What is the $4 membership fee going to?",
    answer: `The membership fee covers the ENTIRE term (not per event). By paying the membership fee, you can attend all of our events, most of which include FREE FOOD like boba, ChungChun, Bao, and more!`,
  },
  {
    id: "6",
    question: "How to sign up?",
    answer: `Click the “Join Us” button to create an account on our website. You can pay the $4 membership fee through one of the following methods:\n- Online through WUSA (navigate to Shop → Memberships → DSC)\n- In-person at our office/events with cash\n- In-person at the MathSoc office with credit/debit (keep receipt)`,
  },
];
