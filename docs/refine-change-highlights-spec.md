# Refine 결과 “변경점 하이라이트(Grammarly 스타일)” FE 스펙 (Draft)

## 0) 배경 / 문제
- 현재 Refine 결과를 “원문 vs 수정본”으로 눈으로 비교하기 어려움(특히 짧은 3~4문장에서도 변경 지점을 찾기 위해 시선 왕복이 발생).
- 일반 유저 대상이므로 GitHub 스타일의 `+/-` diff 표기(규칙 학습 필요)나 좌우 Split 비교(시선 왕복)는 인지 부담이 큼.

## 1) 목표(Goals)
- 수정본을 **읽는 흐름을 깨지 않으면서**, “바뀐 지점”만 빠르게 파악할 수 있게 한다.
- **학습 비용이 낮은 UI**(설명 없이도 바로 이해)로 “어디가 달라졌는지”를 확인할 수 있게 한다.
- 모바일/터치 환경에서도 자연스럽게 동작(hover 의존 X).
- Copy / Save 등 기존 핵심 행동을 방해하지 않는다.

## 2) 비목표(Non-goals)
- 문장 단위 “Accept/Reject” (Grammarly의 트랙체인지 수준)은 1차 범위 아님.
- 변경점에 대한 “자동 분류(문법/톤/간결화 등)”는 1차 범위 아님.
- `/history` 페이지까지 확장하는 것은 2차 범위(후속 제안으로만 기록).

## 3) 1차 적용 화면 / 위치
- 적용 위치: `src/features/sentence/components/InputForm.tsx`의 “Refined Version” 카드.
- 변경 대상: 결과 영역의 출력 UI를 “Refined(편집)” / “Changes(하이라이트)” 모드로 분리.

## 4) UX 컨셉(Grammarly-lite)
### 핵심 원칙
- **Reading-first**: 기본 화면은 “수정본을 읽는 경험”을 우선한다.
- **Progressive disclosure**: “상세 비교(원문/수정)”는 클릭/탭 시에만 노출한다.
- **Low cognitive load**: `+/-` 문법이나 좌우 비교를 강요하지 않는다.

### 제안 UI(최소 컨트롤, 명확한 모드 전환)
- 결과 카드 내부에 **세그먼트 탭(2개)** 제공
  - `Changes` (기본 선택): 수정본을 읽되, 변경된 구간만 마커처럼 하이라이트(읽기 전용)
  - `Refined` : 기존처럼 Textarea로 수정본을 직접 편집(하이라이트 없음)
- `Changes` 라벨 옆에 변경 수를 `N changes` 형태로 표시(예: `3 changes`)
  - 변경 수는 “insert/replace/delete” change block의 개수 기준(아래 알고리즘 참고).
  - `N changes`는 클릭 가능(= 변경 목록/상세 뷰 오픈).

> 기본 선택을 `Changes`로 두는 이유: 사용자가 “어디가 바뀌었지?”라는 질문을 가장 먼저 갖기 때문. 편집은 `Refined` 탭으로 명확히 분리해 인지 모드를 전환한다.

## 5) 인터랙션 스펙
### 상태 정의
- conversion 결과가 있을 때만 노출.
- `viewMode: 'changes' | 'refined'`
  - 새 변환이 완료될 때마다 `viewMode = 'changes'`로 리셋(“변경점 확인” 목적 강화).
- `activeChangeId: string | null` (상세 다이얼로그에서 현재 보고 있는 변경)
- `isChangeDialogOpen: boolean`

### Changes 모드(읽기 전용)
- 수정본 텍스트를 그대로 렌더링하되, “변경된 구간(after)”만 하이라이트.
- 하이라이트 구간을 탭/클릭하면 `ChangeDetailsDialog` 오픈:
  - 제목: `Change 2 of 5`
  - 내용: `Before`(원문) / `After`(수정) 2블록
  - 내비게이션: `Prev` / `Next` 버튼(아이콘 가능) + 키보드 화살표(선택)

### Refined 모드(편집)
- 기존 `Textarea` 유지(현재 `refinedText` state에 바인딩).
- Copy 버튼은 항상 “현재 refinedText(plain text)”를 복사(하이라이트/마크업 영향 없음).

### 변경이 거의 없는 경우
- `N changes === 0`이면:
  - `Changes` 탭을 숨기거나(discoverability보다 단순성 우선) 비활성화(“No changes”) 중 하나 선택.
  - 추천: `Changes` 탭 숨김 + `Refined`만 보여주기(컨트롤 최소화).

## 6) 시각/디자인 가이드(인지 부담 최소화)
- 하이라이트는 “성공/경고/오류” 의미로 보이지 않게 **저채도 마커 느낌** 권장.
- 추천 스타일(토큰 기반):
  - 기본 하이라이트: `bg-accent-warning/20` + `rounded-sm`
  - hover/focus: `bg-accent-warning/30` + `ring-1 ring-primary/25`
  - 선택된 change(다이얼로그에서 활성화): 동일하되 `ring-primary/40` 정도로 강조
- 접근성:
  - 색만으로 구분하지 않도록 `underline decoration-primary/30` 등 보조 신호 추가(과하지 않게).
  - 하이라이트는 반드시 포커스 가능(키보드 탭 이동)해야 함.

## 7) 데이터 모델(프론트 내부 타입)
### 변경 블록(ChangeBlock)
```ts
type ChangeKind = 'insert' | 'delete' | 'replace';

type ChangeBlock = {
  id: string;          // stable key for rendering/navigation
  kind: ChangeKind;
  beforeText: string;  // original side text (can be "")
  afterText: string;   // refined side text (can be "")
};
```

