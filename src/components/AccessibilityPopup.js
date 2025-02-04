// src/components/AccessibilityPopup.js
import { store } from '../core/store.js'

class AccessibilityPopup extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.unsubscribe = null

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 160px;
          right: 20px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          width: 300px;
          padding: 1rem;
          z-index: 1001;
          max-height: 70vh;
          overflow-y: auto;
          display: none;
        }

        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .reset-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border: 1px solid #000;
          border-radius: 20px;
          background: #f0f0f0;
          cursor: pointer;
        }

        button:hover {
          background: #e0e0e0;
        }
      </style>

      <div class="popup-content">
        <div class="header">
          <button class="reset-btn" aria-label="Zurücksetzen">
            <img src="/icons/reset-icon.png" alt="Reset" width="32" height="32">
          </button>
          <settings-button></settings-button>
        </div>
        
        <contrast-switch></contrast-switch>
      </div>
    `
  }

  connectedCallback() {
    this.unsubscribe = store.subscribe(state => {
      this.style.display = state.isOpen ? 'block' : 'none'
    })
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe()
  }
}

customElements.define('accessibility-popup', AccessibilityPopup)