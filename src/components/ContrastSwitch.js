// src/components/ContrastSwitch.js
import { store } from '../core/store.js';

class ContrastSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isSubmenuOpen = false;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1rem;
          font-family: sans-serif;
        }
        #contrast-button {
          width: 100%;
          padding: 0.5rem;
          background: var(--a11y-bg, #f0f0f0);
          border: 1px solid #000;
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.3s;
        }
        #arrow-container {
          display: inline-block;
          margin-right: 0.5rem;
          transition: transform 0.3s;
        }
        #submenu {
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 16px;
          margin-top: 0.5rem;
          padding: 0.5rem;
          transition: all 0.3s ease;
        }
        .submenu-item {
          margin-bottom: 0.5rem;
        }
        .color-options {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .color-picker {
          width: 2rem;
          height: 2rem;
          border-radius: 8px;
          cursor: pointer;
          display: inline-block;
        }
        .filter-btn {
          flex: 1;
          margin-right: 0.5rem;
          padding: 0.5rem;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: background 0.3s;
        }
        .filter-btn:last-child {
          margin-right: 0;
        }
        #contrast-button.contrast-active {
          background: #000;
          color: #fff;
        }
        .filter-btn.active {
          background: #ddd !important;
          border-color: #000 !important;
        }
        .color-picker[data-reset] {
          border: 2px solid #ccc;
        }
      </style>
      
      <div class="menu-item">
        <div id="blue-light-overlay" style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 200, 150, 0.2);
          pointer-events: none;
          z-index: 9999;
          display: none;
        "></div>
        
        <button id="contrast-button">
          <span>
            <span id="arrow-container">
              <img src="/icons/arrow.png" alt="Submenü öffnen/schließen" width="20" height="20">
            </span>
            Kontrast umschalten
          </span>
          <img src="/icons/contrast-icon.png" alt="Kontrast Icon" width="32" height="32">
        </button>
        
        <div id="submenu" style="display: none;">
          <div class="submenu-item">
            <div>Hintergrundfarbe</div>
            <div class="color-options">
              <div class="color-picker" style="background-color: red;" data-color="red"></div>
              <div class="color-picker" style="background-color: blue;" data-color="blue"></div>
              <div class="color-picker" style="background-color: green;" data-color="green"></div>
              <div class="color-picker" style="background-color: yellow;" data-color="yellow"></div>
              <div class="color-picker" style="background-color: purple;" data-color="purple"></div>
              <div class="color-picker" style="background-color: white;" data-color="white">
                <img src="/icons/reset2.png" alt="Reset" width="16" height="16">
              </div>
            </div>
          </div>
          
          <div class="submenu-item">
            <div>Schriftfarbe</div>
            <div class="color-options">
              <div class="color-picker" style="background-color: red;" data-font-color="red">T</div>
              <div class="color-picker" style="background-color: blue;" data-font-color="blue">T</div>
              <div class="color-picker" style="background-color: green;" data-font-color="green">T</div>
              <div class="color-picker" style="background-color: yellow;" data-font-color="yellow">T</div>
              <div class="color-picker" style="background-color: purple;" data-font-color="purple">T</div>
              <div class="color-picker" style="background-color: white;" data-font-color="black">
                <img src="/icons/reset2.png" alt="Reset" width="16" height="16">
              </div>
            </div>
          </div>
          
          <div class="submenu-item" style="display: flex; gap: 0.5rem;">
            <button id="grayscale-btn" class="filter-btn">
              <img src="/icons/graufilter.png" alt="Graustufen Icon" width="32" height="32">
              <span>Graustufe</span>
            </button>
            <button id="bluelight-btn" class="filter-btn">
              <img src="/icons/rotlicht.png" alt="Blaulicht Icon" width="32" height="32">
              <span>Blaulicht</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  connectedCallback() {
    this.contrastButton = this.shadowRoot.getElementById('contrast-button');
    this.submenu = this.shadowRoot.getElementById('submenu');
    this.arrowContainer = this.shadowRoot.getElementById('arrow-container');
    this.grayscaleBtn = this.shadowRoot.getElementById('grayscale-btn');
    this.bluelightBtn = this.shadowRoot.getElementById('bluelight-btn');
    this.blueLightOverlay = this.shadowRoot.getElementById('blue-light-overlay');

    // Event-Handler
    this.contrastButton.addEventListener('click', this.handleMainButton);
    this.arrowContainer.addEventListener('click', this.handleArrowClick);
    
    this.shadowRoot.querySelectorAll('.color-picker').forEach(picker => {
      picker.addEventListener('click', this.handleColorPick);
    });

    this.grayscaleBtn.addEventListener('click', () => store.toggleGrayscale());
    this.bluelightBtn.addEventListener('click', () => store.toggleBlueLight());

    // Store Subscription
    this.unsubscribe = store.subscribe(state => this.updateUI(state));

    // Keyboard Shortcut
    this.handleKeyDown = (e) => {
      if (e.altKey && e.ctrlKey && e.key === "1") {
        e.preventDefault();
        store.toggleContrast();
      }
    };
    window.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.unsubscribe?.();
  }

  handleMainButton = (e) => {
    if (!this.isClickOnArrow(e)) {
      store.toggleContrast();
    }
  };

  handleArrowClick = (e) => {
    e.stopPropagation();
    this.toggleSubmenu();
    this.arrowContainer.style.transform = this.isSubmenuOpen 
      ? 'rotate(0deg)' 
      : 'rotate(180deg)';
  };

  handleColorPick = (e) => {
    e.stopPropagation();
    const picker = e.target.closest('.color-picker');
    
    if (picker.dataset.color) {
      const color = picker.dataset.color === 'white' ? '' : picker.dataset.color;
      store.setBackgroundColor(color);
    }
    else if (picker.dataset.fontColor) {
      const color = picker.dataset.fontColor === 'black' ? '' : picker.dataset.fontColor;
      store.setTextColor(color);
    }
  };

  updateUI = (state) => {
    // Kontrast-Button
    this.contrastButton.classList.toggle('contrast-active', state.contrast);
    
    // Filter-Buttons
    this.grayscaleBtn.classList.toggle('active', state.grayscale);
    this.bluelightBtn.classList.toggle('active', state.blueLight);
    
    // Blaulicht-Overlay
    this.blueLightOverlay.style.display = state.blueLight ? 'block' : 'none';
    
    // Reset-Indikatoren
    this.shadowRoot.querySelectorAll('[data-color="white"]').forEach(btn => {
      btn.classList.toggle('active', !state.backgroundColor);
    });
    this.shadowRoot.querySelectorAll('[data-font-color="black"]').forEach(btn => {
      btn.classList.toggle('active', !state.textColor);
    });
  };

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
    this.submenu.style.display = this.isSubmenuOpen ? 'block' : 'none';
  }

  isClickOnArrow(e) {
    return this.arrowContainer.contains(e.target);
  }
}

customElements.define('contrast-switch', ContrastSwitch);