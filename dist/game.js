/**
 * DRIVE MAD PRO — Game Controller & Canvas 2D Engine
 * Features:
 * - 50 Levels with progression & local storage records
 * - 3 Dynamic Procedural Music Tracks with adjacent-level rotation
 * - Full Web Audio SFX (win fanfare, crash explosion, brake screech, turbo boost, stunt chimes)
 * - Pro Visuals: Mechanical suspension springs, volumetric headlights, dual-color nitro flames, blinking duck driver
 * - Voxel 3D-depth terrain rendering with animated Turbo Boost and Bounce pads
 * - In-air rotation controls & 360-degree flip / stunt detection with live popups
 * - Live HUD speedometer (km/h) with boost glow indicator
 * - Ergonomic side-by-side on-screen Brake & Gas controls + keyboard controls
 */

class DriveMadGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.keys = { up: false, down: false, left: false, right: false, brake: false, forward: false, backward: false };
    this.state = 'MENU'; // 'MENU' | 'PLAYING' | 'CRASHED' | 'WIN' | 'PAUSED'

    this.currentLevelIndex = 0;
    this.physics = null;
    this.startTime = 0;
    this.elapsed = 0;

    // Camera & Screen Shake
    this.camX = 0;
    this.camY = 0;
    this.screenShake = 0;

    // Particles & Animations
    this.particles = [];
    this.confetti = [];
    this.clouds = [];
    this.flagWave = 0;
    this.boostAnim = 0;
    this._stuntToastTimer = null;
    this._lastBrakeSoundTime = 0;

    // Progress in LocalStorage
    this.progress = JSON.parse(localStorage.getItem('drivemad_progress_v2') || '{}');

    // Audio System
    this._musicStarted = false;
    this._musicMuted = localStorage.getItem('drivemad_muted') === 'true';
    this._currentSongIndex = -1;
    this._initAudio();

    this._initClouds();
    this._resize();
    this._bindInput();
    this._buildMenu();
    this._initAboutSwipeGesture();
    this._createMuteButton();
    this.toggleAboutModal(false);
    this._setScreen('screen-menu');

    window.addEventListener('resize', () => this._resize());

    this._lastTime = performance.now();
    requestAnimationFrame(t => this._loop(t));
  }

  _initClouds() {
    this.clouds = [];
    for (let i = 0; i < 18; i++) {
      this.clouds.push({
        x: (Math.random() * 200) - 40,
        y: 6 + Math.random() * 12,
        w: 4 + Math.random() * 6,
        h: 1.5 + Math.random() * 1.5,
        speed: 0.2 + Math.random() * 0.4
      });
    }
  }

  _resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // World unit scale: responsive for mobile and desktop
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      this.PPU = Math.min(window.innerWidth / 12, window.innerHeight / 7.5);
    } else {
      this.PPU = Math.min(window.innerWidth / 16, window.innerHeight / 9.5);
    }
  }

  _bindInput() {
    // Start music on first user interaction (browser policy requires user gesture)
    const startMusicOnce = () => {
      if (!this._musicStarted) {
        this._musicStarted = true;
        this._startMusic();
      }
    };
    ['click', 'touchstart', 'keydown', 'pointerdown'].forEach(evt => {
      window.addEventListener(evt, startMusicOnce, { once: false });
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.keys.right = true;
        this.keys.forward = true;
        document.getElementById('ctrl-right')?.classList.add('pressed');
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.keys.left = true;
        this.keys.backward = true;
        document.getElementById('ctrl-left')?.classList.add('pressed');
      }
      if (e.key === ' ' || e.key === 'b' || e.key === 'B' || e.key === 'Shift') {
        e.preventDefault();
        this.keys.brake = true;
        document.getElementById('ctrl-brake')?.classList.add('pressed');
      }
      if ((e.key === 'r' || e.key === 'R') && (this.state === 'PLAYING' || this.state === 'CRASHED' || this.state === 'PAUSED')) {
        this.restartLevel();
      }
      if (e.key === 'p' || e.key === 'P') {
        if (this.state === 'PLAYING' || this.state === 'PAUSED') {
          this.togglePause();
        }
      }
      if (e.key === 'Escape') {
        const modal = document.getElementById('modal-about');
        if (modal && !modal.classList.contains('hidden')) {
          this.toggleAboutModal(false);
          return;
        }
        if (this.state === 'PLAYING' || this.state === 'PAUSED') {
          this.togglePause();
        } else {
          this.goToMenu();
        }
      }
      if (e.key === 'm' || e.key === 'M') this.toggleMute();
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.keys.right = false;
        this.keys.forward = false;
        document.getElementById('ctrl-right')?.classList.remove('pressed');
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.keys.left = false;
        this.keys.backward = false;
        document.getElementById('ctrl-left')?.classList.remove('pressed');
      }
      if (e.key === ' ' || e.key === 'b' || e.key === 'B' || e.key === 'Shift') {
        this.keys.brake = false;
        document.getElementById('ctrl-brake')?.classList.remove('pressed');
      }
    });

    // Global fail-safe release on any pointer/touch release or blur
    ['pointerup', 'pointercancel', 'mouseup', 'touchend', 'blur'].forEach(evt => {
      window.addEventListener(evt, () => this._releaseAll());
    });
  }

  _ctrlPress(key) {
    if (navigator.vibrate) {
      try { navigator.vibrate(15); } catch(e) {}
    }
    if (key === 'right' || key === 'forward' || key === 'up') {
      this.keys.right = true;
      this.keys.forward = true;
      document.getElementById('ctrl-right')?.classList.add('pressed');
    } else if (key === 'left' || key === 'backward' || key === 'down') {
      this.keys.left = true;
      this.keys.backward = true;
      document.getElementById('ctrl-left')?.classList.add('pressed');
    } else if (key === 'brake') {
      this.keys.brake = true;
      document.getElementById('ctrl-brake')?.classList.add('pressed');
    }
  }

  _ctrlRelease(key) {
    if (key === 'right' || key === 'forward' || key === 'up') {
      this.keys.right = false;
      this.keys.forward = false;
      document.getElementById('ctrl-right')?.classList.remove('pressed');
    } else if (key === 'left' || key === 'backward' || key === 'down') {
      this.keys.left = false;
      this.keys.backward = false;
      document.getElementById('ctrl-left')?.classList.remove('pressed');
    } else if (key === 'brake') {
      this.keys.brake = false;
      document.getElementById('ctrl-brake')?.classList.remove('pressed');
    }
  }

  _releaseAll() {
    this.keys = { up: false, down: false, left: false, right: false, forward: false, backward: false, brake: false };
    document.getElementById('ctrl-left')?.classList.remove('pressed');
    document.getElementById('ctrl-right')?.classList.remove('pressed');
    document.getElementById('ctrl-brake')?.classList.remove('pressed');
  }

  _buildMenu() {
    const grid = document.getElementById('level-select');
    if (!grid) return;
    grid.innerHTML = '';

    // Check max unlocked level (default level 0 is unlocked)
    let maxUnlocked = 0;
    let completedCount = 0;
    LEVELS.forEach((_, i) => {
      if (this.progress[i] !== undefined) {
        maxUnlocked = Math.max(maxUnlocked, i + 1);
        completedCount++;
      }
    });
    maxUnlocked = Math.min(LEVELS.length - 1, maxUnlocked);
    this.currentMaxUnlocked = maxUnlocked;

    // Calculate progression stats
    const pct = Math.round((completedCount / LEVELS.length) * 100);
    const starsEarned = completedCount * 3;

    // Determine current campaign stage
    let currentStageIndex = 0;
    if (maxUnlocked >= 40) currentStageIndex = 4;
    else if (maxUnlocked >= 30) currentStageIndex = 3;
    else if (maxUnlocked >= 20) currentStageIndex = 2;
    else if (maxUnlocked >= 10) currentStageIndex = 1;

    const stageNames = [
      'Stage 1 • Rookie Ramps',
      'Stage 2 • Bridges & Gaps',
      'Stage 3 • Turbo Loops',
      'Stage 4 • Extreme Hazards',
      'Stage 5 • Mad Master'
    ];

    // Update Professional Career Dashboard Elements
    const stageNameEl = document.getElementById('career-stage-name');
    if (stageNameEl) stageNameEl.textContent = stageNames[currentStageIndex];

    const pctBadgeEl = document.getElementById('career-pct-badge');
    if (pctBadgeEl) pctBadgeEl.textContent = `${pct}% Complete`;

    const progBarEl = document.getElementById('career-progress-bar');
    if (progBarEl) progBarEl.style.width = `${Math.max(4, pct)}%`;

    const levelsValEl = document.getElementById('metric-levels-val');
    if (levelsValEl) levelsValEl.textContent = `${completedCount} / ${LEVELS.length}`;

    const starsValEl = document.getElementById('metric-stars-val');
    if (starsValEl) starsValEl.textContent = `${starsEarned} / 150`;

    const statusValEl = document.getElementById('metric-status-val');
    if (statusValEl) statusValEl.textContent = `Level ${maxUnlocked + 1}`;

    const heroName = document.getElementById('hero-level-name');
    if (heroName) {
      const currentLvl = LEVELS[maxUnlocked];
      if (currentLvl && currentLvl.name && !/^level\s*\d+$/i.test(currentLvl.name.trim())) {
        heroName.textContent = `Level ${maxUnlocked + 1}: ${currentLvl.name}`;
      } else {
        heroName.textContent = `Level ${maxUnlocked + 1}`;
      }
    }

    // Stages definitions
    const stages = [
      { name: 'Stage 1 • Rookie Ramps 🏁', start: 0, end: 9 },
      { name: 'Stage 2 • Bridges & Gaps ⚡', start: 10, end: 19 },
      { name: 'Stage 3 • Turbo Loops 🔥', start: 20, end: 29 },
      { name: 'Stage 4 • Extreme Hazards 🌪️', start: 30, end: 39 },
      { name: 'Stage 5 • Mad Master 👑', start: 40, end: 49 },
    ];

    stages.forEach(stage => {
      const section = document.createElement('div');
      section.className = 'stage-section';

      let stageCompleted = 0;
      for (let j = stage.start; j <= Math.min(stage.end, LEVELS.length - 1); j++) {
        if (this.progress[j] !== undefined) stageCompleted++;
      }
      const totalInStage = Math.min(stage.end, LEVELS.length - 1) - stage.start + 1;

      const header = document.createElement('div');
      header.className = 'stage-header';
      header.innerHTML = `
        <div class="stage-title">${stage.name}</div>
        <div class="stage-pill">${stageCompleted}/${totalInStage} ⭐</div>
      `;
      section.appendChild(header);

      const stageGrid = document.createElement('div');
      stageGrid.className = 'stage-grid';

      for (let i = stage.start; i <= Math.min(stage.end, LEVELS.length - 1); i++) {
        const lvl = LEVELS[i];
        const btn = document.createElement('div');
        const isLocked = i > maxUnlocked;
        const isCompleted = !!this.progress[i];
        const isCurrent = i === maxUnlocked && !isCompleted;

        btn.className = 'lvl-btn' + 
          (isLocked ? ' locked' : '') + 
          (isCompleted ? ' completed' : '') + 
          (isCurrent ? ' current' : '');
          
        btn.innerHTML = `
          <div class="num">${isLocked ? '🔒' : (i + 1)}</div>
          <div class="stars">${isCompleted ? '★★★' : (isLocked ? '' : '☆☆☆')}</div>
        `;
        btn.title = lvl.name;

        if (!isLocked) {
          btn.addEventListener('click', () => this.loadLevel(i));
        }
        stageGrid.appendChild(btn);
      }

      section.appendChild(stageGrid);
      grid.appendChild(section);
    });
  }

  jumpToStage(stageIndex) {
    const stageSections = document.querySelectorAll('.stage-section');
    if (stageSections && stageSections[stageIndex]) {
      stageSections[stageIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const pills = document.querySelectorAll('.stage-nav-tab');
    pills.forEach((p, idx) => {
      if (idx === stageIndex) p.classList.add('active');
      else p.classList.remove('active');
    });
  }

  scrollDownToLevels() {
    const anchor = document.getElementById('levels-anchor') || document.getElementById('level-select');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  playCurrentLevel() {
    const idx = (this.currentMaxUnlocked !== undefined) ? this.currentMaxUnlocked : 0;
    this.loadLevel(idx);
  }

  loadLevel(index) {
    this.currentLevelIndex = index;
    const lvl = LEVELS[index];

    this.toggleAboutModal(false);
    this._setScreen(null);

    document.getElementById('hud').style.display = 'flex';
    document.getElementById('progress-bar-wrap').style.display = 'block';
    document.getElementById('on-screen-controls').style.display = 'flex';
    document.getElementById('hud-level-name').textContent = lvl.name || `Level ${index + 1}`;
    this._updatePauseButton(false);

    this.physics = new PhysicsWorld(CAR_CONFIG);
    this.physics.loadLevel(lvl);
    this.physics.createCar(lvl.spawnX, lvl.spawnY);

    this.camX = lvl.spawnX;
    this.camY = lvl.spawnY + 1.5;
    this.screenShake = 0;

    this.currentLevel = lvl;
    this.theme = THEMES[lvl.theme] || THEMES.sky;
    this.state = 'PLAYING';
    this._releaseAll();
    this.startTime = performance.now();
    this.elapsed = 0;
    this.particles = [];
    this.confetti = [];

    const songPill = document.getElementById('hud-song-name');
    if (songPill) songPill.textContent = '🎵 Daru Badnaam (Kamal Kahlon)';

    this._startMusic();
    this._playRealTrack();
  }

  restartLevel() {
    this.loadLevel(this.currentLevelIndex);
  }

  goToMenu() {
    this.state = 'MENU';
    this._releaseAll();
    if (this._audioPlayer && !this._audioPlayer.paused) {
      this._audioPlayer.pause();
    }
    this.toggleAboutModal(false);
    document.getElementById('hud').style.display = 'none';
    document.getElementById('progress-bar-wrap').style.display = 'none';
    document.getElementById('on-screen-controls').style.display = 'none';
    this._buildMenu();
    this._setScreen('screen-menu');
  }

  _setScreen(id) {
    ['screen-menu', 'screen-crash', 'screen-win', 'screen-pause'].forEach(s => {
      const el = document.getElementById(s);
      if (!el) return;
      if (s === id) {
        el.classList.add('active');
        el.classList.remove('hidden');
        el.style.display = 'flex';
      } else {
        el.classList.remove('active');
        el.classList.add('hidden');
        if (s !== 'screen-menu') el.style.display = 'none';
      }
    });
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this._pauseStartTime = performance.now();
      this._releaseAll();
      document.getElementById('on-screen-controls').style.display = 'none';
      this._updatePauseButton(true);
      if (this._audioPlayer && !this._audioPlayer.paused) {
        this._audioPlayer.pause();
      }
      this._setScreen('screen-pause');
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      const pausedDuration = performance.now() - (this._pauseStartTime || performance.now());
      this.startTime += pausedDuration;
      this._lastTime = performance.now();
      document.getElementById('on-screen-controls').style.display = 'flex';
      this._updatePauseButton(false);
      if (this._audioPlayer && !this._musicMuted) {
        this._audioPlayer.play().catch(e => {});
      }
      this._setScreen(null);
    }
  }

  _updatePauseButton(isPaused) {
    const pauseBtn = document.getElementById('btn-pause-hud');
    if (!pauseBtn) return;
    const icon = isPaused ? '▶' : '⏸';
    const text = isPaused ? ' Resume' : ' Pause';
    pauseBtn.innerHTML = `<span>${icon}</span><span class="hud-btn-text">${text}</span>`;
  }

  toggleAboutModal(show) {
    const modal = document.getElementById('modal-about');
    if (!modal) return;
    const card = modal.querySelector('.about-modal-card');
    if (show) {
      modal.style.display = 'flex';
      modal.offsetHeight; // force layout calculation for CSS transition
      modal.classList.add('active');
      modal.classList.remove('hidden');
      if (card) {
        card.style.transform = '';
        card.classList.remove('closing');
      }
    } else {
      if (card && window.innerWidth <= 640) {
        card.classList.add('closing');
        setTimeout(() => {
          modal.classList.remove('active');
          modal.classList.add('hidden');
          modal.style.display = 'none';
          card.classList.remove('closing');
          card.style.transform = '';
        }, 220);
      } else {
        modal.classList.remove('active');
        modal.classList.add('hidden');
        modal.style.display = 'none';
        if (card) card.style.transform = '';
      }
    }
  }

  _initAboutSwipeGesture() {
    const card = document.querySelector('.about-modal-card');
    const modal = document.getElementById('modal-about');
    if (!card || !modal) return;

    let startY = 0;
    let isDragging = false;

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      const content = card.querySelector('.about-content');
      const isHeaderOrBar = e.target.closest('.modal-drag-bar, .about-header');
      const isScrolledToTop = content ? content.scrollTop <= 0 : true;

      if (isHeaderOrBar || isScrolledToTop) {
        startY = touch.clientY;
        isDragging = true;
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const deltaY = touch.clientY - startY;

      // Only allow dragging downward
      if (deltaY > 0) {
        card.style.transform = `translateY(${deltaY}px)`;
        if (e.cancelable) e.preventDefault();
      } else {
        card.style.transform = '';
      }
    };

    const onTouchEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const changedTouch = e.changedTouches ? e.changedTouches[0] : null;
      const deltaY = changedTouch ? (changedTouch.clientY - startY) : 0;

      if (deltaY > 75) {
        this.toggleAboutModal(false);
      } else {
        card.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = '';
        setTimeout(() => {
          card.style.transition = '';
        }, 240);
      }
    };

    card.addEventListener('touchstart', onTouchStart, { passive: false });
    card.addEventListener('touchmove', onTouchMove, { passive: false });
    card.addEventListener('touchend', onTouchEnd, { passive: true });
    card.addEventListener('touchcancel', onTouchEnd, { passive: true });
  }

  _showStuntToast(text) {
    const toast = document.getElementById('stunt-toast');
    if (!toast) return;
    toast.textContent = text;
    toast.style.display = 'block';
    toast.classList.add('show');
    if (this._stuntToastTimer) clearTimeout(this._stuntToastTimer);
    this._stuntToastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.style.display = 'none';
    }, 2200);
  }

  requestLandscape() {
    const docEl = document.documentElement;
    const reqFullscreen = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;

    const tryLockOrientation = () => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').then(() => {
          this._showStuntToast('Landscape Mode Activated! 🏎️');
        }).catch(() => {
          this._showStuntToast('Rotate device sideways for Landscape! 📱↪️');
        });
      } else {
        this._showStuntToast('Rotate device sideways for Landscape! 📱↪️');
      }
    };

    if (reqFullscreen && !document.fullscreenElement) {
      reqFullscreen.call(docEl).then(() => {
        tryLockOrientation();
      }).catch(() => {
        tryLockOrientation();
      });
    } else {
      tryLockOrientation();
    }
  }

  dismissLandscapeNotice() {
    const notice = document.getElementById('mobile-landscape-notice');
    if (notice) {
      notice.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      notice.style.opacity = '0';
      notice.style.transform = 'translateY(-12px) scale(0.95)';
      setTimeout(() => {
        notice.style.display = 'none';
      }, 300);
    }
  }

  _loop(ts) {
    const dt = Math.min((ts - this._lastTime) / 1000, 0.04);
    this._lastTime = ts;

    requestAnimationFrame(t => this._loop(t));

    if (this.state === 'PAUSED') {
      this._draw(0);
      return;
    }

    this.flagWave += dt * 5;
    this.boostAnim += dt * 8;

    if (this.state === 'PLAYING') {
      this._update(dt);
    }

    this._updateParticles(dt);
    this._draw(dt);
  }

  _update(dt) {
    const result = this.physics.step(dt, this.keys);
    const car = this.physics.car;

    this.elapsed = (performance.now() - this.startTime) / 1000;
    document.getElementById('hud-timer').textContent = `${this.elapsed.toFixed(2)}s`;

    // Speedometer calculation
    const speedKmh = Math.round(car.vel.len() * 3.6);
    const speedVal = document.getElementById('hud-speed-val');
    if (speedVal) speedVal.textContent = speedKmh;
    const speedPill = document.getElementById('hud-speed-pill');
    if (speedPill) {
      if (car.boostTime > 0 || speedKmh > 55) {
        speedPill.classList.add('boosted');
      } else {
        speedPill.classList.remove('boosted');
      }
    }

    // Stunt detection and floating banner
    if (car.lastStunt) {
      this._showStuntToast(car.lastStunt);
      this._playSFX('stunt');
      car.lastStunt = null;
    }

    // Landing screen shake
    if (car.landingImpact && car.landingImpact > 5.5) {
      this.screenShake = Math.min(0.9, car.landingImpact * 0.08);
      car.landingImpact = 0;
    }

    // Progress bar calculation
    const totalDist = this.currentLevel.finishX - this.currentLevel.spawnX;
    const currentDist = car.pos.x - this.currentLevel.spawnX;
    const prog = Math.max(0, Math.min(1, currentDist / totalDist));
    document.getElementById('progress-bar-fill').style.width = `${prog * 100}%`;

    // Camera follow with lookahead and dynamic mobile framing
    const isMobile = window.innerWidth < 768;
    const targetX = car.pos.x + Math.max(-1, Math.min(3.5, car.vel.x * 0.16));
    const targetY = car.pos.y + (isMobile ? 2.35 : 1.8);
    this.camX += (targetX - this.camX) * Math.min(1, dt * 6.5);
    this.camY += (targetY - this.camY) * Math.min(1, dt * 5);

    // Tire dust & acceleration exhaust smoke
    if (this.keys.forward && car.wheels.some(w => w.contact)) {
      const rearWheel = car.wheels[0].worldPos(car);
      if (Math.random() < 0.6) {
        this.particles.push({
          x: rearWheel.x - 0.25,
          y: rearWheel.y,
          vx: -2 - Math.random() * 2,
          vy: 0.5 + Math.random() * 1.5,
          life: 0.45,
          maxLife: 0.45,
          color: 'rgba(210, 210, 210, 0.6)',
          size: 0.2 + Math.random() * 0.2
        });
      }
    }

    // Brake sparks & heavy tire screech smoke
    if (this.keys.brake && car.wheels.some(w => w.contact) && car.vel.len() > 1.2) {
      const now = performance.now();
      if (now - this._lastBrakeSoundTime > 400) {
        this._playSFX('brake');
        this._lastBrakeSoundTime = now;
      }
      car.wheels.forEach(wheel => {
        if (wheel.contact) {
          const wPos = wheel.worldPos(car);
          // Friction sparks
          this.particles.push({
            x: wPos.x,
            y: wPos.y - 0.08,
            vx: (Math.random() - 0.5) * 4 - car.vel.x * 0.25,
            vy: 0.8 + Math.random() * 2.5,
            life: 0.25 + Math.random() * 0.2,
            maxLife: 0.45,
            color: ['#ff4444', '#ff8800', '#ffd700', '#ffffff'][Math.floor(Math.random() * 4)],
            size: 0.08 + Math.random() * 0.1
          });
          // Skid tire smoke
          if (Math.random() < 0.4) {
            this.particles.push({
              x: wPos.x - 0.1,
              y: wPos.y,
              vx: (Math.random() - 0.5) * 1.5,
              vy: 0.4 + Math.random() * 0.8,
              life: 0.5,
              maxLife: 0.5,
              color: 'rgba(180, 180, 180, 0.45)',
              size: 0.25 + Math.random() * 0.2
            });
          }
        }
      });
    }

    // Boost pad effects
    if (car.boostTime > 0) {
      if (Math.random() < 0.5) {
        this._playSFX('boost');
      }
      for (let i = 0; i < 2; i++) {
        this.particles.push({
          x: car.pos.x - 1.2 + (Math.random() - 0.5) * 0.4,
          y: car.pos.y - 0.2 + (Math.random() - 0.5) * 0.2,
          vx: -8 - Math.random() * 6,
          vy: (Math.random() - 0.5) * 3,
          life: 0.35,
          maxLife: 0.35,
          color: ['#00e5ff', '#3d5afe', '#ffea00', '#ffffff'][Math.floor(Math.random() * 4)],
          size: 0.18 + Math.random() * 0.2
        });
      }
    }

    // Bounce spring pad effects
    if (car.bounceTime > 0) {
      if (Math.random() < 0.4) {
        this._playSFX('bounce');
      }
      for (let i = 0; i < 2; i++) {
        this.particles.push({
          x: car.pos.x + (Math.random() - 0.5) * 1.0,
          y: car.pos.y - 0.5 + (Math.random() - 0.5) * 0.2,
          vx: (Math.random() - 0.5) * 4,
          vy: -3 - Math.random() * 4,
          life: 0.35,
          maxLife: 0.35,
          color: ['#ff9100', '#ffd600', '#ff6d00', '#ffffff'][Math.floor(Math.random() * 4)],
          size: 0.18 + Math.random() * 0.2
        });
      }
    }

    // Crash Check
    if (result && result.crashed) {
      this._onCrash();
      return;
    }

    // Win Check
    if (car.pos.x >= this.currentLevel.finishX) {
      this._onWin();
    }
  }

  _onCrash() {
    this.state = 'CRASHED';
    this.screenShake = 1.3;
    if (this._audioPlayer && !this._audioPlayer.paused) {
      this._audioPlayer.pause();
    }
    this._playSFX('crash');
    this._releaseAll();
    document.getElementById('hud').style.display = 'none';
    document.getElementById('progress-bar-wrap').style.display = 'none';
    document.getElementById('on-screen-controls').style.display = 'none';

    // Spawn rich crash debris & flame explosion
    const car = this.physics.car;
    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3 + Math.random() * 8;
      this.particles.push({
        x: car.pos.x + (Math.random() - 0.5) * 1.2,
        y: car.pos.y + (Math.random() - 0.5) * 0.8,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd + 2,
        life: 0.8 + Math.random() * 0.6,
        maxLife: 1.4,
        color: ['#ff3d00', '#ff9100', '#ffd600', '#263238', '#ffffff'][Math.floor(Math.random() * 5)],
        size: 0.16 + Math.random() * 0.3
      });
    }

    this._setScreen('screen-crash');
  }

  _onWin() {
    if (this.state === 'WIN') return;
    this.state = 'WIN';
    if (this._audioPlayer && !this._audioPlayer.paused) {
      this._audioPlayer.pause();
    }
    this._playSFX('win');
    this._releaseAll();

    const prevBest = this.progress[this.currentLevelIndex]?.time || Infinity;
    this.progress[this.currentLevelIndex] = {
      time: Math.min(prevBest, this.elapsed),
      completed: true
    };
    localStorage.setItem('drivemad_progress_v2', JSON.stringify(this.progress));

    document.getElementById('hud').style.display = 'none';
    document.getElementById('progress-bar-wrap').style.display = 'none';
    document.getElementById('on-screen-controls').style.display = 'none';
    document.getElementById('win-time-text').textContent = `Time: ${this.elapsed.toFixed(2)}s (Best: ${this.progress[this.currentLevelIndex].time.toFixed(2)}s)`;

    // Spawn win confetti fireworks
    for (let i = 0; i < 85; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 4 + Math.random() * 10;
      this.confetti.push({
        x: this.currentLevel.finishX,
        y: 4 + Math.random() * 3,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd + 4,
        life: 1.6 + Math.random() * 1.6,
        maxLife: 3.2,
        color: ['#ff1744', '#00e5ff', '#ffd600', '#00e676', '#d500f9', '#ff9100'][Math.floor(Math.random() * 6)],
        size: 0.22 + Math.random() * 0.25
      });
    }

    this._setScreen('screen-win');
  }

  _updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy -= 9.8 * dt; // gravity
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.life -= dt;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy -= 7 * dt;
      if (c.life <= 0) this.confetti.splice(i, 1);
    }
  }

  _draw(dt) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const PPU = this.PPU;

    const theme = (this.state !== 'MENU' && this.theme) ? this.theme : THEMES.night;

    // Background Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, theme.bg1);
    skyGrad.addColorStop(1, theme.bg2);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    if (this.state === 'MENU') {
      this._drawMenuDecor(ctx, W, H);
      return;
    }

    // Camera shake decay and calculation
    let shakeX = 0, shakeY = 0;
    if (this.screenShake > 0.005) {
      shakeX = (Math.random() - 0.5) * this.screenShake * 28;
      shakeY = (Math.random() - 0.5) * this.screenShake * 28;
      this.screenShake *= Math.pow(0.86, dt * 60);
    }

    const cx = W / 2 - this.camX * PPU + shakeX;
    const cy = H / 2 + this.camY * PPU + shakeY;

    const toScreen = (wx, wy) => ({
      x: cx + wx * PPU,
      y: cy - wy * PPU
    });

    ctx.save();

    // 1. Stars (for Night / Space themes)
    if (theme.stars) {
      this._drawStars(ctx, W, H);
    }

    // 2. Parallax Mountain / Hill Silhouettes
    this._drawParallaxScenery(ctx, W, H, cx, theme);

    // 3. Floating Clouds
    this._drawClouds(ctx, toScreen, PPU, theme);

    // 4. Track Segments with 3D Voxel Extrusion
    this._drawTrack(ctx, toScreen, this.currentLevel, PPU, theme);

    // 5. Boxes
    this._drawBoxes(ctx, toScreen, PPU);

    // 6. See-Saws
    this._drawSeeSaws(ctx, toScreen, PPU);

    // 7. Moving Platforms
    this._drawMovingPlatforms(ctx, toScreen, PPU);

    // 8. Spinner Obstacles
    this._drawSpinners(ctx, toScreen, PPU);

    // 9. Finish Line & Flag
    this._drawFinish(ctx, toScreen, this.currentLevel.finishX, PPU);

    // 10. Particles
    this._drawParticles(ctx, toScreen, PPU);

    // 11. Car with Suspensions, Headlight, and Nitro Exhaust
    if (this.physics && this.physics.car && this.state !== 'CRASHED') {
      this._drawCar(ctx, toScreen, PPU);
    }

    ctx.restore();

    // 12. Speed Lines FX when speeding fast
    if (this.physics && this.physics.car && this.physics.car.vel.len() > 11.5) {
      this._drawSpeedLines(ctx, W, H, this.physics.car.vel.len());
    }
  }

  _drawSpeedLines(ctx, W, H, speed) {
    const numLines = Math.min(18, Math.round(speed * 0.8));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 2;
    for (let i = 0; i < numLines; i++) {
      const y = (i * (H / numLines) + performance.now() * 0.5) % H;
      const len = 80 + (i % 5) * 30;
      const x = (i % 2 === 0) ? W - len - Math.random() * 40 : Math.random() * 40;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y);
      ctx.stroke();
    }
  }

  _drawMenuDecor(ctx, W, H) {
    const t = performance.now() * 0.0003;
    for (let i = 0; i < 50; i++) {
      const sx = (i * 123.4 + t * 40) % W;
      const sy = (i * 87.1) % H;
      const a = (Math.sin(t * 3 + i) * 0.5 + 0.5) * 0.6 + 0.2;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _drawStars(ctx, W, H) {
    for (let i = 0; i < 45; i++) {
      const sx = (i * 197.3) % W;
      const sy = (i * 113.7) % (H * 0.7);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(sx, sy, 2, 2);
    }
  }

  _drawParallaxScenery(ctx, W, H, cx, theme) {
    // Back Layer
    ctx.fillStyle = theme.h2;
    ctx.beginPath();
    ctx.moveTo(0, H);
    const step1 = 60;
    for (let x = 0; x <= W + step1; x += step1) {
      const wx = x - (cx * 0.15) % step1;
      const y = H * 0.55 + Math.sin((x + cx * 0.05) * 0.005) * 70;
      ctx.lineTo(wx, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    // Front Layer
    ctx.fillStyle = theme.h1;
    ctx.beginPath();
    ctx.moveTo(0, H);
    const step2 = 45;
    for (let x = 0; x <= W + step2; x += step2) {
      const wx = x - (cx * 0.35) % step2;
      const y = H * 0.68 + Math.sin((x + cx * 0.08) * 0.008) * 55;
      ctx.lineTo(wx, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
  }

  _drawClouds(ctx, toScreen, PPU, theme) {
    ctx.fillStyle = theme.cloud;
    this.clouds.forEach(cl => {
      const pos = toScreen(cl.x, cl.y);
      const w = cl.w * PPU;
      const h = cl.h * PPU;

      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
      ctx.ellipse(pos.x - w * 0.25, pos.y + h * 0.1, w * 0.3, h * 0.35, 0, 0, Math.PI * 2);
      ctx.ellipse(pos.x + w * 0.25, pos.y + h * 0.1, w * 0.35, h * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  _drawTrack(ctx, toScreen, lvl, PPU, theme) {
    const groundColor = theme.ground || '#5d4037';
    const sideDepth = PPU * 0.22; // 3D voxel extrusion depth

    (lvl.segments || []).forEach(seg => {
      if (seg.type === 'gap' || seg.type === 'see-saw' || seg.type === 'box' || seg.type === 'moving') return;

      if (seg.type === 'bridge') {
        const numPlanks = Math.max(4, Math.ceil(seg.w * 2));
        for (let i = 0; i < numPlanks; i++) {
          const t0 = i / numPlanks;
          const t1 = (i + 1) / numPlanks;
          const dip0 = Math.sin(t0 * Math.PI) * (seg.sag || 1.5);
          const dip1 = Math.sin(t1 * Math.PI) * (seg.sag || 1.5);
          const x0 = seg.x + t0 * seg.w, x1 = seg.x + t1 * seg.w;
          const y0 = seg.y - dip0, y1 = seg.y - dip1;
          const p0 = toScreen(x0, y0), p1 = toScreen(x1, y1);

          ctx.fillStyle = '#8d6e63';
          ctx.strokeStyle = '#4e342e';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p1.x, p1.y + PPU * 0.22);
          ctx.lineTo(p0.x, p0.y + PPU * 0.22);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Suspension Posts & Cables
        [0, 1].forEach(side => {
          const wx = seg.x + side * seg.w;
          const p0 = toScreen(wx, seg.y);
          const p1 = toScreen(wx, seg.y + 2.5);
          ctx.strokeStyle = '#3e2723';
          ctx.lineWidth = PPU * 0.15;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        });
        return;
      }

      // TURBO BOOST PAD / ACCELERATING RAMP
      if (seg.type === 'boost') {
        const rise = seg.rise || 0;
        const p0 = toScreen(seg.x, seg.y);
        const p1 = toScreen(seg.x + seg.w, seg.y + rise);
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        ctx.save();
        ctx.translate(p0.x, p0.y);
        ctx.rotate(angle);

        // Glowing base
        ctx.fillStyle = '#004d40';
        ctx.fillRect(0, 0, len, PPU * 0.4);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(0, 0, len, PPU * 0.4);

        // Animated neon chevrons
        const offset = (this.boostAnim * 22) % 24;
        ctx.fillStyle = '#00e5ff';
        for (let x = offset - 24; x < len; x += 24) {
          if (x >= 0 && x + 12 <= len) {
            ctx.beginPath();
            ctx.moveTo(x, 4);
            ctx.lineTo(x + 10, PPU * 0.2);
            ctx.lineTo(x, PPU * 0.4 - 4);
            ctx.lineTo(x + 5, PPU * 0.2);
            ctx.closePath();
            ctx.fill();
          }
        }
        ctx.restore();
        return;
      }

      // BOUNCE SPRING PAD
      if (seg.type === 'bounce') {
        const p0 = toScreen(seg.x, seg.y);
        const w = seg.w * PPU;
        ctx.fillStyle = '#ff6f00';
        ctx.fillRect(p0.x, p0.y, w, PPU * 0.35);
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 3;
        ctx.strokeRect(p0.x, p0.y, w, PPU * 0.35);

        // Coiled spring graphic
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const sx = p0.x + (i + 1) * (w / 5);
          ctx.moveTo(sx - 6, p0.y + PPU * 0.3);
          ctx.lineTo(sx + 6, p0.y + PPU * 0.08);
        }
        ctx.stroke();
        return;
      }

      let pts = [];
      if (seg.type === 'flat') {
        pts = [
          toScreen(seg.x, seg.y),
          toScreen(seg.x + seg.w, seg.y),
          toScreen(seg.x + seg.w, seg.y - 8),
          toScreen(seg.x, seg.y - 8),
        ];
      } else if (seg.type === 'ramp') {
        const y1 = seg.y + seg.rise;
        pts = [
          toScreen(seg.x, seg.y),
          toScreen(seg.x + seg.w, y1),
          toScreen(seg.x + seg.w, y1 - 8),
          toScreen(seg.x, seg.y - 8),
        ];
      } else if (seg.type === 'bump') {
        const h = seg.h || 0.6;
        pts = [
          toScreen(seg.x, seg.y),
          toScreen(seg.x + seg.w * 0.5, seg.y + h),
          toScreen(seg.x + seg.w, seg.y),
          toScreen(seg.x + seg.w, seg.y - 8),
          toScreen(seg.x, seg.y - 8),
        ];
      }

      if (pts.length < 3) return;

      // 3D Voxel Depth Bevel (Side / Shadow Extrusion)
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y + sideDepth);
      ctx.lineTo(pts[1].x, pts[1].y + sideDepth);
      ctx.lineTo(pts[2].x, pts[2].y);
      ctx.lineTo(pts[3].x, pts[3].y);
      ctx.closePath();
      ctx.fill();

      // Main Terrain Block
      ctx.fillStyle = groundColor;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.fill();

      // Top Asphalt Surface
      ctx.strokeStyle = '#263238';
      ctx.lineWidth = PPU * 0.24;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[1].x, pts[1].y);
      ctx.stroke();

      // Road Striping
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = PPU * 0.05;
      ctx.setLineDash([PPU * 0.45, PPU * 0.35]);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y + PPU * 0.04);
      ctx.lineTo(pts[1].x, pts[1].y + PPU * 0.04);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  _drawBoxes(ctx, toScreen, PPU) {
    if (!this.physics) return;
    this.physics.boxes.forEach(bx => {
      const tl = toScreen(bx.x, bx.y + bx.h);
      const w = bx.w * PPU;
      const h = bx.h * PPU;

      ctx.fillStyle = bx.color || '#e53935';
      ctx.fillRect(tl.x, tl.y, w, h);

      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(tl.x, tl.y, w, h);

      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tl.x + w, tl.y + h);
      ctx.moveTo(tl.x + w, tl.y);
      ctx.lineTo(tl.x, tl.y + h);
      ctx.stroke();
    });
  }

  _drawSeeSaws(ctx, toScreen, PPU) {
    if (!this.physics) return;
    this.physics.seeSaws.forEach(ss => {
      const { a, b } = ss.getSurface();
      const pa = toScreen(a.x, a.y);
      const pb = toScreen(b.x, b.y);
      const pp = toScreen(ss.pivot.x, ss.pivot.y);

      const thick = PPU * 0.22;
      const dx = pb.x - pa.x, dy = pb.y - pa.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len * thick, ny = dx / len * thick;

      ctx.fillStyle = '#ff9800';
      ctx.strokeStyle = '#e65100';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pa.x + nx, pa.y + ny);
      ctx.lineTo(pb.x + nx, pb.y + ny);
      ctx.lineTo(pb.x - nx, pb.y - ny);
      ctx.lineTo(pa.x - nx, pa.y - ny);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#424242';
      ctx.beginPath();
      ctx.moveTo(pp.x, pp.y);
      ctx.lineTo(pp.x - PPU * 0.45, pp.y + PPU * 0.85);
      ctx.lineTo(pp.x + PPU * 0.45, pp.y + PPU * 0.85);
      ctx.closePath();
      ctx.fill();
    });
  }

  _drawMovingPlatforms(ctx, toScreen, PPU) {
    if (!this.physics) return;
    this.physics.movingPlatforms.forEach(mp => {
      const s = mp.getSurface();
      const p0 = toScreen(s.a.x, s.a.y);
      const w = (s.b.x - s.a.x) * PPU;
      const h = PPU * 0.5;

      const railStart = toScreen(mp.baseX - mp.range, mp.y);
      const railEnd = toScreen(mp.baseX + mp.range + mp.w, mp.y);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(railStart.x, railStart.y + h * 0.5);
      ctx.lineTo(railEnd.x, railEnd.y + h * 0.5);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#0288d1';
      ctx.strokeStyle = '#01579b';
      ctx.lineWidth = 2;
      ctx.fillRect(p0.x, p0.y, w, h);
      ctx.strokeRect(p0.x, p0.y, w, h);

      ctx.fillStyle = '#ffd54f';
      for (let x = 4; x < w - 4; x += 14) {
        ctx.fillRect(p0.x + x, p0.y + 2, 6, h - 4);
      }
    });
  }

  _drawSpinners(ctx, toScreen, PPU) {
    if (!this.physics) return;
    this.physics.spinners.forEach(sp => {
      const p = toScreen(sp.pos.x, sp.pos.y);
      const r = sp.r * PPU;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(sp.angle);

      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 2);
        ctx.fillStyle = '#d32f2f';
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 2;
        ctx.fillRect(-PPU * 0.12, 0, PPU * 0.24, r);
        ctx.strokeRect(-PPU * 0.12, 0, PPU * 0.24, r);

        ctx.fillStyle = '#fff';
        ctx.fillRect(-PPU * 0.08, r * 0.4, PPU * 0.16, r * 0.2);
        ctx.restore();
      }

      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(0, 0, PPU * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  _drawFinish(ctx, toScreen, finishX, PPU) {
    let groundY = 2;
    if (this.currentLevel && this.currentLevel.segments) {
      for (const seg of this.currentLevel.segments) {
        if (seg.type === 'gap' || seg.type === 'see-saw' || seg.type === 'box' || seg.type === 'moving') continue;
        const segEnd = seg.x + (seg.w || 0);
        if (finishX >= seg.x && finishX <= segEnd) {
          if (seg.type === 'flat' || seg.type === 'boost' || seg.type === 'bounce') {
            groundY = seg.y;
          } else if (seg.type === 'ramp') {
            const t = (finishX - seg.x) / seg.w;
            groundY = seg.y + seg.rise * t;
          } else if (seg.type === 'bridge') {
            const t = (finishX - seg.x) / seg.w;
            const dip = Math.sin(t * Math.PI) * (seg.sag || 1.5);
            groundY = seg.y - dip;
          }
          break;
        }
      }
    }

    const base = toScreen(finishX, groundY);
    const top = toScreen(finishX, groundY + 4.5);

    // Neon Victory Arch Post
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = PPU * 0.12;
    ctx.beginPath();
    ctx.moveTo(base.x, base.y);
    ctx.lineTo(top.x, top.y);
    ctx.stroke();

    // Checkered Waving Flag
    const fw = PPU * 2.2;
    const fh = PPU * 1.4;
    const cols = 5;
    const rows = 3;
    const sw = fw / cols;
    const sh = fh / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wave = Math.sin(this.flagWave + c * 0.6) * 6;
        ctx.fillStyle = (r + c) % 2 === 0 ? '#fff' : '#111';
        ctx.fillRect(top.x + c * sw, top.y + r * sh + wave, sw + 0.5, sh + 0.5);
      }
    }
  }

  _drawParticles(ctx, toScreen, PPU) {
    this.particles.forEach(p => {
      const pos = toScreen(p.x, p.y);
      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size * PPU, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    this.confetti.forEach(c => {
      const pos = toScreen(c.x, c.y);
      const alpha = c.life / c.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = c.color;
      ctx.fillRect(pos.x, pos.y, c.size * PPU, c.size * PPU * 1.5);
      ctx.restore();
    });
  }

  _drawCar(ctx, toScreen, PPU) {
    const car = this.physics.car;
    const cfg = CAR_CONFIG;
    const cPos = toScreen(car.pos.x, car.pos.y);
    const ang = -car.angle;

    // ─── 1. Mechanical Suspension Springs (Drawn behind car body) ───
    car.wheels.forEach(wheel => {
      const wPos = wheel.worldPos(car);
      const ws = toScreen(wPos.x, wPos.y);

      // Chassis mount point
      const chLocal = new Vec2(wheel.localOffset.x, -cfg.bodyHeight * 0.25);
      const chWorld = car.pos.add(chLocal.rot(car.angle));
      const cs = toScreen(chWorld.x, chWorld.y);

      // Spring compression coils
      ctx.save();
      ctx.strokeStyle = '#e53935'; // Racing Red Coil
      ctx.lineWidth = Math.max(2, PPU * 0.08);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const dx = ws.x - cs.x;
      const dy = ws.y - cs.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / dist;
      const ny = dx / dist;

      // Chrome shock absorber center piston shaft
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = Math.max(3, PPU * 0.1);
      ctx.beginPath();
      ctx.moveTo(cs.x, cs.y);
      ctx.lineTo(ws.x, ws.y);
      ctx.stroke();

      // Zigzag spring coil
      ctx.strokeStyle = '#d32f2f';
      ctx.lineWidth = Math.max(2, PPU * 0.06);
      ctx.beginPath();
      const coils = 6;
      ctx.moveTo(cs.x, cs.y);
      for (let i = 1; i < coils; i++) {
        const t = i / coils;
        const side = (i % 2 === 0 ? 1 : -1) * PPU * 0.14;
        ctx.lineTo(cs.x + dx * t + nx * side, cs.y + dy * t + ny * side);
      }
      ctx.lineTo(ws.x, ws.y);
      ctx.stroke();
      ctx.restore();
    });

    // ─── 2. Car Body & Driver ───
    ctx.save();
    ctx.translate(cPos.x, cPos.y);
    ctx.rotate(ang);

    const bw = cfg.bodyWidth * PPU;
    const bh = cfg.bodyHeight * PPU;

    // Volumetric Headlight Cone (Front beam)
    const isDarkTheme = this.theme && (this.theme.stars || this.theme.bg1.includes('0d') || this.theme.bg1.includes('1a'));
    const hlGrad = ctx.createLinearGradient(bw * 0.5, 0, bw * 0.5 + PPU * 4.5, 0);
    hlGrad.addColorStop(0, 'rgba(255, 240, 180, 0.45)');
    hlGrad.addColorStop(0.7, 'rgba(255, 240, 180, 0.15)');
    hlGrad.addColorStop(1, 'rgba(255, 240, 180, 0)');
    ctx.fillStyle = hlGrad;
    ctx.beginPath();
    ctx.moveTo(bw * 0.5, -bh * 0.2);
    ctx.lineTo(bw * 0.5 + PPU * 4.5, -PPU * 1.5);
    ctx.lineTo(bw * 0.5 + PPU * 4.5, PPU * 1.5);
    ctx.lineTo(bw * 0.5, bh * 0.35);
    ctx.closePath();
    ctx.fill();

    // Body Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(0, bh * 0.5 + PPU * 0.1, bw * 0.55, PPU * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chrome Exhaust Pipe at Rear
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(-bw * 0.52, bh * 0.1, PPU * 0.25, PPU * 0.12);

    // Animated Nitro Flame when accelerating or boost active
    if (this.keys.forward || (this.physics.car && this.physics.car.boostTime > 0)) {
      const isMega = this.physics.car && this.physics.car.boostTime > 0;
      const fLen = (isMega ? 1.6 : 0.8) + Math.random() * 0.4;
      const fWidth = (isMega ? 0.35 : 0.2);

      // Outer Orange Fire
      ctx.fillStyle = '#ff6d00';
      ctx.beginPath();
      ctx.moveTo(-bw * 0.52, bh * 0.08);
      ctx.lineTo(-bw * 0.52 - PPU * fLen, bh * 0.16);
      ctx.lineTo(-bw * 0.52, bh * 0.24);
      ctx.closePath();
      ctx.fill();

      // Inner Blue/Cyan Core
      ctx.fillStyle = isMega ? '#00e5ff' : '#00b0ff';
      ctx.beginPath();
      ctx.moveTo(-bw * 0.52, bh * 0.11);
      ctx.lineTo(-bw * 0.52 - PPU * fLen * 0.6, bh * 0.16);
      ctx.lineTo(-bw * 0.52, bh * 0.21);
      ctx.closePath();
      ctx.fill();
    }

    // Brake Lights (glow intensely when braking)
    if (this.keys.brake) {
      const blGlow = 0.75 + Math.sin(performance.now() * 0.03) * 0.25;
      ctx.fillStyle = `rgba(255, 30, 30, ${blGlow})`;
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = PPU * 0.6;
      ctx.beginPath();
      ctx.arc(-bw / 2 - PPU * 0.05, 0, PPU * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-bw / 2 - PPU * 0.05, bh * 0.25, PPU * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Main Chassis
    ctx.fillStyle = cfg.bodyColor;
    this._roundRect(ctx, -bw / 2, -bh / 2, bw, bh, PPU * 0.16);
    ctx.fill();

    // Body Voxel Side Shading / Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    this._roundRect(ctx, -bw / 2 + PPU * 0.08, -bh / 2 + PPU * 0.05, bw * 0.85, bh * 0.35, PPU * 0.1);
    ctx.fill();

    // Cabin / Roof
    const rw = bw * 0.52, rh = bh * 0.75;
    const rx = -bw * 0.05;
    ctx.fillStyle = cfg.roofColor;
    this._roundRect(ctx, rx - rw / 2, -bh / 2 - rh + PPU * 0.05, rw, rh, PPU * 0.14);
    ctx.fill();

    // Windshield with Glint
    ctx.fillStyle = 'rgba(100, 200, 255, 0.65)';
    ctx.fillRect(rx + rw * 0.05, -bh / 2 - rh * 0.75 + PPU * 0.05, rw * 0.42, rh * 0.6);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(rx + rw * 0.1, -bh / 2 - rh * 0.7 + PPU * 0.05, rw * 0.1, rh * 0.45);

    // Duck / Driver Head with Inertia bob & Eye Blinking
    const hx = cfg.headOffset.x * PPU;
    const hy = -cfg.headOffset.y * PPU + Math.sin(performance.now() * 0.015) * 1.5;
    const hr = cfg.headRadius * PPU;

    // Yellow Helmet / Head
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(hx, hy, hr, 0, Math.PI * 2);
    ctx.fill();

    // Duck Beak
    ctx.fillStyle = '#ff6f00';
    ctx.beginPath();
    ctx.ellipse(hx + hr * 0.7, hy + hr * 0.2, hr * 0.5, hr * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye (Blinks every ~3.5 seconds)
    const isBlinking = (Math.floor(performance.now() * 0.001) % 4 === 0) && (Math.sin(performance.now() * 0.01) > 0.85);
    if (!isBlinking) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(hx + hr * 0.25, hy - hr * 0.15, hr * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(hx + hr * 0.32, hy - hr * 0.15, hr * 0.12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hx + hr * 0.12, hy - hr * 0.15);
      ctx.lineTo(hx + hr * 0.4, hy - hr * 0.15);
      ctx.stroke();
    }

    ctx.restore();

    // ─── 3. Wheels with Chunky Tires, Spokes & Calipers ───
    car.wheels.forEach(wheel => {
      const wPos = wheel.worldPos(car);
      const ws = toScreen(wPos.x, wPos.y);
      const wr = cfg.wheelRadius * PPU;

      ctx.save();
      ctx.translate(ws.x, ws.y);
      ctx.rotate(wheel.spin);

      // Chunky Off-Road Tire
      ctx.fillStyle = cfg.tireColor;
      ctx.beginPath();
      ctx.arc(0, 0, wr, 0, Math.PI * 2);
      ctx.fill();

      // Tire Treads
      ctx.fillStyle = '#111';
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.fillRect(Math.cos(a) * wr * 0.85 - 2, Math.sin(a) * wr * 0.85 - 2, 4, 4);
      }

      // Rim
      ctx.fillStyle = cfg.wheelColor;
      ctx.beginPath();
      ctx.arc(0, 0, wr * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Silver Spokes
      ctx.strokeStyle = '#bdbdbd';
      ctx.lineWidth = wr * 0.12;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * wr * 0.55, Math.sin(a) * wr * 0.55);
        ctx.stroke();
      }

      // Center Hub Cap
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.arc(0, 0, wr * 0.22, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  AUDIO SYSTEM — Web Audio Engine with Adjacent-Level Song Rotation & SFX
  // ═══════════════════════════════════════════════════════════════════════════

  _initAudio() {
    this._audioCtx = null;
    this._masterGain = null;
    this._musicBus = null;
    this._sfxBus = null;
    this._compressor = null;
    this._musicPlaying = false;
    this._musicTimeout = null;

    // Real audio player for user-provided actual song "Daru Badnaam"
    try {
      this._audioPlayer = new Audio(encodeURI('Daru Badnaam.mp3'));
      this._audioPlayer.loop = true;
      this._audioPlayer.preload = 'auto';
      this._audioPlayer.volume = this._musicMuted ? 0 : 0.75;
      this._audioPlayer.addEventListener('error', () => {
        if (this._audioPlayer.src.indexOf('daru-badnaam.mp3') === -1) {
          this._audioPlayer.src = 'daru-badnaam.mp3';
          this._audioPlayer.load();
        }
      });
    } catch(e) {
      console.warn('Audio player init warning:', e);
    }
  }

  _playRealTrack() {
    if (!this._audioPlayer) {
      try {
        this._audioPlayer = new Audio(encodeURI('Daru Badnaam.mp3'));
        this._audioPlayer.loop = true;
      } catch(e) {}
    }
    if (!this._audioPlayer) return;
    this._audioPlayer.volume = this._musicMuted ? 0 : 0.75;
    this._audioPlayer.muted = this._musicMuted;

    // The song must ONLY play when user is actively playing the game!
    if (this.state === 'PLAYING' && !this._musicMuted && this._audioPlayer.paused) {
      this._audioPlayer.play().catch(e => {
        // Will play upon next user tap/interaction
      });
    } else if (this.state !== 'PLAYING' && !this._audioPlayer.paused) {
      this._audioPlayer.pause();
    }
  }

  _startMusic() {
    this._musicStarted = true;
    this._playRealTrack();

    // Initialize Web Audio context strictly for sound effects (SFX)
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!this._audioCtx) {
        this._audioCtx = new AC();
      }
      const ctx = this._audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      if (!this._masterGain) {
        this._masterGain = ctx.createGain();
        this._masterGain.gain.value = this._musicMuted ? 0 : 0.4;
        this._masterGain.connect(ctx.destination);

        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -18;
        compressor.knee.value = 10;
        compressor.ratio.value = 4;
        compressor.connect(this._masterGain);
        this._compressor = compressor;

        // Dedicated SFX bus for sound effects
        this._sfxBus = ctx.createGain();
        this._sfxBus.gain.value = 0.55;
        this._sfxBus.connect(this._compressor);
      }
    } catch(e) {}
  }

  _playSFX(type) {
    if (!this._audioCtx || this._musicMuted) return;
    try {
      const ctx = this._audioCtx;
      const dest = this._sfxBus || this._compressor || ctx.destination;
      const t = ctx.currentTime;

      if (type === 'win') {
        // Triumphant victory arpeggio: C5 -> E5 -> G5 -> C6
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.1);
          gain.gain.setValueAtTime(0.18, t + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.35);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t + idx * 0.1);
          osc.stop(t + idx * 0.1 + 0.4);
        });
      } else if (type === 'crash') {
        // Explosion noise + pitch drop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(25, t + 0.4);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.5);
      } else if (type === 'brake') {
        // High tire screech chirp
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100 + Math.random() * 200, t);
        osc.frequency.linearRampToValueAtTime(800, t + 0.12);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.15);
      } else if (type === 'boost') {
        // Sci-fi rising whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.3);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.4);
      } else if (type === 'bounce') {
        // High bouncy spring boing
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(540, t + 0.22);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.3);
      } else if (type === 'stunt') {
        // High sparkle bell
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(1318.5, t + 0.08);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.45);
      }
    } catch(e) {}
  }

  toggleMute() {
    this._musicMuted = !this._musicMuted;
    localStorage.setItem('drivemad_muted', this._musicMuted);
    if (this._audioPlayer) {
      this._audioPlayer.muted = this._musicMuted;
      this._audioPlayer.volume = this._musicMuted ? 0 : 0.75;
      if (!this._musicMuted && this.state === 'PLAYING' && this._audioPlayer.paused) {
        this._audioPlayer.play().catch(e => {});
      }
    }
    if (this._masterGain && this._audioCtx) {
      this._masterGain.gain.linearRampToValueAtTime(
        this._musicMuted ? 0 : 0.35,
        this._audioCtx.currentTime + 0.1
      );
    }
    this._updateMuteButton();
  }

  _createMuteButton() {
    // Menu toggle music button removed as requested
  }

  _updateMuteButton() {
    const icon = this._musicMuted ? '🔇' : '🔊';
    const menuBtn = document.getElementById('btn-mute-menu');
    if (menuBtn) menuBtn.textContent = icon;
    const muteIcon = document.getElementById('btn-mute-icon');
    if (muteIcon) muteIcon.textContent = icon;
  }
}

function initDriveMad() {
  if (window.game) return;
  window.game = new DriveMadGame();

  document.getElementById('btn-crash-retry')?.addEventListener('click', () => window.game.restartLevel());
  document.getElementById('btn-crash-menu')?.addEventListener('click', () => window.game.goToMenu());
  document.getElementById('btn-win-next')?.addEventListener('click', () => {
    const next = (window.game.currentLevelIndex + 1) % LEVELS.length;
    window.game.loadLevel(next);
  });
  document.getElementById('btn-win-menu')?.addEventListener('click', () => window.game.goToMenu());
  document.getElementById('btn-about-menu')?.addEventListener('click', () => window.game.toggleAboutModal(true));
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initDriveMad);
} else {
  initDriveMad();
}
