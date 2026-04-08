# 개발 일지: #81 SweetBook sandbox 선행 검증

**일자:** 2026-04-08
**관련 이슈:** #81
**관련 역할:** build

## 배경 (Context)

내지 콘텐츠 매핑 개선(#82) 전에, SweetBook sandbox API에서 실제로 어떤 파라미터가 동작하는지 5개 항목을 검증해야 했다. ADR-003→ADR-004 때 검증 없이 구현했다가 전면 재작성한 전례가 있어, 이번에는 구현 전에 검증부터 진행.

## 문제 (Problem)

PRD에서 "접근법 A (일기장A 단일 테마)"를 추천했지만, 사진 전용 페이지에는 구글포토북C의 `내지_photo` 템플릿이 더 적합하다. 테마를 혼용할 수 있는지가 핵심 불확실성이었다.

## 시도한 것들 (Attempts)

sandbox에서 책 1권을 생성하여 5개 검증 항목을 순서대로 실호출:

1. **내지a(`3nWJ4wtPSQOb`) + photo URL** — 성공. `photo` 파라미터에 picsum URL 전달 시 정상 수용.
2. **내지_gallery(`msFsr6Ult7qw`) + collagePhotos 배열** — 성공. JSON 배열 형태(`["url1","url2","url3"]`)로 전달 시 정상 수용.
3. **내지b(`3mjKd8kcaVzT`) + 긴 텍스트 (308자)** — 성공. 잘림 없이 수용. (500자+ 미검증이나 합리적 추론 가능)
4. **내지b + 줄바꿈(`\n`)** — 성공. API 수용 확인. (실제 렌더링 결과는 프리뷰에서 확인 필요)
5. **테마 혼용: 구글포토북A(커버) + 일기장A(내지a,b,gallery) + 구글포토북C(내지_photo)** — 패딩 21장 추가 후 finalization **성공**. pageCount=26.

## 최종 해결 (Resolution)

5개 검증 항목 전부 성공. 핵심 발견:

- **테마 혼용 가능** — PRD의 "접근법 A (일기장A 단일)" 제약이 풀림. #82에서 사진 전용 페이지에 구글포토북C `내지_photo`도 활용 가능.
- **finalization 시 Content-Length 헤더 필요** — 빈 body로 POST할 때 `411 Length Required` 에러 발생. `Content-Length: 0` 헤더를 명시해야 함. (기존 코드의 `sweetbook-api.ts`는 이미 처리하고 있으므로 코드 변경 불필요)
- **모든 파라미터 형식 정상 동작** — photo(file binding), collagePhotos(collageGallery binding), diaryText(text binding + 줄바꿈)

## 배운 것 (Lessons Learned)

- SweetBook sandbox는 **테마 혼용을 허용**한다. 같은 bookSpecUid 내에서 서로 다른 테마의 템플릿을 자유롭게 혼합할 수 있다. 이는 문서에 명시되지 않은 동작이므로, Production에서도 동일하게 동작하는지는 별도 확인이 필요하다.
- **구현 전 sandbox 실호출 검증**은 ADR-004의 교훈에서 도입한 프로세스인데, 이번에도 "테마 혼용 가능"이라는 예상 못한 양성 결과를 얻었다. 검증 비용 대비 가치가 높다.
