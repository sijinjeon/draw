# 🎰 Multi-Mode Roulette - 다중 모드 추첨 룰렛 PRD

## 1. 제품 개요

### 1.1 문제 정의
라이브 스트리밍이나 이벤트에서 공정하고 시각적으로 재미있는 추첨 도구가 필요합니다. 기존의 단순 랜덤 추첨은 시청자 참여도가 낮고, 공정성에 대한 의문이 제기될 수 있습니다.

### 1.2 솔루션
3D 애니메이션 기반 웹사이트 디자인에서 **4가지 다양한 추첨 모드**를 제공하는 추첨 도구를 개발합니다.

### 1.3 목표
| 목표 | 설명 | 측정 지표 |
|------|------|-----------|
| 공정성 | 완전 랜덤 추첨 보장 | 편향 없는 결과 분포 |
| 엔터테인먼트 | 시청자 몰입도 향상 | 추첨 시간 동안 시청 유지율 |
| 접근성 | 누구나 쉽게 사용 | 3클릭 이내 추첨 시작 |
| 성능 | 부드러운 3D 애니메이션 | 60fps 유지, 3초 내 로딩 |

### 1.4 성공 지표
- 추첨 완료율 95% 이상
- 모바일/데스크톱 모두 60fps 유지
- 페이지 로드 시간 3초 미만
- 사용자 재방문율 50% 이상

---

## 2. 사용자 페르소나

### 2.1 주최자 (Primary User)
```
역할: 이벤트 개최자 또는 이벤트 운영자
니즈: 다양한 행사에서 참여자를 대상으로 공정하고 흥미로운 추첨 이벤트를 효과적으로 운영
목표: 라이브 스트리밍 또는 오프라인에서 시각적으로 인상적인 추첨 연출
```

### 2.2 시청자 (Secondary User)
```
역할: 유튜브/라이브 스트리밍 시청자
니즈: 공정한 추첨 과정을 실시간으로 확인
기대: 시각적으로 재미있고 긴장감 있는 추첨 과정
```

### 2.3 참가자 (Tertiary User)
```
역할: 이벤트 참가자
니즈: 자신의 이름이 명확하게 표시되고, 공정하게 추첨되는지 직접 확인
기대: 투명하고 알기 쉬운 추첨 과정 및 결과 확인
```



---

## 3. 기능 명세

### 3.1 추첨 모드 (P0 - 핵심 기능)

| 모드 | 설명 | 시각 효과 | 추천 용도 |
|------|------|-----------|-----------|
| 🎱 **마블 레이스** | 구슬이 트랙을 따라 레이싱 | 물리 엔진 기반 구슬 경주 | 다수 인원, 순위 결정 |
| 🎡 **3D 휠 스피너** | 3D 회전 룰렛 휠 | Three.js 기반 회전 애니메이션 | 소수 인원, 단일 당첨자 |
| 🎈 **풍선 터뜨리기** | 하늘에 떠다니는 풍선에 다트 던지기 | 부유 애니메이션 + 다트 발사 + 터짐 효과 | 인터랙티브, 1~N명 |
| 🏴‍☠️ **해적 룰렛** | 해적이 통 안에 숨어있고 칼을 꽂아 당첨자 결정 | 3D 통 + 칼 꽂기 + 해적 튀어오름 | 서스펜스, 1명씩 추첨 |

### 3.2 참가자 입력 (P0)

```
입력 방식:
├── 쉼표(,) 구분: "홍길동, 김철수, 이영희"
├── 줄바꿈 구분: 
│   "홍길동
│    김철수
│    이영희"
└── 혼합 사용 가능

제한사항:
├── 최대 참가자: 100명
├── 이름 길이: 20자 이내
└── 중복 이름: 자동 번호 부여 (홍길동, 홍길동#2)
```

