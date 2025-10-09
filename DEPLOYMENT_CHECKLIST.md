# 🚀 배포 체크리스트

프로덕션 배포 전에 확인해야 할 사항들입니다.

## ✅ 배포 전 체크리스트

### 1. 코드 품질
- [ ] 모든 테스트 통과
- [ ] Lint 오류 없음 (`npm run lint`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] TypeScript 타입 오류 없음

### 2. 환경 변수
- [ ] Supabase URL 설정
- [ ] Supabase Anon Key 설정
- [ ] OpenAI API Key 설정
- [ ] 모든 환경 변수가 Vercel에 추가됨

### 3. Supabase 설정
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 마이그레이션 완료
- [ ] Authentication 설정
- [ ] Redirect URLs에 배포 URL 추가
- [ ] RLS (Row Level Security) 정책 확인

### 4. API 키 확인
- [ ] OpenAI API 키 유효성 확인
- [ ] API 사용량 한도 확인
- [ ] Billing 정보 설정 (OpenAI)

### 5. 보안
- [ ] `.env.local` 파일이 `.gitignore`에 포함됨
- [ ] 민감한 정보가 코드에 하드코딩되지 않음
- [ ] API 키가 서버 사이드에서만 사용됨 (NEXT_PUBLIC_ prefix 주의)

### 6. 성능
- [ ] 이미지 최적화 설정
- [ ] 불필요한 console.log 제거
- [ ] 번들 크기 확인

### 7. SEO & 메타데이터
- [ ] 페이지 title 설정
- [ ] meta description 설정
- [ ] Open Graph 이미지 설정 (선택사항)
- [ ] favicon 설정

## 🎯 Vercel 배포 단계별 가이드

### 1단계: GitHub 준비
```bash
# 최신 코드를 GitHub에 push
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2단계: Vercel 연결
1. https://vercel.com 접속
2. "Add New Project" 클릭
3. GitHub 저장소 Import
4. "Import" 버튼 클릭

### 3단계: 환경 변수 설정
Environment Variables 섹션에 다음을 추가:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxx...
OPENAI_API_KEY = sk-xxx...
```

### 4단계: 배포
"Deploy" 버튼 클릭!

### 5단계: Supabase URL 업데이트
1. Vercel에서 배포 URL 복사 (예: https://your-app.vercel.app)
2. Supabase Dashboard → Authentication → URL Configuration
3. Site URL과 Redirect URLs에 배포 URL 추가

## ✅ 배포 후 확인사항

### 기능 테스트
- [ ] 메인 페이지 로드 확인
- [ ] 문장 변환 기능 작동 확인
- [ ] 히스토리 페이지 확인
- [ ] 설정 페이지 확인
- [ ] 반응형 디자인 확인 (모바일/태블릿/데스크톱)

### 성능 테스트
- [ ] 페이지 로딩 속도 확인
- [ ] Lighthouse 점수 확인
- [ ] Core Web Vitals 확인

### 에러 확인
- [ ] Browser Console에 에러 없음
- [ ] Vercel Logs에 에러 없음
- [ ] Sentry 설정 (선택사항)

## 🔧 문제 해결

### 배포는 성공했지만 앱이 작동하지 않을 때

1. **Vercel Logs 확인**
   - Dashboard → Deployments → 해당 배포 → Runtime Logs

2. **환경 변수 확인**
   - Settings → Environment Variables
   - 변수 이름 오타 확인
   - `NEXT_PUBLIC_` prefix 확인

3. **재배포**
   - Deployments → 해당 배포 → ... → Redeploy

### Supabase 연결 오류

1. **URL 확인**
   - Supabase Dashboard → Settings → API
   - URL이 정확한지 확인

2. **Redirect URLs 확인**
   - Authentication → URL Configuration
   - 배포 URL이 추가되어 있는지 확인

3. **API Key 확인**
   - anon/public key를 사용하는지 확인 (service_role key 아님!)

### OpenAI API 오류

1. **API Key 확인**
   - https://platform.openai.com/api-keys
   - 키가 유효한지 확인

2. **Usage Limits**
   - https://platform.openai.com/usage
   - 사용량 한도 확인

3. **Billing**
   - https://platform.openai.com/settings/organization/billing
   - 결제 정보 설정 확인

## 📊 모니터링 설정

### Vercel Analytics (무료)
```bash
npm install @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Vercel Speed Insights (무료)
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

## 🎉 배포 완료!

배포가 완료되면:
- ✅ 앱 URL 저장
- ✅ 팀원들과 공유
- ✅ 문서 업데이트
- ✅ 사용자 피드백 수집 시작

---

## 다음 단계

1. **커스텀 도메인 연결** (선택사항)
   - Vercel Dashboard → Settings → Domains

2. **CI/CD 파이프라인 개선**
   - GitHub Actions 추가
   - 자동 테스트 설정

3. **모니터링 강화**
   - Sentry 연동
   - Logging 시스템 구축

4. **성능 최적화**
   - 번들 크기 분석
   - 이미지 최적화
   - Caching 전략 개선

자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md) 참고하세요!
