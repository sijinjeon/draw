/**
 * @file pirate-roulette.js
 * @description 해적 룰렛 모드 (Three.js)
 */

import { BaseMode } from './BaseMode.js';
import { CONFIG } from '../config.js';
import { shuffle } from '../utils/shuffle.js';

export default class PirateRoulette extends BaseMode {
  constructor(state, sound) {
    super(state, sound);
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.barrel = null;
    this.swords = [];
    this.pirate = null;
    
    this.currentSwordIndex = 0;
    this.isStabbing = false;
    this.winnerIndex = -1;
    this.stabSequence = [];
  }

  init() {
    if (!this.setupContainer()) return;
    
    if (typeof THREE === 'undefined') {
      console.error('[PirateRoulette] Three.js가 로드되지 않았습니다.');
      this.showFallback('Three.js 라이브러리를 로드할 수 없습니다.');
      return;
    }

    this.setupScene();
    this.createBarrel();
    this.createSlots();
    this.animate();
    
    this.isInitialized = true;
    console.log('[PirateRoulette] 초기화 완료');
  }

  setupScene() {
    const { width, height } = this.getContainerSize();
    
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 8);
    this.camera.lookAt(0, 0, 0);
    
    // Renderer
    const perfSettings = CONFIG.PERFORMANCE[this.state.performanceLevel];
    this.renderer = new THREE.WebGLRenderer({
      antialias: perfSettings.antialias,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = perfSettings.shadows;
    
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Point light (금색)
    const goldLight = new THREE.PointLight(0xffd700, 1, 15);
    goldLight.position.set(0, 3, 5);
    this.scene.add(goldLight);
  }

  createBarrel() {
    // 통 그룹
    this.barrel = new THREE.Group();
    
    // 통 본체 (원통)
    const barrelGeometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const barrelMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.8,
      metalness: 0.1
    });
    const barrelMesh = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrelMesh.castShadow = true;
    barrelMesh.receiveShadow = true;
    this.barrel.add(barrelMesh);
    