### 3.3 추첨 옵션 (P1)

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| 당첨자 수 | 1~10명 선택 | 1명 |
| 애니메이션 속도 | 느림/보통/빠름 | 보통 |
| 사운드 효과 | ON/OFF | ON |
| 배경 테마 | 5가지 테마 선택 | 우주 테마 |
| 🌓 다크/라이트 모드 | 화면 밝기 모드 전환 | 다크 모드 (시스템 설정 따름) |
| 풀스크린 모드 | 전체화면 표시 | OFF |

### 3.4 결과 표시 (P0)

```
결과 화면:
├── 순위별 당첨자 표시 (🥇🥈🥉)
├── 🎆 폭죽 이펙트 (모든 모드 공통)
│   ├── Canvas 기반 Confetti 파티클
│   ├── 화면 전체에 퍼지는 폭죽 효과
│   ├── 다양한 색상의 종이 조각 낙하
│   └── 3초간 지속 후 자연스럽게 소멸
├── 축하 사운드 효과 (팡파레)
├── 결과 복사 버튼 (클립보드)
├── 결과 이미지 저장 (PNG)
└── 재추첨 버튼
```

### 3.5 폭죽 이펙트 상세 (P0 - 모든 모드 공통)

| 효과 요소 | 설명 | 설정값 |
|-----------|------|--------|
| 파티클 수 | 화면에 뿌려지는 조각 수 | 150~300개 |
| 색상 | 축하 분위기 연출 | 골드, 레드, 블루, 그린, 퍼플, 핑크 |
| 지속 시간 | 효과 재생 시간 | 3초 |
| 발사 위치 | 폭죽 시작점 | 화면 중앙 하단에서 위로 발사 |
| 중력 효과 | 자연스러운 낙하 | 0.8~1.2 |
| 회전 | 종이 조각 회전 | 랜덤 각도 |

### 3.5 UI 컨트롤 (P1)

| 기능 | 단축키 | 설명 |
|------|--------|------|
| 추첨 시작 | `Space` | 애니메이션 시작 |
| 결과 복사 | `Ctrl+C` | 클립보드 복사 |
| 풀스크린 | `F` | 전체화면 토글 |
| 재시작 | `R` | 처음으로 돌아가기 |
| 모드 변경 | `1-4` | 추첨 모드 전환 |
| 다크/라이트 모드 | `D` | 화면 밝기 모드 토글 |

---

## 4. 사용자 여정

### 4.1 메인 플로우

```
┌─────────────────────────────────────────────────────────────────┐
│                        사용자 여정 흐름도                          │
└─────────────────────────────────────────────────────────────────┘

[시작] 
   │
   ▼
┌──────────────┐
│  1. 사이트 접속  │ ─────► GitHub Pages URL 접속
└──────────────┘
   │
   ▼
┌──────────────┐
│ 2. 모드 선택    │ ─────► 4가지 추첨 모드 중 선택
│  🎱🎡🎈🏴‍☠️   │        (3D 프리뷰 확인 가능)
└──────────────┘
   │
   ▼
┌──────────────┐
│ 3. 참가자 입력  │ ─────► 쉼표 또는 줄바꿈으로 구분
│               │        실시간 파싱 및 미리보기
└──────────────┘
   │
   ▼
┌──────────────┐
│ 4. 옵션 설정   │ ─────► 당첨자 수, 테마, 속도 설정
└──────────────┘
   │
   ▼
┌──────────────┐
│ 5. 추첨 시작   │ ─────► 3D 애니메이션 재생
│   🎬 START   │        (모드별 고유 애니메이션)
└──────────────┘
   │
   ▼
┌──────────────┐
│ 6. 결과 확인   │ ─────► 당첨자 발표 + 축하 이펙트
│   🎉 WINNER  │
└──────────────┘
   │
   ├──► [결과 복사] → 클립보드
   ├──► [이미지 저장] → PNG 다운로드
   └──► [재추첨] → 4단계로 복귀

[종료]
```

### 4.2 에러 핸들링

