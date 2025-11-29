/**
 * @file config.js
 * @description 전역 상수 및 설정값
 */

export const CONFIG = {
  // 제한값
  MAX_PARTICIPANTS: 100,
  MAX_NAME_LENGTH: 20,
  MAX_WINNERS: 10,
  MIN_PARTICIPANTS: 2,

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
      antialias: true,
      targetFPS: 60
    },
    medium: {
      particleCount: 150,
      shadows: true,
      antialias: true,
      targetFPS: 45
    },
    low: {
      particleCount: 100,
      shadows: false,
      antialias: false,
      targetFPS: 30
    }
  },

  // 폭죽 색상
  CONFETTI_COLORS: [
    '#FFD700', '#FF6B6B', '#4ECDC4',
    '#45B7D1', '#96CEB4', '#DDA0DD'
  ],

  // 사운드 파일
  SOUNDS: {
    spin: './assets/sounds/spin.mp3',
    pop: './assets/sounds/pop.mp3',
    fanfare: './assets/sounds/fanfare.mp3',
    click: './assets/sounds/click.mp3',
    marble: './assets/sounds/marble.mp3',
    sword: './assets/sounds/sword.mp3'
  },

  // 테마
  THEMES: ['space', 'neon', 'minimal', 'retro', 'nature'],

  // 모드 정보
  MODES: {
    wheel: {
      name: '3D 휠 스피너',
      icon: '🎡',
      minParticipants: 2,
      description: '3D 룰렛 휠이 회전합니다'
    },
    marble: {
      name: '마블 레이스',
      icon: '🎱',
      minParticipants: 2,
      description: '구슬이 트랙을 따라 경주합니다'
    },
    balloon: {
      name: '풍선 터뜨리기',
      icon: '🎈',
      minParticipants: 1,
      description: '다트로 풍선을 터뜨립니다'
    },
    pirate: {
      name: '해적 룰렛',
      icon: '🏴‍☠️',
      minParticipants: 2,
      description: '통에 칼을 꽂아 해적을 찾습니다'
    }
  },

  // 모드별 색상 팔레트
  MODE_COLORS: {
    marble: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#DDA0DD', '#FFD700', '#FF8C00', '#9370DB',
      '#20B2AA', '#FF69B4', '#87CEEB', '#98D8C8'
    ],
    wheel: [
      '#ef4444', '#f97316', '#eab308', '#22c55e',
      '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
      '#6366f1', '#06b6d4', '#84cc16', '#f43f5e'
    ],
    balloon: [
      '#FF6B6B', '#FFE66D', '#4ECDC4', '#95E1D3',
      '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA'
    ],
    pirate: ['#8B4513', '#CD853F', '#D2691E', '#A0522D']
  },

  // 로컬 스토리지 키
  STORAGE_KEYS: {
    settings: 'roulette_settings',
    theme: 'roulette_theme',
    themeStyle: 'roulette_theme_style'
  }
};

