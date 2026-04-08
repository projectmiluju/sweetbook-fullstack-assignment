-- CreateTable
CREATE TABLE "Cohort" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "graduationDate" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "operatorMessage" TEXT,
    "philosophy" TEXT,
    "logoUrl" TEXT,
    "photos" TEXT[],
    "partnerInfo" TEXT,
    "stats" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleTrack" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "techStack" TEXT[],
    "mentorComment" TEXT NOT NULL,
    "photos" TEXT[],
    "certificateMessage" TEXT NOT NULL,
    "retrospective" JSONB,
    "interests" TEXT[],
    "achievements" TEXT,
    "portfolioLinks" JSONB,
    "thanksMessage" TEXT,
    "cohortId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contribution" TEXT NOT NULL,
    "links" TEXT[],
    "problem" TEXT,
    "solution" TEXT,
    "techChoices" TEXT[],
    "result" TEXT,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
