/**
 * @file confetti.js
 * @description canvas-confetti 래퍼
 */

import { CONFIG } from '../config.js';

/**
 * 당첨자 발표 폭죽 효과 (양쪽에서 발사)
 */
export function launchConfetti() {
  if (typeof confetti === 'undefined') {
    console.warn('[Confetti] canvas-confetti 라이브러리가 로드되지 않았습니다.');
    return;
  }

  const duration = 3000;
  const end = Date.now() + duration;
  const colors = CONFIG.CONFETTI_COLORS;

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
  })();
}

/**
 * 중앙 집중 폭죽 (버스트)
 */
export function burstConfetti() {
  if (typeof confetti === 'undefined') {
    console.warn('[Confetti] canvas-confetti 라이브러리가 로드되지 않았습니다.');
    return;
  }

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
 * 성능 레벨에 따른 파티클 수 반환
 * @param {string} performanceLevel
 * @returns {number}
 */
export function getParticleCount(performanceLevel) {
  return CONFIG.PERFORMANCE[performanceLevel]?.particleCount || 150;
}

