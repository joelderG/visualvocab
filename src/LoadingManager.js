export default class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loaderBar = document.querySelector('.loader-bar');
        this.loaderText = document.querySelector('.loader-text');
    }

    show(message = 'Loading Scene...') {
        this.loadingScreen.style.display = 'flex';
        this.setProgress(0);
        this.setMessage(message);
    }

    hide() {
        // Smooth transition out
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.loadingScreen.style.opacity = '1';
        }, 300);
    }

    setProgress(progress) {
        if (this.loaderBar) {
            this.loaderBar.style.width = `${progress}%`;
        }
    }

    setMessage(message) {
        if (this.loaderText) {
            this.loaderText.textContent = message;
        }
    }
}