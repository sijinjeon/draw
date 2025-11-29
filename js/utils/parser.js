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
    return { names: [], errors: [] };
  }

  // 파싱: 쉼표 또는 줄바꿈으로 분리
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
  const result = [];

  for (const name of names) {
    if (counts[name] === undefined) {
      counts[name] = 1;
      result.push(name);
    } else {
      counts[name]++;
      result.push(`${name}#${counts[name]}`);
    }
  }

  return result;
}

/**
 * 입력 유효성 검사
 * @param {string[]} names
 * @param {number} minRequired
 * @returns {{ valid: boolean, message: string }}
 */
export function validateParticipants(names, minRequired = 2) {
  if (!Array.isArray(names) || names.length === 0) {
    return { valid: false, message: '참가자를 입력해주세요.' };
  }

  if (names.length < minRequired) {
    return { valid: false, message: `최소 ${minRequired}명 이상 필요합니다.` };
  }

  return { valid: true, message: '' };
}

/**
 * 중복 이름 확인
 * @param {string} name
 * @returns {boolean}
 */
export function isDuplicate(name) {
  return name.includes('#');
}