| 상황 | 처리 방법 |
|------|-----------|
| 참가자 0명 | "참가자를 입력해주세요" 토스트 |
| 참가자 > 100명 | "최대 100명까지 가능합니다" 경고 |
| 이름 중복 | 자동 번호 부여 + 안내 메시지 |
| 브라우저 미지원 | WebGL 폴백 또는 안내 페이지 |

---

## 5. 기술 구현 가이드

### 5.1 기술 스택

```
프론트엔드:
├── HTML5 + CSS3 (Tailwind CSS)
├── Vanilla JavaScript (ES6+)
├── Three.js (3D 렌더링) - CDN
├── Matter.js (마블 레이스 물리 엔진) - CDN
├── GSAP (애니메이션) - CDN
├── Howler.js (사운드) - CDN
├── canvas-confetti (폭죽 이펙트) - CDN
└── html2canvas (결과 이미지 캡처) - CDN

호스팅:
└── GitHub Pages (정적 웹사이트)

빌드:
└── 빌드 불필요 (순수 정적 파일)
```

### 5.2 파일 구조

```
/roulette-site/
├── index.html              # 메인 페이지
├── css/
│   ├── main.css            # 메인 스타일
│   ├── themes/             # 테마별 CSS
│   │   ├── space.css
│   │   ├── neon.css
│   │   ├── minimal.css
│   │   ├── retro.css
│   │   └── nature.css
│   └── animations.css      # 애니메이션 정의
├── js/
│   ├── main.js             # 앱 초기화
│   ├── modes/
│   │   ├── marble-race.js  # 마블 레이스 모드
│   │   ├── wheel-spinner.js # 3D 휠 스피너
│   │   ├── balloon-pop.js  # 풍선 터뜨리기
│   │   └── pirate-roulette.js # 해적 룰렛
│   ├── utils/
│   │   ├── parser.js       # 이름 파싱
│   │   ├── shuffle.js      # Fisher-Yates 셔플
│   │   ├── clipboard.js    # 클립보드 복사
│   │   └── confetti.js     # 폭죽 이펙트
│   └── ui/
│       ├── controls.js     # UI 컨트롤
│       ├── results.js      # 결과 화면
│       └── theme-toggle.js # 다크/라이트 모드 전환
├── assets/
│   ├── sounds/             # 효과음
│   ├── textures/           # 3D 텍스처
│   └── fonts/              # 커스텀 폰트
└── README.md
```

### 5.3 핵심 알고리즘

#### 5.3.1 이름 파싱 (parser.js)
```javascript
/**
 * 쉼표 또는 줄바꿈으로 구분된 이름을 파싱
 * @param {string} input - 원본 입력
 * @returns {string[]} - 정제된 이름 배열
 */
function parseNames(input) {
  return input
    .split(/[,\n]+/)           // 쉼표 또는 줄바꿈으로 분리
    .map(name => name.trim())  // 공백 제거
    .filter(name => name.length > 0)  // 빈 문자열 제거
    .map((name, index, arr) => {
      // 중복 이름 처리
      const count = arr.slice(0, index).filter(n => n === name).length;
      return count > 0 ? `${name}#${count + 1}` : name;
    });
}
```

#### 5.3.2 공정 셔플 (shuffle.js)
```javascript
/**
 * Fisher-Yates 셔플 알고리즘
 * @param {any[]} array - 셔플할 배열
 * @returns {any[]} - 셔플된 새 배열
 */
function fairShuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

