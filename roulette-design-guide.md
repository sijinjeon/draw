# 🎨 Multi-Mode Roulette - 디자인 가이드

> **관련 문서**: [roulette-prd.md](./roulette-prd.md) | [roulette-trd.md](./roulette-trd.md) | [roulette-ia.md](./roulette-ia.md)  
> **문서 버전**: v1.0  
> **작성일**: 2025-11-29  
> **작성자**: SIREAL

---

## 1. 디자인 철학

### 1.1 핵심 원칙

| 원칙 | 설명 | 적용 |
|------|------|------|
| **몰입감 (Immersive)** | 3D 애니메이션으로 시청자를 끌어들이는 경험 | 풀스크린, 고품질 그래픽, 사운드 |
| **공정성 (Fair)** | 추첨 과정이 투명하게 보여야 함 | 모든 참가자 이름 표시, 랜덤 알고리즘 |
| **재미 (Fun)** | 엔터테인먼트 요소로 긴장감과 즐거움 | 폭죽 효과, 다양한 모드, 사운드 |
| **접근성 (Accessible)** | 누구나 쉽게 사용 | 직관적 UI, 키보드 지원, 다크/라이트 모드 |

### 1.2 디자인 키워드

```
우주 (Space) · 네온 (Neon) · 미래적 (Futuristic) · 게임 (Game)
```

---

## 2. 컬러 시스템

### 2.1 다크 모드 (기본) - 우주 테마

```css
:root, [data-theme="dark"] {
  /* 배경 계층 */
  --bg-primary: #0a0a1a;         /* 깊은 우주 */
  --bg-secondary: #1a1a3a;       /* 카드/패널 */
  --bg-tertiary: #2a2a4a;        /* 호버/활성 */
  --bg-elevated: #2f2f5f;        /* 모달/드롭다운 */
  
  /* 강조색 */
  --accent-primary: #6366f1;     /* 인디고 - 주 강조 */
  --accent-secondary: #8b5cf6;   /* 바이올렛 - 보조 */
  --accent-tertiary: #a855f7;    /* 퍼플 - 액센트 */
  --accent-glow: rgba(139, 92, 246, 0.5);  /* 글로우 효과 */
  
  /* 텍스트 */
  --text-primary: #ffffff;       /* 메인 텍스트 */
  --text-secondary: #a1a1aa;     /* 보조 텍스트 */
  --text-muted: #6b6b7a;         /* 비활성 텍스트 */
  --text-inverse: #0a0a1a;       /* 밝은 배경 위 텍스트 */
  
  /* 시맨틱 색상 */
  --success: #22c55e;            /* 성공/당첨 */
  --warning: #f59e0b;            /* 경고 */
  --error: #ef4444;              /* 에러 */
  --info: #3b82f6;               /* 정보 */
  
  /* 그라데이션 */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-accent: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  --gradient-gold: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  
  /* 테두리 & 구분선 */
  --border-color: #3a3a5a;
  --border-focus: #6366f1;
  --divider: #2a2a4a;
  
  /* 그림자 */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px var(--accent-glow);
}
```

### 2.2 라이트 모드

```css
[data-theme="light"] {
  /* 배경 계층 */
  --bg-primary: #f8f9fc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #eef0f5;
  --bg-elevated: #ffffff;
  
  /* 강조색 (더 진하게) */
  --accent-primary: #4f46e5;
  --accent-secondary: #7c3aed;
  --accent-tertiary: #8b5cf6;
  --accent-glow: rgba(79, 70, 229, 0.3);
  
  /* 텍스트 */
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a5a;
  --text-muted: #9a9aaa;
  --text-inverse: #ffffff;
  
  /* 테두리 & 구분선 */
  --border-color: #e2e4e9;
  --border-focus: #4f46e5;
  --divider: #eef0f5;
  
  /* 그림자 */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
  --shadow-glow: 0 0 20px var(--accent-glow);
}
```

### 2.3 테마별 액센트 색상

#### 🌌 우주 (Space) - 기본

