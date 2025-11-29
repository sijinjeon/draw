# 🔧 Multi-Mode Roulette - 기술 요구사항 문서 (TRD)

> **관련 문서**: [roulette-prd.md](./roulette-prd.md)  
> **문서 버전**: v1.0  
> **작성일**: 2025-11-29  
> **작성자**: SIREAL

---

## 1. 기술 아키텍처 개요

### 1.1 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          클라이언트 (브라우저)                              │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   UI Layer  │  │ Mode Layer  │  │ Utils Layer │  │ State Layer │    │
│  │             │  │             │  │             │  │             │    │
│  │ - controls  │  │ - marble    │  │ - parser    │  │ - AppState  │    │
│  │ - results   │  │ - wheel     │  │ - shuffle   │  │ - Settings  │    │
│  │ - theme     │  │ - balloon   │  │ - clipboard │  │ - Winners   │    │
│  │             │  │ - pirate    │  │ - confetti  │  │             │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │                │           │
│         └────────────────┼────────────────┼────────────────┘           │
│                          │                │                             │
│  ┌───────────────────────┴────────────────┴───────────────────────┐    │
│  │                        main.js (앱 진입점)                       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                    │                                    │
├────────────────────────────────────┼────────────────────────────────────┤
│                          External Libraries (CDN)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Three.js │ │ Matter.js│ │   GSAP   │ │ Howler.js│ │ Confetti │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        GitHub Pages (정적 호스팅)                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 기술 스택 상세

| 카테고리 | 기술 | 버전 | CDN URL | 용도 |
|----------|------|------|---------|------|
| 3D 렌더링 | Three.js | r158 | `unpkg.com/three@0.158.0` | 휠 스피너, 해적 룰렛 |
| 물리 엔진 | Matter.js | 0.19.0 | `cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0` | 마블 레이스 |
| 애니메이션 | GSAP | 3.12.2 | `cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2` | 모든 모드 |
| 사운드 | Howler.js | 2.2.4 | `cdnjs.cloudflare.com/ajax/libs/howler/2.2.4` | 효과음 |
| 폭죽 | canvas-confetti | 1.9.0 | `cdn.jsdelivr.net/npm/canvas-confetti@1.9.0` | 당첨 효과 |
| 이미지 캡처 | html2canvas | 1.4.1 | `cdn.jsdelivr.net/npm/html2canvas@1.4.1` | 결과 저장 |
| CSS 프레임워크 | Tailwind CSS | 3.4.0 | `cdn.tailwindcss.com` | 스타일링 |

---

## 2. 모듈 상세 명세

### 2.1 코어 모듈 구조

```
/js/
├── main.js                 # 앱 진입점, 초기화
├── config.js               # 전역 설정값
├── state.js                # 상태 관리
├── modes/
│   ├── BaseMode.js         # 추상 베이스 클래스
│   ├── marble-race.js      # 마블 레이스
│   ├── wheel-spinner.js    # 3D 휠 스피너
│   ├── balloon-pop.js      # 풍선 터뜨리기
│   └── pirate-roulette.js  # 해적 룰렛
├── utils/
│   ├── parser.js           # 입력 파싱
│   ├── shuffle.js          # 셔플 알고리즘
│   ├── clipboard.js        # 클립보드
│   ├── confetti.js         # 폭죽 효과
│   ├── sound.js            # 사운드 관리
│   └── performance.js      # 성능 감지
└── ui/
    ├── controls.js         # UI 컨트롤러
    ├── results.js          # 결과 화면
    ├── theme-toggle.js     # 테마 전환
    └── toast.js            # 알림 메시지
```

### 2.2 main.js - 앱 진입점

```javascript
/**
 * @file main.js
 * @description 애플리케이션 진입점 및 초기화
 */

// 모듈 임포트
import { AppState } from './state.js';
import { UIController } from './ui/controls.js';
import { ThemeToggle } from './ui/theme-toggle.js';
import { SoundManager } from './utils/sound.js';
import { PerformanceDetector } from './utils/performance.js';

// 모드 임포트 (동적 로딩)
const modes = {
  marble: () => import('./modes/marble-race.js'),
  wheel: () => import('./modes/wheel-spinner.js'),
  balloon: () => import('./modes/balloon-pop.js'),
  pirate: () => import('./modes/pirate-roulette.js')
};

class App {
  constructor() {
    this.state = new AppState();
    this.ui = null;
    this.currentMode = null;
    this.sound = null;
    this.theme = null;
  }

  async init() {
    // 1. 성능 감지
    const performance = new PerformanceDetector();
    this.state.setPerformanceLevel(performance.detect());

    // 2. 테마 초기화
    this.theme = new ThemeToggle();

    // 3. 사운드 초기화
    this.sound = new SoundManager();

    // 4. UI 초기화
    this.ui = new UIController(this.state, this);

    // 5. 이벤트 바인딩
    this.bindEvents();

    // 6. 기본 모드 로드
    await this.loadMode('wheel');

    console.log('🎰 Multi-Mode Roulette initialized');
  }

  async loadMode(modeName) {
    if (this.currentMode) {
      this.currentMode.destroy();
    }
    
    const ModeClass = await modes[modeName]();
    this.currentMode = new ModeClass.default(this.state, this.sound);
    this.currentMode.init();
  }

  bindEvents() {
    // 키보드 단축키
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    
    // 윈도우 리사이즈
    window.addEventListener('resize', () => this.handleResize());
  }

  handleKeyPress(e) {
    const key = e.key.toLowerCase();
    const handlers = {
      ' ': () => this.startDraw(),
      'f': () => this.toggleFullscreen(),
      'r': () => this.reset(),
      'd': () => this.theme.toggle(),
      '1': () => this.loadMode('marble'),
      '2': () => this.loadMode('wheel'),
      '3': () => this.loadMode('balloon'),
      '4': () => this.loadMode('pirate')
    };
    
    if (handlers[key]) {
      e.preventDefault();
      handlers[key]();
    }
  }

  handleResize() {
    if (this.currentMode) {
      this.currentMode.resize();
    }
  }

  startDraw() {
    if (!this.state.canStart()) return;
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

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
```

### 2.3 state.js - 상태 관리

