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
      isMobile: /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),

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
    try {
      const canvas = document.createElement('canvas');
      if (canvas.getContext('webgl2')) return 2;
      if (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) return 1;
      return 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * 실시간 FPS 측정 시작
   * @param {Function} callback - FPS 업데이트 콜백
   * @returns {Function} 측정 중지 함수
   */
  startFPSMonitor(callback) {
    let running = true;

    const measure = () => {
      if (!running) return;

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

    return () => {
      running = false;
    };
  }

  /**
   * 현재 FPS 반환
   */
  getFPS() {
    return this.fps;
  }
}