#### 5.3.3 다크/라이트 모드 전환 (theme-toggle.js)
```javascript
/**
 * 다크/라이트 모드 토글 시스템
 * - 시스템 설정 자동 감지
 * - 사용자 선택 localStorage 저장
 * - 부드러운 전환 애니메이션
 */
class ThemeToggle {
  constructor() {
    this.theme = this.getInitialTheme();
    this.init();
  }

  getInitialTheme() {
    // 1. localStorage에서 사용자 선택 확인
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // 2. 시스템 설정 감지
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark'; // 기본값: 다크 모드
  }

  init() {
    this.applyTheme(this.theme);
    this.watchSystemTheme();
  }

  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.theme);
    localStorage.setItem('theme', this.theme);
  }

  applyTheme(theme) {
    // 부드러운 전환을 위한 트랜지션 추가
    document.documentElement.style.transition = 'background-color 0.3s, color 0.3s';
    document.documentElement.setAttribute('data-theme', theme);
    
    // 아이콘 업데이트
    const icon = document.querySelector('.theme-toggle-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  watchSystemTheme() {
    // 시스템 테마 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
  }
}

// 초기화
const themeToggle = new ThemeToggle();

// 단축키 D로 토글
document.addEventListener('keydown', (e) => {
  if (e.key === 'd' || e.key === 'D') {
    themeToggle.toggle();
  }
});
```

#### 5.3.4 폭죽 이펙트 (confetti.js)
```javascript
/**
 * 당첨자 발표 시 폭죽 이펙트 발사
 * canvas-confetti 라이브러리 사용
 */
function launchConfetti() {
  const duration = 3000; // 3초
  const end = Date.now() + duration;

  // 색상 팔레트
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD'];

  (function frame() {
    // 좌측에서 발사
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors
    });
    
    // 우측에서 발사
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

/**
 * 중앙 집중 폭죽 (당첨자 이름 표시 시)
 */
function burstConfetti() {
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    gravity: 0.8,
    scalar: 1.2,
    drift: 0,
    ticks: 200
  });
}
```

#### 5.3.4 마블 레이스 물리 엔진 (marble-race.js)
```javascript
// Matter.js 초기화
const engine = Matter.Engine.create();
const world = engine.world;

// 중력 설정
world.gravity.y = 0.8;

// 구슬 생성
function createMarble(name, x, y, color) {
  const marble = Matter.Bodies.circle(x, y, 15, {
    restitution: 0.6,      // 탄성
    friction: 0.1,         // 마찰
    frictionAir: 0.01,     // 공기 저항
    label: name,
    render: { fillStyle: color }
  });
  Matter.World.add(world, marble);
  return marble;
}
```

### 5.4 3D 렌더링 가이드

#### 5.4.1 Three.js 휠 스피너
```javascript
// Three.js 씬 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// 3D 휠 생성
function createWheel(segments) {
  const geometry = new THREE.CylinderGeometry(5, 5, 0.5, segments);
  const materials = segments.map((_, i) => 
    new THREE.MeshPhongMaterial({ color: getColor(i) })
  );
  const wheel = new THREE.Mesh(geometry, materials);
  return wheel;
}

// 회전 애니메이션
function spinWheel(wheel, duration, finalSegment) {
  gsap.to(wheel.rotation, {
    z: Math.PI * 10 + (finalSegment * segmentAngle),
    duration: duration,
    ease: "power4.out"
  });
}
```

### 5.5 성능 최적화

| 기법 | 적용 대상 | 효과 |
|------|-----------|------|
| `requestAnimationFrame` | 모든 애니메이션 | 60fps 보장 |
| 오브젝트 풀링 | 파티클 이펙트 | 메모리 최적화 |
| 텍스처 압축 | 3D 에셋 | 로딩 시간 단축 |
| 디바운싱 | 입력 파싱 | CPU 부하 감소 |
| 레이지 로딩 | 모드별 JS | 초기 로딩 최적화 |

---

## 6. 디자인 가이드

### 6.1 색상 팔레트