```javascript
/**
 * @file state.js
 * @description 전역 상태 관리 (Observer 패턴)
 */

export class AppState {
  constructor() {
    this._state = {
      // 참가자 데이터
      participants: [],
      
      // 설정
      settings: {
        winnerCount: 1,
        animationSpeed: 'normal', // slow, normal, fast
        soundEnabled: true,
        theme: 'space',
        darkMode: true
      },
      
      // 현재 상태
      currentMode: 'wheel',
      isRunning: false,
      
      // 결과
      winners: [],
      
      // 성능
      performanceLevel: 'high' // high, medium, low
    };
    
    this._observers = new Set();
  }

  // Observer 등록
  subscribe(callback) {
    this._observers.add(callback);
    return () => this._observers.delete(callback);
  }

  // 상태 변경 알림
  _notify(key, value) {
    this._observers.forEach(cb => cb(key, value, this._state));
  }

  // Getters
  get participants() { return this._state.participants; }
  get settings() { return this._state.settings; }
  get winners() { return this._state.winners; }
  get isRunning() { return this._state.isRunning; }
  get performanceLevel() { return this._state.performanceLevel; }

  // Setters
  setParticipants(names) {
    this._state.participants = names;
    this._notify('participants', names);
  }

  setWinners(winners) {
    this._state.winners = winners;
    this._notify('winners', winners);
  }

  setSetting(key, value) {
    this._state.settings[key] = value;
    this._notify(`settings.${key}`, value);
  }

  setRunning(isRunning) {
    this._state.isRunning = isRunning;
    this._notify('isRunning', isRunning);
  }

  setPerformanceLevel(level) {
    this._state.performanceLevel = level;
    this._notify('performanceLevel', level);
  }

  // 유틸리티
  canStart() {
    return this._state.participants.length > 0 && !this._state.isRunning;
  }

  reset() {
    this._state.winners = [];
    this._state.isRunning = false;
    this._notify('reset', null);
  }

  // 로컬 스토리지 연동
  saveToStorage() {
    localStorage.setItem('roulette_settings', JSON.stringify(this._state.settings));
  }

  loadFromStorage() {
    const saved = localStorage.getItem('roulette_settings');
    if (saved) {
      this._state.settings = { ...this._state.settings, ...JSON.parse(saved) };
    }
  }
}
```

### 2.4 config.js - 전역 설정

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
      postProcessing: true,
      targetFPS: 60
    },
    medium: {
      particleCount: 150,
      shadows: true,
      postProcessing: false,
      targetFPS: 45
    },
    low: {
      particleCount: 100,
      shadows: false,
      postProcessing: false,
      targetFPS: 30
    }
  },
  
  // 폭죽 색상
  CONFETTI_COLORS: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD'],
  
  // 사운드 파일
  SOUNDS: {
    spin: 'sounds/spin.mp3',
    pop: 'sounds/pop.mp3',
    fanfare: 'sounds/fanfare.mp3',
    click: 'sounds/click.mp3',
    marble: 'sounds/marble.mp3',
    sword: 'sounds/sword.mp3'
  },
  
  // 테마
  THEMES: ['space', 'neon', 'minimal', 'retro', 'nature'],
  
  // 모드
  MODES: {
    marble: { name: '마블 레이스', icon: '🎱', minParticipants: 2 },
    wheel: { name: '3D 휠 스피너', icon: '🎡', minParticipants: 2 },
    balloon: { name: '풍선 터뜨리기', icon: '🎈', minParticipants: 1 },
    pirate: { name: '해적 룰렛', icon: '🏴‍☠️', minParticipants: 2 }
  }
};
```

---

## 3. 모드별 구현 명세

### 3.1 BaseMode.js - 추상 베이스 클래스

```javascript
/**
 * @file BaseMode.js
 * @description 모든 추첨 모드의 추상 베이스 클래스
 */

export class BaseMode {
  constructor(state, sound) {
    if (new.target === BaseMode) {
      throw new Error('BaseMode는 직접 인스턴스화할 수 없습니다.');
    }
    
    this.state = state;
    this.sound = sound;
    this.container = null;
    this.isInitialized = false;
    this.animationId = null;
  }

  /**
   * 모드 초기화 (필수 구현)
   * @abstract
   */
  init() {
    throw new Error('init() 메서드를 구현해야 합니다.');
  }

  /**
   * 추첨 시작 (필수 구현)
   * @abstract
   */
  start() {
    throw new Error('start() 메서드를 구현해야 합니다.');
  }

  /**
   * 모드 리셋 (필수 구현)
   * @abstract
   */
  reset() {
    throw new Error('reset() 메서드를 구현해야 합니다.');
  }

  /**
   * 리사이즈 핸들러
   */
  resize() {
    // 기본 구현 (오버라이드 가능)
  }

  /**
   * 모드 정리
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.isInitialized = false;
  }

  /**
   * 당첨자 선정
   * @param {number} count - 당첨자 수
   * @returns {string[]} - 당첨자 이름 배열
   */
  selectWinners(count) {
    const shuffled = this.shuffle([...this.state.participants]);
    return shuffled.slice(0, count);
  }

  /**
   * Fisher-Yates 셔플
   * @param {any[]} array
   * @returns {any[]}
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * 당첨 완료 처리
   * @param {string[]} winners
   */
  onComplete(winners) {
    this.state.setWinners(winners);
    this.state.setRunning(false);
    
    // 폭죽 효과
    import('../utils/confetti.js').then(module => {
      module.launchConfetti();
    });
    
    // 당첨 사운드
    this.sound.play('fanfare');
    
    // 커스텀 이벤트 발생
    document.dispatchEvent(new CustomEvent('drawComplete', { detail: { winners } }));
  }
}
```

### 3.2 마블 레이스 모드 상세

```javascript
/**
 * @file marble-race.js
 * @description Matter.js 기반 마블 레이스 구현
 * 
 * 기술 요구사항:
 * - Matter.js 물리 엔진 사용
 * - Canvas 2D 렌더링
 * - 충돌 감지 및 순위 결정
 * - 구슬별 고유 색상 및 이름 표시
 */

import { BaseMode } from './BaseMode.js';
import { CONFIG } from '../config.js';

export default class MarbleRaceMode extends BaseMode {
  constructor(state, sound) {
    super(state, sound);
    
    // Matter.js 인스턴스
    this.engine = null;
    this.world = null;
    this.render = null;
    this.runner = null;
    
    // 게임 상태
    this.marbles = [];
    this.finishedMarbles = [];
    this.trackBodies = [];
  }

  init() {
    this.container = document.getElementById('mode-container');
    
    // Matter.js 엔진 생성
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.world.gravity.y = 0.8;
    
    // 렌더러 생성
    this.render = Matter.Render.create({
      element: this.container,
      engine: this.engine,
      options: {
        width: this.container.clientWidth,
        height: this.container.clientHeight,
        wireframes: false,
        background: 'transparent'
      }
    });
    
    // 트랙 생성
    this.createTrack();
    
    // 충돌 이벤트
    Matter.Events.on(this.engine, 'collisionStart', (e) => this.handleCollision(e));
    
    this.isInitialized = true;
  }

