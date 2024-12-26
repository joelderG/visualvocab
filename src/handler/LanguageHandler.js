import translations from "../translation.json";

export default class LanguageHandler {
  constructor(language) {
    this.language = language;
  }

  getTranslation(word) {
    return translations[this.language][word] || `Missing translation: ${word}`;
  }
}
