# 🛠️ Multi-Mode Roulette - 개발 가이드

> **관련 문서**: [PRD](./roulette-prd.md) | [TRD](./roulette-trd.md) | [코드 가이드라인](./roulette-code-guidelines.md) | [IA](./roulette-ia.md) | [디자인 가이드](./roulette-design-guide.md)  
> **문서 버전**: v1.0  
> **작성일**: 2025-11-29  
> **작성자**: SIREAL

---

## 1. 개발 환경 설정

### 1.1 필수 도구

| 도구 | 버전 | 용도 | 설치 |
|------|------|------|------|
| VS Code / Cursor | 최신 | 코드 에디터 | [다운로드](https://code.visualstudio.com/) |
| Node.js | 18+ | 로컬 서버 | [다운로드](https://nodejs.org/) |
| Git | 최신 | 버전 관리 | [다운로드](https://git-scm.com/) |
| Chrome | 90+ | 개발/테스트 | [다운로드](https://www.google.com/chrome/) |

### 1.2 VS Code 확장 프로그램 (권장)

```
필수:
├── Live Server          # 로컬 개발 서버
├── ESLint              # JavaScript 린팅
├── Prettier            # 코드 포맷팅
└── Tailwind CSS IntelliSense  # Tailwind 자동완성

권장:
├── Auto Rename Tag     # HTML 태그 자동 이름 변경
├── Color Highlight     # CSS 색상 미리보기
├── GitLens            # Git 이력 확인
└── Error Lens         # 에러 인라인 표시
```

### 1.3 프로젝트 초기화

```bash
# 1. 저장소 생성 (GitHub에서 새 리포지토리 생성)
# Repository name: roulette-site
# Public으로 설정 (GitHub Pages 사용을 위해)

# 2. 로컬에 클론
git clone https://github.com/YOUR_USERNAME/roulette-site.git
cd roulette-site

# 3. 폴더 구조 생성
mkdir -p css/themes js/{modes,utils,ui} assets/{sounds,images,textures}

# 4. 기본 파일 생성
touch index.html 404.html README.md
touch css/{main.css,variables.css,components.css,animations.css}
touch js/{main.js,config.js,state.js}
touch js/modes/{BaseMode.js,marble-race.js,wheel-spinner.js,balloon-pop.js,pirate-roulette.js}
touch js/utils/{parser.js,shuffle.js,clipboard.js,confetti.js,sound.js,performance.js}
touch js/ui/{controls.js,results.js,theme-toggle.js,toast.js}

# 5. 초기 커밋
git add .
git commit -m "[chore] 프로젝트 초기 구조 설정"
git push origin main
```

### 1.4 로컬 개발 서버 실행

#### 방법 1: Live Server (VS Code 확장)

1. VS Code에서 `index.html` 열기
2. 우클릭 → "Open with Live Server"
3. 브라우저에서 `http://localhost:5500` 자동 열림

#### 방법 2: Node.js http-server

```bash
# 설치 (최초 1회)
npm install -g http-server

# 실행
http-server -p 8080 -c-1

# 브라우저에서 http://localhost:8080 접속
```

#### 방법 3: Python

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

---

## 2. 프로젝트 구조 상세

### 2.1 최종 파일 구조

```
/roulette-site/
│
├── index.html                    # 메인 진입점
├── 404.html                      # 404 에러 페이지
├── README.md                     # 프로젝트 문서
│
├── css/
│   ├── variables.css             # CSS 변수 (색상, 폰트, 간격)
│   ├── main.css                  # 메인 스타일 (레이아웃)
│   ├── components.css            # 컴포넌트 스타일
│   ├── animations.css            # 애니메이션 정의
│   └── themes/
│       ├── space.css             # 우주 테마 (기본)
│       ├── neon.css              # 네온 테마
│       ├── minimal.css           # 미니멀 테마
│       ├── retro.css             # 레트로 테마
│       └── nature.css            # 자연 테마
│
├── js/
│   ├── main.js                   # 앱 초기화, 이벤트 바인딩
│   ├── config.js                 # 전역 상수, 설정값
│   ├── state.js                  # 상태 관리 (Observer 패턴)
│   │
│   ├── modes/                    # 추첨 모드 모듈
│   │   ├── BaseMode.js           # 추상 베이스 클래스
│   │   ├── marble-race.js        # 🎱 마블 레이스 (Matter.js)
│   │   ├── wheel-spinner.js      # 🎡 3D 휠 (Three.js)
│   │   ├── balloon-pop.js        # 🎈 풍선 터뜨리기 (Canvas 2D)
│   │   └── pirate-roulette.js    # 🏴‍☠️ 해적 룰렛 (Three.js)
│   │
│   ├── utils/                    # 유틸리티 함수
│   │   ├── parser.js             # 입력 파싱
│   │   ├── shuffle.js            # Fisher-Yates 셔플
│   │   ├── clipboard.js          # 클립보드 복사
│   │   ├── confetti.js           # 폭죽 효과
│   │   ├── sound.js              # 사운드 관리
│   │   └── performance.js        # 성능 감지
│   │
│   └── ui/                       # UI 컴포넌트
│       ├── controls.js           # 메인 UI 컨트롤러
│       ├── results.js            # 결과 모달
│       ├── theme-toggle.js       # 테마 토글
│       └── toast.js              # 토스트 알림
│
└── assets/
    ├── sounds/                   # 효과음
    │   ├── spin.mp3
    │   ├── pop.mp3
    │   ├── fanfare.mp3
    │   ├── click.mp3
    │   ├── marble.mp3
    │   └── sword.mp3
    │
    ├── images/                   # 이미지
    │   ├── og-image.png          # 소셜 공유 이미지
    │   ├── favicon-16.png
    │   ├── favicon-32.png
    │   └── apple-touch-icon.png
    │
    └── textures/                 # 3D 텍스처 (필요시)
```

### 2.2 파일 의존성 그래프

```
index.html
├── css/variables.css
├── css/main.css
├── css/components.css
├── css/animations.css
├── css/themes/[현재테마].css
│
├── (CDN) Tailwind CSS
├── (CDN) Matter.js
├── (CDN) Three.js
├── (CDN) GSAP
├── (CDN) Howler.js
├── (CDN) canvas-confetti
├── (CDN) html2canvas
│
└── js/main.js (type="module")
    ├── js/config.js
    ├── js/state.js
    ├── js/ui/controls.js
    │   └── js/utils/parser.js
    ├── js/ui/results.js
    │   ├── js/utils/clipboard.js
    │   └── js/utils/confetti.js
    ├── js/ui/theme-toggle.js
    ├── js/ui/toast.js
    ├── js/utils/sound.js
    ├── js/utils/performance.js
    │
    └── js/modes/[현재모드].js (동적 임포트)
        └── js/modes/BaseMode.js
```

---

## 3. 개발 순서 (권장)

### 3.1 Phase 1: 기반 구축 (Day 1-2)

```
순서:
1. index.html 기본 구조 작성
2. CSS 변수 및 기본 스타일 설정
3. config.js - 전역 상수 정의
4. state.js - 상태 관리 클래스 구현
5. parser.js - 입력 파싱 유틸리티
6. controls.js - 기본 UI 바인딩
7. 테마 시스템 (다크/라이트 + 5개 테마)

체크리스트:
□ HTML 시맨틱 구조 완성
□ CSS 변수 시스템 동작
□ 상태 관리 Observer 패턴 동작
□ 참가자 입력 → 파싱 → 상태 저장 동작
□ 다크/라이트 모드 전환 동작
□ 테마 변경 동작
```

### 3.2 Phase 2: 코어 모드 구현 (Day 3-5)

```
순서:
1. BaseMode.js - 추상 베이스 클래스
2. wheel-spinner.js - 3D 휠 스피너 (Three.js)
   - Three.js 씬 설정
   - 휠 지오메트리 생성
   - 세그먼트별 색상/텍스트
   - GSAP 회전 애니메이션
3. marble-race.js - 마블 레이스 (Matter.js)
   - Matter.js 물리 엔진 설정
   - 트랙 생성
   - 구슬 생성 및 레이싱
   - 결승선 충돌 감지

체크리스트:
□ BaseMode 추상 클래스 구현
□ 휠 스피너 3D 렌더링 동작
□ 휠 회전 + 감속 애니메이션 동작
□ 마블 레이스 물리 시뮬레이션 동작
□ 두 모드 간 전환 동작
```

### 3.3 Phase 3: 추가 모드 구현 (Day 6-8)

```
순서:
1. balloon-pop.js - 풍선 터뜨리기 (Canvas 2D)
   - Canvas 2D 컨텍스트
   - 풍선 부유 애니메이션
   - 다트 발사 메커니즘
   - 파티클 터짐 효과
2. pirate-roulette.js - 해적 룰렛 (Three.js)
   - 3D 씬 (통, 슬롯)
   - 칼 꽂기 애니메이션
   - 해적 튀어오름 효과

체크리스트:
□ 풍선 부유 + 다트 발사 동작
□ 해적 룰렛 칼 꽂기 동작
□ 4개 모드 전환 동작
□ 모드별 당첨자 결정 로직 동작
```

### 3.4 Phase 4: 결과 & 효과 (Day 9-10)

```
순서:
1. confetti.js - 폭죽 효과
2. results.js - 결과 모달
3. clipboard.js - 결과 복사
4. sound.js - 사운드 매니저
5. toast.js - 토스트 알림

체크리스트:
□ 당첨 시 폭죽 효과 동작
□ 결과 모달 표시 동작
□ 결과 복사 기능 동작
□ 이미지 저장 기능 동작
□ 사운드 효과 동작
□ 토스트 알림 동작
```

### 3.5 Phase 5: 최적화 & 배포 (Day 11-12)

```
순서:
1. performance.js - 성능 감지 및 적응
2. 반응형 디자인 점검
3. 크로스 브라우저 테스트
4. 성능 최적화
5. GitHub Pages 배포

체크리스트:
□ 모바일 반응형 동작
□ 저사양 기기 대응
□ Chrome/Firefox/Safari 테스트
□ Lighthouse 점수 90+
□ GitHub Pages 배포 완료
```

---

## 4. HTML 템플릿

### 4.1 index.html 기본 구조

```html
<!DOCTYPE html>
<html lang="ko" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO & 메타 -->
  <title>🎰 Multi-Mode Roulette - 다중 모드 추첨 룰렛</title>
  <meta name="description" content="마블 레이스, 3D 휠, 풍선 터뜨리기, 해적 룰렛 - 4가지 모드로 재미있게 추첨하세요!">
  <meta name="author" content="SIREAL">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Multi-Mode Roulette">
  <meta property="og:description" content="4가지 3D 애니메이션 추첨 모드">
  <meta property="og:image" content="./assets/images/og-image.png">
  <meta property="og:url" content="https://username.github.io/roulette-site/">
  
  <!-- 파비콘 -->
  <link rel="icon" type="image/png" sizes="32x32" href="./assets/images/favicon-32.png">
  <link rel="apple-touch-icon" href="./assets/images/apple-touch-icon.png">
  
  <!-- 폰트 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS (CDN) -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- 커스텀 CSS -->
  <link rel="stylesheet" href="./css/variables.css">
  <link rel="stylesheet" href="./css/main.css">
  <link rel="stylesheet" href="./css/components.css">
  <link rel="stylesheet" href="./css/animations.css">
</head>

<body class="bg-primary text-primary min-h-screen">
  
  <!-- ========== HEADER ========== -->
  <header class="header" role="banner">
    <div class="header__container">
      <!-- 로고 -->
      <a href="#" class="header__logo" id="logo">
        🎰 <span class="header__title">Multi-Mode Roulette</span>
      </a>
      
      <!-- 컨트롤 -->
      <div class="header__controls">
        <!-- 테마 선택 -->
        <select id="theme-select" class="select-field" aria-label="테마 선택">
          <option value="space">🌌 우주</option>
          <option value="neon">💜 네온</option>
          <option value="minimal">⚪ 미니멀</option>
          <option value="retro">🕹️ 레트로</option>
          <option value="nature">🌿 자연</option>
        </select>
        
        <!-- 다크/라이트 토글 -->
        <button id="theme-toggle" class="btn-icon" aria-label="다크/라이트 모드 전환">
          <span class="theme-toggle-icon">🌙</span>
        </button>
        
        <!-- 사운드 토글 -->
        <button id="sound-toggle" class="btn-icon" aria-label="사운드 ON/OFF">
          <span class="sound-toggle-icon">🔊</span>
        </button>
      </div>
    </div>
  </header>

  <!-- ========== MAIN ========== -->
  <main class="main" role="main">
    
    <!-- 모드 선택 섹션 -->
    <section id="mode-selection" class="mode-selection" aria-label="추첨 모드 선택">
      <div class="mode-grid">
        <button class="mode-card active" data-mode="wheel" aria-pressed="true">
          <span class="mode-card__icon">🎡</span>
          <span class="mode-card__title">3D 휠 스피너</span>
        </button>
        <button class="mode-card" data-mode="marble" aria-pressed="false">
          <span class="mode-card__icon">🎱</span>
          <span class="mode-card__title">마블 레이스</span>
        </button>
        <button class="mode-card" data-mode="balloon" aria-pressed="false">
          <span class="mode-card__icon">🎈</span>
          <span class="mode-card__title">풍선 터뜨리기</span>
        </button>
        <button class="mode-card" data-mode="pirate" aria-pressed="false">
          <span class="mode-card__icon">🏴‍☠️</span>
          <span class="mode-card__title">해적 룰렛</span>
        </button>
      </div>
    </section>

    <!-- 컨트롤 바 (상단 배너) -->
    <section id="control-bar" class="control-bar" aria-label="추첨 설정">
      
      <!-- 참가자 입력 (드롭다운 트리거) -->
      <div class="control-item participant-control">
        <button 
          id="participant-trigger" 
          class="control-trigger"
          aria-expanded="false"
          aria-controls="participant-dropdown"
        >
          <span class="control-icon">📝</span>
          <span class="control-label">참가자 입력</span>
          <span id="participant-count" class="control-badge">0명</span>
          <span class="control-arrow">▼</span>
        </button>
        
        <!-- 참가자 입력 드롭다운 팝업 -->
        <div id="participant-dropdown" class="dropdown-popup" hidden>
          <div class="dropdown-content">
            <textarea 
              id="participant-input" 
              class="input-field"
              placeholder="이름을 입력하세요&#10;쉼표(,) 또는 줄바꿈으로 구분&#10;&#10;예시: 홍길동, 김철수, 이영희"
              aria-describedby="input-hint"
              rows="6"
            ></textarea>
            <p id="input-hint" class="input-hint">
              최대 100명, 이름당 20자 이내
            </p>
            <!-- 참가자 미리보기 -->
            <div id="participant-preview" class="participant-preview">
              <!-- JS로 동적 생성 -->
            </div>
          </div>
        </div>
      </div>

      <!-- 당첨자 수 -->
      <div class="control-item">
        <label for="winner-count" class="control-label-inline">당첨자</label>
        <select id="winner-count" class="select-field-compact">
          <option value="1">1명</option>
          <option value="2">2명</option>
          <option value="3">3명</option>
          <option value="4">4명</option>
          <option value="5">5명</option>
          <option value="6">6명</option>
          <option value="7">7명</option>
          <option value="8">8명</option>
          <option value="9">9명</option>
          <option value="10">10명</option>
        </select>
      </div>

      <!-- 애니메이션 속도 -->
      <div class="control-item">
        <label for="speed-select" class="control-label-inline">속도</label>
        <select id="speed-select" class="select-field-compact">
          <option value="slow">느림</option>
          <option value="normal" selected>보통</option>
          <option value="fast">빠름</option>
        </select>
      </div>

      <!-- 풀스크린 버튼 -->
      <button id="fullscreen-btn" class="btn-icon-compact" aria-label="풀스크린">
        ⛶
      </button>

      <!-- 추첨 시작 버튼 -->
      <button id="start-button" class="btn-primary-compact" disabled>
        🎰 추첨 시작
      </button>
    </section>

    <!-- 캔버스 영역 (화면 전체) -->
    <section id="mode-container" class="canvas-area-fullscreen" aria-label="추첨 애니메이션">
      <!-- 각 모드별 캔버스가 동적으로 삽입됨 -->
      <div class="canvas-placeholder">
        <div class="placeholder-content">
          <span class="placeholder-icon">🎰</span>
          <p class="placeholder-text">모드를 선택하고 참가자를 입력하세요</p>
          <p class="placeholder-hint">Space: 시작 | F: 풀스크린 | D: 다크모드 | 1-4: 모드</p>
        </div>
      </div>
    </section>
    
  </main>

  <!-- ========== FOOTER ========== -->
  <footer class="footer" role="contentinfo">
    <p>© 2025 SIREAL. All rights reserved.</p>
  </footer>

  <!-- ========== 결과 모달 (숨김) ========== -->
  <div id="results-modal" class="modal-overlay" hidden aria-modal="true" role="dialog">
    <!-- JS로 동적 생성 -->
  </div>

  <!-- ========== 토스트 컨테이너 ========== -->
  <div id="toast-container" class="toast-container" aria-live="polite"></div>

  <!-- ========== SCRIPTS ========== -->
  <!-- 외부 라이브러리 (CDN) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
  <script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.0/dist/confetti.browser.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  
  <!-- 앱 스크립트 -->
  <script type="module" src="./js/main.js"></script>
</body>
</html>
```

---

## 5. 주요 모듈 구현 가이드

### 5.1 main.js - 앱 초기화

```javascript
/**
 * @file main.js
 * @description 애플리케이션 진입점
 */

import { CONFIG } from './config.js';
import { AppState } from './state.js';
import { UIController } from './ui/controls.js';
import { ThemeManager } from './ui/theme-toggle.js';
import { SoundManager } from './utils/sound.js';
import { PerformanceDetector } from './utils/performance.js';
import { ResultsManager } from './ui/results.js';
import { Toast } from './ui/toast.js';

class App {
  constructor() {
    this.state = new AppState();
    this.ui = null;
    this.theme = null;
    this.sound = null;
    this.results = null;
    this.currentMode = null;
  }

  async init() {
    try {
      // 1. 성능 감지
      const perf = new PerformanceDetector();
      this.state.setPerformanceLevel(perf.detect());

      // 2. 매니저 초기화
      this.theme = new ThemeManager();
      this.sound = new SoundManager();
      this.results = new ResultsManager(this.state);

      // 3. UI 초기화
      this.ui = new UIController(this.state, this);

      // 4. 이벤트 바인딩
      this.bindGlobalEvents();

      // 5. 기본 모드 로드
      await this.loadMode('wheel');

      // 6. 저장된 설정 복원
      this.state.loadFromStorage();

      console.log('🎰 Multi-Mode Roulette initialized');
    } catch (error) {
      console.error('[App] 초기화 실패:', error);
      Toast.error('앱 초기화에 실패했습니다. 페이지를 새로고침해주세요.');
    }
  }

  async loadMode(modeName) {
    // 기존 모드 정리
    if (this.currentMode) {
      this.currentMode.destroy();
    }

    // 동적 모듈 로드
    const modeMap = {
      wheel: () => import('./modes/wheel-spinner.js'),
      marble: () => import('./modes/marble-race.js'),
      balloon: () => import('./modes/balloon-pop.js'),
      pirate: () => import('./modes/pirate-roulette.js')
    };

    try {
      const module = await modeMap[modeName]();
      this.currentMode = new module.default(this.state, this.sound);
      this.currentMode.init();
      this.state.setCurrentMode(modeName);
    } catch (error) {
      console.error(`[App] 모드 로드 실패: ${modeName}`, error);
      Toast.error('모드 로드에 실패했습니다.');
    }
  }

  bindGlobalEvents() {
    // 키보드 단축키
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // 윈도우 리사이즈
    window.addEventListener('resize', () => {
      if (this.currentMode) {
        this.currentMode.resize();
      }
    });

    // 추첨 완료 이벤트
    document.addEventListener('drawComplete', (e) => {
      this.results.show(e.detail.winners);
    });
  }

  handleKeyPress(e) {
    // 입력 필드에서는 단축키 무시
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
      return;
    }

    const handlers = {
      ' ': () => this.startDraw(),
      'f': () => this.toggleFullscreen(),
      'r': () => this.reset(),
      'd': () => this.theme.toggle(),
      '1': () => this.loadMode('marble'),
      '2': () => this.loadMode('wheel'),
      '3': () => this.loadMode('balloon'),
      '4': () => this.loadMode('pirate'),
      'Escape': () => this.results.close()
    };

    const handler = handlers[e.key.toLowerCase()];
    if (handler) {
      e.preventDefault();
      handler();
    }
  }

  startDraw() {
    if (!this.state.canStart()) {
      Toast.warning('참가자를 2명 이상 입력해주세요.');
      return;
    }
    this.currentMode.start();
  }

  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  reset() {
    this.state.reset();
    this.ui.reset();
    if (this.currentMode) {
      this.currentMode.reset();
    }
  }
}

// 앱 시작
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
```

### 5.2 config.js - 전역 설정

```javascript
/**
 * @file config.js
 * @description 전역 상수 및 설정값
 */

export const CONFIG = {
  // 제한값
  MAX_PARTICIPANTS: 100,
  MAX_NAME_LENGTH: 20,
  MAX_WINNERS: 10,
  MIN_PARTICIPANTS: 2,

  // 애니메이션 속도 (ms)
  ANIMATION_SPEED: {
    slow: 8000,
    normal: 5000,
    fast: 3000
  },

  // 성능 레벨별 설정
  PERFORMANCE: {
    high: {
      particleCount: 300,
      shadows: true,
      antialias: true,
      targetFPS: 60
    },
    medium: {
      particleCount: 150,
      shadows: true,
      antialias: true,
      targetFPS: 45
    },
    low: {
      particleCount: 100,
      shadows: false,
      antialias: false,
      targetFPS: 30
    }
  },

  // 폭죽 색상
  CONFETTI_COLORS: [
    '#FFD700', '#FF6B6B', '#4ECDC4', 
    '#45B7D1', '#96CEB4', '#DDA0DD'
  ],

  // 사운드 파일
  SOUNDS: {
    spin: './assets/sounds/spin.mp3',
    pop: './assets/sounds/pop.mp3',
    fanfare: './assets/sounds/fanfare.mp3',
    click: './assets/sounds/click.mp3',
    marble: './assets/sounds/marble.mp3',
    sword: './assets/sounds/sword.mp3'
  },

  // 테마
  THEMES: ['space', 'neon', 'minimal', 'retro', 'nature'],

  // 모드 정보
  MODES: {
    marble: { 
      name: '마블 레이스', 
      icon: '🎱', 
      minParticipants: 2,
      description: '구슬이 트랙을 따라 경주합니다'
    },
    wheel: { 
      name: '3D 휠 스피너', 
      icon: '🎡', 
      minParticipants: 2,
      description: '3D 룰렛 휠이 회전합니다'
    },
    balloon: { 
      name: '풍선 터뜨리기', 
      icon: '🎈', 
      minParticipants: 1,
      description: '다트로 풍선을 터뜨립니다'
    },
    pirate: { 
      name: '해적 룰렛', 
      icon: '🏴‍☠️', 
      minParticipants: 2,
      description: '통에 칼을 꽂아 해적을 찾습니다'
    }
  },

  // 색상 팔레트 (모드별)
  MODE_COLORS: {
    marble: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#DDA0DD', '#FFD700', '#FF8C00', '#9370DB',
      '#20B2AA', '#FF69B4', '#87CEEB', '#98D8C8'
    ],
    wheel: [
      '#ef4444', '#f97316', '#eab308', '#22c55e',
      '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
      '#6366f1', '#06b6d4', '#84cc16', '#f43f5e'
    ],
    balloon: [
      '#FF6B6B', '#FFE66D', '#4ECDC4', '#95E1D3',
      '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA'
    ],
    pirate: ['#8B4513', '#CD853F', '#D2691E', '#A0522D']
  }
};
```

---

## 6. Git 브랜치 전략

### 6.1 브랜치 구조

```
main (production)
│
├── develop (개발 통합)
│   │
│   ├── feature/core-setup        # 기반 구축
│   ├── feature/wheel-mode        # 휠 스피너 모드
│   ├── feature/marble-mode       # 마블 레이스 모드
│   ├── feature/balloon-mode      # 풍선 모드
│   ├── feature/pirate-mode       # 해적 모드
│   ├── feature/results           # 결과 화면
│   ├── feature/sound             # 사운드 시스템
│   └── feature/responsive        # 반응형 최적화
│
└── hotfix/* (긴급 버그 수정)
```

### 6.2 브랜치 워크플로우

```bash
# 1. develop에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/wheel-mode

# 2. 작업 및 커밋
git add .
git commit -m "[feat] 3D 휠 스피너 기본 구현"

# 3. develop에 병합
git checkout develop
git merge feature/wheel-mode

# 4. main에 배포
git checkout main
git merge develop
git push origin main
```

### 6.3 커밋 메시지 규칙

```bash
# 형식
[타입] 제목 (50자 이내)

본문 (선택사항)
- 변경 사항 설명

# 예시
[feat] 3D 휠 스피너 기본 구현

- Three.js 씬 설정
- 휠 지오메트리 및 세그먼트 생성
- GSAP 회전 애니메이션 적용
```

---

## 7. GitHub Pages 배포

### 7.1 배포 설정

1. GitHub 저장소 → Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)`
4. Save

### 7.2 배포 URL

```
https://[USERNAME].github.io/roulette-site/
```

### 7.3 배포 체크리스트

```
□ 모든 파일 경로가 상대 경로인지 확인
□ 404.html 존재 확인
□ 파비콘 및 OG 이미지 경로 확인
□ 콘솔 에러 없는지 확인
□ 모바일 테스트 완료
□ Lighthouse 점수 확인 (목표: 90+)
```

---

## 8. 트러블슈팅 가이드

### 8.1 자주 발생하는 문제

#### Three.js 렌더링 안 됨

```javascript
// 문제: canvas가 검은색으로만 표시
// 해결: 카메라 위치와 렌더러 크기 확인

camera.position.z = 8;  // 카메라가 오브젝트를 바라보는지 확인
renderer.setSize(container.clientWidth, container.clientHeight);
```

#### Matter.js 물리 시뮬레이션 안 됨

```javascript
// 문제: 구슬이 움직이지 않음
// 해결: Runner와 Engine이 실행 중인지 확인

const runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);  // 이 줄이 있는지 확인
```

#### ES 모듈 로드 에러

```html
<!-- 문제: Cannot use import statement outside a module -->
<!-- 해결: script 태그에 type="module" 추가 -->

<script type="module" src="./js/main.js"></script>
```

#### CORS 에러 (로컬 개발)

```bash
# 문제: file:// 프로토콜에서 모듈 로드 불가
# 해결: 로컬 서버 사용

npx http-server -p 8080
```

### 8.2 디버깅 팁

```javascript
// 상태 디버깅
console.log('[State]', JSON.stringify(state._state, null, 2));

// 모드 디버깅
console.log('[Mode]', this.constructor.name, 'initialized');

// 애니메이션 프레임 디버깅
let frameCount = 0;
function animate() {
  frameCount++;
  if (frameCount % 60 === 0) {
    console.log('[FPS]', frameCount / (performance.now() / 1000));
  }
  requestAnimationFrame(animate);
}
```

---

## 9. 성능 최적화 체크리스트

### 9.1 로딩 최적화

```
□ CSS/JS 파일 minify (배포 시)
□ 이미지 WebP 포맷 사용
□ 폰트 preconnect 설정
□ Critical CSS 인라인
□ 불필요한 CDN 라이브러리 제거
```

### 9.2 렌더링 최적화

```
□ requestAnimationFrame 사용
□ transform 속성으로 애니메이션 (layout 회피)
□ will-change 속성 적절히 사용
□ 불필요한 reflow/repaint 방지
□ 오브젝트 풀링 (파티클 등)
```

### 9.3 메모리 최적화

```
□ 모드 전환 시 이전 리소스 해제
□ 이벤트 리스너 정리
□ Three.js geometry/material dispose
□ WeakMap 활용 (필요시)
```

---

## 10. 참고 자료

### 10.1 공식 문서

| 라이브러리 | 문서 | 예제 |
|------------|------|------|
| Three.js | [threejs.org/docs](https://threejs.org/docs/) | [threejs.org/examples](https://threejs.org/examples/) |
| Matter.js | [brm.io/matter-js/docs](https://brm.io/matter-js/docs/) | [brm.io/matter-js/demo](https://brm.io/matter-js/demo/) |
| GSAP | [greensock.com/docs](https://greensock.com/docs/v3/GSAP) | [greensock.com/showcase](https://greensock.com/showcase/) |
| Howler.js | [howlerjs.com](https://howlerjs.com/) | - |
| canvas-confetti | [github.com/catdad/canvas-confetti](https://github.com/catdad/canvas-confetti) | - |

### 10.2 유용한 도구

| 도구 | 용도 | URL |
|------|------|-----|
| Lighthouse | 성능 측정 | Chrome DevTools |
| Can I Use | 브라우저 호환성 | [caniuse.com](https://caniuse.com/) |
| WebGL Report | WebGL 지원 확인 | [webglreport.com](https://webglreport.com/) |
| Coolors | 색상 팔레트 | [coolors.co](https://coolors.co/) |
| Freesound | 효과음 | [freesound.org](https://freesound.org/) |

---

**문서 버전**: v1.0  
**작성일**: 2025-11-29  
**작성자**: SIREAL  
**관련 문서**: PRD v1.1 | TRD v1.0 | 코드 가이드라인 v1.0 | IA v1.0 | 디자인 가이드 v1.0

