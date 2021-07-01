class cgEnglishHangman {
    constructor() {
        this.parentEl        = document.getElementById('cg-english-hangman')
        this.wrongLettersEl  = document.getElementById('wrong-letters')
        this.word            = document.getElementById('word')
        this.popup           = document.getElementById('popup-container')
        this.notification    = document.getElementById('notification-container')
        this.message         = document.getElementById('final-message')
        this.playAgain       = document.getElementById('play-button')
        this.bodyParts       = document.querySelectorAll('.figure-part')

        this.restUrl         = this.parentEl.dataset.url

        this.targetWord      = ''
        this.correctLetter   = []
        this.wrongLetter     = []

        this.getWords()
        
        this.events()
    }

    events() {
        window.addEventListener('keydown', (e) => {
            if (e.keyCode >= 65 && e.keyCode <= 90) {
                const key = e.key

                if (this.targetWord.includes(key)) {
                    if (!this.correctLetter.includes(key)) {
                        this.correctLetter.push(key)
                        this.displayWord()
                    } else {
                        this.handleNotification()
                    }
                } else {
                    if (!this.wrongLetter.includes(key)) {
                        this.wrongLetter.push(key)
                        this.handleWrongLetter()

                    }else {
                        this.handleNotification()
                    }
                }
            }
        })
        
        this.playAgain.addEventListener('click', () => {
            this.correctLetter.splice(0)
            this.wrongLetter.splice(0)

            this.getWords()
            this.handleWrongLetter()

            this.popup.style.display = 'none'
        })
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

    handleWrongLetter() {
        this.wrongLettersEl.innerHTML = `
            ${this.wrongLetter.length > 0 ? '<p>Wrong</p>' : ''}
            ${this.wrongLetter.map(letter => {
                return `<span>${letter}</span>`
            })}
        `

        this.bodyParts.forEach((part, index) => {
            const errors = this.wrongLetter.length

            if (index < errors) {
                part.style.display = 'block'
            } else {
                part.style.display = 'none'
            }
        })

        if (this.wrongLetter.length === this.bodyParts.length) {
            this.message.innerText = 'OH NO!!! You lost! 😕'
            this.popup.style.display = 'flex'
        }
    }

    handleNotification() {
        this.notification.classList.add('show')

        setTimeout(() => {
            this.notification.classList.remove('show')
        }, 2000)
    }
}

new cgEnglishHangman