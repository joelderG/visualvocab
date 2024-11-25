import translations from './translation.json';

export default class LanguageHandler {
    constructor(languageCode, word) {
        this.languageCode = languageCode;
        this.word = word;

        document.getElementById("title").innerHTML = this.getTranslation(this.word);

        document
            .getElementById("languageSelector")
            .addEventListener("change", (event) => this.onLanguageSelected(event));
    }

    getTranslation(word) {
        return translations[this.languageCode][word] || `Missing translation: ${word}`;
    }

    onLanguageSelected(event) {
        this.languageCode = event.target.value;
        this.updateTitle();
    }

    updateWord(word) {
        this.word = word;
        this.updateTitle();
    }

    updateTitle() {
        const translatedWord = this.getTranslation(this.word);
        document.getElementById("title").innerHTML = translatedWord;
    }
}
