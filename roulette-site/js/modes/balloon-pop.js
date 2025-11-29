/**
 * @file balloon-pop.js
 * @description 풍선 터뜨리기 모드 (2D Canvas)
 */

import { BaseMode } from './BaseMode.js';
import { CONFIG } from '../config.js';
import { shuffle } from '../utils/shuffle.js';

export default class BalloonPop extends BaseMode {
  constructor(state, sound) {
    super(state, sound);
    
    this.canvas = null;
    this.ctx = null;
    this.balloons = [];
    this.dart = null;
    this.popOrder = [];
    this.isPoppping = false;
    this.popIndex = 0;
  }

  init() {
    if (!this.setupContainer()) return;
    
    this.createCanvas();
    this.createBalloons();
    this.animate();
    
    this.isInitialized = true;
    console.log('[BalloonPop] 초기화 완료');
  }

  createCanvas() {
    const { width, height } = this.getContainerSize();
    
    this.container.innerHTML = '';
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.display = 'block';
    
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  createBalloons() {
    this.balloons = [];
    const participants = this.state.participants;
    if (participants.length === 0) return;
    
    const { width, height } = this.getContainerSize();
    const colors = CONFIG.MODE_COLORS.balloon;
    
    // 그리드 레이아웃 계산
    const cols = Math.ceil(Math.sqrt(participants.length));
    const rows = Math.ceil(participants.length / cols);
    const cellWidth = width / (cols + 1);
    const cellHeight = (height - 100) / (rows + 1);
    const balloonWidth = Math.min(cellWidth * 0.6, 80);
    const balloonHeight = balloonWidth * 1.3;
    
    participants.forEach((name, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      const x = cellWidth * (col + 1);
      const y = cellHeight * (row + 1) + 50;
      
      this.balloons.push({
        name,
        index: i,
        x,
        y,
        width: balloonWidth,
        height: balloonHeight,
        color: colors[i % colors.length],
        popped: false,
        popAnimation: 0,
        // 흔들림 애니메이션
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 0.5
      });
    });
    
    // 다트 초기화
    this.dart = {
      x: -50,
      y: height / 2,
      targetX: 0,
      targetY: 0,
      active: false,
      speed: 15
    };
  }

  start() {
    if (!this.isInitialized || this.isPoppping) return;
    if (this.state.participants.length < 1) return;
    
    this.state.setRunning(true);
    this.isPoppping = true;
    this.popOrder = [];
    this.popIndex = 0;
    
    // 터뜨릴 순서 랜덤 결정
    const indices = this.balloons.map((_, i) => i);
    const shuffled = shuffle(indices);
    
    // 당첨자 수만큼 선택 (나머지는 먼저 터뜨림)
    const winnerCount = this.state.settings.winnerCount;
    const losers = shuffled.slice(0, Math.max(0, this.balloons.length - winnerCount));
    const winners = shuffled.slice(Math.max(0, this.balloons.length - winnerCount));
    
    // 순서: 탈락자들 먼저 → 당첨자들은 남음
    this.popSequence = losers;
    this.winnerIndices = winners;
    
    this.popNext();
  }

  popNext() {
    if (this.popIndex >= this.popSequence.length) {
      // 모든 탈락자 제거 완료 → 당첨자 발표
      this.finishRace();
      return;
    }
    
    const targetIndex = this.popSequence[this.popIndex];
    const target = this.balloons[targetIndex];
    
    // 다트 발사
    const { width, height } = this.getContainerSize();
    this.dart.x = -50;
    this.dart.y = height / 2 + (Math.random() - 0.5) * 200;
    this.dart.targetX = target.x;
    this.dart.targetY = target.y;
    this.dart.active = true;
    
    this.sound?.play('click');
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const { width, height } = this.getContainerSize();
    this.ctx.clearRect(0, 0, width, height);
    
    // 배경 그라데이션
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(1, '#1a1a3a');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    
    // 풍선 그리기
    this.balloons.forEach(balloon => {
      if (!balloon.popped) {
        this.drawBalloon(balloon);
      } else if (balloon.popAnimation < 1) {
        this.drawPopEffect(balloon);
        balloon.popAnimation += 0.05;
      }
    });
    
    // 다트 업데이트 및 그리기
    if (this.dart.active) {
      this.updateDart();
      this.drawDart();
    }
  }

  drawBalloon(balloon) {
    const { ctx } = this;
    const time = performance.now() * 0.001;
    
    // 흔들림 효과
    const wobble = Math.sin(time * balloon.wobbleSpeed + balloon.wobbleOffset) * 3;
    const x = balloon.x + wobble;
    const y = balloon.y;
    
    ctx.save();
    
    // 풍선 본체 (타원)
    ctx.beginPath();
    ctx.ellipse(x, y, balloon.width / 2, balloon.height / 2, 0, 0, Math.PI * 2);
    
    // 그라데이션
    const grad = ctx.createRadialGradient(
      x - balloon.width * 0.2, y - balloon.height * 0.2, 0,
      x, y, balloon.width / 2
    );
    grad.addColorStop(0, this.lightenColor(balloon.color, 40));
    grad.addColorStop(0.5, balloon.color);
    grad.addColorStop(1, this.darkenColor(balloon.color, 30));
    
    ctx.fillStyle = grad;
    ctx.fill();
    
    // 하이라이트
    ctx.beginPath();
    ctx.ellipse(
      x - balloon.width * 0.15,
      y - balloon.height * 0.2,
      balloon.width * 0.15,
      balloon.height * 0.1,
      -0.3, 0, Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
    
    // 매듭
    ctx.beginPath();
    ctx.moveTo(x - 5, y + balloon.height / 2);
    ctx.lineTo(x, y + balloon.height / 2 + 10);
    ctx.lineTo(x + 5, y + balloon.height / 2);
    ctx.fillStyle = this.darkenColor(balloon.color, 30);
    ctx.fill();
    
    // 끈
    ctx.beginPath();
    ctx.moveTo(x, y + balloon.height / 2 + 10);
    ctx.quadraticCurveTo(x + wobble * 2, y + balloon.height / 2 + 40, x, y + balloon.height / 2 + 60);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 이름 라벨
    ctx.font = `bold ${Math.max(12, balloon.width * 0.2)}px 'Noto Sans KR', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(balloon.name, x, y, balloon.width * 0.8);
    
    ctx.restore();
  }

  drawPopEffect(balloon) {
    const { ctx } = this;
    const progress = balloon.popAnimation;
    
    // 파편
    const pieces = 8;
    for (let i = 0; i < pieces; i++) {
      const angle = (i / pieces) * Math.PI * 2;
      const dist = progress * 60;
      const px = balloon.x + Math.cos(angle) * dist;
      const py = balloon.y + Math.sin(angle) * dist + progress * 30;
      const size = (1 - progress) * 10;
      
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = balloon.color;
      ctx.globalAlpha = 1 - progress;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  drawDart() {
    const { ctx, dart } = this;
    
    ctx.save();
    
    const angle = Math.atan2(dart.targetY - dart.y, dart.targetX - dart.x);
    ctx.translate(dart.x, dart.y);
    ctx.rotate(angle);
    
    // 다트 몸체
    ctx.beginPath();
    ctx.moveTo(25, 0);
    ctx.lineTo(-10, -6);
    ctx.lineTo(-10, 6);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    
    // 다트 꼬리
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-25, -8);
    ctx.lineTo(-20, 0);
    ctx.lineTo(-25, 8);
    ctx.closePath();
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    
    ctx.restore();
  }

  updateDart() {
    if (!this.dart.active) return;
    
    const dx = this.dart.targetX - this.dart.x;
    const dy = this.dart.targetY - this.dart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < this.dart.speed) {
      // 타격
      this.dart.active = false;
      this.popBalloon(this.popSequence[this.popIndex]);
      this.popIndex++;
      
      // 다음 다트
      setTimeout(() => {
        this.popNext();
      }, 500);
    } else {
      // 이동
      this.dart.x += (dx / dist) * this.dart.speed;
      this.dart.y += (dy / dist) * this.dart.speed;
    }
  }

  popBalloon(index) {
    const balloon = this.balloons[index];
    if (balloon && !balloon.popped) {
      balloon.popped = true;
      balloon.popAnimation = 0;
      this.sound?.play('pop');
    }
  }

  finishRace() {
    this.isPoppping = false;
    
    // 당첨자 = 남은 풍선의 이름
    const winners = this.winnerIndices.map(i => this.balloons[i].name);
    
    setTimeout(() => {
      this.onComplete(winners);
    }, 500);
  }

  resize() {
    if (!this.canvas || !this.container) return;
    
    const { width, height } = this.getContainerSize();
    this.canvas.width = width;
    this.canvas.height = height;
    
    // 풍선 위치 재계산
    this.createBalloons();
  }

  reset() {
    this.isPoppping = false;
    this.popOrder = [];
    this.popIndex = 0;
    this.createBalloons();
  }

  destroy() {
    super.destroy();
    
    this.canvas = null;
    this.ctx = null;
    this.balloons = [];
  }

  // 색상 유틸리티
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }
}