```css
[data-theme-style="space"] {
  --accent-primary: #6366f1;     /* 인디고 */
  --accent-secondary: #8b5cf6;   /* 바이올렛 */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

#### 💜 네온 (Neon)

```css
[data-theme-style="neon"] {
  --bg-primary: #000000;
  --bg-secondary: #0d0d0d;
  --accent-primary: #ff006e;     /* 핫핑크 */
  --accent-secondary: #00f5ff;   /* 시안 */
  --accent-glow: rgba(255, 0, 110, 0.6);
  --gradient-primary: linear-gradient(135deg, #ff006e 0%, #00f5ff 100%);
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
}
```

#### ⚪ 미니멀 (Minimal)

```css
[data-theme-style="minimal"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --accent-primary: #000000;
  --accent-secondary: #333333;
  --accent-glow: rgba(0, 0, 0, 0.2);
  --gradient-primary: linear-gradient(135deg, #333333 0%, #000000 100%);
  --text-primary: #000000;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
}
```

#### 🕹️ 레트로 (Retro)

```css
[data-theme-style="retro"] {
  --bg-primary: #0a1f0a;
  --bg-secondary: #0f2f0f;
  --accent-primary: #00ff00;     /* 픽셀 그린 */
  --accent-secondary: #33ff33;
  --accent-glow: rgba(0, 255, 0, 0.4);
  --gradient-primary: linear-gradient(135deg, #00cc00 0%, #00ff00 100%);
  --text-primary: #00ff00;
  --text-secondary: #00cc00;
  --border-color: #00ff00;
  /* 특수: 픽셀 폰트 사용 */
}
```

#### 🌿 자연 (Nature)

```css
[data-theme-style="nature"] {
  --bg-primary: #1a2f1a;
  --bg-secondary: #243524;
  --accent-primary: #10b981;     /* 에메랄드 */
  --accent-secondary: #34d399;
  --accent-glow: rgba(16, 185, 129, 0.4);
  --gradient-primary: linear-gradient(135deg, #059669 0%, #10b981 100%);
  --text-primary: #ecfdf5;
  --text-secondary: #a7f3d0;
}
```

### 2.4 모드별 색상 팔레트

추첨 모드별 구슬/세그먼트 색상:

```javascript
const MODE_COLORS = {
  // 마블 레이스 - 파스텔 톤
  marble: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#DDA0DD', '#FFD700', '#FF8C00', '#9370DB',
    '#20B2AA', '#FF69B4', '#87CEEB', '#98D8C8'
  ],
  
  // 휠 스피너 - 선명한 색상
  wheel: [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
    '#6366f1', '#06b6d4', '#84cc16', '#f43f5e'
  ],
  
  // 풍선 - 밝은 파스텔
  balloon: [
    '#FF6B6B', '#FFE66D', '#4ECDC4', '#95E1D3',
    '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA'
  ],
  
  // 해적 룰렛 - 나무/금속 톤
  pirate: ['#8B4513', '#CD853F', '#D2691E', '#A0522D']
};
```

---

## 3. 타이포그래피

### 3.1 폰트 스택

```css
:root {
  /* 제목용 - 미래적 느낌 */
  --font-display: 'Orbitron', 'Noto Sans KR', sans-serif;
  
  /* 본문용 - 가독성 */
  --font-body: 'Inter', 'Noto Sans KR', sans-serif;
  
  /* 숫자/코드용 */
  --font-mono: 'JetBrains Mono', monospace;
  
  /* 레트로 테마 전용 */
  --font-retro: 'Press Start 2P', monospace;
}
```

### 3.2 폰트 크기 체계

```css
:root {
  /* 기본 크기 (rem 기준) */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 2rem;       /* 32px */
  --text-4xl: 2.5rem;     /* 40px */
  --text-5xl: 3rem;       /* 48px */
  --text-hero: 4rem;      /* 64px - 메인 타이틀 */
}
```

### 3.3 폰트 사용 가이드

| 요소 | 폰트 | 크기 | 굵기 | 행간 |
|------|------|------|------|------|
| 메인 타이틀 | Orbitron | 4xl~hero | 700 | 1.2 |
| 섹션 제목 | Orbitron | 2xl~3xl | 600 | 1.3 |
| 카드 제목 | Inter | lg~xl | 600 | 1.4 |
| 본문 | Inter | base | 400 | 1.6 |
| 버튼 | Inter | base~lg | 600 | 1 |
| 입력 필드 | Inter | base | 400 | 1.5 |
| 레이블 | Inter | sm | 500 | 1.4 |
| 캡션/힌트 | Inter | xs~sm | 400 | 1.4 |
| 숫자/카운터 | JetBrains Mono | lg~2xl | 500 | 1 |
| 당첨자 이름 | Orbitron | 2xl~3xl | 700 | 1.2 |

### 3.4 텍스트 스타일 예시

```css
/* 메인 타이틀 */
.title-hero {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.02em;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 당첨자 이름 */
.winner-name {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--success);
  text-shadow: 0 0 20px var(--success);
}

/* 참가자 수 카운터 */
.counter {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: 500;
  color: var(--accent-primary);
}
```

---

## 4. 간격 & 레이아웃

### 4.1 간격 시스템 (8px 기반)

```css
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */
}
```

### 4.2 컴포넌트 간격 가이드

| 요소 | 내부 패딩 | 외부 마진 |
|------|-----------|-----------|
| 페이지 | 16~32px | - |
| 섹션 | 24~48px | 32~64px |
| 카드 | 16~24px | 16px |
| 버튼 | 12~16px (세로) / 24~32px (가로) | 8~16px |
| 입력 필드 | 12~16px | 8px |
| 모달 | 24~32px | - |
| 리스트 아이템 | 12~16px | 8px (사이) |

### 4.3 그리드 시스템

```css
/* 모드 선택 그리드 */
.mode-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-4);
}

