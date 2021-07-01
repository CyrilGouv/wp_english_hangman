class cgEnglishHangman {
    constructor() {
        this.parentEl     = document.getElementById('cg-english-hangman')
        this.wrongLetters = document.getElementById('wrong-letters')
        this.word         = document.getElementById('word')
        this.popup        = document.getElementById('popup')
        this.notification = document.getElementById('notification-container')
        this.bodyParts    = document.querySelectorAll('.figure-part')

        this.restUrl  = this.parentEl.dataset.url

        this.getWords()
    }

    getWords() {
        fetch(this.restUrl, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(res => {
            const words = res

            const word = this.selectRandomWord(words)

            console.log(word)
        })
        .catch(err => console.log(err))
    }

    selectRandomWord(words) {
        const randomWord = words[Math.floor(Math.random() * words.length)].title

        return randomWord
    }
}

new cgEnglishHangman