    // 통 띠 (링)
    const bandGeometry = new THREE.TorusGeometry(1.55, 0.08, 8, 32);
    const bandMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.3
    });
    
    [-1.2, 0, 1.2].forEach(y => {
      const band = new THREE.Mesh(bandGeometry, bandMaterial);
      band.rotation.x = Math.PI / 2;
      band.position.y = y;
      this.barrel.add(band);
    });
    
    // 해적 (통 위의 해적)
    this.createPirate();
    
    this.scene.add(this.barrel);
  }

  createPirate() {
    // 간단한 해적 (구+원뿔)
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    
    // 해적 모자
    const hatGeometry = new THREE.ConeGeometry(0.5, 0.4, 8);
    const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const hat = new THREE.Mesh(hatGeometry, hatMaterial);
    hat.position.y = 2.4;
    
    // 눈
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.12, 2.05, 0.35);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.12, 2.05, 0.35);
    
    // 안대
    const patchGeometry = new THREE.CircleGeometry(0.1, 8);
    const patchMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eyePatch = new THREE.Mesh(patchGeometry, patchMaterial);
    eyePatch.position.set(-0.12, 2.05, 0.36);
    
    this.pirate = new THREE.Group();
    this.pirate.add(head, hat, leftEye, rightEye, eyePatch);
    this.barrel.add(this.pirate);
  }

  createSlots() {
    this.swords = [];
    const participants = this.state.participants;
    if (participants.length === 0) return;
    
    // 슬롯 수 결정 (참가자 수에 맞춤)
    const slotCount = participants.length;
    const radius = 1.8;
    
    for (let i = 0; i < slotCount; i++) {
      const angle = (i / slotCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 2;
      
      // 슬롯 (구멍)
      const slotGeometry = new THREE.CircleGeometry(0.15, 16);
      const slotMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const slot = new THREE.Mesh(slotGeometry, slotMaterial);
      slot.position.set(x * 0.83, y, z * 0.83);
      slot.lookAt(0, y, 0);
      this.barrel.add(slot);
      
      // 검 생성 (처음엔 숨김)
      const sword = this.createSword();
      sword.position.set(x, y, z);
      sword.lookAt(0, y, 0);
      sword.visible = false;
      sword.userData = {
        name: participants[i],
        index: i,
        inserted: false,
        angle: angle
      };
      
      this.swords.push(sword);
      this.scene.add(sword);
    }
  }

  createSword() {
    const group = new THREE.Group();
    
    // 칼날
    const bladeGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.02);
    const bladeMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.9,
      roughness: 0.2
    });
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.x = 0.4;
    group.add(blade);
    
    // 손잡이
    const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a3728,
      roughness: 0.7
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.z = Math.PI / 2;
    handle.position.x = -0.15;
    group.add(handle);
    
    // 가드
    const guardGeometry = new THREE.BoxGeometry(0.02, 0.15, 0.1);
    const guardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.3
    });
    const guard = new THREE.Mesh(guardGeometry, guardMaterial);
    guard.position.x = 0;
    group.add(guard);
    
    return group;
  }

  start() {
    if (!this.isInitialized || this.isStabbing) return;
    if (this.state.participants.length < 2) return;
    
    this.state.setRunning(true);
    this.isStabbing = true;
    this.currentSwordIndex = 0;
    
    // 당첨자 결정 (마지막에 튀어나올 사람)
    const winnerCount = this.state.settings.winnerCount;
    const indices = this.swords.map((_, i) => i);
    const shuffled = shuffle(indices);
    
    // 당첨자 인덱스 (마지막 N개)
    this.winnerIndices = shuffled.slice(-winnerCount);
    this.stabSequence = shuffled;
    
    this.stabNext();
  }

  stabNext() {
    if (this.currentSwordIndex >= this.stabSequence.length) {
      this.finishGame();
      return;
    }
    
    const swordIndex = this.stabSequence[this.currentSwordIndex];
    const sword = this.swords[swordIndex];
    
    // 검 찌르기 애니메이션
    sword.visible = true;
    
    const startPos = sword.position.clone();
    const targetPos = startPos.clone().multiplyScalar(0.5);
    
    this.sound?.play('sword');
    
    this.animateSword(sword, startPos, targetPos, () => {
      sword.userData.inserted = true;
      
      // 당첨자인지 체크
      if (this.winnerIndices.includes(swordIndex)) {
        // 해적 튀어나옴!
        this.popPirate(sword.userData.name);
      } else {
        this.currentSwordIndex++;
        setTimeout(() => this.stabNext(), 400);
      }
    });
  }

  animateSword(sword, start, end, onComplete) {
    const duration = 300;
    const startTime = performance.now();
    
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutBack
      const eased = 1 + 2.70158 * Math.pow(progress - 1, 3) + 1.70158 * Math.pow(progress - 1, 2);
      
      sword.position.lerpVectors(start, end, eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    animate();
  }

  popPirate(winnerName) {
    // 해적 튀어나오는 애니메이션
    const startY = this.pirate.position.y;
    const jumpHeight = 2;
    const duration = 800;
    const startTime = performance.now();
    
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 점프 곡선
      const jumpProgress = Math.sin(progress * Math.PI);
      this.pirate.position.y = startY + jumpHeight * jumpProgress;
      this.pirate.rotation.y += 0.1;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 다음 당첨자 또는 종료
        this.currentSwordIndex++;
        
        if (this.winnerIndices.filter(i => this.stabSequence.indexOf(i) > this.currentSwordIndex - 1).length > 0) {
          setTimeout(() => this.stabNext(), 500);
        } else {
          this.finishGame();
        }
      }
    };
    
    animate();
  }

  finishGame() {
    this.isStabbing = false;
    
    // 당첨자 목록
    const winners = this.winnerIndices.map(i => this.swords[i].userData.name);
    
    setTimeout(() => {
      this.onComplete(winners);
    }, 500);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // 통 회전 (대기 중)
    if (!this.isStabbing && this.barrel) {
      this.barrel.rotation.y += 0.005;
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
    this.isStabbing = false;
    this.currentSwordIndex = 0;
    this.winnerIndices = [];
    this.stabSequence = [];
    
    // 검 초기화
    this.swords.forEach(sword => {
      this.scene.remove(sword);
    });
    this.swords = [];
    
    // 해적 위치 초기화
    if (this.pirate) {
      this.pirate.position.y = 0;
      this.pirate.rotation.y = 0;
    }
    
    // 슬롯 재생성
    if (this.scene) {
      this.createSlots();
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
    this.barrel = null;
    this.swords = [];
    this.pirate = null;
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