  createTrack() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    // 트랙 벽 생성 (지그재그 형태)
    const trackConfig = [
      // 왼쪽 벽
      { x: 50, y: height / 2, w: 20, h: height, angle: 0 },
      // 오른쪽 벽
      { x: width - 50, y: height / 2, w: 20, h: height, angle: 0 },
      // 지그재그 장애물
      { x: width * 0.3, y: height * 0.2, w: width * 0.4, h: 20, angle: 0.15 },
      { x: width * 0.7, y: height * 0.35, w: width * 0.4, h: 20, angle: -0.15 },
      { x: width * 0.3, y: height * 0.5, w: width * 0.4, h: 20, angle: 0.15 },
      { x: width * 0.7, y: height * 0.65, w: width * 0.4, h: 20, angle: -0.15 },
      // 결승선
      { x: width / 2, y: height - 30, w: width - 100, h: 20, angle: 0, isFinish: true }
    ];
    
    trackConfig.forEach(config => {
      const body = Matter.Bodies.rectangle(
        config.x, config.y, config.w, config.h,
        {
          isStatic: true,
          angle: config.angle,
          render: {
            fillStyle: config.isFinish ? '#FFD700' : '#3a3a5a'
          },
          label: config.isFinish ? 'finish' : 'wall'
        }
      );
      this.trackBodies.push(body);
      Matter.World.add(this.world, body);
    });
  }

  createMarbles() {
    const participants = this.state.participants;
    const colors = this.generateColors(participants.length);
    const startX = this.container.clientWidth / 2;
    const spacing = 40;
    
    participants.forEach((name, i) => {
      const marble = Matter.Bodies.circle(
        startX + (i - participants.length / 2) * spacing,
        50,
        15,
        {
          restitution: 0.6,
          friction: 0.1,
          frictionAir: 0.01,
          label: name,
          render: {
            fillStyle: colors[i]
          }
        }
      );
      
      this.marbles.push({ body: marble, name, color: colors[i] });
      Matter.World.add(this.world, marble);
    });
  }

  generateColors(count) {
    const hueStep = 360 / count;
    return Array.from({ length: count }, (_, i) => 
      `hsl(${i * hueStep}, 70%, 50%)`
    );
  }

  start() {
    if (this.state.isRunning) return;
    
    this.state.setRunning(true);
    this.finishedMarbles = [];
    
    // 기존 구슬 제거
    this.marbles.forEach(m => Matter.World.remove(this.world, m.body));
    this.marbles = [];
    
    // 새 구슬 생성
    this.createMarbles();
    
    // 러너 시작
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
    Matter.Render.run(this.render);
    
    // 사운드
    this.sound.play('marble');
  }

  handleCollision(event) {
    event.pairs.forEach(pair => {
      const finishLine = [pair.bodyA, pair.bodyB].find(b => b.label === 'finish');
      const marble = [pair.bodyA, pair.bodyB].find(b => 
        this.marbles.some(m => m.body === b)
      );
      
      if (finishLine && marble) {
        const marbleData = this.marbles.find(m => m.body === marble);
        if (!this.finishedMarbles.includes(marbleData)) {
          this.finishedMarbles.push(marbleData);
          this.checkCompletion();
        }
      }
    });
  }

  checkCompletion() {
    const winnerCount = this.state.settings.winnerCount;
    
    if (this.finishedMarbles.length >= winnerCount) {
      const winners = this.finishedMarbles.slice(0, winnerCount).map(m => m.name);
      
      // 애니메이션 중지
      Matter.Runner.stop(this.runner);
      
      this.onComplete(winners);
    }
  }

  reset() {
    if (this.runner) Matter.Runner.stop(this.runner);
    
    this.marbles.forEach(m => Matter.World.remove(this.world, m.body));
    this.marbles = [];
    this.finishedMarbles = [];
  }

  resize() {
    if (!this.render) return;
    
    this.render.canvas.width = this.container.clientWidth;
    this.render.canvas.height = this.container.clientHeight;
    
    // 트랙 재생성
    this.trackBodies.forEach(b => Matter.World.remove(this.world, b));
    this.trackBodies = [];
    this.createTrack();
  }

  destroy() {
    if (this.runner) Matter.Runner.stop(this.runner);
    if (this.render) Matter.Render.stop(this.render);
    if (this.engine) Matter.Engine.clear(this.engine);
    
    super.destroy();
  }
}
```

### 3.3 3D 휠 스피너 모드 상세

```javascript
/**
 * @file wheel-spinner.js
 * @description Three.js 기반 3D 휠 스피너 구현
 * 
 * 기술 요구사항:
 * - Three.js WebGL 렌더링
 * - GSAP 회전 애니메이션
 * - 세그먼트별 색상 및 텍스트
 * - 감속 이징 효과
 */

import { BaseMode } from './BaseMode.js';
import { CONFIG } from '../config.js';

export default class WheelSpinnerMode extends BaseMode {
  constructor(state, sound) {
    super(state, sound);
    
    // Three.js 인스턴스
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.wheel = null;
    this.pointer = null;
    
    // 애니메이션 상태
    this.currentRotation = 0;
  }

  init() {
    this.container = document.getElementById('mode-container');
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    // Scene
    this.scene = new THREE.Scene();
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 8;
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
    
    // Pointer (화살표)
    this.createPointer();
    
    // 애니메이션 루프
    this.animate();
    
    this.isInitialized = true;
  }

  createWheel() {
    // 기존 휠 제거
    if (this.wheel) {
      this.scene.remove(this.wheel);
    }
    
    const participants = this.state.participants;
    const segments = participants.length;
    const radius = 4;
    const thickness = 0.5;
    
    this.wheel = new THREE.Group();
    
    // 세그먼트 생성
    const anglePerSegment = (Math.PI * 2) / segments;
    const colors = this.generateColors(segments);
    
    for (let i = 0; i < segments; i++) {
      // 세그먼트 지오메트리
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.arc(0, 0, radius, i * anglePerSegment, (i + 1) * anglePerSegment, false);
      shape.lineTo(0, 0);
      
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: thickness,
        bevelEnabled: false
      });
      
      const material = new THREE.MeshPhongMaterial({
        color: colors[i],
        side: THREE.DoubleSide
      });
      
      const segment = new THREE.Mesh(geometry, material);
      segment.rotation.x = Math.PI / 2;
      segment.position.z = -thickness / 2;
      
      this.wheel.add(segment);
      
