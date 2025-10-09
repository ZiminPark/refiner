# 🚀 Refiner 앱 배포 가이드

이 문서는 Refiner 앱을 프로덕션 환경에 배포하는 방법을 설명합니다.

## 목차
1. [Vercel로 배포하기 (추천)](#vercel로-배포하기-추천)
2. [환경 변수 설정](#환경-변수-설정)
3. [Supabase 설정](#supabase-설정)
4. [배포 후 확인사항](#배포-후-확인사항)
5. [다른 플랫폼 배포](#다른-플랫폼-배포)

---

## Vercel로 배포하기 (추천)

Vercel은 Next.js를 개발한 회사의 플랫폼으로, Next.js 앱 배포에 최적화되어 있습니다.

### 1단계: Vercel 계정 생성 및 연결

1. [Vercel](https://vercel.com)에 접속하여 GitHub 계정으로 로그인
2. "Add New Project" 클릭
3. GitHub 저장소에서 이 프로젝트 선택
4. Import 버튼 클릭

### 2단계: 프로젝트 설정

Vercel이 자동으로 Next.js 프로젝트를 감지합니다.

**Build & Development Settings:**
- Framework Preset: `Next.js` (자동 감지)
- Build Command: `npm run build` (기본값)
- Output Directory: `.next` (기본값)
- Install Command: `npm install` (기본값)

### 3단계: 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수들을 추가:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

> ⚠️ **중요**: 
> - `NEXT_PUBLIC_` prefix가 있는 변수는 클라이언트에서 접근 가능
> - `OPENAI_API_KEY`는 서버 사이드에서만 사용되므로 prefix 없음

### 4단계: 배포

"Deploy" 버튼 클릭하면 자동으로 배포가 시작됩니다.

배포 완료 후:
- Production URL이 생성됩니다 (예: `https://your-app.vercel.app`)
- 이후 main 브랜치에 push하면 자동으로 재배포됩니다
- 다른 브랜치는 Preview 배포가 생성됩니다

---

## 환경 변수 설정

### 필수 환경 변수

로컬 개발을 위해 `.env.local` 파일을 생성하세요:

```bash
# .env.local

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI API (문장 변환 기능)
OPENAI_API_KEY=sk-your-openai-api-key
```

### 환경 변수 가져오는 방법

**Supabase:**
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. Settings → API
4. Project URL과 anon/public key 복사

**OpenAI:**
1. [OpenAI Platform](https://platform.openai.com) 접속
2. API Keys 섹션에서 새 키 생성

---

## Supabase 설정

### 1. Supabase 프로젝트 생성

1. [Supabase](https://app.supabase.com) 접속
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전 설정

### 2. 데이터베이스 마이그레이션

마이그레이션 파일이 `supabase/migrations/` 디렉토리에 있다면:

```bash
# Supabase CLI 설치 (아직 안 했다면)
npm install -g supabase

# Supabase 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

또는 Supabase Dashboard에서 SQL Editor를 사용하여 수동으로 마이그레이션:

1. Dashboard → SQL Editor
2. 마이그레이션 파일의 SQL 내용 복사 & 실행

### 3. Supabase URL 설정

Vercel 배포 후 Supabase에서 허용된 URL을 추가해야 합니다:

1. Supabase Dashboard → Authentication → URL Configuration
2. **Site URL**: `https://your-app.vercel.app`
3. **Redirect URLs**: 
   - `https://your-app.vercel.app/**`
   - `http://localhost:3000/**` (로컬 개발용)

---

## 배포 후 확인사항

### ✅ 체크리스트

- [ ] 앱이 정상적으로 로드되는가?
- [ ] 환경 변수가 올바르게 설정되었는가?
- [ ] Supabase 연결이 정상적으로 작동하는가?
- [ ] OpenAI API를 통한 문장 변환이 작동하는가?
- [ ] 모든 페이지가 정상적으로 렌더링되는가?
  - `/` (메인 페이지)
  - `/app` (앱 페이지)
  - `/app/history` (히스토리)
  - `/app/settings` (설정)

### 디버깅

배포 후 문제가 발생하면:

1. **Vercel Dashboard → Deployments → 해당 배포 클릭 → Logs**
2. **Vercel Dashboard → Settings → Environment Variables** 확인
3. **Browser Console**에서 에러 메시지 확인

---

## 다른 플랫폼 배포

### Netlify

```bash
# netlify.toml 생성
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

1. Netlify에 로그인
2. "Add new site" → "Import an existing project"
3. GitHub 저장소 연결
4. 환경 변수 설정 (Vercel과 동일)
5. Deploy

### Docker + 클라우드 서비스 (AWS, GCP, Azure)

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

**next.config.ts에 추가:**
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... 기존 설정
};
```

### Railway, Render 등

1. 프로젝트 연결
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. 환경 변수 설정
5. Deploy

---

## 성능 최적화 팁

### 1. 이미지 최적화

```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      hostname: 'picsum.photos',
    },
    // 다른 이미지 도메인 추가
  ],
}
```

### 2. 캐싱 전략

Vercel은 자동으로 CDN 캐싱을 제공하지만, 추가 최적화:

```typescript
// src/app/api/refine/route.ts
export const runtime = 'edge'; // Edge Runtime 사용
```

### 3. 번들 크기 분석

```bash
# 번들 크기 분석
npm install --save-dev @next/bundle-analyzer

# package.json에 스크립트 추가
"analyze": "ANALYZE=true npm run build"
```

---

## 문제 해결

### 빌드 에러

**에러: ESLint errors**
```typescript
// next.config.ts
eslint: {
  ignoreDuringBuilds: true, // 이미 설정되어 있음
}
```

**에러: TypeScript errors**
```bash
npm run build
```
로컬에서 먼저 테스트하고 타입 에러 수정

### 런타임 에러

**환경 변수가 undefined**
- Vercel에서 환경 변수 재확인
- 변수명이 정확한지 확인 (`NEXT_PUBLIC_` prefix)
- 재배포 필요할 수 있음

**Supabase 연결 실패**
- Supabase URL과 API 키 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- Redirect URLs에 배포 URL 추가했는지 확인

**OpenAI API 에러**
- API 키가 유효한지 확인
- API 사용량 한도 확인
- Rate limit 에러라면 재시도 로직 추가 고려

---

## 모니터링 및 분석

### Vercel Analytics

무료로 기본 분석 제공:
- Web Vitals
- 페이지뷰
- 성능 메트릭

Dashboard → Analytics에서 확인

### Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 커스텀 도메인 설정

Vercel에서 커스텀 도메인 연결:

1. Vercel Dashboard → Settings → Domains
2. 도메인 입력 (예: `refiner.yourdomain.com`)
3. DNS 레코드 추가:
   - Type: `CNAME`
   - Name: `refiner` (또는 원하는 서브도메인)
   - Value: `cname.vercel-dns.com`
4. SSL은 자동으로 설정됩니다

---

## CI/CD 설정

Vercel은 자동으로 CI/CD를 제공하지만, 커스텀 GitHub Actions:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

---

## 요약

**가장 쉬운 배포 방법:**

1. GitHub에 코드 푸시
2. Vercel에서 Import
3. 환경 변수 설정
4. Deploy 버튼 클릭
5. ✅ 완료!

**배포 시간:** 약 5-10분  
**비용:** 무료 (Hobby plan)

질문이 있으시면 언제든지 물어보세요! 🚀
