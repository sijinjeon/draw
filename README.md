# 🎰 Multi-Mode Roulette

4가지 재미있는 모드로 추첨하세요! 3D 휠 스피너, 마블 레이스, 풍선 터뜨리기, 해적 룰렛.

## 🚀 데모

GitHub Pages: [Live Demo](#) (배포 후 링크 추가)

## ✨ 주요 기능

### 🎮 4가지 추첨 모드

| 모드 | 설명 | 기술 |
|------|------|------|
| 🎡 **3D 휠 스피너** | 3D 룰렛 휠이 회전하며 당첨자 선정 | Three.js |
| 🎱 **마블 레이스** | 구슬이 트랙을 따라 경주 | Matter.js |
| 🎈 **풍선 터뜨리기** | 다트로 풍선을 터뜨려 탈락/당첨 결정 | Canvas 2D |
| 🏴‍☠️ **해적 룰렛** | 통에 칼을 꽂아 해적을 찾기 | Three.js |

### 🎨 테마 & 커스터마이징

- **5가지 테마**: 우주, 네온, 미니멀, 레트로, 자연
- **다크/라이트 모드** 지원
- **반응형 디자인**: 모바일, 태블릿, 데스크톱

### 🔧 기능

- 최대 100명 참가자 지원
- 1~10명 당첨자 동시 추첨
- 애니메이션 속도 조절 (느림/보통/빠름)
- 풀스크린 모드
- 사운드 효과 (ON/OFF)
- 결과 복사 & 이미지 저장
- 키보드 단축키 지원

## ⌨️ 단축키

| 키 | 기능 |
|----|------|
| `Space` | 추첨 시작 |
| `F` | 풀스크린 토글 |
| `D` | 다크/라이트 모드 전환 |
| `R` | 리셋 |
| `1-4` | 모드 선택 (마블/휠/풍선/해적) |
| `Esc` | 결과 모달 닫기 |

## 🛠️ 기술 스택

- **프론트엔드**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **3D 렌더링**: Three.js
- **물리 엔진**: Matter.js
- **애니메이션**: CSS Animations, GSAP (옵션)
- **사운드**: Howler.js
- **폭죽 효과**: canvas-confetti
- **이미지 저장**: html2canvas

## 📁 프로젝트 구조

```
roulette-site/
├── index.html           # 메인 페이지
├── 404.html             # 에러 페이지
├── css/
│   ├── variables.css    # CSS 변수
│   ├── main.css         # 메인 레이아웃
│   ├── components.css   # 컴포넌트 스타일
│   └── animations.css   # 애니메이션
├── js/
│   ├── main.js          # 앱 진입점
│   ├── config.js        # 설정
│   ├── state.js         # 상태 관리
│   ├── modes/
│   │   ├── BaseMode.js         # 베이스 클래스
│   │   ├── wheel-spinner.js    # 3D 휠 스피너
│   │   ├── marble-race.js      # 마블 레이스
│   │   ├── balloon-pop.js      # 풍선 터뜨리기
│   │   └── pirate-roulette.js  # 해적 룰렛
│   ├── utils/
│   │   ├── parser.js      # 입력 파싱
│   │   ├── shuffle.js     # 셔플 알고리즘
│   │   ├── confetti.js    # 폭죽 효과
│   │   ├── sound.js       # 사운드 관리
│   │   ├── clipboard.js   # 클립보드
│   │   └── performance.js # 성능 감지
│   └── ui/
│       ├── controls.js    # UI 컨트롤러
│       ├── results.js     # 결과 모달
│       ├── toast.js       # 토스트 알림
│       └── theme-toggle.js # 테마 관리
└── assets/
    └── sounds/           # 사운드 파일 (옵션)
```

## 🚀 시작하기

### 로컬 실행

```bash
# 프로젝트 클론
git clone <repo-url>
cd roulette-site

# 로컬 서버 실행 (Python)
python -m http.server 8000

# 또는 Node.js
npx serve
```

브라우저에서 `http://localhost:8000` 접속

### GitHub Pages 배포

1. GitHub 저장소 생성
2. `roulette-site/` 폴더 내용 업로드
3. Settings > Pages > Source: `main` 브랜치 선택
4. 배포 완료!

## 📱 브라우저 지원

| 브라우저 | 지원 |
|----------|------|
| Chrome 90+ | ✅ |
| Firefox 88+ | ✅ |
| Safari 14+ | ✅ |
| Edge 90+ | ✅ |
| Mobile Chrome/Safari | ✅ |

## 📄 라이선스

MIT License

## 👨‍💻 제작

**SIREAL** © 2025

