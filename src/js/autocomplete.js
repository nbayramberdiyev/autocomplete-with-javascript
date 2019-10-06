class Autocomplete {
    constructor(input, results, countries) {
        this.input = input;
        this.results = results;
        this.countries = countries;
        this.cursor = -1;
        
        this.init();
    }

    init() {
        this.input.addEventListener('input', e => {
            this.removeMatches();

            this.cursor = -1;

            if (!this.input.value) {
                return;
            }
    
            let matches = this.getMatches();
    
            if (Array.isArray(matches) && matches.length) {
                this.displayMatches(matches);
            }
        });

        this.input.addEventListener('keydown', e => {
            if ([13, 38, 40].includes(e.keyCode)) {
                e.preventDefault();
            }

            if (!this.results.children.length) {
                return;
            }

            switch(e.keyCode) {
                case 13:
                    this.results.children[this.cursor].children[0].click();
                    break;
                case 38:
                    this.cursor--;
                    this.scrollUp();
                    this.moveCursor();
                    break;
                case 40:
                    this.cursor++;
                    this.moveCursor();
                    this.scrollDown();
                    break;
                default:
                    return;
            }
        });
    }

    getMatches() {
        let matches = [];

        if (this.input.value) {
            this.countries.forEach((country, index) => {
                if (country.substr(0, this.input.value.length).toLowerCase() === this.input.value.toLowerCase()) {
                    matches.push(country);
                }
            });
        }

        return matches;
    }

    displayMatches(matches) {
        matches.forEach(match => {
            let item = document.createElement('li');
            item.setAttribute('data-match', match);
            item.innerHTML = '<span><strong>' + match.substring(0, this.input.value.length) + '</strong>' + match.substr(this.input.value.length) + '</span>';
            item.addEventListener('click', e => {
                if (e.target.dataset.match || e.target.parentNode.dataset.match) {
                    this.input.value = e.target.dataset.match || e.target.parentNode.dataset.match;
                    this.removeMatches();
                }
            });
            this.results.appendChild(item);
        });

        this.results.parentNode.classList.remove('hidden');
        this.input.classList.add('open');
    }

    removeMatches() {
        this.results.parentNode.classList.add('hidden');
        this.input.classList.remove('open');
        this.results.innerHTML = '';
    }

    moveCursor() {
        for (let i = 0; i < this.results.children.length; i++) {
            this.results.children[i].classList.remove('highlighted');
        }

        if (this.cursor >= this.results.children.length) {
            this.cursor = 0;
        }
        
        if (this.cursor < 0) {
            this.cursor = (this.results.children.length - 1);
        }

        if (this.results.children[this.cursor]) {
            this.results.children[this.cursor].classList.add('highlighted');
        }
    }

    scrollUp() {
        if (this.cursor < 0) {
            this.results.scrollTop = this.results.scrollHeight;
            return;
        }

        if ((this.results.children[this.cursor].offsetHeight * this.cursor ) < this.results.scrollTop) {
            this.results.scrollTop -= this.results.children[this.cursor].offsetHeight;
        }
    }

    scrollDown() {
        if (this.cursor === 0) {
            this.results.scrollTop = 0;
            return;
        }

        if ((this.results.children[this.cursor].offsetHeight * this.cursor + this.results.children[this.cursor].offsetHeight) > (this.results.scrollTop + parseFloat(getComputedStyle(this.results, null).height.replace('px', '')))) {
            this.results.scrollTop += this.results.children[this.cursor].offsetHeight;
        }
    }
}