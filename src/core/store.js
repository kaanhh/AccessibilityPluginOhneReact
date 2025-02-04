// src/core/store.js
export class A11yStore {
    #state = {
      isOpen: false,        // Popup-Zustand
      contrast: false,      // Hochkontrast-Modus
      fontSize: 16,         // Schriftgröße
      backgroundColor: '',  // Benutzerdefinierte Hintergrundfarbe
      textColor: '',        // Benutzerdefinierte Schriftfarbe
      grayscale: false,     // Graustufen-Filter
      blueLight: false      // Blaulichtfilter
    }
  
    #observers = []
  
    get state() {
      return this.#state
    }
  
    subscribe(callback) {
      this.#observers.push(callback)
    }
  
    // Popup-Steuerung
    togglePopup() {
      this.#state.isOpen = !this.#state.isOpen
      this.#notify()
    }
  
    // Kontrast-Modus: Hier wird jetzt der Hintergrund der Seite explizit geändert
    toggleContrast() {
      this.#state.contrast = !this.#state.contrast
  
      if (this.#state.contrast) {
        // Hochkontrast: Seite erhält schwarzen Hintergrund und weiße Schrift
        this.#state.backgroundColor = "black"
        this.#state.textColor = "white"
      } else {
        // Normal: Seite erhält weißen Hintergrund und schwarze Schrift
        this.#state.backgroundColor = "white"
        this.#state.textColor = "black"
      }
  
      this.#applyStyles()
      this.#notify()
    }
  
    // Farbmanagement
    setBackgroundColor(color) {
      this.#state.backgroundColor = color
      this.#applyStyles()
      this.#notify()
    }
  
    setTextColor(color) {
      this.#state.textColor = color
      this.#applyStyles()
      this.#notify()
    }
  
    // Filter
    toggleGrayscale() {
      this.#state.grayscale = !this.#state.grayscale
      this.#applyStyles()
      this.#notify()
    }
  
    toggleBlueLight() {
      this.#state.blueLight = !this.#state.blueLight
      this.#applyStyles()
      this.#notify()
    }
  
    // Style-Anwendung: Wendet die globalen Styles auf das <html>-Element an
    #applyStyles() {
      const html = document.documentElement
      const s = this.#state
  
      // Kontrast & Filter
      html.style.filter = `
        contrast(${s.contrast ? 1.5 : 1})
        grayscale(${s.grayscale ? '100%' : '0'})
        ${s.blueLight ? 'hue-rotate(180deg)' : ''}
      `
  
      // Hintergrund- und Schriftfarben
      if (s.backgroundColor) html.style.backgroundColor = s.backgroundColor
      if (s.textColor) html.style.color = s.textColor
    }
  
    // Observer-Benachrichtigung
    #notify() {
      this.#observers.forEach(cb => cb(this.#state))
    }
  }
  
  export const store = new A11yStore()
  