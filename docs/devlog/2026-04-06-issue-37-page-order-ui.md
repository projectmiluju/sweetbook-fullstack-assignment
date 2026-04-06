# 개발 일지: 페이지 순서 변경 UI 구현 (#37)

**일자:** 2026-04-06
**관련 버전:** v0.1.0
**관련 역할:** build, qa

## 배경 (Context)

PRD 8.1절의 "페이지 순서 변경" 편집 기능을 구현한다. #35에서 `EditSession.pages: string[]` 필드를 미리 확보해 두었고, 이 이슈에서 초기화 로직과 위아래 이동 UI를 실제로 연결한다. 드래그 앤 드롭은 이슈 단계에서 외부 라이브러리 의존성·모바일 대응 복잡도를 이유로 명시적으로 제외했다.

## 문제 (Problem)

1. `createDefaultEditSession`은 `pages: []`로 초기화하지만, 실제 기본 순서를 만들려면 student 데이터(`projects.length`, `photos.length`)가 필요하다. factory 함수가 이 데이터를 받지 않는 구조였다.
2. `getPageLabel`(pageId → 표시 레이블 매핑) 함수를 어디에 둘지 결정해야 했다. `lib/edit-session.ts`에 넣으면 `ProjectSummary` 타입 import가 필요해 lib 레이어가 API 타입에 의존하게 된다.

## 최종 해결 (Resolution)

### factory override 패턴으로 pages 초기화

```typescript
useState<EditSession>(() => ({
  ...createDefaultEditSession(bookType, studentName),
  pages: buildDefaultPages(projects.length, photos.length)
}))
```

`createDefaultEditSession`에 파라미터를 추가하지 않고, 클라이언트 컴포넌트에서 spread override로 `pages`를 교체했다. 이유:

- `lib/edit-session.ts`는 순수 상태 유틸 레이어로 유지한다. API 타입(`ProjectSummary`)을 이 레이어에 끌어들이면 lib과 api의 의존 방향이 역전된다.
- `buildDefaultPages(projectCount: number, photoCount: number)`는 count만 받으므로 lib 레이어가 API 타입에 의존하지 않는다.

### getPageLabel은 컴포넌트 내 함수로 배치

pageId(`project:0`, `photo:1`)를 사람이 읽는 레이블(`"프로젝트 제목"`, `"사진 2"`)로 변환하는 로직은 `projects` 배열에 접근해야 한다. 이 배열은 컴포넌트 props에서 옵니다. lib에 넣으면 projects를 인자로 받아야 하는데, 그렇게 되면 함수 시그니처가 API 타입에 의존하게 된다. 컴포넌트 내 클로저로 두는 것이 자연스럽다.

### movePage 경계 조건: throw 대신 no-op

```typescript
if (direction === "up" && index === 0) return pages;
if (direction === "down" && index === pages.length - 1) return pages;
```

경계에서 에러를 던지지 않고 원본을 반환한다. UI에서 버튼의 `disabled` 속성으로 이미 경계 조건을 막지만, 순수 함수 레이어에서도 방어적으로 처리해 함수 계약을 안전하게 유지했다.

## 배운 것 (Lessons Learned)

**lib 레이어의 독립성을 지키려면 파라미터를 "타입 인스턴스"가 아니라 "스칼라 값"으로 받아야 한다.** `buildDefaultPages(projectCount, photoCount)`처럼 count만 받으면 lib이 API 타입과 분리된다. 나중에 기수 단위 책(`cohort-showcase`)에서도 같은 패턴을 쓸 수 있다.

**QA에서 `buildDefaultPages`의 blockId 포맷 연동 계약 테스트를 추가했다.** `buildDefaultPages`가 `buildProjectBlockId`/`buildPhotoBlockId`를 경유해 ID를 생성한다는 것은 코드만 봐서는 명확하지 않다. 포맷이 독자적으로 작성되면 `isBlockHidden` 연동이 조용히 깨진다. `/qa`에서 이 계약을 테스트로 고정했다(총 78개).
