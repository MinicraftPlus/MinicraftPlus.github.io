document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  
  // Simplified theme handling
  const savedTheme = localStorage.getItem('minicraft-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonText(savedTheme);

  themeToggle.addEventListener('click', (e) => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('minicraft-theme', newTheme);
    updateThemeButtonText(newTheme);
  });

  function updateThemeButtonText(theme) {
    themeToggle.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
  }

  // Optimized smooth scroll
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Intersection Observer with reduced complexity
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.3s, transform 0.3s';
    observer.observe(section);
  });

  // Optimized popup handling
  function showThankYouAndDownload(downloadUrl) {
    const filename = downloadUrl.split('/').pop();
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.style.display = 'flex';
    
    popup.innerHTML = `
      <div class="popup-content">
        <h2>Thank You!</h2>
        <p>Your download of ${filename} should begin automatically.</p>
        <div class="tips">
          <h3>Installation Guide:</h3>
          <ul>
            <li>On Windows: Double click the .jar file to run (if Java is installed)</li>
            <li>On Mac/Linux: Open Terminal and type: java -jar ${filename}</li>
            <li><a href="https://www.java.com/download/" target="_blank">Download Java Runtime</a> if needed</li>
          </ul>
        </div>
        <button class="close-popup">Close</button>
      </div>
    `;

    document.body.appendChild(popup);
    
    const closeBtn = popup.querySelector('.close-popup');
    const closePopup = () => {
      popup.remove();
    };
    
    closeBtn.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup();
    });

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.click();
  }

  // Add download handlers
  document.querySelectorAll('.edition-button, .dev-builds a').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      showThankYouAndDownload(button.href);
    });
  });

  // Simplified GitHub API handling with caching
  async function updateMinicraftPlusLink() {
    try {
      const cache = localStorage.getItem('minicraftPlusData');
      const cacheTime = localStorage.getItem('minicraftPlusDataTime');
      
      // Use cache if it's less than 5 minutes old
      if (cache && cacheTime && (Date.now() - parseInt(cacheTime)) < 300000) {
        updateUIWithData(JSON.parse(cache));
        return;
      }

      const response = await fetch('https://api.github.com/repos/MinicraftPlus/minicraft-plus-revived/releases');
      const data = await response.json();
      
      // Find the latest pre-release
      const latestPreRelease = data.find(release => release.prerelease);
      
      localStorage.setItem('minicraftPlusData', JSON.stringify(latestPreRelease));
      localStorage.setItem('minicraftPlusDataTime', Date.now().toString());
      
      updateUIWithData(latestPreRelease);
    } catch (error) {
      console.error('Error fetching Minicraft+ releases:', error);
    }
  }

  function updateUIWithData(data) {
    const downloadLink = document.querySelector('[data-edition="plus"]');
    if (downloadLink && data.assets && data.assets.length > 0) {
      const jarAsset = data.assets.find(asset => asset.name.endsWith('.jar'));
      if (jarAsset) {
        downloadLink.href = jarAsset.browser_download_url;
        
        const editionDiv = downloadLink.closest('.edition');
        const versionInfo = editionDiv.querySelector('.version-info') || createVersionInfo(editionDiv);
        versionInfo.textContent = `Latest Version: ${data.tag_name}`;
        versionInfo.style.display = 'block';
      }
    }
  }

  function createVersionInfo(parent) {
    const versionInfo = document.createElement('div');
    versionInfo.className = 'version-info';
    parent.insertBefore(versionInfo, parent.querySelector('.button-container'));
    return versionInfo;
  }

  // Add Snake Game Easter Egg
  let typed = '';
  const snakeGameHTML = `
    <div id="snake-game" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
         background:rgba(0,0,0,0.9); padding:20px; border-radius:10px; z-index:1000; text-align:center">
      <canvas id="snake-canvas" width="400" height="400" style="border:2px solid var(--primary-color)"></canvas>
      <div style="color:var(--text-color); margin-top:10px; font-family:'Press Start 2P'">
        Score: <span id="snake-score">0</span>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', snakeGameHTML);

  document.addEventListener('keydown', (e) => {
    typed += e.key.toLowerCase();
    if (typed.length > 5) typed = typed.slice(-5);
    if (typed === 'snake') {
      typed = '';
      const game = document.getElementById('snake-game');
      game.style.display = 'block';
      startSnakeGame();
    }
  });

  function startSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('snake-score');
    
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameInterval;
    let gameStarted = false;
    let gameOver = false;
    
    function drawGame() {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (!gameStarted) {
        // Show start screen
        ctx.fillStyle = 'white';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';  
        ctx.fillText('Press any arrow', canvas.width/2, canvas.height/2 - 20);
        ctx.fillText('key to start!', canvas.width/2, canvas.height/2 + 20);
        return;
      }
      
      if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';  
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 20);
        ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText('Press any arrow key', canvas.width/2, canvas.height/2 + 60);
        ctx.fillText('to play again', canvas.width/2, canvas.height/2 + 80);
        return;
      }
      
      // Draw snake
      ctx.fillStyle = 'lime';
      snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      });
      
      // Draw food
      ctx.fillStyle = 'red';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
      
      moveSnake();
    }
    
    function moveSnake() {
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      
      // Check wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        handleGameOver();
        return;
      }
      
      // Check self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return;
      }
      
      snake.unshift(head);
      
      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        // Generate new food position
        do {
          food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
          };
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
      } else {
        snake.pop();
      }
    }
    
    function handleGameOver() {
      gameOver = true;
      clearInterval(gameInterval);
    }
    
    function resetGame() {
      snake = [{x: 10, y: 10}];
      dx = 0;
      dy = 0;
      score = 0;
      scoreElement.textContent = score;
      gameStarted = true;
      gameOver = false;
      food = {x: 15, y: 15};
      startGameLoop();
    }
    
    function startGameLoop() {
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = setInterval(drawGame, 100);
    }
    
    document.addEventListener('keydown', (e) => {
      // Prevent arrow keys from scrolling the page
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      if (gameOver && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        resetGame();
        return;
      }
      
      if (!gameStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        gameStarted = true;
      }
      
      switch(e.key) {
        case 'ArrowUp':
          if (dy !== 1) { dx = 0; dy = -1; }
          break;
        case 'ArrowDown':
          if (dy !== -1) { dx = 0; dy = 1; }
          break;
        case 'ArrowLeft':
          if (dx !== 1) { dx = -1; dy = 0; }
          break;
        case 'ArrowRight':
          if (dx !== -1) { dx = 1; dy = 0; }
          break;
      }
    });
    
    startGameLoop();
  }

  // Initial update
  updateMinicraftPlusLink();
  
  // Check for updates every 5 minutes
  setInterval(updateMinicraftPlusLink, 300000);
});