#### 6.1.1 다크 모드 (기본)
```css
/* 다크 모드 - 우주 (Space) */
:root, [data-theme="dark"] {
  --bg-primary: #0a0a1a;      /* 깊은 우주 배경 */
  --bg-secondary: #1a1a3a;    /* 카드/패널 배경 */
  --bg-tertiary: #2a2a4a;     /* 호버/활성 상태 */
  --accent-primary: #6366f1;   /* 인디고 - 주 강조색 */
  --accent-secondary: #8b5cf6; /* 바이올렛 - 보조 강조 */
  --accent-glow: #a855f7;      /* 글로우 이펙트 */
  --text-primary: #ffffff;     /* 메인 텍스트 */
  --text-secondary: #a1a1aa;   /* 보조 텍스트 */
  --text-muted: #6b6b7a;       /* 비활성 텍스트 */
  --success: #22c55e;          /* 당첨 표시 */
  --gradient-start: #667eea;   /* 그라데이션 시작 */
  --gradient-end: #764ba2;     /* 그라데이션 끝 */
  --border-color: #3a3a5a;     /* 테두리 색상 */
  --shadow-color: rgba(0, 0, 0, 0.5);
}
```

#### 6.1.2 라이트 모드
```css
/* 라이트 모드 */
[data-theme="light"] {
  --bg-primary: #f8f9fc;      /* 밝은 배경 */
  --bg-secondary: #ffffff;    /* 카드/패널 배경 */
  --bg-tertiary: #eef0f5;     /* 호버/활성 상태 */
  --accent-primary: #4f46e5;   /* 인디고 - 주 강조색 (진하게) */
  --accent-secondary: #7c3aed; /* 바이올렛 - 보조 강조 */
  --accent-glow: #8b5cf6;      /* 글로우 이펙트 */
  --text-primary: #1a1a2e;     /* 메인 텍스트 (어둡게) */
  --text-secondary: #4a4a5a;   /* 보조 텍스트 */
  --text-muted: #9a9aaa;       /* 비활성 텍스트 */
  --success: #16a34a;          /* 당첨 표시 */
  --gradient-start: #6366f1;   /* 그라데이션 시작 */
  --gradient-end: #8b5cf6;     /* 그라데이션 끝 */
  --border-color: #e2e4e9;     /* 테두리 색상 */
  --shadow-color: rgba(0, 0, 0, 0.1);
}
```

#### 6.1.3 시스템 테마 감지
```css
/* 시스템 설정 자동 감지 */
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    /* 라이트 모드 변수 적용 */
  }
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* 다크 모드 변수 적용 */
  }
}
```

### 6.2 타이포그래피

```css
/* 폰트 스택 */
--font-display: 'Orbitron', 'Noto Sans KR', sans-serif;  /* 제목용 */
--font-body: 'Inter', 'Noto Sans KR', sans-serif;        /* 본문용 */
--font-mono: 'JetBrains Mono', monospace;                /* 코드/숫자 */

/* 크기 체계 */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 2rem;      /* 32px */
--text-4xl: 2.5rem;    /* 40px */
--text-hero: 4rem;     /* 64px - 히어로 섹션 */
```

### 6.3 버튼 스타일

```css
/* 기본 버튼 */
.btn-primary {
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  color: white;
  font-weight: 600;
  font-size: var(--text-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

/* 글로우 이펙트 */
.btn-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 10px var(--accent-glow); }
  to { box-shadow: 0 0 30px var(--accent-glow), 0 0 60px var(--accent-glow); }
}
```

### 6.4 3D 효과 & 애니메이션

```css
/* 3D 카드 호버 효과 */
.card-3d {
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.card-3d:hover {
  transform: rotateY(10deg) rotateX(5deg);
}

/* 부유 애니메이션 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* 파티클 배경 */
.particle-bg {
  background: 
    radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    var(--bg-primary);
}
```

### 6.5 테마 프리셋

| 테마 | 배경 | 강조색 | 분위기 |
|------|------|--------|--------|
| 🌌 우주 (Space) | 다크 네이비 | 인디고/퍼플 | 신비로운 |
| 💜 네온 (Neon) | 순수 블랙 | 핫핑크/시안 | 사이버펑크 |
| ⚪ 미니멀 (Minimal) | 화이트 | 블랙/그레이 | 깔끔한 |
| 🕹️ 레트로 (Retro) | 다크 그린 | 픽셀 그린 | 복고풍 |
| 🌿 자연 (Nature) | 다크 그린 | 에메랄드 | 편안한 |

