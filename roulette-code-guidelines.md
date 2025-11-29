# 📝 Multi-Mode Roulette - 코드 가이드라인

> **관련 문서**: [roulette-prd.md](./roulette-prd.md) | [roulette-trd.md](./roulette-trd.md)  
> **문서 버전**: v1.0  
> **작성일**: 2025-11-29  
> **작성자**: SIREAL

---

## 1. 코딩 컨벤션

### 1.1 JavaScript 스타일 가이드

#### 1.1.1 기본 규칙

```javascript
// ✅ 좋은 예시
const MAX_PARTICIPANTS = 100;           // 상수는 UPPER_SNAKE_CASE
let currentMode = 'wheel';              // 변수는 camelCase
const isRunning = false;                // Boolean은 is/has/can 접두사

// ❌ 나쁜 예시
const max_participants = 100;           // 상수에 snake_case 사용
let CurrentMode = 'wheel';              // 변수에 PascalCase 사용
const running = false;                  // Boolean 의미 불명확
```

#### 1.1.2 함수 선언

```javascript
// ✅ 일반 함수: function 키워드 사용
function parseParticipants(input) {
  // 로직
}

// ✅ 콜백/화살표 함수: 짧은 로직에 사용
const handleClick = (e) => {
  e.preventDefault();
  startDraw();
};

// ✅ 클래스 메서드: 클래스 내부
class WheelSpinnerMode {
  start() {
    // 메서드 로직
  }
}

// ❌ 나쁜 예시: 일관성 없는 혼용
const parseParticipants = function(input) { };  // 불필요한 function 표현식
```

#### 1.1.3 세미콜론 & 따옴표

```javascript
// ✅ 세미콜론 필수, 작은따옴표 사용
const name = 'SIREAL';
const message = `당첨자: ${name}`;  // 템플릿 리터럴은 백틱

// ❌ 나쁜 예시
const name = "SIREAL"   // 세미콜론 누락, 큰따옴표
```

#### 1.1.4 들여쓰기 & 공백

```javascript
// ✅ 2칸 들여쓰기, 연산자 양쪽 공백
function calculate(a, b) {
  const result = a + b;
  if (result > 10) {
    return result * 2;
  }
  return result;
}

// ✅ 객체/배열 포맷팅
const config = {
  mode: 'wheel',
  speed: 'normal',
  sound: true
};

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
```

### 1.2 CSS/Tailwind 스타일 가이드

#### 1.2.1 CSS 변수 네이밍

```css
/* ✅ 좋은 예시: 의미 있는 계층적 이름 */
:root {
  /* 색상 */
  --color-bg-primary: #0a0a1a;
  --color-text-primary: #ffffff;
  --color-accent-primary: #6366f1;
  
  /* 크기 */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  /* 폰트 */
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Inter', sans-serif;
}

/* ❌ 나쁜 예시 */
:root {
  --blue: #6366f1;      /* 용도 불명확 */
  --size1: 0.5rem;      /* 의미 없는 숫자 */
}
```

#### 1.2.2 Tailwind 클래스 순서

```html
<!-- ✅ 권장 순서: 레이아웃 → 크기 → 색상 → 효과 → 반응형 -->
<button class="
  flex items-center justify-center
  w-full h-12 px-6 py-3
  bg-gradient-to-r from-indigo-500 to-purple-500
  text-white font-semibold
  rounded-xl shadow-lg
  hover:shadow-xl hover:scale-105
  transition-all duration-300
  md:w-auto
">
  추첨 시작
</button>
```

#### 1.2.3 커스텀 CSS 클래스

```css
/* ✅ BEM 네이밍 (필요시) */
.mode-card { }
.mode-card__icon { }
.mode-card__title { }
.mode-card--active { }

/* ✅ 유틸리티 클래스 */
.glow-effect { }
.float-animation { }
```

### 1.3 HTML 구조 가이드

