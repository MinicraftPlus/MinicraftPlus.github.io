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
  const minesweeperHTML = `
    <div id="minesweeper-game" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
         background:rgba(0,0,0,0.9); padding:20px; border-radius:10px; z-index:1000; text-align:center">
      <div style="color:var(--text-color); margin-bottom:10px; font-family:'Press Start 2P'">
        Mines: <span id="mines-left">10</span>
      </div>
      <div id="minesweeper-board" style="display:grid; grid-template-columns:repeat(8,40px); gap:2px; 
           background:var(--background-color); padding:10px; border-radius:5px;">
      </div>
      <div style="color:var(--text-color); margin-top:10px; font-family:'Press Start 2P'">
        Time: <span id="minesweeper-time">0</span>s
      </div>
    </div>
  `;
  
  const game2048HTML = `
    <div id="game-2048" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
         background:rgba(0,0,0,0.9); padding:20px; border-radius:10px; z-index:1000; text-align:center">
      <div style="color:var(--text-color); margin-bottom:10px; font-family:'Press Start 2P'">
        Score: <span id="score-2048">0</span>
      </div>
      <div id="board-2048" style="display:grid; grid-template-columns:repeat(4,80px); gap:5px; 
           background:var(--background-color); padding:10px; border-radius:5px;">
      </div>
      <div style="color:var(--text-color); margin-top:10px; font-family:'Press Start 2P'">
        High Score: <span id="high-score-2048">0</span>
      </div>
    </div>
  `;
  
  const clickerGameHTML = `
    <div id="clicker-game" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
         background:rgba(0,0,0,0.9); padding:20px; border-radius:10px; z-index:1000; text-align:center">
      <div style="color:var(--text-color); margin-bottom:20px; font-family:'Press Start 2P'; font-size:20px;">
        Clicks: <span id="click-count">0</span>/100
      </div>
      <button id="clicker-button" style="padding:20px 40px; font-family:'Press Start 2P'; 
              background:var(--primary-color); border:none; border-radius:10px; cursor:pointer; 
              color:white; font-size:16px;">CLICK ME</button>
    </div>
  `;
  
  const guessGameHTML = `
    <div id="dino-game" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
         background:rgba(0,0,0,0.9); padding:20px; border-radius:10px; z-index:1000; text-align:center">
      <div style="color:var(--text-color); margin-bottom:10px; font-family:'Press Start 2P'; font-size:12px;">
        Score: <span id="dino-score">0</span>
      </div>
      <canvas id="dino-canvas" width="600" height="150" style="border:1px solid var(--primary-color)"></canvas>
      <div style="color:var(--text-color); margin-top:10px; font-family:'Press Start 2P'; font-size:10px;">
        Press Space to Jump
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', snakeGameHTML);
  document.body.insertAdjacentHTML('beforeend', minesweeperHTML);
  document.body.insertAdjacentHTML('beforeend', game2048HTML);
  document.body.insertAdjacentHTML('beforeend', clickerGameHTML);
  document.body.insertAdjacentHTML('beforeend', guessGameHTML);

  document.addEventListener('keydown', (e) => {
    typed += e.key.toLowerCase();
    if (typed.length > 10) typed = typed.slice(-10);
    
    if (typed.includes('snake')) {
      typed = '';
      const game = document.getElementById('snake-game');
      game.style.display = 'block';
      startSnakeGame();
    } else if (typed.includes('mine')) {
      typed = '';
      const game = document.getElementById('minesweeper-game');
      game.style.display = 'block';
      startMinesweeper();
    } else if (typed.includes('2048')) {
      typed = '';
      const game = document.getElementById('game-2048');
      game.style.display = 'block';
      start2048();
    } else if (typed.includes('clicker')) {
      typed = '';
      const game = document.getElementById('clicker-game');
      game.style.display = 'block';
      startClickerGame();
    } else if (typed.includes('dino')) {
      typed = '';
      const game = document.getElementById('dino-game');
      game.style.display = 'block';
      startDinoGame();
    } else if (typed.includes('wait')) {
      typed = '';
      startWaitTimer();
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
      setTimeout(() => {
        document.getElementById('snake-game').style.display = 'none';
      }, 1500);
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

  function startMinesweeper() {
    const board = document.getElementById('minesweeper-board');
    const minesLeftDisplay = document.getElementById('mines-left');
    const timeDisplay = document.getElementById('minesweeper-time');
    const size = 8;
    let time = 0;
    let timer;
    let gameOver = false;
    let minesLeft = 10;
    let revealed = 0;
    
    const grid = [];
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        row.push({
          isMine: false,
          revealed: false,
          flagged: false,
          neighborMines: 0
        });
      }
      grid.push(row);
    }
    
    let minesPlaced = 0;
    while (minesPlaced < 10) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      
      if (!grid[y][x].isMine) {
        grid[y][x].isMine = true;
        minesPlaced++;
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
              grid[ny][nx].neighborMines++;
            }
          }
        }
      }
    }
    
    board.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = document.createElement('div');
        cell.style.width = '40px';
        cell.style.height = '40px';
        cell.style.backgroundColor = 'var(--secondary-color)';
        cell.style.display = 'flex';
        cell.style.justifyContent = 'center';
        cell.style.alignItems = 'center';
        cell.style.cursor = 'pointer';
        cell.style.userSelect = 'none';
        
        cell.dataset.x = x;
        cell.dataset.y = y;
        
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('contextmenu', handleCellRightClick);
        
        fragment.appendChild(cell);
      }
    }
    
    board.appendChild(fragment);
    
    function handleCellClick(e) {
      const x = parseInt(e.target.dataset.x);
      const y = parseInt(e.target.dataset.y);
      revealCell(x, y);
    }
    
    function handleCellRightClick(e) {
      e.preventDefault();
      const x = parseInt(e.target.dataset.x);
      const y = parseInt(e.target.dataset.y);
      flagCell(x, y);
    }
    
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      if (!gameOver) {
        time++;
        timeDisplay.textContent = time;
      }
    }, 1000);
    
    function revealCell(x, y) {
      if (gameOver || grid[y][x].flagged || grid[y][x].revealed) return;
      
      grid[y][x].revealed = true;
      revealed++;
      const cell = board.children[y * size + x];
      
      if (grid[y][x].isMine) {
        cell.style.backgroundColor = 'red';
        endGame(false);
      } else {
        cell.style.backgroundColor = 'var(--background-color)';
        if (grid[y][x].neighborMines > 0) {
          cell.textContent = grid[y][x].neighborMines;
          cell.style.color = 'var(--text-color)';
        } else {
          const toReveal = [];
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < size && nx >= 0 && nx < size && 
                  !grid[ny][nx].revealed && !grid[ny][nx].flagged) {
                toReveal.push({x: nx, y: ny});
              }
            }
          }
          
          for (const cell of toReveal) {
            revealCell(cell.x, cell.y);
          }
        }
      }
      
      if (revealed === size * size - 10) endGame(true);
    }
    
    function flagCell(x, y) {
      if (gameOver || grid[y][x].revealed) return;
      
      const cell = board.children[y * size + x];
      if (grid[y][x].flagged) {
        grid[y][x].flagged = false;
        cell.textContent = '';
        minesLeft++;
      } else {
        grid[y][x].flagged = true;
        cell.textContent = 'F';
        minesLeft--;
      }
      minesLeftDisplay.textContent = minesLeft;
    }
    
    function endGame(won) {
      gameOver = true;
      clearInterval(timer);
      
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (grid[y][x].isMine) {
            const cell = board.children[y * size + x];
            cell.style.backgroundColor = won ? 'green' : 'red';
            cell.textContent = '*';
          }
        }
      }
      
      setTimeout(() => {
        document.getElementById('minesweeper-game').style.display = 'none';
      }, 1500);
    }
  }

  function start2048() {
    const board = document.getElementById('board-2048');
    const scoreDisplay = document.getElementById('score-2048');
    const highScoreDisplay = document.getElementById('high-score-2048');
    const size = 4;
    let score = 0;
    let highScore = localStorage.getItem('2048-high-score') || 0;
    let grid = Array(size).fill().map(() => Array(size).fill(0));
    let gameOver = false;
/*
    highScoreDisplay.textContent = highScore;
    */
    function createTile(value) {
      const tile = document.createElement('div');
      tile.style.width = '80px';
      tile.style.height = '80px';
      tile.style.display = 'flex';
      tile.style.justifyContent = 'center';
      tile.style.alignItems = 'center';
      tile.style.fontSize = '24px';
      tile.style.fontFamily = '"Press Start 2P"';
      tile.style.transition = 'all 0.1s';
      updateTile(tile, value);
      return tile;
    }
    
    function updateTile(tile, value) {
      tile.textContent = value || '';
      tile.style.backgroundColor = getTileColor(value);
      tile.style.color = value > 4 ? '#fff' : '#000';
    }
    
    function getTileColor(value) {
      const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
      };
      return colors[value] || 'var(--background-color)';
    }
    
    function initBoard() {
      board.innerHTML = '';
      grid = Array(size).fill().map(() => Array(size).fill(0));
      score = 0;
      gameOver = false;
      scoreDisplay.textContent = '0';
      
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          board.appendChild(createTile(0));
        }
      }
      
      addNewTile();
      addNewTile();
    }
    
    function addNewTile() {
      const emptyCells = [];
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (grid[y][x] === 0) emptyCells.push({x, y});
        }
      }
      
      if (emptyCells.length) {
        const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[y][x] = Math.random() < 0.9 ? 2 : 4;
        updateTile(board.children[y * size + x], grid[y][x]);
      }
    }
    
    function updateBoard() {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          updateTile(board.children[y * size + x], grid[y][x]);
        }
      }
    }
    
    function move(direction) {
      if (gameOver) return;
      
      let moved = false;
      const newGrid = Array(size).fill().map(() => Array(size).fill(0));
      
      if (direction === 'left' || direction === 'right') {
        for (let y = 0; y < size; y++) {
          const row = grid[y].filter(cell => cell !== 0);
          if (direction === 'right') row.reverse();
          
          for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
              row[i] *= 2;
              score += row[i];
              row.splice(i + 1, 1);
              moved = true;
            }
          }
          
          while (row.length < size) row.push(0);
          if (direction === 'right') row.reverse();
          
          if (row.join(',') !== grid[y].join(',')) moved = true;
          newGrid[y] = row;
        }
      } else {
        for (let x = 0; x < size; x++) {
          const column = grid.map(row => row[x]).filter(cell => cell !== 0);
          if (direction === 'down') column.reverse();
          
          for (let i = 0; i < column.length - 1; i++) {
            if (column[i] === column[i + 1]) {
              column[i] *= 2;
              score += column[i];
              column.splice(i + 1, 1);
              moved = true;
            }
          }
          
          while (column.length < size) column.push(0);
          if (direction === 'down') column.reverse();
          
          if (column.join(',') !== grid.map(row => row[x]).join(',')) moved = true;
          for (let y = 0; y < size; y++) {
            newGrid[y][x] = column[y];
          }
        }
      }
      
      if (moved) {
        grid = newGrid;
        addNewTile();
        updateBoard();
        scoreDisplay.textContent = score;
        
        if (score > highScore) {
          highScore = score;
          highScoreDisplay.textContent = highScore;
          localStorage.setItem('2048-high-score', highScore);
        }
        
        let hasEmpty = false;
        let canMove = false;
        
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            if (grid[y][x] === 0) {
              hasEmpty = true;
            }
            if (grid[y][x] === 2048) {
              setTimeout(() => {
                if (confirm('You won! Continue playing?')) {
                  gameOver = false;
                } else {
                  document.getElementById('game-2048').style.display = 'none';
                }
              }, 100);
              return;
            }
            if (x < size - 1 && grid[y][x] === grid[y][x + 1]) canMove = true;
            if (y < size - 1 && grid[y][x] === grid[y + 1][x]) canMove = true;
          }
        }
        
        if (!hasEmpty && !canMove) {
          gameOver = true;
          setTimeout(() => {
            document.getElementById('game-2048').style.display = 'none';
          }, 1500);
        }
      }
    }
    
    document.addEventListener('keydown', (e) => {
      if (document.getElementById('game-2048').style.display !== 'none') {
        e.preventDefault();
        switch(e.key) {
          case 'ArrowLeft': move('left'); break;
          case 'ArrowRight': move('right'); break;
          case 'ArrowUp': move('up'); break;
          case 'ArrowDown': move('down'); break;
        }
      }
    });
    
    initBoard();
  }

  function startClickerGame() {
    const clickButton = document.getElementById('clicker-button');
    const clickCount = document.getElementById('click-count');
    let count = 0;
    
    clickButton.addEventListener('click', () => {
      count++;
      clickCount.textContent = count;
      
      if (count >= 100) {
        setTimeout(() => {
          document.getElementById('clicker-game').style.display = 'none';
        }, 500);
      }
    });
  }
  
  function startGuessGame() {
    // Function is replaced by startDinoGame
  }
  
  function startDinoGame() {
    const canvas = document.getElementById('dino-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('dino-score');
    
    const dino = {
      x: 50,
      y: 100,
      width: 20,
      height: 40,
      jumping: false,
      jumpHeight: 0,
      score: 0
    };
    
    const obstacles = [];
    const gravity = 0.6;
    const jumpPower = 12;
    let speed = 5;
    let gameOver = false;
    let animationId;
    
    function drawDino() {
      ctx.fillStyle = 'green';
      ctx.fillRect(dino.x, dino.y - dino.height, dino.width, dino.height);
    }
    
    function drawObstacle(obstacle) {
      ctx.fillStyle = 'red';
      ctx.fillRect(obstacle.x, obstacle.y - obstacle.height, obstacle.width, obstacle.height);
    }
    
    function updateDino() {
      if (dino.jumping) {
        dino.y -= dino.jumpHeight;
        dino.jumpHeight -= gravity;
        
        if (dino.y >= 100) {
          dino.y = 100;
          dino.jumping = false;
        }
      }
    }
    
    function createObstacle() {
      const height = 20 + Math.random() * 30;
      obstacles.push({
        x: canvas.width,
        y: 100,
        width: 20,
        height: height
      });
    }
    
    function updateObstacles() {
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= speed;
        
        // Check collision
        if (
          dino.x < obstacles[i].x + obstacles[i].width &&
          dino.x + dino.width > obstacles[i].x &&
          dino.y - dino.height < obstacles[i].y &&
          dino.y > obstacles[i].y - obstacles[i].height
        ) {
          endGame();
        }
        
        // Remove obstacles that have gone off screen
        if (obstacles[i].x + obstacles[i].width < 0) {
          obstacles.splice(i, 1);
          i--;
          dino.score++;
          scoreDisplay.textContent = dino.score;
          
          // Increase speed every 5 points
          if (dino.score % 5 === 0) {
            speed += 0.5;
          }
        }
      }
      
      // Create new obstacles
      if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
        createObstacle();
      }
    }
    
    function endGame() {
      gameOver = true;
      cancelAnimationFrame(animationId);
      setTimeout(() => {
        document.getElementById('dino-game').style.display = 'none';
      }, 3000);
    }
    
    function gameLoop() {
      if (gameOver) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw ground
      ctx.fillStyle = 'gray';
      ctx.fillRect(0, 100, canvas.width, 1);
      
      updateDino();
      drawDino();
      
      updateObstacles();
      obstacles.forEach(drawObstacle);
      
      animationId = requestAnimationFrame(gameLoop);
    }
    
    function jump() {
      if (!dino.jumping && !gameOver) {
        dino.jumping = true;
        dino.jumpHeight = jumpPower;
      }
    }
    
    document.addEventListener('keydown', (e) => {
      if (document.getElementById('dino-game').style.display !== 'none') {
        if (e.code === 'Space') {
          e.preventDefault();
          jump();
        }
      }
    });
    
    // Add touch controls for mobile
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      jump();
    });
    
    // Start the game
    gameLoop();
  }

  function startWaitTimer() {
    const timerHTML = `
      <div id="wait-timer" style="display:block; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
           background:rgba(0,0,0,0.9); padding:20px; border-radius:10px; z-index:1000; text-align:center">
        <div style="color:var(--text-color); margin-bottom:20px; font-family:'Press Start 2P'; font-size:24px;">
          Time Remaining: <span id="countdown">10:00</span>
        </div>
        <button id="cancel-wait" style="padding:10px 20px; font-family:'Press Start 2P'; 
                background:var(--primary-color); border:none; border-radius:10px; cursor:pointer; 
                color:white; font-size:12px;">Cancel</button>
      </div>
    `;
  
    document.body.insertAdjacentHTML('beforeend', timerHTML);
  
    const countdownElement = document.getElementById('countdown');
    const cancelButton = document.getElementById('cancel-wait');
    let minutes = 10;
    let seconds = 0;
  
    const timerInterval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timerInterval);
          playRickroll();
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      
      countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  
    cancelButton.addEventListener('click', () => {
      clearInterval(timerInterval);
      document.getElementById('wait-timer').remove();
    });
  
    function playRickroll() {
      document.getElementById('wait-timer').remove();
      
      const rickrollHTML = `
        <div id="rickroll" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; 
             background:rgba(0,0,0,0.9); z-index:1000;">
          <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; max-width:800px; margin:50px auto;">
            <iframe style="position:absolute; top:0; left:0; width:100%; height:100%;" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen></iframe>
          </div>
          <button id="close-rickroll" style="position:absolute; top:10px; right:10px; padding:10px 20px; font-family:'Press Start 2P'; 
                  background:var(--primary-color); border:none; border-radius:10px; cursor:pointer; 
                  color:white; font-size:12px;">Close</button>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', rickrollHTML);
      
      document.getElementById('close-rickroll').addEventListener('click', () => {
        document.getElementById('rickroll').remove();
      });
    }
  }

  // Initial update
  updateMinicraftPlusLink();
  
  // Check for updates every 5 minutes
  setInterval(updateMinicraftPlusLink, 300000);
});