### 렌더 세그먼트(RefinedSegments)
```ts
type RefinedSegment =
  | { type: 'equal'; text: string }
  | { type: 'changed'; text: string; changeId: string };
```

> `changed`는 “수정본(after)에서 눈에 보이는 구간”만 렌더링한다. `delete`-only change는 하이라이트 구간이 없으므로, `N changes` 클릭 시 열리는 “변경 목록/상세 내비게이션”에서만 확인 가능하게 처리한다.

## 8) Diff 로직 스펙(짧은 문장 최적화, 유지보수 친화)
### 요구사항
- 입력: `original: string`, `refined: string`
- 출력:
  - `segments: RefinedSegment[]` (Changes 모드 렌더용)
  - `changes: ChangeBlock[]` (다이얼로그/카운트/내비게이션용)

### 토크나이즈(tokenize)
- 우선: `Intl.Segmenter('en', { granularity: 'word' })` 사용
  - segment의 `isWordLike` 여부는 참고만(공백/구두점도 토큰으로 포함해 원문 형태 유지)
- fallback(브라우저 지원 부족 시):
  - 정규식 기반 분리: 공백(`\\s+`), 단어/숫자, 구두점으로 분해해 토큰 배열 생성

### Diff 알고리즘(권장)
텍스트가 짧으므로(3~4문장) **LCS 기반 DP**로 구현해도 성능/복잡도 모두 충분히 수용 가능.
- 입력 토큰 수가 커도 수백 단위라 O(n*m)이 현실적으로 문제 없음.

#### Diff 결과(op)
```ts
type DiffOp =
  | { op: 'equal'; tokens: string[] }
  | { op: 'insert'; tokens: string[] }
  | { op: 'delete'; tokens: string[] };
```

#### ChangeBlock 생성 규칙(그룹핑)
- 연속된 `delete` + `insert`는 1개의 `replace`로 묶는다.
- `insert` 단독은 `insert`.
- `delete` 단독은 `delete`(하이라이트는 없음).

#### RefinedSegment 생성 규칙
- `equal` → `{ type: 'equal', text: join(tokens) }`
- `insert` / `replace`의 afterText → `{ type: 'changed', text: join(insertTokens), changeId }`
- `delete` → segment 생성 없음(수정본에 존재하지 않으므로)
  - 단, `changes[]`에는 포함하여 `N changes` 및 다이얼로그 내비게이션에서 노출.

### 공백 토큰 처리(UX/클릭 타겟)
- `changed` segment가 공백만으로 구성되면 하이라이트를 적용하지 않고 `equal`로 취급(클릭 타겟이 “빈 영역”이 되는 문제 방지).
- `changed` segment의 앞/뒤 공백은 가능하면 `equal`로 분리해 클릭 영역을 단어 중심으로 유지(선택 구현).

## 9) 컴포넌트 설계(권장 파일 배치)
> 실제 구현 시 feature-first 규칙에 맞춰 `src/features/sentence/` 내부로 한정.

- `src/features/sentence/lib/diff.ts`
  - `computeChangeHighlights(original, refined) => { segments, changes }`
- `src/features/sentence/components/RefinedOutputTabs.tsx` (또는 결과 카드 내부로 인라인)
  - `viewMode` 토글 UI(`Changes`/`Refined`)
- `src/features/sentence/components/RefinedChangeHighlights.tsx`
  - `segments` 렌더(Changes 모드 본문)
- `src/features/sentence/components/ChangeDetailsDialog.tsx`
  - `changes` + `activeChangeId` 기반 상세 비교/내비게이션

## 10) 접근성(A11y) 체크리스트
- 하이라이트 구간은 `button` 또는 `role="button"` + `tabIndex=0`로 포커스 가능.
- 키보드:
  - `Enter`/`Space`로 상세 오픈
  - `Esc`로 닫기
  - (선택) 좌/우 화살표로 Prev/Next
- 스크린리더:
  - 하이라이트 버튼에 `aria-label="View change details"` + change index 포함 권장
  - 다이얼로그에 제목/설명 연결(`DialogTitle`, `DialogDescription`)

## 11) 수용 기준(Acceptance Criteria)
- 변환 결과가 나오면 `Changes` 탭이 기본 선택되고 변경 구간이 하이라이트된다.
- 하이라이트를 탭/클릭하면 `Before/After` 상세 비교를 볼 수 있다.
- `N changes`는 실제 change block 수와 일치한다(삭제-only 포함).
- Copy는 항상 “순수 refinedText”를 복사한다(마크업 포함 X).
- `Refined` 탭에서 수정본 편집이 가능하다(기존 동작 유지).
- 다크모드에서도 하이라이트 대비가 충분하고(과하지 않게) 텍스트 가독성이 유지된다.

## 12) 후속(2차) 제안
- `/history` 카드에도 동일한 `Changes` 뷰를 추가해 저장된 항목에서도 비교 가능하게 확장.
- 변경점 리스트(전체) + “jump to change” 제공(긴 텍스트 대비).
- 변경점별 accept/reject(트랙체인지)로 발전 가능.

## 13) 오픈 퀘스천(결정 필요)
- `Changes` 탭 기본 선택 유지 여부(현재 스펙은 “새 변환마다 Changes로 리셋”).
- `N changes == 0`일 때 탭 숨김 vs 비활성화(추천은 숨김).
- 하이라이트 색상 토큰(`accent-warning` 기반 vs 전용 토큰 추가).

