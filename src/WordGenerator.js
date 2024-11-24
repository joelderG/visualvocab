export default class WordGenerator {
    constructor() {
        this.wordArray = ["Sphere","Cone", "Cube", "Cylinder"];
        this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];

        document.getElementById("newWord").addEventListener("click", this.onGenerateNewWord.bind(this)) 
    }

    onGenerateNewWord() {
        this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];
        console.log(this.word)
    }
}