      // 텍스트 추가 (참가자 이름)
      this.addSegmentText(participants[i], i, anglePerSegment, radius);
    }
    
    // 중앙 원
    const centerGeometry = new THREE.CylinderGeometry(0.5, 0.5, thickness + 0.1, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.rotation.x = Math.PI / 2;
    this.wheel.add(center);
    
    this.scene.add(this.wheel);
  }

  addSegmentText(text, index, anglePerSegment, radius) {
    // Canvas 텍스처로 텍스트 생성
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 긴 이름 처리
    const displayText = text.length > 8 ? text.slice(0, 7) + '…' : text;
    ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    
    // 위치 계산 (세그먼트 중앙)
    const angle = (index + 0.5) * anglePerSegment - Math.PI / 2;
    const textRadius = radius * 0.6;
    sprite.position.x = Math.cos(angle) * textRadius;
    sprite.position.y = Math.sin(angle) * textRadius;
    sprite.position.z = 0.3;
    sprite.scale.set(2, 0.5, 1);
    
    this.wheel.add(sprite);
  }

  createPointer() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.8);
    shape.lineTo(-0.3, 0);
    shape.lineTo(0.3, 0);
    shape.closePath();
    
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.pointer = new THREE.Mesh(geometry, material);
    this.pointer.position.set(0, 4.5, 0.5);
    
    this.scene.add(this.pointer);
  }

  generateColors(count) {
    const hueStep = 360 / count;
    return Array.from({ length: count }, (_, i) => {
      const hue = i * hueStep;
      return new THREE.Color(`hsl(${hue}, 70%, 50%)`);
    });
  }

  start() {
    if (this.state.isRunning) return;
    
    this.state.setRunning(true);
    
    // 휠 생성/갱신
    this.createWheel();
    
    // 당첨자 미리 결정
    const winnerIndex = Math.floor(Math.random() * this.state.participants.length);
    const winner = this.state.participants[winnerIndex];
    
    // 최종 각도 계산
    const segments = this.state.participants.length;
    const anglePerSegment = (Math.PI * 2) / segments;
    const targetAngle = -(winnerIndex * anglePerSegment + anglePerSegment / 2);
    
    // 회전 애니메이션 (GSAP)
    const duration = CONFIG.ANIMATION_SPEED[this.state.settings.animationSpeed] / 1000;
    const totalRotation = Math.PI * 10 + targetAngle - this.currentRotation;
    
    this.sound.play('spin');
    
    gsap.to(this.wheel.rotation, {
      z: this.currentRotation + totalRotation,
      duration: duration,
      ease: 'power4.out',
      onUpdate: () => {
        // 틱 사운드 (선택적)
      },
      onComplete: () => {
        this.currentRotation = this.wheel.rotation.z;
        this.onComplete([winner]);
      }
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  reset() {
    this.currentRotation = 0;
    if (this.wheel) {
      this.wheel.rotation.z = 0;
    }
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    super.destroy();
  }
}
```

### 3.4 풍선 터뜨리기 모드 상세

```javascript
/**
 * @file balloon-pop.js
 * @description Canvas 2D 기반 풍선 터뜨리기 구현
 * 
 * 기술 요구사항:
 * - Canvas 2D 렌더링
 * - 클릭/Enter 이벤트로 다트 발사
 * - 풍선 부유 애니메이션
 * - 터짐 파티클 효과
 */

import { BaseMode } from './BaseMode.js';
import { CONFIG } from '../config.js';

export default class BalloonPopMode extends BaseMode {
  constructor(state, sound) {
    super(state, sound);
    
    this.canvas = null;
    this.ctx = null;
    this.balloons = [];
    this.dart = null;
    this.poppedCount = 0;
    this.particles = [];
  }

  init() {
    this.container = document.getElementById('mode-container');
    
    // Canvas 생성
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    // 이벤트 바인딩
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.state.isRunning) {
        this.throwDart();
      }
    });
    
    // 애니메이션 시작
    this.animate();
    
    this.isInitialized = true;
  }

  createBalloons() {
    this.balloons = [];
    const participants = this.state.participants;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD', '#FFD700', '#FF8C00'];
    
    participants.forEach((name, i) => {
      this.balloons.push({
        name,
        x: 100 + Math.random() * (this.canvas.width - 200),
        y: 100 + Math.random() * (this.canvas.height - 300),
        radius: 40,
        color: colors[i % colors.length],
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.02 + Math.random() * 0.02,
        popped: false
      });
    });
  }

  start() {
    if (this.state.isRunning) return;
    
    this.state.setRunning(true);
    this.poppedCount = 0;
    this.dart = null;
    this.particles = [];
    
    this.createBalloons();
    
    // 안내 메시지
    this.showMessage('클릭 또는 Enter로 다트를 던지세요!');
  }

  handleClick(e) {
    if (!this.state.isRunning || this.dart) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.throwDart(x);
  }

  throwDart(targetX = this.canvas.width / 2) {
    if (this.dart || !this.state.isRunning) return;
    
    // 무작위 풍선 선택 (아직 터지지 않은 것 중에서)
    const availableBalloons = this.balloons.filter(b => !b.popped);
    if (availableBalloons.length === 0) return;
    
    const targetBalloon = availableBalloons[Math.floor(Math.random() * availableBalloons.length)];
    
    this.dart = {
      x: targetX,
      y: this.canvas.height,
      targetX: targetBalloon.x,
      targetY: targetBalloon.y,
      targetBalloon,
      speed: 15
    };
    
    this.sound.play('click');
  }

  updateDart() {
    if (!this.dart) return;
    
    const dx = this.dart.targetX - this.dart.x;
    const dy = this.dart.targetY - this.dart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < this.dart.speed) {
      // 풍선에 도달
      this.popBalloon(this.dart.targetBalloon);
      this.dart = null;
    } else {
      // 이동
      this.dart.x += (dx / distance) * this.dart.speed;
      this.dart.y += (dy / distance) * this.dart.speed;
    }
  }

  popBalloon(balloon) {
    balloon.popped = true;
    this.poppedCount++;
    
    // 파티클 효과
    this.createPopParticles(balloon.x, balloon.y, balloon.color);
    
    // 사운드
    this.sound.play('pop');
    
    // 당첨 확인
    if (this.poppedCount >= this.state.settings.winnerCount) {
      const winners = this.balloons
        .filter(b => b.popped)
        .slice(0, this.state.settings.winnerCount)
        .map(b => b.name);
      
      setTimeout(() => {
        this.onComplete(winners);
      }, 500);
    }
  }

  createPopParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        radius: 3 + Math.random() * 5,
        color,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02
      });
    }
  }

  updateParticles() {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // 중력
      p.alpha -= p.decay;
      return p.alpha > 0;
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 풍선 그리기
    this.balloons.forEach(balloon => {
      if (balloon.popped) return;
      
      // 부유 애니메이션
      balloon.floatOffset += balloon.floatSpeed;
      const floatY = Math.sin(balloon.floatOffset) * 10;
      
      this.drawBalloon(balloon.x, balloon.y + floatY, balloon.radius, balloon.color, balloon.name);
    });
    
    // 다트 업데이트 & 그리기
    this.updateDart();
    if (this.dart) {
      this.drawDart(this.dart.x, this.dart.y);
    }
    
    // 파티클 업데이트 & 그리기
    this.updateParticles();
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      this.ctx.fill();
    });
  }

  drawBalloon(x, y, radius, color, name) {
    const ctx = this.ctx;
    
    // 풍선 본체
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * 1.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // 하이라이트
    ctx.beginPath();
    ctx.ellipse(x - radius * 0.3, y - radius * 0.4, radius * 0.2, radius * 0.3, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
    
    // 끈
    ctx.beginPath();
    ctx.moveTo(x, y + radius * 1.2);
    ctx.quadraticCurveTo(x + 10, y + radius * 1.5, x, y + radius * 2);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 이름
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.length > 6 ? name.slice(0, 5) + '…' : name, x, y);
  }

  drawDart(x, y) {
    const ctx = this.ctx;
    
    // 다트 본체
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.atan2(this.dart.targetY - y, this.dart.targetX - x) + Math.PI / 2);
    
    // 날개
    ctx.beginPath();
    ctx.moveTo(-8, 10);
    ctx.lineTo(0, -20);
    ctx.lineTo(8, 10);
    ctx.fillStyle = '#FF4444';
    ctx.fill();
    
    // 몸체
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 15);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
  }

  showMessage(text) {
    // 토스트 메시지 표시 (UI 모듈 연동)
  }

  reset() {
    this.balloons = [];
    this.dart = null;
    this.poppedCount = 0;
    this.particles = [];
  }

  resize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  destroy() {
    super.destroy();
  }
}
```

### 3.5 해적 룰렛 모드 상세

```javascript
/**
 * @file pirate-roulette.js
 * @description Three.js 기반 해적 룰렛 구현
 * 
 * 기술 요구사항:
 * - Three.js 3D 렌더링
 * - 3D 모델 로딩 (GLTF)
 * - 칼 꽂기 애니메이션
 * - 해적 튀어오름 효과
 */

