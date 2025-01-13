export default class StartScreen {
    constructor(config) {
        this.container = document.getElementById("startScreen");
        this.config = config; 
    }

    show(onComplete) {
      this.container.style.display = "block";
  
      // Entferne die 'selected'-Klasse von allen Buttons
  
      let previouslySelectedButton = null;
  
      document.querySelectorAll('.selection-container > div').forEach((container) => {
          container.addEventListener('click', (event) => {
              if (event.target.tagName === 'BUTTON') {
                  const clickedButton = event.target;
  
                  // Entferne die 'selected'-Klasse vom vorherigen Button
                  if (previouslySelectedButton) {
                      previouslySelectedButton.classList.remove('selected');
                  }
  
                  // Füge die 'selected'-Klasse zum aktuellen Button hinzu
                  clickedButton.classList.add('selected');
  
                  // Aktualisiere den vorherigen Button
                  previouslySelectedButton = clickedButton;
  
                  // Verarbeite die Sprachwahl oder den nächsten Schritt
                  if (clickedButton.hasAttribute('data-language')) {
                      this.config.language = clickedButton.getAttribute('data-language');
                      console.log('Language selected:', this.config.language);
                  } else if (clickedButton.id == "nextBtn") {
                      if (this.config.language) {
                          onComplete();
                      } else {
                          alert("Select a language!");
                      }
                  }
              }
          });
      });
  }
  

    hide() {
      document.querySelectorAll('.selection-container > div > button').forEach((button) => {
        button.classList.remove('selected');
    });
        this.container.style.display = "none";
    }
}
