/**
 * @file clipboard.js
 * @description 클립보드 복사 유틸리티
 */

/**
 * 텍스트를 클립보드에 복사
 * @param {string} text - 복사할 텍스트
 * @returns {Promise<boolean>} 성공 여부
 */
export async function copyToClipboard(text) {
  // 모던 Clipboard API 시도
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('[Clipboard] Clipboard API 실패, 폴백 사용:', err);
    }
  }

  // 레거시 폴백
  return fallbackCopy(text);
}

/**
 * 레거시 복사 방식
 * @param {string} text
 * @returns {boolean}
 */
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  textarea.style.opacity = '0';
  textarea.setAttribute('readonly', '');

  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    console.error('[Clipboard] execCommand 실패:', err);
  }

  document.body.removeChild(textarea);
  return success;
}

/**
 * 당첨자 목록을 포맷팅하여 복사
 * @param {string[]} winners - 당첨자 이름 배열
 * @returns {Promise<boolean>}
 */
export async function copyWinners(winners) {
  const text = winners
    .map((name, i) => `${i + 1}등: ${name}`)
    .join('\n');

  return copyToClipboard(text);
}