import { BaseMode } from './BaseMode.js';
import { CONFIG } from '../config.js';

export default class PirateRouletteMode extends BaseMode {
  constructor(state, sound) {
    super(state, sound);
    
    // Three.js
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    // 3D 오브젝트
    this.barrel = null;
    this.pirate = null;
    this.swords = [];
    this.slots = [];
    
    // 게임 상태
    this.currentSlot = 0;
    this.winningSlot = -1;
  }

  init() {
    this.container = document.getElementById('mode-container');
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 3, 8);
    this.camera.lookAt(0, 1, 0);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    
    // Lights
    this.setupLights();
    
    // 바닥
    this.createFloor();
    
    // 통 & 해적 생성 (간단한 기하학적 형태)
    this.createBarrel();
    this.createPirate();
    
    // 칼 슬롯 생성
    this.createSlots();
    
    // 클릭 이벤트
    this.container.addEventListener('click', () => this.insertSword());
    
    // 애니메이션
    this.animate();
    
    this.isInitialized = true;
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);
    
    const spotlight = new THREE.SpotLight(0xffffff, 1);
    spotlight.position.set(5, 10, 5);
    spotlight.castShadow = true;
    this.scene.add(spotlight);
  }

  createFloor() {
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x2a2a4a,
      roughness: 0.8
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  createBarrel() {
    // 나무통 (원기둥)
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.7
    });
    this.barrel = new THREE.Mesh(geometry, material);
    this.barrel.position.y = 1.5;
    this.barrel.castShadow = true;
    this.scene.add(this.barrel);
    
    // 통 띠 (검은색 원)
    [0.5, 2.5].forEach(y => {
      const bandGeometry = new THREE.TorusGeometry(1.55, 0.1, 8, 32);
      const bandMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const band = new THREE.Mesh(bandGeometry, bandMaterial);
      band.rotation.x = Math.PI / 2;
      band.position.y = y;
      this.scene.add(band);
    });
  }

  createPirate() {
    // 해적 (간단한 형태 - 실제로는 GLTF 모델 사용 권장)
    const group = new THREE.Group();
    
    // 머리
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFDBB4 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.6;
    group.add(head);
    
    // 모자
    const hatGeometry = new THREE.ConeGeometry(0.5, 0.6, 8);
    const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const hat = new THREE.Mesh(hatGeometry, hatMaterial);
    hat.position.y = 1.1;
    group.add(hat);
    
    // 눈 (패치)
    const patchGeometry = new THREE.CircleGeometry(0.1, 8);
    const patchMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const patch = new THREE.Mesh(patchGeometry, patchMaterial);
    patch.position.set(0.15, 0.65, 0.35);
    group.add(patch);
    
    this.pirate = group;
    this.pirate.position.y = 2; // 통 안에 숨어있음
    this.pirate.visible = false; // 처음엔 숨김
    this.scene.add(this.pirate);
  }

  createSlots() {
    const participants = this.state.participants;
    const slotCount = Math.min(participants.length, 12);
    const angleStep = (Math.PI * 2) / slotCount;
    
    this.slots = [];
    
    for (let i = 0; i < slotCount; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * 1.6;
      const z = Math.sin(angle) * 1.6;
      
      // 슬롯 마커
      const markerGeometry = new THREE.CircleGeometry(0.15, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, 1.5, z);
      marker.lookAt(0, 1.5, 0);
      this.scene.add(marker);
      
      this.slots.push({
        x, z,
        angle,
        participant: participants[i % participants.length],
        hasSword: false
      });
    }
  }

  start() {
    if (this.state.isRunning) return;
    
    this.state.setRunning(true);
    this.currentSlot = 0;
    this.swords.forEach(s => this.scene.remove(s));
    this.swords = [];
    
    // 랜덤 당첨 슬롯 결정
    this.winningSlot = Math.floor(Math.random() * this.slots.length);
    
    this.pirate.visible = false;
    this.pirate.position.y = 2;
    
    // 슬롯 리셋
    this.slots.forEach((slot, i) => {
      slot.hasSword = false;
    });
    
    // 안내 메시지
    this.showInstructions();
  }

  insertSword() {
    if (!this.state.isRunning) return;
    
    const slot = this.slots[this.currentSlot];
    if (slot.hasSword) return;
    
    // 칼 생성
    const swordGroup = new THREE.Group();
    
    // 칼날
    const bladeGeometry = new THREE.BoxGeometry(0.05, 1.2, 0.2);
    const bladeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xC0C0C0,
      metalness: 0.8,
      roughness: 0.2
    });
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.y = 0.6;
    swordGroup.add(blade);
    
    // 손잡이
    const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    swordGroup.add(handle);
    
    // 위치 설정 (통 바깥에서 시작)
    swordGroup.position.set(slot.x * 2, 1.5, slot.z * 2);
    swordGroup.lookAt(0, 1.5, 0);
    
    this.scene.add(swordGroup);
    this.swords.push(swordGroup);
    
    // 꽂히는 애니메이션
    gsap.to(swordGroup.position, {
      x: slot.x,
      z: slot.z,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        this.sound.play('sword');
        slot.hasSword = true;
        
        // 당첨 확인
        if (this.currentSlot === this.winningSlot) {
          this.triggerWin(slot.participant);
        } else {
          this.currentSlot++;
          if (this.currentSlot >= this.slots.length) {
            // 모든 슬롯을 다 꽂았는데 당첨이 안 됐으면 강제 당첨
            this.triggerWin(this.slots[this.winningSlot].participant);
          }
        }
      }
    });
  }

  triggerWin(winner) {
    // 해적 튀어오름
    this.pirate.visible = true;
    
    gsap.to(this.pirate.position, {
      y: 4.5,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(this.pirate.position, {
          y: 3,
          duration: 0.3,
          ease: 'bounce.out'
        });
      }
    });
    
    // 카메라 흔들림
    this.shakeCamera();
    
    // 완료 처리
    setTimeout(() => {
      this.onComplete([winner]);
    }, 1000);
  }

  shakeCamera() {
    const originalPos = { ...this.camera.position };
    
    gsap.to(this.camera.position, {
      x: originalPos.x + 0.2,
      duration: 0.05,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.camera.position.copy(new THREE.Vector3(originalPos.x, originalPos.y, originalPos.z));
      }
    });
  }

  showInstructions() {
    // UI 연동
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  reset() {
    this.swords.forEach(s => this.scene.remove(s));
    this.swords = [];
    this.currentSlot = 0;
    this.pirate.visible = false;
    this.pirate.position.y = 2;
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    super.destroy();
  }
}
```

---

## 4. 유틸리티 모듈 명세

### 4.1 parser.js - 입력 파싱

```javascript
/**
 * @file parser.js
 * @description 참가자 입력 파싱 유틸리티
 */

