import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export interface ProjectSummary {
  title: string;
  summary: string;
  contribution: string;
  links: string[];
}

export interface StudentPortfolio {
  id: string;
  name: string;
  roleTrack: string;
  bio: string;
  techStack: string[];
  projects: ProjectSummary[];
  retrospective: string;
  mentorComment: string;
  photos: string[];
  certificateMessage: string;
}

export interface Cohort {
  id: string;
  name: string;
  program: string;
  graduationDate: string;
  summary: string;
  tagline: string;
  students: StudentPortfolio[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");
const jsonPath = resolve(projectRoot, "data/cohorts.json");

function loadCohorts(): Cohort[] {
  const raw = readFileSync(jsonPath, "utf-8");
  return JSON.parse(raw) as Cohort[];
}

export const cohorts: Cohort[] = loadCohorts();