#### 6.5.1 테마별 상세 색상 정의

```css
/* 💜 네온 (Neon) 테마 */
[data-theme-style="neon"] {
  --bg-primary: #000000;
  --bg-secondary: #0d0d0d;
  --bg-tertiary: #1a1a1a;
  --accent-primary: #ff006e;     /* 핫핑크 */
  --accent-secondary: #00f5ff;   /* 시안 */
  --accent-glow: #ff006e;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --success: #00ff88;
  --gradient-start: #ff006e;
  --gradient-end: #00f5ff;
}

/* ⚪ 미니멀 (Minimal) 테마 */
[data-theme-style="minimal"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #eeeeee;
  --accent-primary: #000000;
  --accent-secondary: #333333;
  --accent-glow: #666666;
  --text-primary: #000000;
  --text-secondary: #666666;
  --success: #000000;
  --gradient-start: #333333;
  --gradient-end: #000000;
}

/* 🕹️ 레트로 (Retro) 테마 */
[data-theme-style="retro"] {
  --bg-primary: #0a1f0a;
  --bg-secondary: #0f2f0f;
  --bg-tertiary: #143f14;
  --accent-primary: #00ff00;     /* 픽셀 그린 */
  --accent-secondary: #33ff33;
  --accent-glow: #00ff00;
  --text-primary: #00ff00;
  --text-secondary: #00cc00;
  --success: #00ff00;
  --gradient-start: #00cc00;
  --gradient-end: #00ff00;
  --font-display: 'Press Start 2P', monospace;  /* 픽셀 폰트 */
}

/* 🌿 자연 (Nature) 테마 */
[data-theme-style="nature"] {
  --bg-primary: #1a2f1a;
  --bg-secondary: #243524;
  --bg-tertiary: #2e402e;
  --accent-primary: #10b981;     /* 에메랄드 */
  --accent-secondary: #34d399;
  --accent-glow: #6ee7b7;
  --text-primary: #ecfdf5;
  --text-secondary: #a7f3d0;
  --success: #10b981;
  --gradient-start: #059669;
  --gradient-end: #10b981;
}
```

---

## 7. 성능 요구사항

### 7.1 필수 성능 지표

| 지표 | 목표값 | 측정 방법 |
|------|--------|-----------|
| 초기 로드 시간 | < 3초 | Lighthouse |
| 첫 의미있는 페인트 (FMP) | < 1.5초 | Chrome DevTools |
| Time to Interactive (TTI) | < 3.5초 | Lighthouse |
| 총 번들 크기 | < 500KB (gzip) | webpack-bundle-analyzer |

#### 7.1.1 기기별 프레임 레이트 목표

| 기기 유형 | 목표 FPS | 비고 |
|-----------|----------|------|
| 데스크톱 (일반) | 60fps | 필수 달성 |
| 데스크톱 (저사양) | 45fps 이상 | 허용 범위 |
| 모바일 (최신) | 60fps | iPhone 12+, Galaxy S21+ |
| 모바일 (일반) | 45fps 이상 | iPhone X~11, Galaxy S10~S20 |
| 모바일 (구형) | 30fps 이상 | iPhone 8 이하, 저가형 안드로이드 |

```
성능 적응형 전략:
├── 초기 로드 시 기기 성능 감지
├── 저사양 감지 시 → 라이트 모드 자동 전환
│   ├── 파티클 수 감소 (300 → 100개)
│   ├── 그림자 효과 OFF
│   └── 3D 품질 하향 (폴리곤 수 감소)
└── 사용자 수동 전환 옵션 제공
```

### 7.2 디바이스 지원

```
데스크톱:
├── Chrome 90+ ✓
├── Firefox 88+ ✓
├── Safari 14+ ✓
├── Edge 90+ ✓
└── 최소 해상도: 1280x720

모바일:
├── iOS Safari 14+ ✓
├── Chrome for Android 90+ ✓
├── 최소 해상도: 375x667 (iPhone SE)
└── 터치 제스처 지원

WebGL 요구사항:
├── WebGL 2.0 지원 필수
└── 미지원 시 → 2D 폴백 모드 제공
```