/* 반응형 */
@media (max-width: 1024px) {
  .mode-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-3);
  }
}

@media (max-width: 640px) {
  .mode-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-2);
  }
}
```

---

## 5. 컴포넌트 디자인

### 5.1 버튼

#### Primary Button (추첨 시작)

```css
.btn-primary {
  /* 크기 */
  padding: var(--spacing-4) var(--spacing-8);
  min-height: 56px;
  
  /* 배경 */
  background: var(--gradient-primary);
  border: none;
  border-radius: 16px;
  
  /* 텍스트 */
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-inverse);
  
  /* 효과 */
  box-shadow: var(--shadow-md), var(--shadow-glow);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), 0 0 30px var(--accent-glow);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}

.btn-primary:disabled {
  background: var(--bg-tertiary);
  color: var(--text-muted);
  box-shadow: none;
  cursor: not-allowed;
}
```

#### Secondary Button

```css
.btn-secondary {
  padding: var(--spacing-3) var(--spacing-6);
  min-height: 44px;
  
  background: transparent;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--text-primary);
  
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}
```

#### Icon Button

```css
.btn-icon {
  width: 44px;
  height: 44px;
  padding: 0;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  
  font-size: var(--text-xl);
  
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent-primary);
}
```

### 5.2 모드 카드

```css
.mode-card {
  /* 레이아웃 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  
  /* 배경 */
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  
  /* 효과 */
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-card:hover {
  transform: scale(1.05);
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-lg);
}

.mode-card.active {
  background: var(--bg-tertiary);
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.mode-card__icon {
  font-size: 3rem;
  filter: drop-shadow(0 0 8px var(--accent-glow));
}

.mode-card__title {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
}

.mode-card__description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-align: center;
}
```

### 5.3 입력 필드

```css
.input-field {
  width: 100%;
  min-height: 120px;
  padding: var(--spacing-4);
  
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-primary);
  resize: vertical;
  
  transition: all 0.3s ease;
}

.input-field::placeholder {
  color: var(--text-muted);
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px var(--accent-glow);
}

.input-field:invalid {
  border-color: var(--error);
}
```

### 5.4 드롭다운 셀렉트

```css
.select-wrapper {
  position: relative;
}

