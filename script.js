document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const menuItems = document.querySelectorAll('.menu li');
    const contentArea = document.querySelector('.content-area');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior

            // Remove active class from all
            menuItems.forEach(li => li.classList.remove('active'));

            // Add active class to clicked
            item.classList.add('active');

            // Get tab name
            const tabName = item.querySelector('a').getAttribute('data-tab');

            // Simple animation for content change
            contentArea.style.opacity = '0';

            setTimeout(() => {
                if(tabName === 'home') {
                    // Reset to home content (this is a simplified logic just to show interactivity)
                    document.querySelector('.featured-game').style.display = 'flex';
                    document.querySelector('.recommended').style.display = 'block';
                    document.querySelector('.section-header h2').textContent = 'Polecane dla Ciebie';
                } else {
                    // Change content based on tab
                    document.querySelector('.featured-game').style.display = 'none';
                    const grid = document.querySelector('.games-grid');
                    document.querySelector('.section-header h2').textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);

                    // Simple shuffle of games to simulate different content
                    for (let i = grid.children.length; i >= 0; i--) {
                        grid.appendChild(grid.children[Math.random() * i | 0]);
                    }
                }
                contentArea.style.opacity = '1';
                contentArea.style.transition = 'opacity 0.3s ease';
            }, 300);
        });
    });

    // Play Button Interaction
    const playBtn = document.querySelector('.btn-play');
    playBtn.addEventListener('click', () => {
        const gameTitle = document.querySelector('.featured-content h1').textContent;

        // Simple launching effect
        playBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uruchamianie...';
        playBtn.style.opacity = '0.8';
        playBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            alert(`Uruchamianie gry: ${gameTitle}!\nZanurz się w świecie anime!`);
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Zagraj teraz';
            playBtn.style.opacity = '1';
            playBtn.style.pointerEvents = 'auto';
        }, 1500);
    });

    // Library Add Button
    const addBtn = document.querySelector('.btn-secondary');
    addBtn.addEventListener('click', () => {
        addBtn.innerHTML = '<i class="fa-solid fa-check"></i> W bibliotece';
        addBtn.style.backgroundColor = '#4CAF50';
        addBtn.style.borderColor = '#4CAF50';
        addBtn.style.color = 'white';

        // Update notification badge
        const badge = document.querySelector('.badge');
        badge.textContent = parseInt(badge.textContent) + 1;

        // Simple animation
        badge.style.transform = 'scale(1.5)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    });

    // Game Cards Interaction
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            alert(`Otwieranie strony gry: ${title}`);
        });
    });

    // Search Interaction
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('keyup', (e) => {
        if(e.key === 'Enter') {
            const query = searchInput.value;
            if(query.trim() !== '') {
                alert(`Szukanie: "${query}"...`);
            }
        }
    });
});
