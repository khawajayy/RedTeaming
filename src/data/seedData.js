import { collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const INITIAL_ROADMAP_DATA = [
  {
    order: 1,
    month: "Month 1",
    week: "Week 1",
    focusArea: "Python & API Fundamentals",
    keyConcepts: "Python, async/await, API requests",
    actionItem: "Build a basic script interacting with OpenAI/Anthropic API",
    status: "To Do"
  },
  {
    order: 2,
    month: "Month 1",
    week: "Week 2",
    focusArea: "Prompt Engineering Basics",
    keyConcepts: "System prompts, context windows, few-shot prompting",
    actionItem: "Create a prompt template for a specific task",
    status: "To Do"
  },
  {
    order: 3,
    month: "Month 1",
    week: "Week 3",
    focusArea: "Intro to Agentic Workflows",
    keyConcepts: "n8n, Make, LangChain",
    actionItem: "Set up a basic n8n workflow using an LLM node",
    status: "To Do"
  },
  {
    order: 4,
    month: "Month 1",
    week: "Week 4",
    focusArea: "Tool Calling",
    keyConcepts: "Function calling, API specs",
    actionItem: "Build an LLM script that fetches weather data via API",
    status: "To Do"
  },
  {
    order: 5,
    month: "Month 2",
    week: "Week 1",
    focusArea: "OWASP Top 10 for LLMs",
    keyConcepts: "OWASP LLM risks overview",
    actionItem: "Read and summarize the OWASP Top 10 for LLM Apps",
    status: "To Do"
  },
  {
    order: 6,
    month: "Month 2",
    week: "Week 2",
    focusArea: "Direct Prompt Injections",
    keyConcepts: "DAN prompts, ignore previous instructions",
    actionItem: "Manually jailbreak a public AI chatbot model",
    status: "To Do"
  },
  {
    order: 7,
    month: "Month 2",
    week: "Week 3",
    focusArea: "Indirect Prompt Injections",
    keyConcepts: "Poisoned web pages, hidden text",
    actionItem: "Create a webpage with hidden text to hijack an AI scraper",
    status: "To Do"
  },
  {
    order: 8,
    month: "Month 2",
    week: "Week 4",
    focusArea: "Agent Goal Hijacking",
    keyConcepts: "ASI01, malicious input altering objectives",
    actionItem: "Map out an attack tree for an autonomous email agent",
    status: "To Do"
  },
  {
    order: 9,
    month: "Month 3",
    week: "Week 1",
    focusArea: "Vulnerable App Setup",
    keyConcepts: "Supabase, Python environment",
    actionItem: "Set up a local database with dummy customer data",
    status: "To Do"
  },
  {
    order: 10,
    month: "Month 3",
    week: "Week 2",
    focusArea: "Building the AI Agent",
    keyConcepts: "LangGraph, API routing",
    actionItem: "Build a customer support agent connected to the DB",
    status: "To Do"
  },
  {
    order: 11,
    month: "Month 3",
    week: "Week 3",
    focusArea: "Granting Tool Access",
    keyConcepts: "Read/write permissions, loose system prompts",
    actionItem: "Give the agent ability to refund Stripe charges (test mode)",
    status: "To Do"
  },
  {
    order: 12,
    month: "Month 3",
    week: "Week 4",
    focusArea: "Agent Integration",
    keyConcepts: "API endpoints, Webhooks",
    actionItem: "Expose the agent via a local webhook for testing",
    status: "To Do"
  },
  {
    order: 13,
    month: "Month 4",
    week: "Week 1",
    focusArea: "Manual Tool Misuse Exploitation",
    keyConcepts: "ASI02, unauthorized API calls",
    actionItem: "Force the local agent to query another user's data",
    status: "To Do"
  },
  {
    order: 14,
    month: "Month 4",
    week: "Week 2",
    focusArea: "Memory Poisoning (RAG)",
    keyConcepts: "ASI06, vector databases",
    actionItem: "Inject a malicious payload into a PDF the agent reads",
    status: "To Do"
  },
  {
    order: 15,
    month: "Month 4",
    week: "Week 3",
    focusArea: "Data Exfiltration",
    keyConcepts: "Webhook catchers, encoding data",
    actionItem: "Make the agent send DB secrets to your external webhook",
    status: "To Do"
  },
  {
    order: 16,
    month: "Month 4",
    week: "Week 4",
    focusArea: "Documenting the Exploit",
    keyConcepts: "Markdown, vulnerability reporting",
    actionItem: "Write a step-by-step exploit chain report (Autopsy)",
    status: "To Do"
  },
  {
    order: 17,
    month: "Month 5",
    week: "Week 1",
    focusArea: "Intro to Automated Red Teaming",
    keyConcepts: "Red team frameworks, scaling attacks",
    actionItem: "Install and configure Promptfoo on your machine",
    status: "To Do"
  },
  {
    order: 18,
    month: "Month 5",
    week: "Week 2",
    focusArea: "Automated Fuzzing with Promptfoo",
    keyConcepts: "Adversarial testing, test suites",
    actionItem: "Run a 100-prompt attack suite against your vulnerable agent",
    status: "To Do"
  },
  {
    order: 19,
    month: "Month 5",
    week: "Week 3",
    focusArea: "Advanced Orchestration with PyRIT",
    keyConcepts: "PyRIT, multi-turn attacks",
    actionItem: "Set up a multi-turn attack where AI attacks another AI",
    status: "To Do"
  },
  {
    order: 20,
    month: "Month 5",
    week: "Week 4",
    focusArea: "Analyzing Results",
    keyConcepts: "Scoring, hallucination rates",
    actionItem: "Export and analyze the vulnerability report from Promptfoo",
    status: "To Do"
  },
  {
    order: 21,
    month: "Month 6",
    week: "Week 1",
    focusArea: "Defensive Mitigations",
    keyConcepts: "NeMo Guardrails, input validation",
    actionItem: "Implement prompt sanitization on your vulnerable agent",
    status: "To Do"
  },
  {
    order: 22,
    month: "Month 6",
    week: "Week 2",
    focusArea: "Portfolio Development",
    keyConcepts: "Jekyll, GitHub Pages",
    actionItem: "Publish your exploit autopsy and mitigation code on your site",
    status: "To Do"
  },
  {
    order: 23,
    month: "Month 6",
    week: "Week 3",
    focusArea: "Bug Bounties & Platforms",
    keyConcepts: "Bugcrowd, HackerOne, AI labs",
    actionItem: "Register on platforms and read past AI bug bounty reports",
    status: "To Do"
  },
  {
    order: 24,
    month: "Month 6",
    week: "Week 4",
    focusArea: "First Live Hunt",
    keyConcepts: "Real-world testing within scope",
    actionItem: "Participate in your first public AI bug bounty program",
    status: "To Do"
  }
];

/**
 * Seeds the 24 milestones to Firestore for the specified user using a Batch Write.
 * Checks if documents already exist to prevent unwanted overwrites unless forced.
 */
export async function seedRoadmapData(userId, force = false) {
  if (!userId) {
    throw new Error("User ID is required to seed roadmap data.");
  }

  const roadmapColRef = collection(db, 'users', userId, 'roadmap');
  
  if (!force) {
    const existingSnap = await getDocs(roadmapColRef);
    if (!existingSnap.empty) {
      return { seeded: false, count: existingSnap.size, message: "Roadmap data already exists." };
    }
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  INITIAL_ROADMAP_DATA.forEach((item) => {
    // Custom document ID format: m1-w1, m1-w2, etc. for easy reference & idempotence
    const mNum = item.month.replace(/\D/g, '');
    const wNum = item.week.replace(/\D/g, '');
    const docId = `m${mNum}-w${wNum}`;
    
    const docRef = doc(roadmapColRef, docId);
    batch.set(docRef, {
      ...item,
      id: docId,
      userId: userId,
      createdAt: now,
      updatedAt: now
    });
  });

  await batch.commit();
  return { seeded: true, count: INITIAL_ROADMAP_DATA.length, message: "Successfully seeded 24 milestones!" };
}
