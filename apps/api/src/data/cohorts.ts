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

export const cohorts: Cohort[] = [
  {
    id: "cohort-2026-01",
    name: "웹 풀스택 5기",
    program: "SweetBootcamp Web Fullstack",
    graduationDate: "2026-04-30",
    summary: "제품 기획부터 프론트엔드, 백엔드, 배포까지 한 흐름으로 완주한 웹 풀스택 기수입니다.",
    tagline: "실무형 제품 사고와 구현을 함께 익힌 5기 수료생 포트폴리오 아카이브",
    students: [
      {
        id: "student-001",
        name: "김코드",
        roleTrack: "풀스택",
        bio: "문제를 빠르게 구조화하고 제품 관점으로 구현하는 것을 좋아하는 수료생입니다.",
        techStack: ["TypeScript", "Next.js", "Express", "PostgreSQL"],
        projects: [
          {
            title: "StudyFlow",
            summary: "스터디 운영 자동화 서비스",
            contribution: "백엔드 API 설계와 운영자 대시보드 구현",
            links: ["https://github.com/example/studyflow"]
          },
          {
            title: "DemoBoard",
            summary: "데모데이 발표 자료 관리 서비스",
            contribution: "프론트엔드 정보 구조 설계와 상태 관리",
            links: ["https://github.com/example/demoboard"]
          }
        ],
        retrospective: "기능 구현보다 문제 정의가 더 중요하다는 점을 배웠고, 작은 단위로 쪼개는 습관을 익혔습니다.",
        mentorComment: "요구사항을 구조화하는 능력이 좋고, 구현 속도와 설명력이 균형 잡혀 있습니다.",
        photos: [
          "https://picsum.photos/seed/bootcamp-team-1/1200/900",
          "https://picsum.photos/seed/bootcamp-demo-1/1200/900"
        ],
        certificateMessage: "끝까지 완주한 성장과 몰입을 축하합니다."
      },
      {
        id: "student-002",
        name: "박설계",
        roleTrack: "프론트엔드",
        bio: "사용자 경험을 화면 구조로 설계하는 데 강점이 있는 수료생입니다.",
        techStack: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
        projects: [
          {
            title: "CreatorGrid",
            summary: "콘텐츠 제작자 포트폴리오 서비스",
            contribution: "디자인 시스템 구성과 상세 화면 구현",
            links: ["https://github.com/example/creatorgrid"]
          }
        ],
        retrospective: "좋은 UI는 보기 좋은 화면이 아니라 의도가 분명한 흐름이라는 점을 이해하게 되었습니다.",
        mentorComment: "시각적 완성도와 구조적 사고가 같이 보이는 수료생입니다.",
        photos: [
          "https://picsum.photos/seed/bootcamp-design-1/1200/900"
        ],
        certificateMessage: "팀과 함께 만든 성장을 오래 기억하길 바랍니다."
      }
    ]
  },
  {
    id: "cohort-2026-02",
    name: "AI 서비스 2기",
    program: "SweetBootcamp AI Product Builder",
    graduationDate: "2026-05-31",
    summary: "AI 기반 서비스 아이디어를 실제 제품으로 연결하는 과정을 중심으로 운영된 기수입니다.",
    tagline: "문제 정의부터 모델 활용까지 연결한 2기 쇼케이스 컬렉션",
    students: [
      {
        id: "student-003",
        name: "이서진",
        roleTrack: "AI Product",
        bio: "생성형 AI를 실제 사용자 문제에 연결하는 제품 구조 설계를 좋아하는 수료생입니다.",
        techStack: ["Python", "FastAPI", "TypeScript", "OpenAI API"],
        projects: [
          {
            title: "Meeting Note Studio",
            summary: "회의 요약과 액션 아이템 정리를 자동화하는 도구",
            contribution: "API 통합 설계와 결과 검토 UX 구현",
            links: ["https://github.com/example/meeting-note-studio"]
          },
          {
            title: "Voice Archive",
            summary: "음성 인터뷰를 편집 가능한 기록으로 바꾸는 서비스",
            contribution: "프롬프트 구조화와 운영 워크플로우 설계",
            links: ["https://github.com/example/voice-archive"]
          }
        ],
        retrospective: "AI 기능은 모델 성능보다도 사용자 검토 흐름이 중요하다는 점을 체감했습니다.",
        mentorComment: "제품 관점에서 AI 기능을 좁혀내는 판단이 안정적이었습니다.",
        photos: [
          "https://picsum.photos/seed/ai-bootcamp-1/1200/900",
          "https://picsum.photos/seed/ai-bootcamp-2/1200/900"
        ],
        certificateMessage: "문제와 기술을 연결한 성장을 다음 단계에서도 이어가길 바랍니다."
      }
    ]
  }
];