### 7.3 최적화 체크리스트

- [ ] 이미지 WebP 포맷 변환
- [ ] 폰트 서브셋팅 (한글 2350자)
- [ ] Critical CSS 인라인
- [ ] JS 코드 스플리팅 (모드별)
- [ ] Service Worker 캐싱
- [ ] Gzip/Brotli 압축

---

## 8. 배포 체크리스트

### 8.1 GitHub Pages 설정

```bash
# 1. 저장소 생성 및 클론
git clone https://github.com/username/roulette-site.git
cd roulette-site

# 2. 정적 파일 추가
# (index.html, css/, js/, assets/ 폴더 구성)

# 3. 커밋 및 푸시
git add .
git commit -m "Initial commit: Multi-mode roulette site"
git push origin main

# 4. GitHub Pages 활성화
# Settings → Pages → Source: main branch → / (root)
```

### 8.2 배포 전 체크리스트

| 항목 | 상태 | 비고 |
|------|------|------|
| HTML 유효성 검사 | ⬜ | W3C Validator |
| CSS 유효성 검사 | ⬜ | W3C CSS Validator |
| JS 린팅 | ⬜ | ESLint |
| 크로스 브라우저 테스트 | ⬜ | BrowserStack |
| 모바일 반응형 테스트 | ⬜ | Chrome DevTools |
| 성능 테스트 | ⬜ | Lighthouse 90+ |
| 접근성 테스트 | ⬜ | axe-core |
| 404 페이지 | ⬜ | 커스텀 404.html |
| 파비콘 | ⬜ | 다양한 크기 |
| OG 메타태그 | ⬜ | 소셜 공유용 |

### 8.3 SEO & 메타태그

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎰 Multi-Mode Roulette - 다중 모드 추첨 룰렛</title>
  <meta name="description" content="마블 레이스, 3D 휠, 풍선 터뜨리기, 해적 룰렛 - 4가지 모드로 재미있게 추첨하세요!">
  
  <!-- 제작자 정보 -->
  <meta name="author" content="SIREAL">
  <meta name="creator" content="SIREAL">
  <meta name="publisher" content="SIREAL">
  <meta name="copyright" content="© 2025 SIREAL. All rights reserved.">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Multi-Mode Roulette">
  <meta property="og:description" content="4가지 3D 애니메이션 추첨 모드">
  <meta property="og:image" content="./assets/og-image.png">
  <meta property="og:url" content="https://username.github.io/roulette-site/">
  <meta property="og:site_name" content="SIREAL Roulette">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:creator" content="@SIREAL">
  <meta name="twitter:title" content="Multi-Mode Roulette by SIREAL">
  <meta name="twitter:description" content="4가지 3D 애니메이션 추첨 모드">
  
  <!-- 파비콘 -->
  <link rel="icon" type="image/png" sizes="32x32" href="./assets/favicon-32.png">
  <link rel="apple-touch-icon" href="./assets/apple-touch-icon.png">
