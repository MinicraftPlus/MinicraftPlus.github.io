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

  // Optimized popup handling with filename detection
  function showThankYouAndDownload(downloadUrl) {
    const filename = downloadUrl.split('/').pop();
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.style.display = 'flex';

    let installationGuideHTML = `
      <div class="tips">
        <h3>Installation Guide:</h3>
        <ul>
          <li>On Windows: Double click the .jar file to run (if Java is installed)</li>
          <li>On Mac/Linux: Open Terminal and type: java -jar ${filename}</li>
          <li><a href="https://www.java.com/download/" target="_blank">Download Java Runtime</a> if needed</li>
        </ul>
      </div>
    `;

    if (downloadUrl.includes('minicraft.zip')) {
      installationGuideHTML = ''; // Don't include installation guide for original version
    }

    popup.innerHTML = `
      <div class="popup-content">
        <h2>Thank You!</h2>
        <p>Your download of ${filename} should begin automatically.</p>
        ${installationGuideHTML}
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

    // Trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.click();
  }

  // Improved GitHub API handling with caching
  async function updateMinicraftLinks() {
    try {
      const cache = localStorage.getItem('minicraftPlusData');
      const cacheTime = localStorage.getItem('minicraftPlusDataTime');

      // Use cache if less than 5 minutes old
      if (cache && cacheTime && (Date.now() - parseInt(cacheTime)) < 300000) {
        updateUIWithData(JSON.parse(cache));
        return;
      }

      const response = await fetch('https://api.github.com/repos/MinicraftPlus/minicraft-plus-revived/releases');
      const data = await response.json();

      // Cache the data
      localStorage.setItem('minicraftPlusData', JSON.stringify(data));
      localStorage.setItem('minicraftPlusDataTime', Date.now().toString());

      updateUIWithData(data);
    } catch (error) {
      console.error('Error fetching Minicraft+ releases:', error);
    }
  }

  function updateUIWithData(data) {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    // Find latest stable and dev versions
    const stableRelease = data.find(release => !release.prerelease);
    const devRelease = data.find(release => release.prerelease);

    // Update stable version link
    const downloadLink = document.querySelector('[data-edition="plus"]');
    if (downloadLink && stableRelease?.assets?.length > 0) {
      const jarAsset = stableRelease.assets.find(asset => asset.name.endsWith('.jar'));
      if (jarAsset) {
        downloadLink.href = jarAsset.browser_download_url;

        const editionDiv = downloadLink.closest('.edition');
        const versionInfo = editionDiv.querySelector('.version-info') || createVersionInfo(editionDiv);
        versionInfo.textContent = `Latest Version: ${stableRelease.tag_name}`;
        versionInfo.style.display = 'block';
      }

      // Add dev version info right after the version info
      if (devRelease) {
        const devBuildsDiv = document.querySelector('.dev-builds') || createDevBuildsDiv();
        const jarAsset = devRelease.assets.find(asset => asset.name.endsWith('.jar'));
        if (jarAsset) {
          devBuildsDiv.innerHTML = `
            <a href="${jarAsset.browser_download_url}">${devRelease.tag_name}</a>
            <span>|</span>
            <a href="https://github.com/MinicraftPlus/minicraft-plus-revived/releases" target="_blank">View All Releases</a>
          `;
        }
      }
    }

    // Add download handlers to all download buttons AFTER UI is updated
    document.querySelectorAll('.edition-button, .dev-builds a').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        showThankYouAndDownload(button.href);
      });
    });
  }

  function createVersionInfo(parent) {
    const versionInfo = document.createElement('div');
    versionInfo.className = 'version-info';
    parent.insertBefore(versionInfo, parent.querySelector('.button-container'));
    return versionInfo;
  }

  function createDevBuildsDiv() {
    const devBuildsDiv = document.createElement('div');
    devBuildsDiv.className = 'dev-builds';
    const versionInfo = document.querySelector('.version-info');
    versionInfo.parentNode.insertBefore(devBuildsDiv, versionInfo.nextSibling);
    return devBuildsDiv;
  }

  // Initial update
  updateMinicraftLinks();

  // Check for updates every 5 minutes
  setInterval(updateMinicraftLinks, 300000);
});
