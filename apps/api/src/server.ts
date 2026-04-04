import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

import { cohorts } from "./data/cohorts.js";

dotenv.config({ path: "../../.env" });

const app = express();
const port = Number(process.env.PORT ?? "4000");

app.use(cors());
app.use(express.json());

app.get("/health", (_request: Request, response: Response) => {
  response.json({ ok: true });
});

app.get("/api/cohorts", (_request: Request, response: Response) => {
  response.json({
    cohorts: cohorts.map((cohort) => ({
      id: cohort.id,
      name: cohort.name,
      program: cohort.program,
      graduationDate: cohort.graduationDate,
      summary: cohort.summary,
      tagline: cohort.tagline,
      studentCount: cohort.students.length
    }))
  });
});

app.get("/api/cohorts/:id", (request: Request, response: Response) => {
  const cohort = cohorts.find((item) => item.id === request.params.id);

  if (!cohort) {
    response.status(404).json({ message: "기수를 찾을 수 없습니다." });
    return;
  }

  response.json({
    cohort: {
      id: cohort.id,
      name: cohort.name,
      program: cohort.program,
      graduationDate: cohort.graduationDate,
      summary: cohort.summary,
      tagline: cohort.tagline,
      studentCount: cohort.students.length,
      students: cohort.students.map((student) => ({
        id: student.id,
        name: student.name,
        roleTrack: student.roleTrack,
        bio: student.bio,
        projectCount: student.projects.length,
        primaryProjectTitle: student.projects[0]?.title ?? "대표 프로젝트 준비 중"
      }))
    }
  });
});

app.get("/api/students/:id", (request: Request, response: Response) => {
  const student = cohorts.flatMap((cohort) => cohort.students).find((item) => item.id === request.params.id);

  if (!student) {
    response.status(404).json({ message: "수료생을 찾을 수 없습니다." });
    return;
  }

  response.json({ student });
});

app.listen(port, () => {
  process.stdout.write(`API server listening on http://localhost:${port}\n`);
});
