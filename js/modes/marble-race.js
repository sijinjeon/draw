/**
 * @file marble-race.js
 * @description 마블 레이스 모드 (Matter.js 물리 엔진)
 */

import { BaseMode } from './BaseMode.js';
import { CONFIG } from '../config.js';

export default class MarbleRace extends BaseMode {
  constructor(state, sound) {
    super(state, sound);
    
    this.engine = null;
    this.render = null;
    this.runner = null;
    this.marbles = [];
    this.finishOrder = [];
    this.raceStarted = false;
    this.canvas = null;
  }

  init() {
    if (!this.setupContainer()) return;
    
    // Matter.js 로드 확인
    if (typeof Matter === 'undefined') {
      console.error('[MarbleRace] Matter.js가 로드되지 않았습니다.');
      this.showFallback('Matter.js 라이브러리를 로드할 수 없습니다.');
      return;
    }

    this.setupPhysics();
    this.createTrack();
    this.createStartingLine();
    
    this.isInitialized = true;
    console.log('[MarbleRace] 초기화 완료');
  }

  setupPhysics() {
    const { width, height } = this.getContainerSize();
    
    // Engine
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.8 }
    });
    
    // Render
    this.render = Matter.Render.create({
      element: this.container,
      engine: this.engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: '#0a0a1a',
        pixelRatio: Math.min(window.devicePixelRatio, 2)
      }
    });
    
    this.canvas = this.render.canvas;
    Matter.Render.run(this.render);
    
    // Runner
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
    
    // 충돌 이벤트
    Matter.Events.on(this.engine, 'collisionStart', (e) => {
      this.handleCollision(e);
    });
  }

  createTrack() {
    const { width, height } = this.getContainerSize();
    const wallOptions = {
      isStatic: true,
      render: {
        fillStyle: '#6366f1'
      }
    };
    
    const walls = [];
    
    // 외곽 벽
    walls.push(
      Matter.Bodies.rectangle(width / 2, -10, width, 20, wallOptions),
      Matter.Bodies.rectangle(width / 2, height + 10, width, 20, { ...wallOptions, label: 'finish' }),
      Matter.Bodies.rectangle(-10, height / 2, 20, height, wallOptions),
      Matter.Bodies.rectangle(width + 10, height / 2, 20, height, wallOptions)
    );
    
    // 장애물/경사로 생성
    const obstacles = this.createObstacles(width, height);
    
    Matter.Composite.add(this.engine.world, [...walls, ...obstacles]);
  }

  createObstacles(width, height) {
    const obstacles = [];
    const obstacleOptions = {
      isStatic: true,
      render: {
        fillStyle: '#3a3a5a'
      },
      friction: 0.3,
      restitution: 0.5
    };
    
    // 지그재그 경사로
    const rowCount = 6;
    const rowHeight = (height - 200) / rowCount;
    
    for (let i = 0; i < rowCount; i++) {
      const y = 150 + i * rowHeight;
      const isEven = i % 2 === 0;
      
      // 경사로
      const rampWidth = width * 0.6;
      const rampX = isEven ? rampWidth / 2 + 50 : width - rampWidth / 2 - 50;
      const angle = isEven ? 0.15 : -0.15;
      
      obstacles.push(
        Matter.Bodies.rectangle(rampX, y, rampWidth, 15, {
          ...obstacleOptions,
          angle: angle
        })
      );
      
      // 구멍/갭
      if (i > 0 && i < rowCount - 1) {
        const gapX = isEven ? width - 100 : 100;
        // 갭은 장애물이 아닌 빈 공간
      }
      
      // 범퍼
      if (i % 2 === 0 && i > 0) {
        const bumperCount = 3;
        for (let j = 0; j < bumperCount; j++) {
          const bx = (width / (bumperCount + 1)) * (j + 1);
          obstacles.push(
            Matter.Bodies.circle(bx, y + rowHeight / 2, 15, {
              ...obstacleOptions,
              restitution: 0.8,
              render: { fillStyle: '#8b5cf6' }
            })
          );
        }
      }
    }
    
    return obstacles;
  }

  createStartingLine() {
    // 기존 구슬 제거
    this.marbles.forEach(marble => {
      Matter.Composite.remove(this.engine.world, marble.body);
    });
    this.marbles = [];
    this.finishOrder = [];
    
    const participants = this.state.participants;
    if (participants.length === 0) return;
    
    const { width } = this.getContainerSize();
    const colors = CONFIG.MODE_COLORS.marble;
    const marbleRadius = Math.min(20, (width - 100) / participants.length / 2.5);
    
    // 시작 위치에 구슬 배치
    participants.forEach((name, i) => {
      const x = (width / (participants.length + 1)) * (i + 1);
      const y = 50;
      
      const body = Matter.Bodies.circle(x, y, marbleRadius, {
        restitution: 0.6,
        friction: 0.01,
        frictionAir: 0.001,
        render: {
          fillStyle: colors[i % colors.length]
        },
        label: `marble_${i}`
      });
      
      // 정적 상태로 시작
      Matter.Body.setStatic(body, true);
      
      this.marbles.push({
        body,
        name,
        index: i,
        finished: false
      });
      
      Matter.Composite.add(this.engine.world, body);
    });
  }

  start() {
    if (!this.isInitialized || this.raceStarted) return;
    if (this.state.participants.length < 2) return;
    
    this.state.setRunning(true);
    this.raceStarted = true;
    this.finishOrder = [];
    
    this.sound?.play('marble');
    
    // 구슬 해제 (위치에 따라 순차적으로)
    this.marbles.forEach((marble, i) => {
      setTimeout(() => {
        Matter.Body.setStatic(marble.body, false);
        // 약간의 랜덤 초기 속도
        Matter.Body.setVelocity(marble.body, {
          x: (Math.random() - 0.5) * 2,
          y: 1 + Math.random() * 0.5
        });
      }, i * 100);
    });
    
    // 완료 체크
    this.checkFinishInterval = setInterval(() => {
      this.checkFinish();
    }, 100);
  }

  handleCollision(event) {
    const pairs = event.pairs;
    
    pairs.forEach(pair => {
      // 충돌 사운드 (범퍼와)
      if (pair.bodyA.render?.fillStyle === '#8b5cf6' ||
          pair.bodyB.render?.fillStyle === '#8b5cf6') {
        this.sound?.play('pop');
      }
    });
  }

  checkFinish() {
    const { height } = this.getContainerSize();
    const finishLine = height - 30;
    
    this.marbles.forEach(marble => {
      if (!marble.finished && marble.body.position.y > finishLine) {
        marble.finished = true;
        this.finishOrder.push(marble.name);
        
        // 완료 체크
        if (this.finishOrder.length >= this.state.settings.winnerCount ||
            this.finishOrder.length === this.marbles.length) {
          this.endRace();
        }
      }
    });
    
    // 모든 구슬이 정지했는지 체크
    const allStopped = this.marbles.every(marble => {
      const speed = Matter.Body.getSpeed(marble.body);
      return marble.finished || speed < 0.1;
    });
    
    if (allStopped && this.raceStarted && this.finishOrder.length > 0) {
      this.endRace();
    }
  }

  endRace() {
    if (this.checkFinishInterval) {
      clearInterval(this.checkFinishInterval);
      this.checkFinishInterval = null;
    }
    
    if (!this.raceStarted) return;
    this.raceStarted = false;
    
    this.sound?.stop('marble');
    
    // 당첨자 결정
    const winners = this.finishOrder.slice(0, this.state.settings.winnerCount);
    
    setTimeout(() => {
      this.onComplete(winners);
    }, 500);
  }

  resize() {
    if (!this.render || !this.container) return;
    
    const { width, height } = this.getContainerSize();
    
    this.render.options.width = width;
    this.render.options.height = height;
    this.render.canvas.width = width;
    this.render.canvas.height = height;
    
    Matter.Render.setPixelRatio(this.render, Math.min(window.devicePixelRatio, 2));
  }

  reset() {
    if (this.checkFinishInterval) {
      clearInterval(this.checkFinishInterval);
      this.checkFinishInterval = null;
    }
    
    this.raceStarted = false;
    this.finishOrder = [];
    
    // 트랙 재생성
    if (this.engine) {
      Matter.Composite.clear(this.engine.world);
      this.createTrack();
      this.createStartingLine();
    }
  }

  destroy() {
    super.destroy();
    
    if (this.checkFinishInterval) {
      clearInterval(this.checkFinishInterval);
    }
    
    if (this.runner) {
      Matter.Runner.stop(this.runner);
    }
    
    if (this.render) {
      Matter.Render.stop(this.render);
      this.render.canvas?.remove();
    }
    
    if (this.engine) {
      Matter.Engine.clear(this.engine);
    }
    
    this.engine = null;
    this.render = null;
    this.runner = null;
    this.marbles = [];
  }

  showFallback(message) {
    if (this.container) {
      this.container.innerHTML = `
        <div class="canvas-placeholder">
          <div class="placeholder-content">
            <span class="placeholder-icon">⚠️</span>
            <p class="placeholder-text">${message}</p>
          </div>
        </div>
      `;
    }
  }
}

