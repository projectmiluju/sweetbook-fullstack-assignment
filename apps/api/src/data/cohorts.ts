import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export interface ProjectSummary {
  title: string;
  summary: string;
  contribution: string;
  links: string[];
  problem?: string;
  solution?: string;
  techChoices?: string[];
  result?: string;
}

export interface RetrospectiveData {
  before?: string;
  process?: string;
  turning?: string;
  difficulty?: string;
  overcome?: string;
  learned?: string;
}

export interface PortfolioLinks {
  github?: string;
  blog?: string;
  email?: string;
  demo?: string;
}

export interface StudentPortfolio {
  id: string;
  name: string;
  roleTrack: string;
  bio: string;
  techStack: string[];
  projects: ProjectSummary[];
  retrospective: string | RetrospectiveData;
  mentorComment: string;
  photos: string[];
  certificateMessage: string;
  interests?: string[];
  achievements?: string;
  portfolioLinks?: PortfolioLinks;
  thanksMessage?: string;
}

export interface Cohort {
  id: string;
  name: string;
  program: string;
  graduationDate: string;
  summary: string;
  tagline: string;
  students: StudentPortfolio[];
  operatorMessage?: string;
  philosophy?: string;
  photos?: string[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");
const jsonPath = resolve(projectRoot, "data/cohorts.json");

function loadCohorts(): Cohort[] {
  const raw = readFileSync(jsonPath, "utf-8");
  return JSON.parse(raw) as Cohort[];
}

export const cohorts: Cohort[] = loadCohorts();
