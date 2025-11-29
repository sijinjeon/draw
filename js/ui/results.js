/**
 * @file results.js
 * @description 결과 모달 관리
 */

import { copyWinners } from '../utils/clipboard.js';
import { Toast } from './toast.js';

const RANK_EMOJIS = ['🥇', '🥈', '🥉'];

export class ResultsManager {
  constructor(state) {
    this.state = state;
    this.modal = document.getElementById('results-modal');
    this.isOpen = false;

    this.init();
  }

  init() {
    // 추첨 완료 이벤트 리스너
    document.addEventListener('drawComplete', (e) => {
      this.show(e.detail.winners);
    });

    // ESC로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * 결과 모달 표시
   * @param {string[]} winners
   */
  show(winners) {
    if (!this.modal) return;

    this.modal.innerHTML = this.createModalContent(winners);
    this.modal.removeAttribute('hidden');
    this.isOpen = true;

    // 버튼 이벤트 바인딩
    this.bindModalEvents(winners);

    // 포커스 트랩
    this.modal.querySelector('.btn-primary')?.focus();
  }

  /**
   * 모달 컨텐츠 생성
   */
  createModalContent(winners) {
    const winnerItems = winners.map((name, i) => `
      <div class="winner-item stagger-item">
        <span class="winner-rank">${this.getRankEmoji(i)}</span>
        <span class="winner-name">${this.escapeHtml(name)}</span>
      </div>
    `).join('');

    return `
      <div class="modal-content">
        <h2 class="modal-title">🎉 당첨자 발표!</h2>
        <div class="winners-list">
          ${winnerItems}
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" id="copy-results">
            📋 복사
          </button>
          <button class="btn-secondary" id="save-image">
            📷 이미지 저장
          </button>
          <button class="btn-primary" id="close-results">
            🔄 다시 추첨
          </button>
        </div>
      </div>
    `;
  }

  /**
   * 순위 이모지 반환
   */
  getRankEmoji(index) {
    return RANK_EMOJIS[index] || `${index + 1}등`;
  }

  /**
   * 모달 이벤트 바인딩
   */
  bindModalEvents(winners) {
    // 복사 버튼
    document.getElementById('copy-results')?.addEventListener('click', async () => {
      const success = await copyWinners(winners);
      if (success) {
        Toast.success('클립보드에 복사되었습니다!');
      } else {
        Toast.error('복사에 실패했습니다.');
      }
    });

    // 이미지 저장 버튼
    document.getElementById('save-image')?.addEventListener('click', () => {
      this.saveAsImage();
    });

    // 닫기/다시 추첨 버튼
    document.getElementById('close-results')?.addEventListener('click', () => {
      this.close();
    });

    // 배경 클릭으로 닫기
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  /**
   * 이미지로 저장
   */
  async saveAsImage() {
    if (typeof html2canvas === 'undefined') {
      Toast.error('이미지 저장 기능을 사용할 수 없습니다.');
      return;
    }

    const content = this.modal?.querySelector('.modal-content');
    if (!content) return;

    try {
      const canvas = await html2canvas(content, {
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-secondary').trim() || '#1a1a3a',
        scale: 2
      });

      const link = document.createElement('a');
      link.download = `roulette-result-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      Toast.success('이미지가 저장되었습니다!');
    } catch (err) {
      console.error('[Results] 이미지 저장 실패:', err);
      Toast.error('이미지 저장에 실패했습니다.');
    }
  }

  /**
   * 모달 닫기
   */
  close() {
    if (!this.modal) return;

    this.modal.setAttribute('hidden', '');
    this.isOpen = false;

    // 앱 상태 리셋
    this.state.reset();
  }

  /**
   * HTML 이스케이프
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