#### 1.3.1 시맨틱 태그 사용

```html
<!-- ✅ 시맨틱 구조 -->
<header class="site-header">
  <nav>...</nav>
</header>

<main class="app-container">
  <section id="mode-selection">...</section>
  <section id="participant-input">...</section>
  <section id="mode-container">...</section>
</main>

<footer class="site-footer">...</footer>

<!-- ❌ 나쁜 예시 -->
<div class="header">
  <div class="nav">...</div>
</div>
```

#### 1.3.2 접근성 속성

```html
<!-- ✅ 접근성 고려 -->
<button 
  id="start-button"
  aria-label="추첨 시작"
  aria-disabled="false"
  role="button"
>
  🎰 추첨 시작
</button>

<input
  type="text"
  id="participant-input"
  aria-label="참가자 이름 입력"
  placeholder="이름을 입력하세요 (쉼표 또는 줄바꿈으로 구분)"
/>
```

---

## 2. 파일/폴더 구조

### 2.1 프로젝트 구조

```
/roulette-site/
├── index.html                    # 메인 HTML (진입점)
├── 404.html                      # 커스텀 404 페이지
│
├── css/
│   ├── main.css                  # 메인 스타일시트
│   ├── variables.css             # CSS 변수 정의
│   ├── components.css            # 재사용 컴포넌트 스타일
│   ├── animations.css            # 애니메이션 정의
│   └── themes/                   # 테마별 스타일
│       ├── space.css
│       ├── neon.css
│       ├── minimal.css
│       ├── retro.css
│       └── nature.css
│
├── js/
│   ├── main.js                   # 앱 진입점
│   ├── config.js                 # 전역 설정
│   ├── state.js                  # 상태 관리
│   │
│   ├── modes/                    # 추첨 모드
│   │   ├── BaseMode.js           # 베이스 클래스
│   │   ├── marble-race.js
│   │   ├── wheel-spinner.js
│   │   ├── balloon-pop.js
│   │   └── pirate-roulette.js
│   │
│   ├── utils/                    # 유틸리티
│   │   ├── parser.js
│   │   ├── shuffle.js
│   │   ├── clipboard.js
│   │   ├── confetti.js
│   │   ├── sound.js
│   │   └── performance.js
│   │
│   └── ui/                       # UI 모듈
│       ├── controls.js
│       ├── results.js
│       ├── theme-toggle.js
│       └── toast.js
│
├── assets/
│   ├── sounds/                   # 효과음 (MP3/OGG)
│   │   ├── spin.mp3
│   │   ├── pop.mp3
│   │   ├── fanfare.mp3
│   │   ├── click.mp3
│   │   ├── marble.mp3
│   │   └── sword.mp3
│   │
│   ├── images/                   # 이미지
│   │   ├── og-image.png          # 소셜 공유 이미지
│   │   ├── favicon-32.png
│   │   └── apple-touch-icon.png
│   │
│   └── textures/                 # 3D 텍스처 (필요시)
│
└── README.md                     # 프로젝트 문서
```

### 2.2 파일 네이밍 규칙

| 유형 | 규칙 | 예시 |
|------|------|------|
| HTML | kebab-case | `index.html`, `404.html` |
| CSS | kebab-case | `main.css`, `theme-toggle.css` |
| JS 파일 | kebab-case | `marble-race.js`, `theme-toggle.js` |
| JS 클래스 | PascalCase | `class WheelSpinnerMode` |
| 이미지 | kebab-case | `og-image.png`, `favicon-32.png` |
| 사운드 | kebab-case | `spin.mp3`, `fanfare.mp3` |

### 2.3 모듈 구조 규칙

