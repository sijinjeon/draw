/**
 * @file wheel-spinner.js
 * @description 3D 휠 스피너 모드 (Three.js)
 */

import { BaseMode } from './BaseMode.js';
import { CONFIG } from '../config.js';
import { shuffle, randomRange } from '../utils/shuffle.js';

export default class WheelSpinner extends BaseMode {
  constructor(state, sound) {
    super(state, sound);
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.wheel = null;
    this.arrow = null;
    this.segments = [];
    
    this.targetAngle = 0;
    this.currentAngle = 0;
    this.spinning = false;
    this.spinStartTime = 0;
    this.spinDuration = 5000;
  }

  init() {
    if (!this.setupContainer()) return;
    
    // Three.js 로드 확인
    if (typeof THREE === 'undefined') {
      console.error('[WheelSpinner] Three.js가 로드되지 않았습니다.');
      this.showFallback('Three.js 라이브러리를 로드할 수 없습니다.');
      return;
    }

    this.setupScene();
    this.createWheel();
    this.createArrow();
    this.animate();
    
    this.isInitialized = true;
    console.log('[WheelSpinner] 초기화 완료');
  }

  setupScene() {
    const { width, height } = this.getContainerSize();
    
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 6);
    
    // Renderer
    const perfSettings = CONFIG.PERFORMANCE[this.state.performanceLevel];
    this.renderer = new THREE.WebGLRenderer({
      antialias: perfSettings.antialias,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 10);
    this.scene.add(directionalLight);
    
    // Point lights for glow
    const pointLight1 = new THREE.PointLight(0x6366f1, 1, 20);
    pointLight1.position.set(3, 3, 5);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xa855f7, 1, 20);
    pointLight2.position.set(-3, -3, 5);
    this.scene.add(pointLight2);
  }

  createWheel() {
    const participants = this.state.participants;
    const count = participants.length || 8;
    
    // 휠 그룹
    this.wheel = new THREE.Group();
    
    // 세그먼트 생성
    const radius = 2.5;
    const colors = CONFIG.MODE_COLORS.wheel;
    
    this.segments = [];
    
    for (let i = 0; i < count; i++) {
      const startAngle = (i / count) * Math.PI * 2;
      const endAngle = ((i + 1) / count) * Math.PI * 2;
      
      // 세그먼트 geometry
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.absarc(0, 0, radius, startAngle, endAngle, false);
      shape.lineTo(0, 0);
      
      const geometry = new THREE.ShapeGeometry(shape, 32);
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        side: THREE.DoubleSide,
        metalness: 0.3,
        roughness: 0.4
      });
      
      const segment = new THREE.Mesh(geometry, material);
      segment.name = participants[i] || `참가자 ${i + 1}`;
      this.segments.push({ mesh: segment, index: i, name: segment.name });
      this.wheel.add(segment);
    }
    
    // 중앙 원
    const centerGeometry = new THREE.CircleGeometry(0.3, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a3a,
      metalness: 0.5,
      roughness: 0.3
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.z = 0.02;
    this.wheel.add(center);
    
    // 외곽 링
    const ringGeometry = new THREE.RingGeometry(radius - 0.05, radius + 0.1, 64);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = 0.01;
    this.wheel.add(ring);
    
    this.scene.add(this.wheel);
  }

  createArrow() {
    // 화살표 (포인터)
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(-0.2, 0.4);
    shape.lineTo(0.2, 0.4);
    shape.lineTo(0, 0);
    
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0xffd700,
      emissiveIntensity: 0.3
    });
    
    this.arrow = new THREE.Mesh(geometry, material);
    this.arrow.position.set(0, 2.8, 0.1);
    this.arrow.rotation.z = Math.PI;
    
    this.scene.add(this.arrow);
  }

  start() {
    if (!this.isInitialized || this.spinning) return;
    
    const participants = this.state.participants;
    if (participants.length < 2) return;
    
    this.state.setRunning(true);
    this.spinning = true;
    this.sound?.play('spin');
    
    // 속도 설정
    this.spinDuration = CONFIG.ANIMATION_SPEED[this.state.settings.animationSpeed];
    
    // 당첨자 결정
    const winners = this.selectWinners(this.state.settings.winnerCount);
    const winnerIndex = participants.indexOf(winners[0]);
    
    // 목표 각도 계산 (휠이 회전하면서 당첨자가 화살표 위치에 오도록)
    const segmentAngle = (Math.PI * 2) / participants.length;
    const segmentCenter = winnerIndex * segmentAngle + segmentAngle / 2;
    
    // 여러 바퀴 회전 + 목표 위치
    const rotations = randomRange(5, 8) * Math.PI * 2;
    this.targetAngle = this.currentAngle + rotations + (Math.PI / 2 - segmentCenter);
    
    this.spinStartTime = performance.now();
    this.winners = winners;
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    if (this.spinning) {
      const elapsed = performance.now() - this.spinStartTime;
      const progress = Math.min(elapsed / this.spinDuration, 1);
      
      // easeOutQuart 이징
      const eased = 1 - Math.pow(1 - progress, 4);
      
      this.currentAngle = this.currentAngle + (this.targetAngle - this.currentAngle) * eased;
      
      if (progress >= 1) {
        this.spinning = false;
        this.currentAngle = this.targetAngle;
        this.sound?.stop('spin');
        
        // 완료 처리
        setTimeout(() => {
          this.onComplete(this.winners);
        }, 500);
      }
    }
    
    if (this.wheel) {
      this.wheel.rotation.z = this.currentAngle;
    }
    
    // 화살표 살짝 흔들기
    if (this.arrow && this.spinning) {
      this.arrow.rotation.z = Math.PI + Math.sin(performance.now() * 0.01) * 0.05;
    }
    
    this.renderer?.render(this.scene, this.camera);
  }

  resize() {
    if (!this.renderer || !this.camera || !this.container) return;
    
    const { width, height } = this.getContainerSize();
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  reset() {
    this.spinning = false;
    this.currentAngle = 0;
    this.targetAngle = 0;
    
    if (this.wheel) {
      this.wheel.rotation.z = 0;
    }
    
    // 세그먼트 재생성 (참가자 변경 시)
    if (this.scene && this.wheel) {
      this.scene.remove(this.wheel);
      this.createWheel();
    }
  }

  destroy() {
    super.destroy();
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.scene) {
      this.scene.clear();
    }
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.wheel = null;
    this.arrow = null;
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

