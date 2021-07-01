class cgEnglishHangman {
    constructor() {
        this.parentEl = document.getElementById('cg-english-hangman')
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
        })
        .catch(err => console.log(err))
    }
}

new cgEnglishHangman