```javascript
/**
 * @file [파일명].js
 * @description [파일 설명]
 * @requires [의존성 목록]
 */

// 1. 임포트 (외부 → 내부 순서)
import { CONFIG } from '../config.js';
import { AppState } from '../state.js';

// 2. 상수 정의
const LOCAL_CONSTANT = 'value';

// 3. 클래스/함수 정의
export class ModuleName {
  // ...
}

// 4. 헬퍼 함수 (private)
function helperFunction() {
  // ...
}

// 5. 초기화 코드 (필요시)
// document.addEventListener('DOMContentLoaded', () => {});
```

---

## 3. 네이밍 규칙

### 3.1 변수명

| 유형 | 규칙 | 예시 |
|------|------|------|
| 상수 | UPPER_SNAKE_CASE | `MAX_PARTICIPANTS`, `CONFIG` |
| 변수 | camelCase | `currentMode`, `winnerCount` |
| Boolean | is/has/can 접두사 | `isRunning`, `hasSound`, `canStart` |
| 배열 | 복수형 | `participants`, `winners`, `colors` |
| DOM 요소 | element 접미사 또는 $접두사 | `startButton`, `$input` |
| 이벤트 핸들러 | handle/on 접두사 | `handleClick`, `onComplete` |

### 3.2 함수명

| 유형 | 규칙 | 예시 |
|------|------|------|
| 동작 | 동사 + 명사 | `startDraw()`, `parseNames()` |
| 가져오기 | get 접두사 | `getWinners()`, `getSettings()` |
| 설정 | set 접두사 | `setTheme()`, `setVolume()` |
| 생성 | create 접두사 | `createWheel()`, `createMarble()` |
| 검증 | validate/check 접두사 | `validateInput()`, `checkWebGL()` |
| 변환 | parse/format/convert | `parseParticipants()`, `formatResult()` |
| 이벤트 | handle/on 접두사 | `handleKeyPress()`, `onDrawComplete()` |

### 3.3 클래스명

```javascript
// ✅ PascalCase, 명확한 역할 표현
class AppState { }
class WheelSpinnerMode { }
class SoundManager { }
class UIController { }
class PerformanceDetector { }

// ✅ 베이스/추상 클래스
class BaseMode { }

// ❌ 나쁜 예시
class wheel_spinner { }     // snake_case
class soundmanager { }      // 소문자
class Helper { }            // 너무 일반적
```

### 3.4 CSS 클래스명

```css
/* 컴포넌트: 명사 또는 명사구 */
.mode-card { }
.result-modal { }
.winner-item { }

/* 상태: is-/has- 접두사 */
.is-active { }
.is-disabled { }
.has-error { }

/* 유틸리티: 기능 설명 */
.glow-effect { }
.fade-in { }
.sr-only { }  /* screen-reader only */

/* 테마: theme- 접두사 */
.theme-space { }
.theme-neon { }
```

### 3.5 ID 네이밍

```html
<!-- 페이지 섹션 -->
<section id="mode-selection">
<section id="participant-input">
<section id="mode-container">

<!-- 컨트롤 요소 -->
<button id="start-button">
<select id="winner-count">
<input id="name-input">

<!-- 컨테이너 -->
<div id="wheel-canvas">
<div id="results-area">
```

---

## 4. 주석 작성 규칙

### 4.1 JSDoc 주석

```javascript
/**
 * 참가자 입력을 파싱하여 배열로 변환
 * @param {string} input - 쉼표 또는 줄바꿈으로 구분된 입력 문자열
 * @returns {{ names: string[], errors: string[] }} 파싱된 이름과 에러 메시지
 * @example
 * const result = parseParticipants('홍길동, 김철수\n이영희');
 * // { names: ['홍길동', '김철수', '이영희'], errors: [] }
 */
function parseParticipants(input) {
  // 구현
}

/**
 * 3D 휠 스피너 추첨 모드
 * @extends BaseMode
 * @requires Three.js
 * @requires GSAP
 */
class WheelSpinnerMode extends BaseMode {
  /**
   * @param {AppState} state - 전역 상태 객체
   * @param {SoundManager} sound - 사운드 매니저 인스턴스
   */
  constructor(state, sound) {
    super(state, sound);
  }
}
```

