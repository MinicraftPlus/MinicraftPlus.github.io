// Theme switcher functionality with local storage persistence
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  let rgbMode = false;
  let originalButtonText;

  // Show "Eye Cancer Mode" text when shift is held
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && !originalButtonText) {
      originalButtonText = themeToggle.textContent;
      themeToggle.textContent = 'Eye Cancer Mode';
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift' && originalButtonText) {
      themeToggle.textContent = originalButtonText;
      originalButtonText = null;
    }
  });

  // Check for saved theme preference, default to light if none found
  const savedTheme = localStorage.getItem('minicraft-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonText(savedTheme);

  // Theme toggle handler with RGB mode
  themeToggle.addEventListener('click', (e) => {
    if (e.shiftKey) {
      rgbMode = !rgbMode;
      if (rgbMode) {
        document.body.classList.add('rgb-mode');
        startRGBAnimation();
        themeToggle.textContent = 'Eye Cancer Mode';
        // Hide the button with animation
        themeToggle.style.transform = 'scale(0)';
        setTimeout(() => {
          themeToggle.style.display = 'none';
        }, 300);
      } else {
        document.body.classList.remove('rgb-mode');
        stopRGBAnimation();
        updateThemeButtonText(document.documentElement.getAttribute('data-theme'));
        // Show the button again
        themeToggle.style.display = 'block';
        setTimeout(() => {
          themeToggle.style.transform = 'scale(1)';
        }, 50);
      }
    } else {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('minicraft-theme', newTheme);
      updateThemeButtonText(newTheme);
    }
  });

  // Helper function to update button text
  function updateThemeButtonText(theme) {
    themeToggle.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
  }

  // Smooth scroll behavior for navigation
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply fade-in animation to sections
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(section);
  });

  // Error handling for theme switching
  window.addEventListener('storage', (e) => {
    if (e.key === 'minicraft-theme') {
      try {
        const newTheme = e.newValue || 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeButtonText(newTheme);
      } catch (error) {
        console.error('Error syncing theme across tabs:', error);
        // Fallback to light theme if there's an error
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeButtonText('light');
      }
    }
  });

  // Create thank you popup
  const popupHTML = `
    <div id="thank-you-popup" class="popup-overlay">
      <div class="popup-content">
        <h2>Thank You!</h2>
        <p>Your download should begin automatically. We hope you enjoy your Minicraft adventure!</p>
        <h3>Join Our Community!</h3>
        <p>Connect with other players, share your experiences, and get help when needed.</p>
        <a href="https://discord.gg/mJFRZXy9BK" class="discord-button" target="_blank">
          Join Discord Server
        </a>
        <div class="tips">
          <h4>Quick Tips:</h4>
          <ul>
            <li>Use WASD or arrow keys to move</li>
            <li>Space/X to attack</li>
            <li>C to open inventory</li>
            <li>Press ESC for menu</li>
          </ul>
        </div>
        <button class="close-popup">Close</button>
      </div>
    </div>
  `;

  // Add popup to body
  document.body.insertAdjacentHTML('beforeend', popupHTML);

  const popup = document.getElementById('thank-you-popup');
  const closeButton = document.querySelector('.close-popup');

  // Close popup on button click or clicking outside
  closeButton.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

  // Function to show popup and start download
  function showThankYouAndDownload(downloadUrl) {
    popup.style.display = 'flex';
    // Start download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Add click handlers to all download buttons
  document.querySelectorAll('.edition-button, .dev-builds a').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      showThankYouAndDownload(button.href);
    });
  });

  async function updateMinicraftPlusLink() {
    try {
      // Get latest release
      const releaseResponse = await fetch('https://api.github.com/repos/MinicraftPlus/minicraft-plus-revived/releases/latest');
      const releaseData = await releaseResponse.json();
      
      // Get pre-releases
      const preReleasesResponse = await fetch('https://api.github.com/repos/MinicraftPlus/minicraft-plus-revived/releases');
      const allReleases = await preReleasesResponse.json();
      
      const downloadLink = document.querySelector('[data-edition="plus"]');
      const editionDiv = downloadLink?.closest('.edition');
      
      if (downloadLink && editionDiv) {
        if (releaseData.assets && releaseData.assets.length > 0) {
          const jarAsset = releaseData.assets.find(asset => asset.name.endsWith('.jar'));
          if (jarAsset) {
            downloadLink.href = jarAsset.browser_download_url;
            
            // Update version information
            let versionInfo = editionDiv.querySelector('.version-info');
            if (!versionInfo) {
              versionInfo = document.createElement('div');
              versionInfo.className = 'version-info';
              editionDiv.insertBefore(versionInfo, editionDiv.querySelector('.button-container'));
            }
            versionInfo.textContent = `Latest Stable Version: ${releaseData.tag_name}`;
            versionInfo.style.display = 'block';
            
            // Add dev build links
            let devBuilds = editionDiv.querySelector('.dev-builds');
            if (!devBuilds) {
              devBuilds = document.createElement('div');
              devBuilds.className = 'dev-builds';
              editionDiv.insertBefore(devBuilds, editionDiv.querySelector('.button-container'));
            }
            
            // Find latest pre-release and nightly
            const preRelease = allReleases.find(release => release.prerelease);
            const nightly = allReleases.find(release => release.tag_name.toLowerCase().includes('nightly'));
            
            const preReleaseLink = preRelease?.assets?.find(asset => asset.name.endsWith('.jar'))?.browser_download_url;
            const nightlyLink = nightly?.assets?.find(asset => asset.name.endsWith('.jar'))?.browser_download_url;
            
            devBuilds.innerHTML = `
              ${preReleaseLink ? `<a href="${preReleaseLink}">Download latest Dev Build</a>` : ''}
              ${preReleaseLink && nightlyLink ? '<span>|</span>' : ''}
              ${nightlyLink ? `<a href="${nightlyLink}">Download latest Nightly Build</a>` : ''}
            `;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching Minicraft+ releases:', error);
      // Fallback to hardcoded link if API fails
      const downloadLink = document.querySelector('[data-edition="plus"]');
      if (downloadLink) {
        downloadLink.href = 'https://github.com/MinicraftPlus/minicraft-plus-revived/releases/download/v2.3.0-dev1/minicraft-plus-2.3.0-dev1.jar';
      }
    }
    
    // Add click handlers to newly added dev build links
    document.querySelectorAll('.dev-builds a').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        showThankYouAndDownload(button.href);
      });
    });
  };

  // Check for new release when page loads
  updateMinicraftPlusLink();

  // Check for new release every 5 minutes
  setInterval(updateMinicraftPlusLink, 300000);

  // RGB mode functionality
  let rgbInterval;

  function startRGBAnimation() {
    let hue = 0;
    rgbInterval = setInterval(() => {
      hue = (hue + 5) % 360; // Faster color change
      document.documentElement.style.setProperty('--rgb-primary', `hsl(${hue}, 100%, 50%)`);
      document.documentElement.style.setProperty('--rgb-secondary', `hsl(${(hue + 120) % 360}, 100%, 50%)`);
      document.documentElement.style.setProperty('--rgb-accent', `hsl(${(hue + 240) % 360}, 100%, 50%)`);
    }, 16);
  }

  function stopRGBAnimation() {
    clearInterval(rgbInterval);
    document.documentElement.style.removeProperty('--rgb-primary');
    document.documentElement.style.removeProperty('--rgb-secondary');
    document.documentElement.style.removeProperty('--rgb-accent');
  }

  // Add easter egg sound elements
  const nyaSound = document.createElement('audio');
  nyaSound.src = 'https://www.myinstants.com/media/sounds/nya_2xyALFL.mp3';
  document.body.appendChild(nyaSound);

  const vineBoomSound = document.createElement('audio');
  vineBoomSound.src = 'https://www.myinstants.com/media/sounds/vine-boom-bass-boost-sound-effect.mp3';
  document.body.appendChild(vineBoomSound);

  // Add uwu and 69 detection
  let typedKeys = '';
  let timeout;
  let uwuMode = false;

  function resetTypingBuffer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      typedKeys = '';
    }, 1000);
  }

  function enableUwuMode() {
    uwuMode = true;
    nyaSound.currentTime = 0;
    nyaSound.play();
    
    // Change all green colors to pink shades
    document.documentElement.style.setProperty('--primary-color', '#FF69B4');  // Hot pink
    document.documentElement.style.setProperty('--secondary-color', '#FF1493'); // Deep pink
    document.documentElement.style.setProperty('--accent-color', '#FFB6C1');   // Light pink
    document.documentElement.style.setProperty('--background-color', '#FFF0F5'); // Lavender blush
    document.documentElement.style.setProperty('--gradient-start', '#FFE4E1'); // Misty rose
    document.documentElement.style.setProperty('--gradient-end', '#FFC0CB');   // Pink
    
    // If in dark mode, use brighter pinks
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      document.documentElement.style.setProperty('--primary-color', '#FF69B4');
      document.documentElement.style.setProperty('--secondary-color', '#FF1493');
      document.documentElement.style.setProperty('--accent-color', '#FF00FF');
      document.documentElement.style.setProperty('--background-color', '#4B0082');
      document.documentElement.style.setProperty('--gradient-start', '#800080');
      document.documentElement.style.setProperty('--gradient-end', '#8B008B');
    }
    
    // Change all buttons and UI elements
    document.querySelectorAll('.edition-button, .download-button, .discord-button, button').forEach(button => {
      button.style.background = '#FF69B4';
      button.style.borderColor = '#FF1493';
    });
  }

  document.addEventListener('keypress', (e) => {
    typedKeys += e.key.toLowerCase();
    
    if (typedKeys.includes('uwu') && !uwuMode) {
      enableUwuMode();
      typedKeys = '';
    }
    
    if (typedKeys.includes('69')) {
      vineBoomSound.currentTime = 0;
      vineBoomSound.play();
      
      // Add a quick screen shake effect
      document.body.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 500);
      
      typedKeys = '';
    }
    
    resetTypingBuffer();
  });

  // Add shake animation to CSS dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  `;
  document.head.appendChild(style);

  // Debounce helper function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});
