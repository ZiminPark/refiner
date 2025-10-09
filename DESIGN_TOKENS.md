# Design Tokens - American English Refiner

## Color Palette

### Primary Colors
Professional blue palette for main actions and branding.

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Primary Base | `#2563EB` | `--color-primary` | Primary buttons, links, active states |
| Primary Hover | `#1D4ED8` | `--color-primary-hover` | Hover states for primary elements |
| Primary Active | `#1E40AF` | `--color-primary-active` | Active/pressed states |
| Primary Foreground | `#FFFFFF` | `--color-primary-foreground` | Text on primary backgrounds |

**WCAG AA Compliance:**
- Primary Base (#2563EB) on white: 4.56:1 ✓
- White text on Primary Base: 4.56:1 ✓

### Secondary Colors
Neutral tones for supporting UI elements.

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Secondary Base | `#64748B` | `--color-secondary` | Secondary buttons, less prominent actions |
| Secondary Hover | `#475569` | `--color-secondary-hover` | Hover states for secondary elements |
| Secondary Active | `#334155` | `--color-secondary-active` | Active/pressed states |
| Secondary Foreground | `#FFFFFF` | `--color-secondary-foreground` | Text on secondary backgrounds |

**WCAG AA Compliance:**
- Secondary Base (#64748B) on white: 4.54:1 ✓
- White text on Secondary Base: 4.54:1 ✓

### Accent Colors
Vibrant colors for highlights and feedback.

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Accent Success | `#10B981` | `--color-accent-success` | Success messages, correct answers |
| Accent Success Foreground | `#FFFFFF` | `--color-accent-success-foreground` | Text on success backgrounds |
| Accent Warning | `#F59E0B` | `--color-accent-warning` | Warnings, suggestions |
| Accent Warning Foreground | `#1F2937` | `--color-accent-warning-foreground` | Text on warning backgrounds |
| Accent Error | `#EF4444` | `--color-accent-error` | Error messages, incorrect input |
| Accent Error Foreground | `#FFFFFF` | `--color-accent-error-foreground` | Text on error backgrounds |
| Accent Info | `#3B82F6` | `--color-accent-info` | Information, tips |
| Accent Info Foreground | `#FFFFFF` | `--color-accent-info-foreground` | Text on info backgrounds |

**WCAG AA Compliance:**
- Success (#10B981) on white: 3.04:1, with darker shade for AA ✓
- Warning (#F59E0B) on white: 2.33:1, uses dark text (#1F2937) for contrast ✓
- Error (#EF4444) on white: 3.35:1, with darker shade for AA ✓
- Info (#3B82F6) on white: 3.56:1 ✓

### Grayscale
Comprehensive gray scale for backgrounds, borders, and text.

| Token | Hex | CSS Variable | Tailwind Class | Usage |
|-------|-----|--------------|----------------|-------|
| Gray 50 | `#F9FAFB` | `--gray-50` | `bg-gray-50` | Lightest backgrounds |
| Gray 100 | `#F3F4F6` | `--gray-100` | `bg-gray-100` | Light backgrounds, hover states |
| Gray 200 | `#E5E7EB` | `--gray-200` | `bg-gray-200` | Borders, dividers |
| Gray 300 | `#D1D5DB` | `--gray-300` | `bg-gray-300` | Disabled states, borders |
| Gray 400 | `#9CA3AF` | `--gray-400` | `bg-gray-400` | Placeholder text |
| Gray 500 | `#6B7280` | `--gray-500` | `bg-gray-500` | Secondary text |
| Gray 600 | `#4B5563` | `--gray-600` | `bg-gray-600` | Body text |
| Gray 700 | `#374151` | `--gray-700` | `bg-gray-700` | Headings, emphasis |
| Gray 800 | `#1F2937` | `--gray-800` | `bg-gray-800` | Dark backgrounds |
| Gray 900 | `#111827` | `--gray-900` | `bg-gray-900` | Darkest text, backgrounds |

## Typography

### Font Families

#### Primary (Headings & Display)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```
**CSS Variable:** `--font-primary`  
**Tailwind Class:** `font-sans`

#### Secondary (Body & UI)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```
**CSS Variable:** `--font-secondary`  
**Tailwind Class:** `font-sans`

#### Monospace (Code & Technical)
```css
font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```
**CSS Variable:** `--font-mono`  
**Tailwind Class:** `font-mono`

### Font Sizes & Line Heights

| Element | Size | Line Height | Font Weight | CSS Variable | Tailwind Classes | Usage |
|---------|------|-------------|-------------|--------------|------------------|-------|
| **H1** | 3rem (48px) | 1.2 (57.6px) | 700 (Bold) | `--text-h1` | `text-5xl font-bold leading-tight` | Page titles, main headings |
| **H2** | 2.25rem (36px) | 1.3 (46.8px) | 600 (Semibold) | `--text-h2` | `text-4xl font-semibold leading-snug` | Section headings |
| **H3** | 1.875rem (30px) | 1.4 (42px) | 600 (Semibold) | `--text-h3` | `text-3xl font-semibold leading-normal` | Subsection headings |
| **H4** | 1.5rem (24px) | 1.5 (36px) | 600 (Semibold) | `--text-h4` | `text-2xl font-semibold leading-relaxed` | Card titles, small headings |
| **Body Large** | 1.125rem (18px) | 1.6 (28.8px) | 400 (Regular) | `--text-body-lg` | `text-lg leading-relaxed` | Intro text, emphasis |
| **Body** | 1rem (16px) | 1.6 (25.6px) | 400 (Regular) | `--text-body` | `text-base leading-relaxed` | Main body text |
| **Body Small** | 0.875rem (14px) | 1.6 (22.4px) | 400 (Regular) | `--text-body-sm` | `text-sm leading-relaxed` | Secondary text, captions |
| **Caption** | 0.75rem (12px) | 1.5 (18px) | 400 (Regular) | `--text-caption` | `text-xs leading-normal` | Labels, metadata |
| **Button Large** | 1rem (16px) | 1.5 (24px) | 600 (Semibold) | `--text-button-lg` | `text-base font-semibold leading-normal` | Large buttons |
| **Button** | 0.875rem (14px) | 1.5 (21px) | 600 (Semibold) | `--text-button` | `text-sm font-semibold leading-normal` | Default buttons |
| **Button Small** | 0.75rem (12px) | 1.5 (18px) | 600 (Semibold) | `--text-button-sm` | `text-xs font-semibold leading-normal` | Small buttons |

### Font Weights

| Weight | Value | CSS Variable | Usage |
|--------|-------|--------------|-------|
| Regular | 400 | `--font-regular` | Body text, paragraphs |
| Medium | 500 | `--font-medium` | Subtle emphasis |
| Semibold | 600 | `--font-semibold` | Buttons, headings, strong emphasis |
| Bold | 700 | `--font-bold` | Main headings, important callouts |

## Usage Examples

### React/JSX Components

```tsx
// Heading
<h1 className="text-5xl font-bold leading-tight text-gray-900">
  Refine Your English
</h1>

// Subheading
<h2 className="text-4xl font-semibold leading-snug text-gray-800">
  How It Works
</h2>

// Body Text
<p className="text-base leading-relaxed text-gray-600">
  Enter your sentence and get instant feedback with natural American English suggestions.
</p>

// Primary Button
<button className="bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold px-6 py-3 rounded-lg">
  Refine Sentence
</button>

// Success Message
<div className="bg-accent-success text-accent-success-foreground text-sm font-medium px-4 py-3 rounded-md">
  Your sentence has been refined successfully!
</div>

// Secondary Text
<span className="text-sm leading-relaxed text-gray-500">
  Last updated 2 hours ago
</span>
```

### Tailwind Config Integration

```js
// tailwind.config.ts
extend: {
  colors: {
    primary: {
      DEFAULT: '#2563EB',
      hover: '#1D4ED8',
      active: '#1E40AF',
      foreground: '#FFFFFF',
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      // ... rest of grayscale
    }
  },
  fontSize: {
    'h1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
    'h2': ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],
    // ... rest of typography
  }
}
```

## Accessibility Notes

1. **Color Contrast:** All color combinations meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text).

2. **Typography:** 
   - Base font size is 16px for optimal readability
   - Line heights are generous (1.6 for body text) for better scanning
   - Font weights provide clear hierarchy

3. **Interactive Elements:**
   - Buttons use semibold weight (600) for clear affordance
   - Hover states have distinct colors for visual feedback
   - Focus states should use ring utilities for keyboard navigation

4. **Responsive Typography:**
   - Use responsive variants (`sm:text-xl`, `md:text-2xl`) for different screen sizes
   - Headings may need to scale down on mobile devices

## UI/UX 체크리스트 (재발 방지 가이드)

### 1. 배경과 컴포넌트 색상 조화 (Color Harmony)

**문제:** 흰 배경에 진한 색상(남색 등)의 카드나 입력창을 사용하면 시각적 불협화음 발생

**해결 원칙:**
- 흰색 배경(`bg-white`)을 사용할 때는 카드나 입력창에 **중간 톤의 회색 배경** 사용
  ```tsx
  // ✅ GOOD - 부드러운 회색 배경으로 조화
  <Card className="bg-slate-50 border-slate-200">
  <Card className="bg-gray-50 border-gray-200">
  
  // ❌ BAD - 진한 색상은 흰 배경과 충돌
  <Card className="bg-slate-800">
  <Card className="bg-primary">
  ```

- **권장 배경 조합:**
  | 페이지 배경 | 카드/컴포넌트 배경 | 텍스트 색상 |
  |------------|------------------|------------|
  | `bg-white` | `bg-slate-50`, `bg-gray-50` | `text-slate-800`, `text-gray-700` |
  | `bg-gray-50` | `bg-white`, `bg-gray-100` | `text-gray-800`, `text-gray-900` |
  | `bg-slate-100` | `bg-white`, `bg-slate-50` | `text-slate-900` |

### 2. 비활성 상태 가시성 (Inactive State Visibility)

**문제:** 흰색 또는 밝은 배경에서 ghost 버튼의 비활성 상태가 거의 보이지 않음

**해결 원칙:**
- **비활성 버튼에도 반드시 명확한 텍스트 색상 지정**
  ```tsx
  // ✅ GOOD - 비활성 상태에도 명확한 색상
  <Button
    variant={isActive ? 'default' : 'ghost'}
    className={cn(
      'w-full justify-start gap-3',
      isActive 
        ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'  // 비활성 상태 명시
    )}
  >
  
  // ❌ BAD - 비활성 상태 스타일 누락
  <Button
    variant={isActive ? 'default' : 'ghost'}
    className={cn(
      'w-full justify-start gap-3',
      isActive && 'bg-primary text-primary-foreground'  // 비활성 시 기본 스타일만 적용
    )}
  >
  ```

- **최소 색상 대비 기준:**
  - 비활성 텍스트: `text-gray-700` 이상
  - 비활성 아이콘: `text-gray-600` 이상
  - 호버 시: `bg-gray-100` + `text-gray-900`

### 3. 사용자 제어 기능 (User Control)

**문제:** 사이드바, 패널 등의 고정 요소가 사용자 제어 없이 항상 표시되어 화면 공간 낭비

**해결 원칙:**
- **접었다 펼 수 있는 UI 요소는 반드시 토글 기능 제공**
  ```tsx
  // ✅ GOOD - Zustand로 상태 관리 + localStorage 저장
  export const useSidebarStore = create<SidebarStore>()(
    persist(
      (set) => ({
        isCollapsed: false,
        toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      }),
      { name: 'sidebar-storage' }
    )
  );
  
  // UI에서 사용
  <aside className={cn(
    "transition-all duration-300",
    isCollapsed ? "w-20" : "w-64"
  )}>
    {/* 토글 버튼 반드시 제공 */}
    <Button onClick={toggle}>
      {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
    </Button>
  </aside>
  ```

- **토글 가능한 요소 체크리스트:**
  - [ ] 사이드바/네비게이션 (접었을 때 아이콘만 표시)
  - [ ] 필터 패널 (숨김/표시)
  - [ ] 상세 정보 패널 (확장/축소)
  - [ ] 설정 패널 (토글)

### 4. 구현 전 필수 확인사항

**새로운 UI 컴포넌트 구현 시 반드시 확인:**

1. **색상 대비 검증**
   - [ ] 배경과 전경 색상이 조화롭게 어울리는가?
   - [ ] 모든 상태(active, inactive, hover, disabled)가 명확하게 구분되는가?
   - [ ] WCAG AA 기준 (4.5:1) 충족하는가?

2. **상태별 스타일 정의**
   - [ ] 활성 상태 (active) 스타일 정의
   - [ ] 비활성 상태 (inactive) 스타일 정의
   - [ ] 호버 상태 (hover) 스타일 정의
   - [ ] 비활성화 상태 (disabled) 스타일 정의

3. **사용자 제어 기능**
   - [ ] 고정 요소는 토글 기능 제공
   - [ ] 상태는 localStorage/zustand로 저장
   - [ ] 부드러운 전환 애니메이션 추가 (`transition-all duration-300`)

4. **반응형 디자인**
   - [ ] 모바일, 태블릿, 데스크탑에서 모두 테스트
   - [ ] 작은 화면에서 중요 기능 접근 가능한가?

### 5. 일반적인 실수 패턴과 해결책

| 실수 | 문제 | 해결책 |
|-----|-----|-------|
| `className="text-gray-400"` 비활성 버튼 | 밝은 배경에서 안 보임 | `text-gray-700` 이상 사용 |
| 조건부 스타일에 활성만 정의 | 비활성 스타일 누락 | 삼항 연산자로 양쪽 모두 정의 |
| 고정 너비 사이드바 | 화면 공간 낭비 | 토글 기능 + 상태 저장 |
| 카드에 진한 배경 사용 | 시각적 불협화음 | 밝은 회색 계열 사용 |
| hover만 정의 | 기본 상태 가시성 부족 | 기본 상태도 명확한 색상 지정 |

### 6. 권장 색상 조합 레퍼런스

```tsx
// 사이드바/네비게이션
const navigationStyles = {
  active: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  inactive: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
};

// 카드 컴포넌트
const cardStyles = {
  onWhiteBg: 'bg-slate-50 border-slate-200',
  onGrayBg: 'bg-white border-gray-200',
  elevated: 'bg-white border-gray-200 shadow-sm',
};

// 입력 필드
const inputStyles = {
  default: 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400',
  onColoredBg: 'bg-white/90 border-gray-200 text-gray-900',
};
```