import { CONFIG } from '../config.js';

/**
 * 입력 문자열을 참가자 배열로 파싱
 * @param {string} input - 쉼표 또는 줄바꿈으로 구분된 입력
 * @returns {{ names: string[], errors: string[] }}
 */
export function parseParticipants(input) {
  const errors = [];
  
  if (!input || typeof input !== 'string') {
    return { names: [], errors: ['입력이 비어있습니다.'] };
  }
  
  // 파싱
  let names = input
    .split(/[,\n]+/)
    .map(name => name.trim())
    .filter(name => name.length > 0);
  
  // 최대 인원 체크
  if (names.length > CONFIG.MAX_PARTICIPANTS) {
    errors.push(`최대 ${CONFIG.MAX_PARTICIPANTS}명까지 가능합니다.`);
    names = names.slice(0, CONFIG.MAX_PARTICIPANTS);
  }
  
  // 이름 길이 체크 & 자르기
  names = names.map(name => {
    if (name.length > CONFIG.MAX_NAME_LENGTH) {
      errors.push(`"${name}"이(가) 너무 깁니다. ${CONFIG.MAX_NAME_LENGTH}자로 자릅니다.`);
      return name.slice(0, CONFIG.MAX_NAME_LENGTH);
    }
    return name;
  });
  
  // 중복 처리
  names = handleDuplicates(names);
  
  return { names, errors };
}

/**
 * 중복 이름에 번호 부여
 * @param {string[]} names
 * @returns {string[]}
 */
function handleDuplicates(names) {
  const counts = {};
  
  return names.map(name => {
    if (counts[name] === undefined) {
      counts[name] = 0;
    }
    counts[name]++;
    
    if (counts[name] > 1) {
      return `${name}#${counts[name]}`;
    }
    return name;
  });
}

/**
 * 입력 유효성 검사
 * @param {string[]} names
 * @returns {{ valid: boolean, message: string }}
 */
export function validateParticipants(names, minRequired = 2) {
  if (names.length === 0) {
    return { valid: false, message: '참가자를 입력해주세요.' };
  }
  
  if (names.length < minRequired) {
    return { valid: false, message: `최소 ${minRequired}명 이상 필요합니다.` };
  }
  
  return { valid: true, message: '' };
}
```

### 4.2 sound.js - 사운드 관리

```javascript
/**
 * @file sound.js
 * @description Howler.js 기반 사운드 관리
 */

import { CONFIG } from '../config.js';

export class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.7;
    
    this.preload();
  }

  preload() {
    Object.entries(CONFIG.SOUNDS).forEach(([key, src]) => {
      this.sounds[key] = new Howl({
        src: [src],
        volume: this.volume,
        preload: true
      });
    });
  }

  play(soundName) {
    if (!this.enabled || !this.sounds[soundName]) return;
    
    this.sounds[soundName].play();
  }

  stop(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].stop();
    }
  }

  stopAll() {
    Object.values(this.sounds).forEach(sound => sound.stop());
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume(this.volume);
    });
  }
}
```

### 4.3 performance.js - 성능 감지

```javascript
/**
 * @file performance.js
 * @description 기기 성능 감지 및 최적화 레벨 결정
 */

export class PerformanceDetector {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
  }

  /**
   * 기기 성능 레벨 감지
   * @returns {'high' | 'medium' | 'low'}
   */
  detect() {
    const indicators = {
      // 하드웨어 동시성 (CPU 코어 수)
      cores: navigator.hardwareConcurrency || 2,
      
      // 메모리 (지원하는 경우)
      memory: navigator.deviceMemory || 4,
      
      // 모바일 여부
      isMobile: /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      
      // WebGL 지원
      webglSupport: this.checkWebGL(),
      
      // 연결 속도 (지원하는 경우)
      connection: navigator.connection?.effectiveType || '4g'
    };
    
    // 점수 계산
    let score = 0;
    
    score += indicators.cores >= 4 ? 30 : indicators.cores >= 2 ? 15 : 0;
    score += indicators.memory >= 4 ? 30 : indicators.memory >= 2 ? 15 : 0;
    score += indicators.isMobile ? 0 : 20;
    score += indicators.webglSupport === 2 ? 20 : indicators.webglSupport === 1 ? 10 : 0;
    
    // 레벨 결정
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }

  /**
   * WebGL 지원 레벨 확인
   * @returns {0 | 1 | 2} 0: 미지원, 1: WebGL 1, 2: WebGL 2
   */
  checkWebGL() {
    const canvas = document.createElement('canvas');
    
    if (canvas.getContext('webgl2')) return 2;
    if (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) return 1;
    return 0;
  }

  /**
   * 실시간 FPS 측정 시작
   * @param {function} callback - FPS 업데이트 콜백
   */
  startFPSMonitor(callback) {
    const measure = () => {
      this.frameCount++;
      const now = performance.now();
      
      if (now - this.lastTime >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastTime = now;
        
        if (callback) callback(this.fps);
      }
      
      requestAnimationFrame(measure);
    };
    
    measure();
  }
}
```

### 4.4 confetti.js - 폭죽 효과

```javascript
/**
 * @file confetti.js
 * @description canvas-confetti 래퍼
 */