</head>
```

---

## 9. 기능 우선순위 요약

### P0 (필수 - MVP)
| 기능 | 예상 공수 |
|------|-----------|
| 참가자 입력 (쉼표/줄바꿈 파싱) | 0.5일 |
| 마블 레이스 모드 | 2일 |
| 3D 휠 스피너 모드 | 2일 |
| 결과 화면 & 복사 | 0.5일 |
| 기본 UI/UX | 1일 |

### P1 (중요 - v1.0)
| 기능 | 예상 공수 |
|------|-----------|
| 풍선 터뜨리기 모드 | 2일 |
| 해적 룰렛 모드 | 2일 |
| 테마 시스템 (5종) | 1일 |
| 🌓 다크/라이트 모드 | 0.5일 |
| 사운드 효과 | 0.5일 |
| 풀스크린 모드 | 0.5일 |

### P2 (개선 - v1.1+)
| 기능 | 예상 공수 |
|------|-----------|
| 결과 이미지 저장 | 0.5일 |
| 키보드 단축키 | 0.5일 |
| PWA 오프라인 지원 | 1일 |
| 다국어 지원 | 1일 |
| 커스텀 배경 업로드 | 1일 |

---

## 10. 부록

### 10.1 참고 자료

- [Matter.js 공식 문서](https://brm.io/matter-js/docs/)
- [Three.js 공식 문서](https://threejs.org/docs/)
- [GSAP 애니메이션](https://greensock.com/gsap/)
- [canvas-confetti 폭죽 라이브러리](https://github.com/catdad/canvas-confetti)
- [html2canvas 이미지 캡처](https://html2canvas.hertzen.com/)
- [GitHub Pages 가이드](https://docs.github.com/ko/pages)

### 10.2 무료 리소스 출처

#### 10.2.1 3D 모델 에셋 (해적 룰렛용)

| 사이트 | 라이선스 | 추천 에셋 |
|--------|----------|-----------|
| [Sketchfab](https://sketchfab.com) | CC BY 4.0 (무료) | 해적, 나무통, 칼 모델 |
| [Turbosquid](https://turbosquid.com) | 무료 섹션 | Low-poly 3D 모델 |
| [Poly Pizza](https://poly.pizza) | CC0 (완전 무료) | 심플한 3D 모델 |
| [Kenney Assets](https://kenney.nl) | CC0 (완전 무료) | 게임용 3D 에셋 |

```
해적 룰렛 필요 에셋:
├── 🏴‍☠️ 해적 피규어 (또는 2D 스프라이트)
├── 🪵 나무통 (원통형 3D 또는 이미지)
├── 🗡️ 칼/검 (꽂는 애니메이션용)
└── 💥 튀어오르는 이펙트 (CSS로 대체 가능)
```

#### 10.2.2 사운드 효과

| 사이트 | 라이선스 | 필요 효과음 |
|--------|----------|-------------|
| [Freesound](https://freesound.org) | CC0/BY | 다양한 효과음 |
| [Pixabay](https://pixabay.com/sound-effects) | 무료 상업용 | 고품질 효과음 |
| [Zapsplat](https://zapsplat.com) | 무료 (가입 필요) | 전문 효과음 |
| [Mixkit](https://mixkit.co/free-sound-effects) | 무료 상업용 | 정리된 카테고리 |

```
필요 효과음 목록:
├── 🎰 룰렛 회전 소리 (휙휙)
├── 🎱 구슬 굴러가는 소리
├── 🎈 풍선 터지는 소리 (펑!)
├── 🗡️ 칼 꽂히는 소리 (슉!)
├── 🏴‍☠️ 해적 튀어오르는 소리
├── 🎉 당첨 팡파레
├── 🎆 폭죽 터지는 소리
└── 🖱️ 버튼 클릭 소리
```

#### 10.2.3 폰트

| 폰트 | 용도 | 출처 |
|------|------|------|
| Orbitron | 제목/헤더 | [Google Fonts](https://fonts.google.com/specimen/Orbitron) |
| Inter | 본문 | [Google Fonts](https://fonts.google.com/specimen/Inter) |
| Noto Sans KR | 한글 | [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+KR) |
| Press Start 2P | 레트로 테마 | [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P) |
| JetBrains Mono | 숫자/코드 | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) |

### 10.3 영감 소스

- [Marble Roulette (lazygyu)](https://lazygyu.github.io/roulette/)
- [Wheel of Names](https://wheelofnames.com/)
- [Random Name Picker](https://www.classtools.net/random-name-picker/)

### 10.4 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

```
MIT License

Copyright (c) 2025 SIREAL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

**문서 버전**: v1.1  
**작성일**: 2025-11-29  
**최종 수정**: 2025-11-29 (검토 반영)  
**작성자**: SIREAL  
**다음 리뷰**: 개발 착수 전 최종 검토

