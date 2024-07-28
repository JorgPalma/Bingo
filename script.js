document.addEventListener('DOMContentLoaded', () => {
    const colors = ['#ff6aa0', '#f8312f', '#9b9b9b', '#0074ba', '#8d65c5', '#fcd53f', '#1c1c1c', '#ff6723', '#00d26a', '#83cbff', '#6d4534', '#d2d2d2'];
    const generateButton = document.getElementById('generateBingoCard');
    const newBingoCardButton = document.getElementById('newBingoCard');
    const bingoCardContainer = document.getElementById('bingoCardContainer');
    var items = ["🤎", "🧡", "💛", "🖤", "💚", "❤️", "💙", "🩵", "💜", "🩶", "🤍", "🩷"];

    function random_item(items) {
        return items[Math.floor(Math.random() * items.length)];
    }
    
    generateButton.addEventListener('click', generateBingoCard);
    newBingoCardButton.addEventListener('click', () => {
        if (confirm('¿Deseas generar un nuevo cartón?')) {
            generateBingoCard();
        }
    });

    function generateBingoCard() {
        const cardBackgroundColor = colors[Math.floor(Math.random() * colors.length)];
        const bingoNumbers = generateBingoNumbers();
        
        bingoCardContainer.innerHTML = '';
        bingoCardContainer.style.backgroundColor = cardBackgroundColor;
        
        const header = ['B', 'I', 'N', 'G', 'O'];
        header.forEach(letter => {
            const cell = document.createElement('div');
            cell.className = 'bingo-header';
            cell.textContent = letter;
            bingoCardContainer.appendChild(cell);
        });

        for (let i = 0; i < 5; i++) {
            header.forEach(letter => {
                const cell = document.createElement('div');
                cell.className = 'bingo-cell';
                let number = bingoNumbers[letter][i];
                cell.textContent = number === 'FREE' ? 'FREE' : number;
                if (number !== 'FREE') {
                    cell.addEventListener('click', () => {
                        cell.classList.toggle('marked');
                        saveBingoCard();
                    });
                } else {
                    cell.classList.add('marked');
                }
                bingoCardContainer.appendChild(cell);
            });
        }

        saveBingoCard();
        newBingoCardButton.style.display = 'block';
        generateButton.style.display = 'none';
    }

    function generateBingoNumbers() {
        const columns = {
            'B': randomSample(1, 15),
            'I': randomSample(16, 30),
            'N': randomSample(31, 45),
            'G': randomSample(46, 60),
            'O': randomSample(61, 75)
        };

        columns['N'][2] = random_item(items);
        
        return columns;
    }

    function randomSample(min, max) {
        const numbers = [];
        for (let i = min; i <= max; i++) {
            numbers.push(i);
        }
        numbers.sort(() => Math.random() - 0.5);
        return numbers.slice(0, 5);
    }

    function saveBingoCard() {
        const cells = Array.from(bingoCardContainer.children).slice(5).map(cell => ({
            number: cell.textContent,
            marked: cell.classList.contains('marked')
        }));
        const cardData = {
            backgroundColor: bingoCardContainer.style.backgroundColor,
            cells
        };
        localStorage.setItem('bingoCard', JSON.stringify(cardData));
    }

    function loadBingoCard() {
        const savedCardData = JSON.parse(localStorage.getItem('bingoCard'));
        if (!savedCardData) {
            generateButton.style.display = 'block';
            return;
        }

        bingoCardContainer.innerHTML = '';
        bingoCardContainer.style.backgroundColor = savedCardData.backgroundColor;

        const header = ['B', 'I', 'N', 'G', 'O'];
        header.forEach(letter => {
            const cell = document.createElement('div');
            cell.className = 'bingo-header';
            cell.textContent = letter;
            bingoCardContainer.appendChild(cell);
        });

        savedCardData.cells.forEach((cellData, index) => {
            const cell = document.createElement('div');
            cell.className = 'bingo-cell';
            cell.textContent = cellData.number;
            if (cellData.marked) {
                cell.classList.add('marked');
            }
            if (cellData.number !== 'FREE') {
                cell.addEventListener('click', () => {
                    cell.classList.toggle('marked');
                    saveBingoCard();
                });
            }
            bingoCardContainer.appendChild(cell);
        });

        newBingoCardButton.style.display = 'block';
        generateButton.style.display = 'none';
    }

    loadBingoCard();
});
