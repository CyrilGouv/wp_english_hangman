class cgEnglishHangman {
    constructor() {
        this.parentEl      = document.getElementById('cg-english-hangman')
        this.wrongLetters  = document.getElementById('wrong-letters')
        this.word          = document.getElementById('word')
        this.popup         = document.getElementById('popup-container')
        this.notification  = document.getElementById('notification-container')
        this.message  = document.getElementById('final-message')
        this.bodyParts     = document.querySelectorAll('.figure-part')

        this.restUrl       = this.parentEl.dataset.url

        this.targetWord = ''
        this.correctLetter = []
        this.wrongLetter   = []

        this.getWords()
        
    }

    getWords() {
        fetch(this.restUrl, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(res => {
            const words = res

            this.targetWord = this.selectRandomWord(words)

            this.displayWord()
        })
        .catch(err => console.log(err))
    }

    selectRandomWord(words) {
        const randomWord = words[Math.floor(Math.random() * words.length)].title

        return randomWord
    }

    displayWord() {
        this.word.innerHTML = `
            ${this.targetWord.toLowerCase().split('').map(letter => `       
                <span class="letter">${this.correctLetter.includes(letter) ? letter : ''}</span>
            `).join('')}
        `

        const innerWord = this.word.innerText.replace(/\n/g, '')

        if (innerWord === this.targetWord) {
            this.message.innerText = 'WOW! You won! 😀'
            this.popup.style.display = 'flex'
        }
    }
}

new cgEnglishHangman