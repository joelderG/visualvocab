import translations from './translation.json';

export default class LanguageHandler {
    constructor(languageCode, word) {
        this.languageCode = languageCode;
        this.word = word

        document.getElementById("title").innerHTML = this.word;
        document.getElementById("languageSelector").addEventListener("change", (event) =>  this.onLanguageSelected(event)) 
    }

    getTranslation(word) {
        return translations[this.languageCode][word] || `Missing translation: ${word}`;
    }

    onLanguageSelected(event) {
        this.languageCode = event.target.value;
        console.log(this.languageCode)
        let translatedWord = this.getTranslation(this.word);
        document.getElementById("title").innerHTML = translatedWord;
        console.log(this.word)
    }
}