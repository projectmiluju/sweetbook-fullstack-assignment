# 개발 일지: hiddenBlocks 포함/제외 토글 UI 구현 (#36)

**일자:** 2026-04-06
**관련 버전:** v0.1.0
**관련 역할:** build, qa

## 배경 (Context)

Epic #3의 편집 경험 중 "콘텐츠 포함/제외" 이슈다. #35에서 `EditSession.hiddenBlocks: string[]` 필드를 미리 확보해 두었고, 이 이슈에서 그 필드를 실제 UI와 연결한다. 수료생 개인 책(individual)을 만들 때 사용자가 특정 프로젝트나 사진을 책에서 뺄 수 있어야 한다.

## 문제 (Problem)

1. `hiddenBlocks`에 넣을 blockId의 포맷이 정해지지 않았다. 타이틀 기반(`"홍길동의 첫 번째 프로젝트"`)으로 할 경우 특수 문자·공백이 섞이고, 여러 컨텍스트(projects, photos)가 같은 배열을 공유하므로 충돌 위험이 있다.
2. `EditForm.tsx`가 `projects`와 `photos` 데이터를 받지 않았기 때문에, Server Component에서 props로 내려주는 경계도 함께 확장해야 했다.

## 최종 해결 (Resolution)

### blockId 네임스페이스 스킴: `{type}:{index}`

`project:0`, `project:1`, `photo:0` 형태로 확정했다. 이 결정의 이유:

- **타입 접두사로 네임스페이스 분리**: `project:0`과 `photo:0`은 서로 다른 ID이므로 같은 인덱스를 가진 프로젝트와 사진이 충돌하지 않는다.
- **인덱스 기반**: 배열 인덱스는 렌더 순서와 일치하고 특수 문자가 없다. 타이틀 기반은 다국어·특수문자 이슈가 있어 배제했다.
- **순수 함수로 빌더 분리**: `buildProjectBlockId(index)`, `buildPhotoBlockId(index)`를 `lib/edit-session.ts`에 두어 컴포넌트가 문자열 포맷을 직접 조립하지 않도록 했다. 포맷이 바뀌어도 한 곳만 수정하면 된다.

### `toggleHiddenBlock` 불변 업데이트 패턴

```typescript
function handleToggleBlock(blockId: string) {
  setSession((prev) => ({
    ...prev,
    hiddenBlocks: toggleHiddenBlock(prev.hiddenBlocks, blockId)
  }));
}
```

`toggleHiddenBlock`은 원본 배열을 변경하지 않고 새 배열을 반환하는 순수 함수다. React의 `setState`가 이전 상태와 참조 동일성을 비교하기 때문에, 변이(mutation) 방식은 리렌더를 보장하지 못한다.

### 조건부 렌더링

`projects.length > 0`과 `photos.length > 0`을 체크해 데이터가 없는 경우 섹션 자체를 렌더하지 않는다. 빈 배열일 때 라벨만 떠 있는 UI를 피하기 위한 방어다.

## 배운 것 (Lessons Learned)

**블록 ID 설계는 타입별 네임스페이스를 처음부터 포함해야 한다.** 나중에 `cohort-showcase` 같은 기수 단위 책에 다른 블록 타입이 추가되더라도 `cohort:0` 형태로 동일 패턴을 따르면 된다. 처음부터 `{type}:{index}` 컨벤션을 잡은 덕분에 이후 확장 비용이 낮다.

**QA에서 네임스페이스 분리 검증 케이스가 누락되었다.** `/build`의 테스트 11개에는 `project:0 ≠ photo:0` 검증이 없었고, `/qa`에서 이를 발견해 2개를 추가했다(총 66개). 블록 ID처럼 같은 인덱스를 공유하는 두 타입이 있을 때는 네임스페이스 충돌 케이스를 테스트 시나리오에 명시적으로 넣어야 한다.
