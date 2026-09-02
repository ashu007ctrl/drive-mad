/**
 * DRIVE MAD — Game Controller & Canvas 2D Engine
 * Features:
 * - 50 Levels with progression & local storage records
 * - Parallax backgrounds & themes (sky, sunset, forest, desert, night, storm, candy, space)
 * - Rich particle effects (dust, exhaust smoke, crash debris, win confetti)
 * - Authentic Drive Mad style car & suspension animations
 * - Moving platforms, hazard spinners, see-saws, bridge mechanics
 * - Responsive mobile on-screen controls & keyboard input
 */

class DriveMadGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.keys = { up: false, down: false, left: false, right: false, brake: false };
    this.state = 'MENU'; // 'MENU' | 'PLAYING' | 'CRASHED' | 'WIN'

    this.currentLevelIndex = 0;
    this.physics = null;
    this.startTime = 0;
    this.elapsed = 0;

    // Camera
    this.camX = 0;
    this.camY = 0;

    // Particles & Animations
    this.particles = [];
    this.confetti = [];
    this.clouds = [];
    this.flagWave = 0;

    // Progress in LocalStorage
    this.progress = JSON.parse(localStorage.getItem('drivemad_progress_v2') || '{}');

    // Audio System
    this._musicStarted = false;
    this._musicMuted = localStorage.getItem('drivemad_muted') === 'true';
    this._initAudio();

    this._initClouds();
    this._resize();
    this._bindInput();
    this._buildMenu();
    this._createMuteButton();

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
    this.PPU = Math.min(window.innerWidth / 16, window.innerHeight / 9.5);
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
      if ((e.key === 'r' || e.key === 'R') && (this.state === 'PLAYING' || this.state === 'CRASHED' || this.state === 'PAUSED')) {
        this.restartLevel();
      }
      if (e.key === 'p' || e.key === 'P') {
        if (this.state === 'PLAYING' || this.state === 'PAUSED') {
          this.togglePause();
        }
      }
      if (e.key === 'Escape') {
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
    });

    // Global fail-safe release on any pointer/touch release or blur
    ['pointerup', 'pointercancel', 'mouseup', 'touchend', 'blur'].forEach(evt => {
      window.addEventListener(evt, () => this._releaseAll());
    });
  }

  _ctrlPress(key) {
    if (key === 'right' || key === 'forward' || key === 'up') {
      this.keys.right = true;
      this.keys.forward = true;
      document.getElementById('ctrl-right')?.classList.add('pressed');
    } else if (key === 'left' || key === 'backward' || key === 'down') {
      this.keys.left = true;
      this.keys.backward = true;
      document.getElementById('ctrl-left')?.classList.add('pressed');
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
    }
  }

  _releaseAll() {
    this.keys = { up: false, down: false, left: false, right: false, forward: false, backward: false, brake: false };
    document.getElementById('ctrl-left')?.classList.remove('pressed');
    document.getElementById('ctrl-right')?.classList.remove('pressed');
  }

  _buildMenu() {
    const grid = document.getElementById('level-select');
    grid.innerHTML = '';

    // Check max unlocked level (default level 0 is unlocked)
    let maxUnlocked = 0;
    LEVELS.forEach((_, i) => {
      if (this.progress[i] !== undefined) {
        maxUnlocked = Math.max(maxUnlocked, i + 1);
      }
    });
    maxUnlocked = Math.min(LEVELS.length - 1, maxUnlocked);

    LEVELS.forEach((lvl, i) => {
      const btn = document.createElement('div');
      const isLocked = i > maxUnlocked;
      const isCompleted = !!this.progress[i];

      btn.className = 'lvl-btn' + (isLocked ? ' locked' : '') + (isCompleted ? ' completed' : '');
      btn.innerHTML = `
        <div class="num">${isLocked ? '🔒' : (i + 1)}</div>
        <div class="stars">${isCompleted ? '★★★' : (isLocked ? '' : '☆☆☆')}</div>
      `;
      btn.title = lvl.name;

      if (!isLocked) {
        btn.addEventListener('click', () => this.loadLevel(i));
      }
      grid.appendChild(btn);
    });
  }

  loadLevel(index) {
    this.currentLevelIndex = index;
    const lvl = LEVELS[index];

    this._setScreen(null);

    document.getElementById('hud').style.display = 'flex';
    document.getElementById('progress-bar-wrap').style.display = 'block';
    document.getElementById('on-screen-controls').style.display = 'flex';
    document.getElementById('hud-level-name').textContent = lvl.name || `Level ${index + 1}`;
    const pauseBtn = document.getElementById('btn-pause-hud');
    if (pauseBtn) pauseBtn.textContent = '⏸ Pause';

    this.physics = new PhysicsWorld(CAR_CONFIG);
    this.physics.loadLevel(lvl);
    this.physics.createCar(lvl.spawnX, lvl.spawnY);

    this.camX = lvl.spawnX;
    this.camY = lvl.spawnY + 1.5;

    this.currentLevel = lvl;
    this.theme = THEMES[lvl.theme] || THEMES.sky;
    this.state = 'PLAYING';
    this._releaseAll();
    this.startTime = performance.now();
    this.elapsed = 0;
    this.particles = [];
    this.confetti = [];
  }

  restartLevel() {
    this.loadLevel(this.currentLevelIndex);
  }

  goToMenu() {
    this.state = 'MENU';
    this._releaseAll();
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
      const pauseBtn = document.getElementById('btn-pause-hud');
      if (pauseBtn) pauseBtn.textContent = '▶ Resume';
      this._setScreen('screen-pause');
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      const pausedDuration = performance.now() - (this._pauseStartTime || performance.now());
      this.startTime += pausedDuration;
      this._lastTime = performance.now();
      document.getElementById('on-screen-controls').style.display = 'flex';
      const pauseBtn = document.getElementById('btn-pause-hud');
      if (pauseBtn) pauseBtn.textContent = '⏸ Pause';
      this._setScreen(null);
    }
  }

  _loop(ts) {
    const dt = Math.min((ts - this._lastTime) / 1000, 0.04);
    this._lastTime = ts;

    requestAnimationFrame(t => this._loop(t));

    if (this.state === 'PAUSED') {
      this._draw();
      return;
    }

    this.flagWave += dt * 5;

    if (this.state === 'PLAYING') {
      this._update(dt);
    }

    this._updateParticles(dt);
    this._draw();
  }

  _update(dt) {
    const result = this.physics.step(dt, this.keys);
    const car = this.physics.car;

    this.elapsed = (performance.now() - this.startTime) / 1000;
    document.getElementById('hud-timer').textContent = `${this.elapsed.toFixed(2)}s`;

    // Progress bar calculation
    const totalDist = this.currentLevel.finishX - this.currentLevel.spawnX;
    const currentDist = car.pos.x - this.currentLevel.spawnX;
    const prog = Math.max(0, Math.min(1, currentDist / totalDist));
    document.getElementById('progress-bar-fill').style.width = `${prog * 100}%`;

    // Camera follow with lookahead
    const targetX = car.pos.x + Math.max(-1, Math.min(3, car.vel.x * 0.15));
    const targetY = car.pos.y + 1.8;
    this.camX += (targetX - this.camX) * Math.min(1, dt * 6.5);
    this.camY += (targetY - this.camY) * Math.min(1, dt * 5);

    // Tire dust & smoke particles
    if (this.keys.up && car.wheels.some(w => w.contact)) {
      const rearWheel = car.wheels[0].worldPos(car);
      if (Math.random() < 0.6) {
        this.particles.push({
          x: rearWheel.x - 0.2,
          y: rearWheel.y,
          vx: -1.5 - Math.random() * 2,
          vy: 0.5 + Math.random() * 1.5,
          life: 0.45,
          maxLife: 0.45,
          color: 'rgba(200, 200, 200, 0.5)',
          size: 0.2 + Math.random() * 0.2
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
    this._releaseAll();
    document.getElementById('hud').style.display = 'none';
    document.getElementById('progress-bar-wrap').style.display = 'none';
    document.getElementById('on-screen-controls').style.display = 'none';

    // Spawn crash explosion particles
    const car = this.physics.car;
    for (let i = 0; i < 35; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 6;
      this.particles.push({
        x: car.pos.x + (Math.random() - 0.5),
        y: car.pos.y + (Math.random() - 0.5),
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0.8 + Math.random() * 0.4,
        maxLife: 1.2,
        color: ['#ff6b35', '#ffd700', '#333', '#fff', '#e53935'][Math.floor(Math.random() * 5)],
        size: 0.15 + Math.random() * 0.25
      });
    }

    this._setScreen('screen-crash');
  }

  _onWin() {
    if (this.state === 'WIN') return;
    this.state = 'WIN';
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
    for (let i = 0; i < 70; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3 + Math.random() * 8;
      this.confetti.push({
        x: this.currentLevel.finishX,
        y: 4 + Math.random() * 3,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd + 3,
        life: 1.5 + Math.random() * 1.5,
        maxLife: 3,
        color: ['#ff3366', '#33ccff', '#ffcc00', '#33ff66', '#cc33ff'][Math.floor(Math.random() * 5)],
        size: 0.2 + Math.random() * 0.2
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

  _draw() {
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

    const cx = W / 2 - this.camX * PPU;
    const cy = H / 2 + this.camY * PPU;

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

    // 4. Track Segments
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

    // 11. Car
    if (this.physics && this.physics.car && this.state !== 'CRASHED') {
      this._drawCar(ctx, toScreen, PPU);
    }

    ctx.restore();
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
    for (let i = 0; i < 40; i++) {
      const sx = (i * 197.3) % W;
      const sy = (i * 113.7) % (H * 0.7);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
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

        // Suspension Posts & Ropes
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

      // Dirt block
      ctx.fillStyle = groundColor;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.fill();

      // Top Asphalt Surface
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = PPU * 0.22;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[1].x, pts[1].y);
      ctx.stroke();

      // Road Stripe
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = PPU * 0.05;
      ctx.setLineDash([PPU * 0.4, PPU * 0.3]);
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

      // Crate wood straps & border
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

      // Plank
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

      // Pivot Triangle
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
      const p1 = toScreen(s.b.x, s.b.y);
      const w = (s.b.x - s.a.x) * PPU;
      const h = PPU * 0.5;

      // Guide Rail
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

      // Metal Platform
      ctx.fillStyle = '#0288d1';
      ctx.strokeStyle = '#01579b';
      ctx.lineWidth = 2;
      ctx.fillRect(p0.x, p0.y, w, h);
      ctx.strokeRect(p0.x, p0.y, w, h);

      // Warning hazard stripes
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

      // 4 Blades / Arms
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 2);
        ctx.fillStyle = '#d32f2f';
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 2;
        ctx.fillRect(-PPU * 0.12, 0, PPU * 0.24, r);
        ctx.strokeRect(-PPU * 0.12, 0, PPU * 0.24, r);

        // Warning spikes / stripes
        ctx.fillStyle = '#fff';
        ctx.fillRect(-PPU * 0.08, r * 0.4, PPU * 0.16, r * 0.2);
        ctx.restore();
      }

      // Central Hub
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(0, 0, PPU * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  _drawFinish(ctx, toScreen, finishX, PPU) {
    // Find the ground Y at the finish position by checking segments
    let groundY = 2; // fallback
    if (this.currentLevel && this.currentLevel.segments) {
      for (const seg of this.currentLevel.segments) {
        if (seg.type === 'gap' || seg.type === 'see-saw' || seg.type === 'box' || seg.type === 'moving') continue;
        const segEnd = seg.x + (seg.w || 0);
        if (finishX >= seg.x && finishX <= segEnd) {
          if (seg.type === 'flat') {
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

    // Flagpole
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = PPU * 0.1;
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

    ctx.save();
    ctx.translate(cPos.x, cPos.y);
    ctx.rotate(ang);

    const bw = cfg.bodyWidth * PPU;
    const bh = cfg.bodyHeight * PPU;

    // Body Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, bh * 0.5 + PPU * 0.1, bw * 0.55, PPU * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main Chassis
    ctx.fillStyle = cfg.bodyColor;
    this._roundRect(ctx, -bw / 2, -bh / 2, bw, bh, PPU * 0.16);
    ctx.fill();

    // Body Gloss Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    this._roundRect(ctx, -bw / 2 + PPU * 0.08, -bh / 2 + PPU * 0.05, bw * 0.85, bh * 0.35, PPU * 0.1);
    ctx.fill();

    // Cabin / Roof
    const rw = bw * 0.52, rh = bh * 0.75;
    const rx = -bw * 0.05;
    ctx.fillStyle = cfg.roofColor;
    this._roundRect(ctx, rx - rw / 2, -bh / 2 - rh + PPU * 0.05, rw, rh, PPU * 0.14);
    ctx.fill();

    // Windshield
    ctx.fillStyle = 'rgba(100, 200, 255, 0.65)';
    ctx.fillRect(rx + rw * 0.05, -bh / 2 - rh * 0.75 + PPU * 0.05, rw * 0.42, rh * 0.6);

    // Duck / Driver Head with Inertia bob
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

    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(hx + hr * 0.25, hy - hr * 0.15, hr * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(hx + hr * 0.32, hy - hr * 0.15, hr * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Wheels with Suspensions & Spokes
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
      ctx.arc(0, 0, wr * 0.2, 0, Math.PI * 2);
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
  //  AUDIO SYSTEM — Procedural Background Music (Web Audio API)
  // ═══════════════════════════════════════════════════════════════════════════

  _initAudio() {
    this._audioCtx = null;
    this._masterGain = null;
    this._musicPlaying = false;
  }

  _startMusic() {
    if (this._musicPlaying) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this._audioCtx = new AC();
      const ctx = this._audioCtx;

      // Master gain
      this._masterGain = ctx.createGain();
      this._masterGain.gain.value = this._musicMuted ? 0 : 0.35;
      this._masterGain.connect(ctx.destination);

      // Compressor for cleaner mix
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -20;
      compressor.knee.value = 10;
      compressor.ratio.value = 4;
      compressor.connect(this._masterGain);

      this._compressor = compressor;
      this._musicPlaying = true;

      // Start the melody loop
      this._scheduleMusicLoop();
    } catch (e) {
      console.warn('Audio init failed:', e);
    }
  }

  _scheduleMusicLoop() {
    if (!this._audioCtx || !this._musicPlaying) return;
    const ctx = this._audioCtx;
    const dest = this._compressor;

    // Tempo and note duration
    const BPM = 140;
    const beatDur = 60 / BPM;
    const barDur = beatDur * 4;

    // Cheerful melody scale (C major pentatonic + extras for variety)
    const noteFreqs = {
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00,
      'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00,
      'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99,
    };

    // Fun upbeat melody pattern (4 bars loop) — Hill Climb Racing style
    const melodyPatterns = [
      // Pattern A - bouncy ascending
      ['C4','E4','G4','C5', 'B4','G4','E4','G4', 'A4','C5','E5','C5', 'G4','E4','D4','E4'],
      // Pattern B - playful descending
      ['E5','D5','C5','G4', 'A4','G4','E4','D4', 'C4','E4','G4','A4', 'G4','E4','C4','E4'],
      // Pattern C - rhythmic bounce
      ['G4','G4','A4','B4', 'C5','C5','B4','A4', 'G4','A4','G4','E4', 'D4','E4','G4','G4'],
      // Pattern D - triumphant
      ['C5','E5','D5','C5', 'G4','A4','G4','E4', 'C4','D4','E4','G4', 'A4','G4','E4','C4'],
    ];

    // Bass pattern (root notes, whole notes)
    const bassPatterns = [
      ['C3','C3','F3','G3'],
      ['A3','A3','F3','G3'],
      ['C3','E3','F3','G3'],
      ['C3','G3','F3','E3'],
    ];

    // Drum pattern per bar: [kick/snare timings within 4 beats]
    // Each entry: [timeInBeats, type] where type = 'kick' | 'snare' | 'hat'
    const drumPattern = [
      [0, 'kick'], [0.5, 'hat'], [1, 'snare'], [1.5, 'hat'],
      [2, 'kick'], [2.5, 'hat'], [3, 'snare'], [3.5, 'hat'],
    ];

    const totalBars = melodyPatterns.length * 4; // repeat each pattern
    const loopDuration = totalBars * barDur;
    const now = ctx.currentTime + 0.1;

    // Schedule melody, bass, and drums
    for (let bar = 0; bar < totalBars; bar++) {
      const patIdx = Math.floor(bar / 4) % melodyPatterns.length;
      const melody = melodyPatterns[patIdx];
      const bass = bassPatterns[patIdx];
      const barStart = now + bar * barDur;

      // Melody notes (16th notes per bar = 4 per beat)
      const noteDur = barDur / melody.length;
      melody.forEach((note, i) => {
        if (!noteFreqs[note]) return;
        this._playNote(ctx, dest, noteFreqs[note], barStart + i * noteDur, noteDur * 0.85, 'square', 0.08);
      });

      // Bass (whole notes per beat)
      bass.forEach((note, i) => {
        if (!noteFreqs[note]) return;
        this._playNote(ctx, dest, noteFreqs[note], barStart + i * beatDur, beatDur * 0.9, 'triangle', 0.12);
      });

      // Drums
      drumPattern.forEach(([beatOffset, type]) => {
        const t = barStart + beatOffset * beatDur;
        this._playDrum(ctx, dest, type, t);
      });
    }

    // Re-schedule when current loop is about to end
    const nextLoopTime = (loopDuration - 0.5) * 1000;
    this._musicTimeout = setTimeout(() => {
      if (this._musicPlaying) this._scheduleMusicLoop();
    }, Math.max(100, nextLoopTime));
  }

  _playNote(ctx, dest, freq, startTime, duration, waveType, volume) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, startTime);

    // Envelope: quick attack, sustain, release
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.setValueAtTime(volume, startTime + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  _playDrum(ctx, dest, type, time) {
    if (type === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(time);
      osc.stop(time + 0.2);
    } else if (type === 'snare') {
      // Noise burst for snare
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

      // Add tonal component
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);
      oscGain.gain.setValueAtTime(0.1, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

      source.connect(gain);
      gain.connect(dest);
      osc.connect(oscGain);
      oscGain.connect(dest);
      source.start(time);
      osc.start(time);
      osc.stop(time + 0.1);
    } else if (type === 'hat') {
      // Short noise for hi-hat
      const bufferSize = ctx.sampleRate * 0.03;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7000;
      gain.gain.setValueAtTime(0.06, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      source.start(time);
    }
  }

  toggleMute() {
    this._musicMuted = !this._musicMuted;
    localStorage.setItem('drivemad_muted', this._musicMuted);
    if (this._masterGain) {
      this._masterGain.gain.linearRampToValueAtTime(
        this._musicMuted ? 0 : 0.35,
        this._audioCtx.currentTime + 0.1
      );
    }
    this._updateMuteButton();
  }

  _createMuteButton() {
    // Menu mute button
    const menuBtn = document.createElement('div');
    menuBtn.id = 'btn-mute-menu';
    menuBtn.className = 'mute-btn';
    menuBtn.textContent = this._musicMuted ? '🔇' : '🔊';
    menuBtn.title = 'Toggle Music (M)';
    menuBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMute(); });
    document.getElementById('screen-menu').appendChild(menuBtn);
  }

  _updateMuteButton() {
    const icon = this._musicMuted ? '🔇' : '🔊';
    const menuBtn = document.getElementById('btn-mute-menu');
    if (menuBtn) menuBtn.textContent = icon;
    const hudBtn = document.getElementById('btn-mute-hud');
    if (hudBtn) hudBtn.innerHTML = `${icon} Music`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new DriveMadGame();

  document.getElementById('btn-crash-retry').onclick = () => game.restartLevel();
  document.getElementById('btn-crash-menu').onclick = () => game.goToMenu();
  document.getElementById('btn-win-next').onclick = () => {
    const next = (game.currentLevelIndex + 1) % LEVELS.length;
    game.loadLevel(next);
  };
  document.getElementById('btn-win-menu').onclick = () => game.goToMenu();
});