import { CONFIG } from '../config.js';

/**
 * 당첨자 발표 폭죽 효과 (양쪽에서 발사)
 */
export function launchConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: CONFIG.CONFETTI_COLORS
    });
    
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: CONFIG.CONFETTI_COLORS
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

/**
 * 중앙 집중 폭죽 (버스트)
 */
export function burstConfetti() {
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
    colors: CONFIG.CONFETTI_COLORS,
    gravity: 0.8,
    scalar: 1.2,
    ticks: 200
  });
}

/**
 * 성능에 따른 파티클 수 조절
 * @param {string} performanceLevel
 * @returns {number}
 */
export function getParticleCount(performanceLevel) {
  return CONFIG.PERFORMANCE[performanceLevel].particleCount;
}
```

---

## 5. UI 모듈 명세

### 5.1 controls.js - UI 컨트롤러

```javascript
/**
 * @file controls.js
 * @description 메인 UI 컨트롤러
 */

export class UIController {
  constructor(state, app) {
    this.state = state;
    this.app = app;
    
    // DOM 요소
    this.elements = {
      participantInput: document.getElementById('participant-input'),
      participantCount: document.getElementById('participant-count'),
      winnerCountSelect: document.getElementById('winner-count'),
      speedSelect: document.getElementById('speed-select'),
      themeSelect: document.getElementById('theme-select'),
      soundToggle: document.getElementById('sound-toggle'),
      startButton: document.getElementById('start-button'),
      modeButtons: document.querySelectorAll('.mode-button')
    };
    
    this.init();
  }

  init() {
    // 입력 이벤트
    this.elements.participantInput?.addEventListener('input', 
      this.debounce((e) => this.handleInput(e), 300)
    );
    
    // 시작 버튼
    this.elements.startButton?.addEventListener('click', 
      () => this.app.startDraw()
    );
    
    // 모드 버튼
    this.elements.modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        this.app.loadMode(mode);
        this.setActiveMode(mode);
      });
    });
    
    // 설정 변경
    this.elements.winnerCountSelect?.addEventListener('change', (e) => {
      this.state.setSetting('winnerCount', parseInt(e.target.value));
    });
    
    this.elements.speedSelect?.addEventListener('change', (e) => {
      this.state.setSetting('animationSpeed', e.target.value);
    });
    
    this.elements.soundToggle?.addEventListener('change', (e) => {
      this.state.setSetting('soundEnabled', e.target.checked);
    });
    
    // 상태 구독
    this.state.subscribe((key, value) => this.handleStateChange(key, value));
  }

  handleInput(e) {
    const { names, errors } = parseParticipants(e.target.value);
    
    this.state.setParticipants(names);
    this.updateParticipantCount(names.length);
    
    if (errors.length > 0) {
      this.showToast(errors[0], 'warning');
    }
  }

  updateParticipantCount(count) {
    if (this.elements.participantCount) {
      this.elements.participantCount.textContent = `${count}명`;
    }
  }

  setActiveMode(mode) {
    this.elements.modeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  handleStateChange(key, value) {
    if (key === 'isRunning') {
      this.elements.startButton.disabled = value;
      this.elements.startButton.textContent = value ? '추첨 중...' : '추첨 시작';
    }
  }

  showToast(message, type = 'info') {
    // 토스트 구현
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  reset() {
    if (this.elements.participantInput) {
      this.elements.participantInput.value = '';
    }
    this.updateParticipantCount(0);
  }
}
```

### 5.2 results.js - 결과 화면

```javascript
/**
 * @file results.js
 * @description 당첨 결과 화면 관리
 */

export class ResultsManager {
  constructor(state) {
    this.state = state;
    this.modal = null;
    
    this.init();
  }

  init() {
    // 결과 이벤트 리스너
    document.addEventListener('drawComplete', (e) => {
      this.showResults(e.detail.winners);
    });
  }

  showResults(winners) {
    this.modal = document.createElement('div');
    this.modal.className = 'results-modal';
    this.modal.innerHTML = `
      <div class="results-content">
        <h2>🎉 당첨자 발표!</h2>
        <div class="winners-list">
          ${winners.map((name, i) => `
            <div class="winner-item">
              <span class="winner-rank">${this.getRankEmoji(i)}</span>
              <span class="winner-name">${name}</span>
            </div>
          `).join('')}
        </div>
        <div class="results-actions">
          <button id="copy-results" class="btn-secondary">
            📋 복사
          </button>
          <button id="save-image" class="btn-secondary">
            📷 이미지 저장
          </button>
          <button id="retry-draw" class="btn-primary">
            🔄 다시 추첨
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.modal);
    
    // 버튼 이벤트
    document.getElementById('copy-results').addEventListener('click', () => {
      this.copyResults(winners);
    });
    
    document.getElementById('save-image').addEventListener('click', () => {
      this.saveAsImage();
    });
    
    document.getElementById('retry-draw').addEventListener('click', () => {
      this.close();
    });
  }

  getRankEmoji(index) {
    const emojis = ['🥇', '🥈', '🥉'];
    return emojis[index] || `${index + 1}등`;
  }

  async copyResults(winners) {
    const text = winners.map((name, i) => `${i + 1}등: ${name}`).join('\n');
    
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('클립보드에 복사되었습니다!');
    } catch (err) {
      this.showToast('복사에 실패했습니다.', 'error');
    }
  }

  async saveAsImage() {
    const content = this.modal.querySelector('.results-content');
    
    try {
      const canvas = await html2canvas(content);
      const link = document.createElement('a');
      link.download = `roulette-result-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      this.showToast('이미지가 저장되었습니다!');
    } catch (err) {
      this.showToast('이미지 저장에 실패했습니다.', 'error');
    }
  }

  close() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
  }

  showToast(message, type = 'success') {
    // 토스트 구현 (UIController와 공유 가능)
  }
}
```

---

## 6. 데이터 구조 및 인터페이스

### 6.1 TypeScript 타입 정의 (참고용)

```typescript
// types.ts

