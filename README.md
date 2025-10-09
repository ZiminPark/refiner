# Refiner

영어 문장을 자연스러운 미국식 영어로 변환해주는 AI 기반 문장 교정 앱입니다.

이 프로젝트는 [`EasyNext`](https://github.com/easynext/easynext)를 사용해 생성된 [Next.js](https://nextjs.org) 프로젝트입니다.

## 주요 기능

- ✍️ **문장 변환**: AI를 통한 자연스러운 영어 문장 교정
- 📝 **문법 교정**: 문법 오류 자동 수정
- 📚 **히스토리 관리**: 변환 기록 저장 및 조회
- 💾 **문장 저장**: 변환된 문장 저장 기능

## Getting Started

### 환경 변수 설정

먼저 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

자세한 환경 변수 설정 방법은 [배포 가이드](./DEPLOYMENT.md#환경-변수-설정)를 참고하세요.

### 개발 서버 실행

개발 서버를 실행합니다:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

`app/page.tsx` 파일을 수정하여 페이지를 편집할 수 있습니다. 파일을 수정하면 자동으로 페이지가 업데이트됩니다.

## 배포하기

앱을 프로덕션 환경에 배포하는 방법은 [배포 가이드](./DEPLOYMENT.md)를 참고하세요.

**빠른 배포 (Vercel):**
1. [Vercel](https://vercel.com)에 로그인
2. 프로젝트 Import
3. 환경 변수 설정
4. Deploy 버튼 클릭

자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md) 참고

## 기본 포함 라이브러리

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Shadcn UI](https://ui.shadcn.com)
- [Lucide Icon](https://lucide.dev)
- [date-fns](https://date-fns.org)
- [react-use](https://github.com/streamich/react-use)
- [es-toolkit](https://github.com/toss/es-toolkit)
- [Zod](https://zod.dev)
- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com)
- [TS Pattern](https://github.com/gvergnaud/ts-pattern)

## 사용 가능한 명령어

한글버전 사용

```sh
easynext lang ko
```

최신버전으로 업데이트

```sh
npm i -g @easynext/cli@latest
# or
yarn add -g @easynext/cli@latest
# or
pnpm add -g @easynext/cli@latest
```

Supabase 설정

```sh
easynext supabase
```

Next-Auth 설정

```sh
easynext auth

# ID,PW 로그인
easynext auth idpw
# 카카오 로그인
easynext auth kakao
```

유용한 서비스 연동

```sh
# Google Analytics
easynext gtag

# Microsoft Clarity
easynext clarity

# ChannelIO
easynext channelio

# Sentry
easynext sentry

# Google Adsense
easynext adsense
```
