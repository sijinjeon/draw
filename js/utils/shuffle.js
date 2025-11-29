/**
 * @file shuffle.js
 * @description Fisher-Yates 셔플 알고리즘
 */

/**
 * Fisher-Yates 셔플 (Knuth Shuffle)
 * 모든 순열이 동일한 확률로 발생 보장
 * @param {any[]} array - 원본 배열 (변경되지 않음)
 * @returns {any[]} - 셔플된 새 배열
 */
export function shuffle(array) {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * 배열에서 랜덤하게 N개 선택
 * @param {any[]} array - 원본 배열
 * @param {number} count - 선택할 개수
 * @returns {any[]} - 선택된 요소들
 */
export function pickRandom(array, count) {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * 0~max 사이의 랜덤 정수 반환
 * @param {number} max - 최대값 (미포함)
 * @returns {number}
 */
export function randomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * min~max 사이의 랜덤 정수 반환
 * @param {number} min - 최소값 (포함)
 * @param {number} max - 최대값 (포함)
 * @returns {number}
 */
export function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

