# Refiner

영어 문장을 자연스러운 미국식 영어로 변환해주는 AI 기반 문장 교정 앱입니다.


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
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

`app/page.tsx` 파일을 수정하여 페이지를 편집할 수 있습니다. 파일을 수정하면 자동으로 페이지가 업데이트됩니다.