### 4.2 인라인 주석

```javascript
// ✅ 좋은 인라인 주석: WHY를 설명
// Fisher-Yates 셔플: 모든 순열이 동일한 확률로 발생 보장
for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [array[i], array[j]] = [array[j], array[i]];
}

// 브라우저 호환성: Safari는 backdrop-filter 성능 이슈 있음
const useBlur = !isSafari && performanceLevel === 'high';

// ❌ 나쁜 주석: WHAT을 반복 (코드만 봐도 알 수 있음)
// i를 1 증가시킴
i++;

// 배열 길이를 가져옴
const length = array.length;
```

### 4.3 TODO/FIXME 주석

```javascript
// TODO: [기능] 설명 - @담당자
// TODO: PWA 오프라인 지원 추가 - @SIREAL

// FIXME: [버그] 설명
// FIXME: Safari에서 3D 렌더링 깜빡임 현상

// HACK: [임시 해결] 설명
// HACK: iOS Safari 풀스크린 API 미지원으로 CSS 처리

// NOTE: [참고] 설명
// NOTE: Matter.js 0.19.0에서 World.add 대신 Composite.add 권장됨
```

### 4.4 파일 헤더 주석

```javascript
/**
 * @file wheel-spinner.js
 * @description Three.js 기반 3D 휠 스피너 추첨 모드
 * 
 * @author SIREAL
 * @version 1.0.0
 * @created 2025-11-29
 * 
 * @requires Three.js r158+
 * @requires GSAP 3.12+
 * 
 * @see {@link https://threejs.org/docs/} Three.js 문서
 */
```

---

## 5. 에러 처리 방법

### 5.1 에러 처리 패턴

```javascript
// ✅ try-catch 패턴
async function loadSound(src) {
  try {
    const sound = new Howl({ src: [src] });
    return sound;
  } catch (error) {
    console.error(`[SoundManager] 사운드 로드 실패: ${src}`, error);
    return null;  // 그레이스풀 폴백
  }
}

// ✅ 유효성 검사 패턴
function validateParticipants(names, minRequired = 2) {
  if (!Array.isArray(names)) {
    return { 
      valid: false, 
      message: '유효하지 않은 입력 형식입니다.' 
    };
  }
  
  if (names.length === 0) {
    return { 
      valid: false, 
      message: '참가자를 입력해주세요.' 
    };
  }
  
  if (names.length < minRequired) {
    return { 
      valid: false, 
      message: `최소 ${minRequired}명 이상 필요합니다.` 
    };
  }
  
  return { valid: true, message: '' };
}
```

### 5.2 사용자 피드백

```javascript
// ✅ 토스트 메시지로 사용자에게 알림
class Toast {
  static show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  
  static error(message) {
    this.show(message, 'error', 5000);
  }
  
  static warning(message) {
    this.show(message, 'warning', 4000);
  }
  
  static success(message) {
    this.show(message, 'success', 3000);
  }
}

// 사용 예시
Toast.error('참가자를 입력해주세요.');
Toast.success('클립보드에 복사되었습니다!');
```

### 5.3 폴백 처리

```javascript
// ✅ WebGL 미지원 폴백
function initRenderer() {
  if (!isWebGLSupported()) {
    console.warn('[Renderer] WebGL 미지원, 2D 폴백 모드로 전환');
    return new Canvas2DFallback();
  }
  return new THREE.WebGLRenderer({ antialias: true });
}

// ✅ 기능 감지 후 폴백
const copyToClipboard = async (text) => {
  // 모던 API 시도
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('[Clipboard] Clipboard API 실패, 폴백 사용');
    }
  }
  
  // 레거시 폴백
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    return true;
  } catch (err) {
    console.error('[Clipboard] 복사 실패', err);
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
};
```