// 참가자
interface Participant {
  name: string;
  originalIndex: number;
}

// 설정
interface Settings {
  winnerCount: number;          // 1-10
  animationSpeed: 'slow' | 'normal' | 'fast';
  soundEnabled: boolean;
  theme: 'space' | 'neon' | 'minimal' | 'retro' | 'nature';
  darkMode: boolean;
}

// 앱 상태
interface AppState {
  participants: Participant[];
  settings: Settings;
  currentMode: 'marble' | 'wheel' | 'balloon' | 'pirate';
  isRunning: boolean;
  winners: string[];
  performanceLevel: 'high' | 'medium' | 'low';
}

// 모드 인터페이스
interface RouletteMode {
  init(): void;
  start(): void;
  reset(): void;
  resize(): void;
  destroy(): void;
}

// 이벤트
interface DrawCompleteEvent {
  winners: string[];
  mode: string;
  duration: number;
}
```

### 6.2 로컬 스토리지 스키마

```javascript
// localStorage 키: 'roulette_settings'
{
  "winnerCount": 1,
  "animationSpeed": "normal",
  "soundEnabled": true,
  "theme": "space",
  "darkMode": true
}

// localStorage 키: 'roulette_theme'
"dark" | "light"
```

---

## 7. API 및 외부 연동

### 7.1 CDN 의존성 로드 순서

```html
<!-- index.html -->
<head>
  <!-- 폰트 -->
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@400;500;600&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body>
  <!-- 앱 컨텐츠 -->
  
  <!-- 라이브러리 (순서 중요) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
  <script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.0/dist/confetti.browser.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  
  <!-- 앱 스크립트 -->
  <script type="module" src="./js/main.js"></script>
</body>
```

### 7.2 브라우저 API 사용

| API | 용도 | 폴백 |
|-----|------|------|
| `Clipboard API` | 결과 복사 | `document.execCommand('copy')` |
| `Fullscreen API` | 전체화면 | 미지원 시 숨김 |
| `Web Audio API` | Howler.js 내부 | HTML5 Audio |
| `localStorage` | 설정 저장 | 메모리 저장 |
| `matchMedia` | 다크모드 감지 | 기본값 사용 |
| `ResizeObserver` | 반응형 처리 | `window.resize` |

---

## 8. 테스트 요구사항

### 8.1 단위 테스트

| 모듈 | 테스트 항목 | 도구 |
|------|-------------|------|
| `parser.js` | 파싱 정확성, 중복 처리, 제한 체크 | Jest |
| `shuffle.js` | 균등 분포, 원본 불변성 | Jest |
| `state.js` | 상태 변경, 옵저버 알림 | Jest |
| `performance.js` | 레벨 판정 정확성 | Jest |

### 8.2 통합 테스트

| 시나리오 | 설명 |
|----------|------|
| 전체 추첨 플로우 | 입력 → 모드 선택 → 추첨 → 결과 |
| 모드 전환 | 모드 간 전환 시 메모리 해제 확인 |
| 설정 저장/복원 | localStorage 연동 |
| 반응형 | 다양한 화면 크기 |

### 8.3 성능 테스트

| 지표 | 목표 | 도구 |
|------|------|------|
| FPS | 60fps (데스크톱) | Chrome DevTools |
| 메모리 | < 100MB | Chrome DevTools |
| 로드 시간 | < 3초 | Lighthouse |
| LCP | < 2.5초 | Lighthouse |

### 8.4 브라우저 테스트 매트릭스

| 브라우저 | 버전 | 데스크톱 | 모바일 |
|----------|------|----------|--------|
| Chrome | 90+ | ✅ | ✅ |
| Firefox | 88+ | ✅ | ✅ |
| Safari | 14+ | ✅ | ✅ |
| Edge | 90+ | ✅ | - |

---

## 9. 보안 고려사항

### 9.1 입력 검증

```javascript
// XSS 방지
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// 사용 예
const safeName = sanitizeInput(userInput);
```

### 9.2 CSP 헤더 권장

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 
    https://cdn.tailwindcss.com 
    https://cdnjs.cloudflare.com 
    https://unpkg.com 
    https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: blob:;
">
```

### 9.3 개인정보

- 참가자 이름은 **클라이언트에서만** 처리
- 서버 전송 없음
- localStorage 저장 시 설정값만 저장 (이름 X)

---

## 10. 개발 일정 (제안)

### 10.1 마일스톤

| 단계 | 기간 | 산출물 |
|------|------|--------|
| **Phase 1: 코어** | 1주 | main.js, state.js, parser.js, UI 기본 |
| **Phase 2: 모드 1-2** | 1주 | 휠 스피너, 마블 레이스 |
| **Phase 3: 모드 3-4** | 1주 | 풍선 터뜨리기, 해적 룰렛 |
| **Phase 4: 폴리싱** | 0.5주 | 테마, 사운드, 폭죽, 최적화 |
| **Phase 5: 테스트 & 배포** | 0.5주 | 테스트, 버그 수정, GitHub Pages 배포 |

### 10.2 개발 순서 권장

```
1일차: 프로젝트 셋업, 파일 구조, CDN 연동
2일차: state.js, parser.js, main.js 기본
3일차: UI 컨트롤러, 테마 시스템
4-5일차: 휠 스피너 모드 (Three.js)
6-7일차: 마블 레이스 모드 (Matter.js)
8-9일차: 풍선 터뜨리기 모드 (Canvas 2D)
10-11일차: 해적 룰렛 모드 (Three.js)
12일차: 폭죽 효과, 결과 화면, 사운드
13일차: 반응형, 성능 최적화
14일차: 테스트, 버그 수정
15일차: GitHub Pages 배포, 문서화
```

---

## 11. 참고 자료

### 11.1 라이브러리 문서

- [Three.js Docs](https://threejs.org/docs/)
- [Matter.js Docs](https://brm.io/matter-js/docs/)
- [GSAP Docs](https://greensock.com/docs/v3/GSAP)
- [Howler.js Docs](https://github.com/goldfire/howler.js#documentation)
- [canvas-confetti](https://github.com/catdad/canvas-confetti)
- [html2canvas](https://html2canvas.hertzen.com/)

### 11.2 디자인 패턴 참고

- Observer Pattern (상태 관리)
- Factory Pattern (모드 생성)
- Singleton Pattern (SoundManager)
- Strategy Pattern (모드별 알고리즘)

---

**문서 버전**: v1.0  
**작성일**: 2025-11-29  
**작성자**: SIREAL  
**관련 PRD**: roulette-prd.md v1.1

