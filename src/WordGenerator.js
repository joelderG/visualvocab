export default class WordGenerator {
    constructor() {
        this.wordArray = ["Sphere", "Cone", "Cube", "Cylinder"];
        this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];

        // Callback-Referenz für Änderungen
        this.onWordChangeCallback = null;

        // Event-Listener für Button
        document.getElementById("newWord").addEventListener("click", this.onGenerateNewWord.bind(this));
    }

    onGenerateNewWord() {
        this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];
        console.log(this.word);

        // Callback ausführen, wenn definiert
        if (this.onWordChangeCallback) {
            this.onWordChangeCallback(this.word);
        }
    }

    // Methode zum Setzen der Callback-Funktion
    setOnWordChangeCallback(callback) {
        this.onWordChangeCallback = callback;
    }
}
