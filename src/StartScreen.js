export default class StartScreen {
    constructor(config) {
        this.container = document.getElementById("startScreen");
        this.config = config; 
        this.previouslySelectedButton = null;
    }

    show(onComplete) {
      this.container.style.display = "block";
      this.onComplete = onComplete; 
      // Entferne die 'selected'-Klasse von allen Buttons
  
      document.querySelectorAll('.selection-container > div').forEach((container) => {
          container.addEventListener('click', this.handleEvent);
      });
  }
  
  handleEvent = (event) => {

    if (event.target.tagName === 'BUTTON') {
        const clickedButton = event.target;

        // Entferne die 'selected'-Klasse vom vorherigen Button
        if (this.previouslySelectedButton) {
            this.previouslySelectedButton.classList.remove('selected');
        }

        // Füge die 'selected'-Klasse zum aktuellen Button hinzu
        clickedButton.classList.add('selected');

        // Aktualisiere den vorherigen Button
        this.previouslySelectedButton = clickedButton;

        // Verarbeite die Sprachwahl oder den nächsten Schritt
        if (clickedButton.hasAttribute('data-language')) {
            this.config.language = clickedButton.getAttribute('data-language');
            console.log('Language selected:', this.config.language);
        } else if (clickedButton.id == "nextBtn") {
            if (this.config.language) {
                this.onComplete();
            } else {
                alert("Select a language!");
            }
        }
    }
  }

    hide() {
        
      document.querySelectorAll('.selection-container > div > button').forEach((button) => {
        button.classList.remove('selected');
    });
    document.querySelectorAll('.selection-container > div').forEach((container) => {
        container.removeEventListener('click', this.handleEvent);
    });
    
        this.container.style.display = "none";
    }
}