### 5.4 에러 로깅 규칙

```javascript
// ✅ 로깅 레벨 사용
console.log('[App] 초기화 완료');           // 일반 정보
console.info('[Mode] 휠 스피너 로드됨');     // 상태 정보
console.warn('[Parser] 중복 이름 감지');     // 경고
console.error('[Sound] 파일 로드 실패');     // 에러

// ✅ 모듈 접두사 사용
// [모듈명] 메시지 형식
console.log('[UIController] 버튼 이벤트 바인딩');
console.error('[WheelSpinner] Three.js 초기화 실패', error);
```

---

## 6. 테스트 작성 기준

### 6.1 단위 테스트 구조

```javascript
// parser.test.js
describe('parseParticipants', () => {
  // 정상 케이스
  describe('정상 입력 처리', () => {
    it('쉼표로 구분된 이름을 파싱해야 한다', () => {
      const result = parseParticipants('홍길동, 김철수, 이영희');
      expect(result.names).toEqual(['홍길동', '김철수', '이영희']);
      expect(result.errors).toHaveLength(0);
    });
    
    it('줄바꿈으로 구분된 이름을 파싱해야 한다', () => {
      const result = parseParticipants('홍길동\n김철수\n이영희');
      expect(result.names).toEqual(['홍길동', '김철수', '이영희']);
    });
    
    it('혼합 구분자를 처리해야 한다', () => {
      const result = parseParticipants('홍길동, 김철수\n이영희');
      expect(result.names).toEqual(['홍길동', '김철수', '이영희']);
    });
  });
  
  // 엣지 케이스
  describe('엣지 케이스 처리', () => {
    it('빈 입력은 빈 배열을 반환해야 한다', () => {
      const result = parseParticipants('');
      expect(result.names).toEqual([]);
    });
    
    it('중복 이름에 번호를 부여해야 한다', () => {
      const result = parseParticipants('홍길동, 홍길동, 홍길동');
      expect(result.names).toEqual(['홍길동', '홍길동#2', '홍길동#3']);
    });
    
    it('최대 인원을 초과하면 자르고 에러를 반환해야 한다', () => {
      const names = Array(150).fill('테스트').join(',');
      const result = parseParticipants(names);
      expect(result.names).toHaveLength(100);
      expect(result.errors).toContain('최대 100명까지 가능합니다.');
    });
  });
});
```

### 6.2 테스트 네이밍 규칙

```javascript
// ✅ [메서드명]_[시나리오]_[기대결과] 형식
describe('WheelSpinnerMode', () => {
  it('start_참가자있을때_애니메이션시작', () => {});
  it('start_참가자없을때_에러토스트표시', () => {});
  it('reset_호출시_초기상태로복원', () => {});
});

// ✅ 한글로 명확하게 설명
describe('셔플 알고리즘', () => {
  it('원본 배열을 변경하지 않아야 한다', () => {});
  it('모든 요소가 결과에 포함되어야 한다', () => {});
  it('여러 번 실행 시 다른 결과를 반환해야 한다', () => {});
});
```

### 6.3 테스트 커버리지 목표

| 모듈 | 목표 커버리지 | 우선순위 |
|------|--------------|---------|
| `parser.js` | 90%+ | 높음 |
| `shuffle.js` | 95%+ | 높음 |
| `state.js` | 85%+ | 높음 |
| `modes/*.js` | 70%+ | 중간 |
| `ui/*.js` | 60%+ | 낮음 |

---

## 7. Git 커밋 규칙

### 7.1 커밋 메시지 형식

```
[타입] 제목 (50자 이내)

본문 (선택사항, 72자 줄바꿈)
- 변경 이유
- 구현 내용

관련 이슈: #이슈번호
```

