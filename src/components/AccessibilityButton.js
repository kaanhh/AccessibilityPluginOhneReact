// src/components/AccessibilityButton.js
import { store } from '../core/store.js'

class AccessibilityButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    
    const icon = '/icons/accessibility-icon.png'
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }

        button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: #3498db;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        button:hover {
          transform: scale(1.1);
        }

        img {
          width: 100%;
          height: 100%;
        }

        @media (max-width: 768px) {
          button {
            width: 60px;
            height: 60px;
          }
        }
      </style>

      <button aria-label="Barrierefreiheitstool öffnen">
        <img src="${icon}" alt="Accessibility Icon">
      </button>
    `

    this.shadowRoot.querySelector('button').addEventListener('click', () => {
      store.togglePopup()
    })
  }
}

customElements.define('accessibility-button', AccessibilityButton)