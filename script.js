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
        if (!games || games.length === 0) {
            contentArea.innerHTML = `
                <div class="empty-state" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; color: #a0a0b0;">
                    <i class="fa-solid fa-gamepad" style="font-size: 80px; margin-bottom: 20px; color: var(--accent-primary); filter: drop-shadow(0 0 20px rgba(255, 51, 102, 0.4));"></i>
                    <h2 style="color: white; font-size: 28px; margin-bottom: 10px;">Brak gier w bazie</h2>
                    <p style="margin-top: 10px; max-width: 500px; line-height: 1.6;">
                        Twój launcher Anclox jest gotowy, ale nie ma jeszcze żadnych gier!
                        <br>Aby zacząć, udostępnij swoje gry przez GitHub Releases i dodaj je do pliku <strong style="color: var(--accent-secondary);">games.json</strong>.
                    </p>
                </div>
            `;
            return;
        }

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
        if (!games || games.length === 0) {
            contentArea.innerHTML = `
                <div class="empty-state" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; color: #a0a0b0;">
                    <i class="fa-solid fa-folder-open" style="font-size: 80px; margin-bottom: 20px; color: var(--accent-secondary); filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.4));"></i>
                    <h2 style="color: white; font-size: 28px; margin-bottom: 10px;">${title} jest pusta</h2>
                    <p style="margin-top: 10px; max-width: 500px; line-height: 1.6;">
                        Brak gier do wyświetlenia w tej sekcji.
                    </p>
                </div>
            `;
            return;
        }

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


    // Render Settings
    function renderSettings() {
        contentArea.innerHTML = `
            <div class="settings-container">
                <h2 style="margin-bottom: 20px;">Ustawienia Launchera</h2>

                <div class="settings-group">
                    <h3>Ogólne</h3>
                    <div class="setting-item">
                        <div>
                            <h4>Uruchamiaj przy starcie systemu</h4>
                            <p>Automatycznie włączaj Anclox po włączeniu komputera</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div>
                            <h4>Minimalizuj do paska zadań</h4>
                            <p>Ukryj w trayu po zamknięciu okna głównego</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>

                <div class="settings-group">
                    <h3>Pobieranie</h3>
                    <div class="setting-item">
                        <div>
                            <h4>Automatyczne aktualizacje gier</h4>
                            <p>Pobieraj i instaluj łatki w tle</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="setting-item" style="display:block;">
                        <h4>Lokalizacja instalacji</h4>
                        <div style="display:flex; gap:10px; margin-top:10px;">
                            <input type="text" value="C:\\Games\\Anclox" readonly style="flex:1; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.3); color:white;">
                            <button class="btn btn-outline">Zmień</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render Community
    function renderCommunity() {
        contentArea.innerHTML = `
            <div class="settings-container">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                    <h2>Społeczność Anclox</h2>
                    <button class="btn btn-primary"><i class="fa-solid fa-pen"></i> Napisz post</button>
                </div>

                <div class="feed-item">
                    <div class="feed-avatar">K</div>
                    <div class="feed-content" style="flex:1;">
                        <div style="display:flex; justify-content:space-between;">
                            <h4>Kira_Player <span style="color:var(--accent-primary); font-size:12px; margin-left:10px;">PRO</span></h4>
                            <span style="color:#a0a0b0; font-size:12px;">2 godz. temu</span>
                        </div>
                        <p style="margin: 10px 0; color: white;">Właśnie skończyłem najnowszą aktualizację do Cyber Samurai! Ta nowa katana jest niesamowita. Ktoś już próbował walczyć z bossem w 3 akcie?</p>
                        <div style="display:flex; gap:15px; margin-top:10px; font-size:14px;">
                            <span style="cursor:pointer; color:#ff3366;"><i class="fa-solid fa-heart"></i> 24</span>
                            <span style="cursor:pointer; color:#a0a0b0;"><i class="fa-solid fa-comment"></i> 5</span>
                        </div>
                    </div>
                </div>

                <div class="feed-item">
                    <div class="feed-avatar" style="background:#00f0ff;">A</div>
                    <div class="feed-content" style="flex:1;">
                        <div style="display:flex; justify-content:space-between;">
                            <h4>AnimeFan99</h4>
                            <span style="color:#a0a0b0; font-size:12px;">Wczoraj</span>
                        </div>
                        <p style="margin: 10px 0; color: white;">Tworzę moda do Magical Girl Squad. Będzie można zmienić stroje całej drużyny. Potrzebuję betatesterów!</p>
                        <div style="display:flex; gap:15px; margin-top:10px; font-size:14px;">
                            <span style="cursor:pointer; color:#ff3366;"><i class="fa-regular fa-heart"></i> 12</span>
                            <span style="cursor:pointer; color:#a0a0b0;"><i class="fa-solid fa-comment"></i> 8</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
                } else if (tabName === 'community') {
                    renderCommunity();
                } else if (tabName === 'settings') {
                    renderSettings();
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