### 7.2 커밋 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 | `[feat] 마블 레이스 모드 추가` |
| `fix` | 버그 수정 | `[fix] 모바일 터치 이벤트 버그 수정` |
| `style` | 코드 스타일 변경 | `[style] 코드 포맷팅 정리` |
| `refactor` | 리팩토링 | `[refactor] 상태 관리 로직 분리` |
| `perf` | 성능 개선 | `[perf] 파티클 렌더링 최적화` |
| `docs` | 문서 수정 | `[docs] README 업데이트` |
| `test` | 테스트 추가 | `[test] parser.js 테스트 추가` |
| `chore` | 빌드/설정 변경 | `[chore] CDN 버전 업데이트` |

### 7.3 커밋 예시

```bash
# ✅ 좋은 커밋 메시지
[feat] 3D 휠 스피너 기본 구현

- Three.js 기반 3D 휠 렌더링
- GSAP 회전 애니메이션 적용
- 세그먼트별 색상 및 텍스트 표시

관련 PRD: 3.1 추첨 모드

# ❌ 나쁜 커밋 메시지
수정함
작업 완료
ㅇㅇ
```

---

## 8. 성능 가이드라인

### 8.1 JavaScript 최적화

```javascript
// ✅ 디바운싱 적용
const handleInput = debounce((e) => {
  parseAndUpdate(e.target.value);
}, 300);

// ✅ requestAnimationFrame 사용
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// ✅ 이벤트 위임
document.getElementById('mode-buttons').addEventListener('click', (e) => {
  if (e.target.matches('.mode-button')) {
    loadMode(e.target.dataset.mode);
  }
});

// ❌ 피해야 할 패턴
// 매 프레임 DOM 쿼리
function badAnimate() {
  const element = document.getElementById('target');  // ❌ 매번 쿼리
  // ...
}
```

### 8.2 메모리 관리

```javascript
// ✅ 모드 전환 시 정리
class BaseMode {
  destroy() {
    // 애니메이션 정지
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Three.js 리소스 해제
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // DOM 정리
    if (this.container) {
      this.container.innerHTML = '';
    }
    
    // 이벤트 리스너 제거
    this.removeEventListeners();
  }
}

// ✅ WeakMap 사용 (필요시)
const privateData = new WeakMap();
```

### 8.3 렌더링 최적화

```javascript
// ✅ CSS transform 사용 (layout 재계산 방지)
gsap.to(element, {
  x: 100,           // transform: translateX
  y: 50,            // transform: translateY
  rotation: 45,     // transform: rotate
  scale: 1.2        // transform: scale
});

// ❌ 피해야 할 패턴
gsap.to(element, {
  left: 100,        // layout 재계산 발생
  top: 50,          // layout 재계산 발생
  width: '200px'    // layout 재계산 발생
});
```

---

## 9. 코드 리뷰 체크리스트

### 9.1 기능

- [ ] 요구사항이 모두 구현되었는가?
- [ ] 엣지 케이스가 처리되었는가?
- [ ] 에러 핸들링이 적절한가?

### 9.2 코드 품질

- [ ] 네이밍 규칙을 따르는가?
- [ ] 함수가 단일 책임을 가지는가?
- [ ] 중복 코드가 없는가?
- [ ] 주석이 적절한가?

### 9.3 성능

- [ ] 불필요한 DOM 쿼리가 없는가?
- [ ] 메모리 누수 위험이 없는가?
- [ ] 애니메이션이 최적화되었는가?

### 9.4 접근성

- [ ] 키보드로 조작 가능한가?
- [ ] ARIA 속성이 적절한가?
- [ ] 색상 대비가 충분한가?

### 9.5 호환성

- [ ] 지원 브라우저에서 테스트되었는가?
- [ ] 모바일에서 작동하는가?
- [ ] 폴백이 구현되었는가?

---

**문서 버전**: v1.0  
**작성일**: 2025-11-29  
**작성자**: SIREAL  
**관련 문서**: roulette-prd.md v1.1 | roulette-trd.md v1.0