.select-field {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  padding-right: var(--spacing-10);
  
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  
  font-size: var(--text-base);
  color: var(--text-primary);
  
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-field:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.select-wrapper::after {
  content: '▼';
  position: absolute;
  right: var(--spacing-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}
```

### 5.5 토글 스위치

```css
.toggle {
  position: relative;
  width: 56px;
  height: 32px;
  
  background: var(--bg-tertiary);
  border-radius: 16px;
  
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle.active {
  background: var(--accent-primary);
}

.toggle__knob {
  position: absolute;
  top: 4px;
  left: 4px;
  
  width: 24px;
  height: 24px;
  
  background: var(--text-primary);
  border-radius: 50%;
  
  transition: transform 0.3s ease;
}

.toggle.active .toggle__knob {
  transform: translateX(24px);
}
```

### 5.6 결과 모달

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  
  z-index: 1000;
  
  animation: fadeIn 0.3s ease;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  padding: var(--spacing-8);
  
  background: var(--bg-secondary);
  border: 2px solid var(--accent-primary);
  border-radius: 24px;
  
  text-align: center;
  
  animation: scaleIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}
```

### 5.7 토스트 알림

```css
.toast {
  position: fixed;
  bottom: var(--spacing-6);
  left: 50%;
  transform: translateX(-50%);
  
  padding: var(--spacing-4) var(--spacing-6);
  
  background: var(--bg-elevated);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  
  font-size: var(--text-base);
  color: var(--text-primary);
  
  z-index: 1100;
  
  animation: slideUp 0.3s ease;
}

.toast-success { border-left: 4px solid var(--success); }
.toast-warning { border-left: 4px solid var(--warning); }
.toast-error { border-left: 4px solid var(--error); }
.toast-info { border-left: 4px solid var(--info); }

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
```

### 5.8 컨트롤 바 (상단 배너)

```css
/* 컨트롤 바 컨테이너 */
.control-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-6);
  
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  
  flex-wrap: wrap;
  justify-content: center;
}

/* 컨트롤 아이템 */
.control-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  position: relative;
}

/* 참가자 입력 트리거 버튼 */
.control-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  
  font-size: var(--text-base);
  color: var(--text-primary);
  
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-trigger:hover {
  border-color: var(--accent-primary);
  background: var(--bg-elevated);
}

.control-trigger[aria-expanded="true"] {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

/* 배지 (참가자 수) */
.control-badge {
  padding: var(--spacing-1) var(--spacing-2);
  
  background: var(--accent-primary);
  border-radius: 20px;
  
  font-size: var(--text-sm);
  font-weight: 600;
  color: white;
}

/* 드롭다운 팝업 */
.dropdown-popup {
  position: absolute;
  top: calc(100% + var(--spacing-2));
  left: 0;
  z-index: 100;
  
  width: 350px;
  max-width: 90vw;
  
  background: var(--bg-elevated);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  
  animation: dropdownOpen 0.2s ease;
}

.dropdown-content {
  padding: var(--spacing-4);
}

@keyframes dropdownOpen {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 컴팩트 셀렉트 */
.select-field-compact {
  padding: var(--spacing-2) var(--spacing-3);
  padding-right: var(--spacing-8);
  
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  
  font-size: var(--text-sm);
  color: var(--text-primary);
  
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-field-compact:focus {
  outline: none;
  border-color: var(--accent-primary);
}

/* 컴팩트 아이콘 버튼 */
.btn-icon-compact {
  width: 40px;
  height: 40px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  
  font-size: var(--text-lg);
  
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-icon-compact:hover {
  background: var(--bg-elevated);
  border-color: var(--accent-primary);
}

/* 컴팩트 프라이머리 버튼 */
.btn-primary-compact {
  padding: var(--spacing-2) var(--spacing-6);
  
  background: var(--gradient-primary);
  border: none;
  border-radius: 12px;
  
  font-size: var(--text-base);
  font-weight: 600;
  color: white;
  
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.btn-primary-compact:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.btn-primary-compact:disabled {
  background: var(--bg-tertiary);
  color: var(--text-muted);
  box-shadow: none;
  cursor: not-allowed;
}

/* 인라인 라벨 */
.control-label-inline {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
}
```

### 5.9 풀스크린 캔버스 영역

```css
/* 캔버스 영역 - 화면 전체 차지 */
.canvas-area-fullscreen {
  flex: 1;
  min-height: 0;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

/* 플레이스홀더 */
.canvas-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 100%;
  height: 100%;
}

.placeholder-content {
  text-align: center;
  padding: var(--spacing-8);
}

.placeholder-icon {
  font-size: 5rem;
  display: block;
  margin-bottom: var(--spacing-4);
  animation: float 3s ease-in-out infinite;
}

.placeholder-text {
  font-size: var(--text-xl);
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-2);
}

.placeholder-hint {
  font-size: var(--text-sm);
  color: var(--text-muted);
}
```

---

## 6. 아이콘 가이드

### 6.1 이모지 아이콘 (기본)

| 용도 | 이모지 | 대체 |
|------|--------|------|
| 마블 레이스 | 🎱 | - |
| 휠 스피너 | 🎡 | - |
| 풍선 터뜨리기 | 🎈 | - |
| 해적 룰렛 | 🏴‍☠️ | - |
| 추첨 시작 | 🎰 | - |
| 다크 모드 | 🌙 | - |
| 라이트 모드 | ☀️ | - |
| 사운드 ON | 🔊 | - |
| 사운드 OFF | 🔇 | - |
| 1등 | 🥇 | - |
| 2등 | 🥈 | - |
| 3등 | 🥉 | - |
| 복사 | 📋 | - |
| 이미지 저장 | 📷 | - |
| 재추첨 | 🔄 | - |
| 풀스크린 | ⛶ | - |
| 축하 | 🎉 | - |

### 6.2 아이콘 스타일

```css
/* 아이콘 기본 크기 */
.icon-sm { font-size: 1rem; }     /* 16px */
.icon-md { font-size: 1.5rem; }   /* 24px */
.icon-lg { font-size: 2rem; }     /* 32px */
.icon-xl { font-size: 3rem; }     /* 48px */
.icon-2xl { font-size: 4rem; }    /* 64px */

/* 아이콘 글로우 효과 */
.icon-glow {
  filter: drop-shadow(0 0 8px var(--accent-glow));
}

/* 아이콘 회전 애니메이션 */
.icon-spin {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 7. 애니메이션 & 모션

### 7.1 트랜지션 속도

```css
:root {
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  --duration-slower: 0.8s;
  
  --ease-default: ease;
  --ease-in: ease-in;
  --ease-out: ease-out;
  --ease-in-out: ease-in-out;
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### 7.2 기본 애니메이션

```css
/* 페이드 인 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 슬라이드 업 */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 스케일 인 */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 부유 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* 글로우 펄스 */
@keyframes glowPulse {
  0%, 100% { 
    box-shadow: 0 0 10px var(--accent-glow); 
  }
  50% { 
    box-shadow: 0 0 30px var(--accent-glow), 0 0 60px var(--accent-glow); 
  }
}

/* 흔들림 (에러) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

### 7.3 컴포넌트별 모션

| 컴포넌트 | 등장 | 호버 | 클릭 |
|----------|------|------|------|
| 모드 카드 | slideUp 0.3s | scale(1.05) | scale(0.98) |
| 버튼 | fadeIn 0.2s | translateY(-2px) | scale(0.98) |
| 모달 | scaleIn 0.3s | - | - |
| 토스트 | slideUp 0.3s | - | fadeOut 0.3s |
| 당첨자 | slideUp 0.5s (stagger) | - | - |

### 7.4 페이지 로드 애니메이션

```css
/* 순차적 등장 (stagger) */
.stagger-item {
  opacity: 0;
  animation: slideUp 0.5s ease forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0.1s; }
.stagger-item:nth-child(2) { animation-delay: 0.2s; }
.stagger-item:nth-child(3) { animation-delay: 0.3s; }
.stagger-item:nth-child(4) { animation-delay: 0.4s; }
```

---

## 8. 반응형 디자인

### 8.1 브레이크포인트

```css
/* Mobile First */
/* 기본: Mobile (< 640px) */

/* Tablet */
@media (min-width: 640px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }
```

### 8.2 반응형 타이포그래피

```css
/* 모바일 */
:root {
  --text-hero: 2.5rem;   /* 40px */
  --text-4xl: 2rem;      /* 32px */
}

/* 태블릿 */
@media (min-width: 640px) {
  :root {
    --text-hero: 3rem;   /* 48px */
    --text-4xl: 2.25rem; /* 36px */
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  :root {
    --text-hero: 4rem;   /* 64px */
    --text-4xl: 2.5rem;  /* 40px */
  }
}
```

### 8.3 반응형 간격

```css
/* 모바일 */
.section {
  padding: var(--spacing-4);
}

/* 태블릿 */
@media (min-width: 640px) {
  .section {
    padding: var(--spacing-6);
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .section {
    padding: var(--spacing-8);
  }
}
```

---

## 9. 접근성 디자인

### 9.1 포커스 스타일

```css
/* 모든 포커스 가능 요소 */
:focus-visible {
  outline: 3px solid var(--accent-primary);
  outline-offset: 2px;
}

/* 버튼 포커스 */
.btn:focus-visible {
  box-shadow: 0 0 0 4px var(--accent-glow);
}

/* 입력 필드 포커스 */
.input-field:focus-visible {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px var(--accent-glow);
}
```

### 9.2 색상 대비

| 조합 | 전경 | 배경 | 대비율 | 통과 |
|------|------|------|--------|------|
| 본문 (다크) | #ffffff | #0a0a1a | 18.4:1 | ✅ AAA |
| 본문 (라이트) | #1a1a2e | #f8f9fc | 12.6:1 | ✅ AAA |
| 버튼 | #ffffff | #6366f1 | 4.8:1 | ✅ AA |
| 링크 | #6366f1 | #0a0a1a | 5.2:1 | ✅ AA |
| 비활성 | #6b6b7a | #0a0a1a | 4.5:1 | ✅ AA |

### 9.3 모션 감소

```css
/* 사용자가 모션 감소 설정한 경우 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. 에셋 가이드

### 10.1 파비콘

| 크기 | 용도 | 파일명 |
|------|------|--------|
| 16x16 | 브라우저 탭 | favicon-16.png |
| 32x32 | 브라우저 탭 (레티나) | favicon-32.png |
| 180x180 | Apple Touch Icon | apple-touch-icon.png |
| 192x192 | Android Chrome | android-chrome-192.png |
| 512x512 | Android Chrome (스플래시) | android-chrome-512.png |

### 10.2 OG 이미지

```
파일명: og-image.png
크기: 1200 x 630px
내용:
┌─────────────────────────────────────────┐
│                                         │
│      🎰 Multi-Mode Roulette            │
│                                         │
│   4가지 3D 애니메이션 추첨 모드          │
│                                         │
│   🎱  🎡  🎈  🏴‍☠️                       │
│                                         │
│              by SIREAL                  │
│                                         │
└─────────────────────────────────────────┘
```

### 10.3 사운드 파일

| 파일 | 포맷 | 용량 제한 | 설명 |
|------|------|-----------|------|
| spin.mp3 | MP3/OGG | < 50KB | 휠 회전 소리 |
| pop.mp3 | MP3/OGG | < 30KB | 풍선 터지는 소리 |
| fanfare.mp3 | MP3/OGG | < 100KB | 당첨 팡파레 |
| click.mp3 | MP3/OGG | < 10KB | 버튼 클릭 |
| marble.mp3 | MP3/OGG | < 50KB | 구슬 굴러가는 소리 |
| sword.mp3 | MP3/OGG | < 30KB | 칼 꽂히는 소리 |

---

**문서 버전**: v1.0  
**작성일**: 2025-11-29  
**작성자**: SIREAL  
**관련 문서**: roulette-prd.md v1.1 | roulette-trd.md v1.0 | roulette-ia.md v1.0

