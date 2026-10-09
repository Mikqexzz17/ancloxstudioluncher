document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('dynamic-content');
    let allGames = [];

    // Fetch games from JSON
    fetch('games.json')
        .then(response => response.json())
        .then(data => {
            allGames = data;
            renderHome(allGames);
            setupSearch(allGames);
        })
        .catch(error => {
            console.error('Error loading games:', error);
            contentArea.innerHTML = '<p style="color: red; text-align: center;">Nie udało się załadować listy gier.</p>';
        });

    // Render Home Tab Content
    function renderHome(games) {
        const featuredGame = games.find(g => g.is_featured) || games[0];
        const otherGames = games.filter(g => g.id !== featuredGame.id);

        let html = '';

        // Render Featured Game
        if (featuredGame) {
            html += `
                <section class="featured-game">
                    <div class="featured-image" style="background: ${featuredGame.cover_color};"></div>
                    <div class="featured-content">
                        <span class="tag">Nowość</span>
                        <h1>${featuredGame.title}</h1>
                        <p>${featuredGame.description}</p>
                        <div class="actions">
                            <button class="btn btn-primary btn-play" data-id="${featuredGame.id}" data-url="${featuredGame.download_url}"><i class="fa-solid fa-download"></i> Pobierz / Zagraj</button>
                            <button class="btn btn-secondary btn-library" data-id="${featuredGame.id}"><i class="fa-solid fa-plus"></i> Do biblioteki</button>
                        </div>
                    </div>
                </section>
            `;
        }

        // Render Recommended Grid
        html += `
            <section class="recommended">
                <div class="section-header">
                    <h2 id="section-title">Polecane dla Ciebie</h2>
                    <a href="#" class="view-all">Zobacz wszystkie</a>
                </div>
                <div class="games-grid" id="games-grid-container">
        `;

        otherGames.forEach(game => {
            html += createGameCardHTML(game);
        });

        html += `
                </div>
            </section>
        `;

        contentArea.innerHTML = html;
        attachButtonListeners();
    }

    // Helper to create a single game card
    function createGameCardHTML(game) {
        return `
            <div class="game-card" data-id="${game.id}">
                <div class="game-cover" style="background: ${game.cover_color};"></div>
                <div class="game-info">
                    <h3>${game.title}</h3>
                    <span class="genre">${game.genre}</span>
                </div>
            </div>
        `;
    }

    // Render Grid only (for other tabs)
    function renderGrid(games, title) {
        let html = `
            <section class="recommended">
                <div class="section-header">
                    <h2 id="section-title">${title}</h2>
                </div>
                <div class="games-grid" id="games-grid-container">
        `;

        games.forEach(game => {
            html += createGameCardHTML(game);
        });

        html += `
                </div>
            </section>
        `;

        contentArea.innerHTML = html;
        attachButtonListeners();
    }


    // Tab Switching Logic
    const menuItems = document.querySelectorAll('.menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            menuItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');

            const tabName = item.querySelector('a').getAttribute('data-tab');

            contentArea.style.opacity = '0';

            setTimeout(() => {
                if(tabName === 'home') {
                    renderHome(allGames);
                } else if (tabName === 'library') {
                    // For now, just show a subset to simulate library
                    renderGrid(allGames.slice(0, 2), 'Moja Biblioteka');
                } else if (tabName === 'store') {
                    renderGrid(allGames, 'Sklep z Grami');
                } else {
                    contentArea.innerHTML = `<h2 style="margin-bottom: 20px;">Zakładka: ${tabName.charAt(0).toUpperCase() + tabName.slice(1)}</h2><p>Treść w budowie...</p>`;
                }

                contentArea.style.opacity = '1';
                contentArea.style.transition = 'opacity 0.3s ease';
            }, 300);
        });
    });

    // Attach listeners for dynamic buttons
    function attachButtonListeners() {
        const playBtns = document.querySelectorAll('.btn-play');
        playBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameUrl = e.currentTarget.getAttribute('data-url');
                alert(`W przyszłości Electron pobierze grę z linku:\n${gameUrl}\n\nNa razie to tylko symulacja pobierania!`);
            });
        });

        const libBtns = document.querySelectorAll('.btn-library');
        libBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                targetBtn.innerHTML = '<i class="fa-solid fa-check"></i> W bibliotece';
                targetBtn.style.backgroundColor = '#4CAF50';
                targetBtn.style.borderColor = '#4CAF50';
                targetBtn.style.color = 'white';

                const badge = document.querySelector('.badge');
                badge.textContent = parseInt(badge.textContent) + 1;
                badge.style.transform = 'scale(1.5)';
                setTimeout(() => badge.style.transform = 'scale(1)', 200);
            });
        });

        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                alert(`W przyszłości przeniesie do widoku szczegółów gry: ${title}`);
            });
        });
    }

    // Search Interaction
    function setupSearch(games) {
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('keyup', (e) => {
            const query = searchInput.value.toLowerCase().trim();
            if(query !== '') {
                const filtered = games.filter(g => g.title.toLowerCase().includes(query) || g.genre.toLowerCase().includes(query));
                renderGrid(filtered, `Wyniki wyszukiwania dla: "${query}"`);

                // Switch active tab visually
                menuItems.forEach(li => li.classList.remove('active'));
            } else {
                renderHome(games);
                menuItems[0].classList.add('active'); // Back to home
            }
        });
    }
});
