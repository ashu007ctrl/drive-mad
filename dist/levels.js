/**
 * DRIVE MAD — Levels & Config
 * ═══════════════════════════════════════════════════════════
 * DESIGN: Hill Climb Racing / Drive Mad style
 *   - Continuous terrain, NO impossible gaps
 *   - Small gaps (max 3-4 units) only after a proper ramp
 *   - Rolling hills, bridges, bumps — all drivable
 *   - NO boxes (they block the road), NO see-saws (physics broken)
 *   - Gradually increasing difficulty, all levels winnable
 *
 * SEGMENT TYPES:
 *   flat    { x, y, w }                  Flat road
 *   ramp    { x, y, w, rise }            Slope (rise>0 up, rise<0 down)
 *   gap     { x, w }                     Small void (max 4 units)
 *   bridge  { x, y, w, sag }             Bendy bridge planks
 *   bump    { x, y, w, h }               Speed bump (drivable)
 *
 * OBSTACLE TYPES (in obstacles[]):
 *   spinner { x, y, r, speed }           Spinning hazard above track
 *
 * THEMES: sky | sunset | forest | desert | night | storm | candy | space
 */

const THEMES = {
  sky: { bg1: '#87CEEB', bg2: '#E0F7FA', h1: 'rgba(100,180,130,0.65)', h2: 'rgba(140,210,160,0.45)', ground: '#5d4037', cloud: 'rgba(255,255,255,0.85)', stars: false },
  sunset: { bg1: '#FF8C42', bg2: '#FFD180', h1: 'rgba(200,90,50,0.65)', h2: 'rgba(230,130,70,0.45)', ground: '#4e342e', cloud: 'rgba(255,220,200,0.8)', stars: false },
  forest: { bg1: '#3D9970', bg2: '#A8D5A2', h1: 'rgba(20,80,40,0.75)', h2: 'rgba(50,120,60,0.55)', ground: '#3e2723', cloud: 'rgba(255,255,255,0.75)', stars: false },
  desert: { bg1: '#FFD54F', bg2: '#FFF8E1', h1: 'rgba(200,140,60,0.55)', h2: 'rgba(235,190,100,0.4)', ground: '#bf360c', cloud: 'rgba(255,255,220,0.7)', stars: false },
  night: { bg1: '#1a1a2e', bg2: '#16213e', h1: 'rgba(15,40,90,0.85)', h2: 'rgba(25,60,120,0.65)', ground: '#212121', cloud: 'rgba(80,100,160,0.5)', stars: true },
  storm: { bg1: '#37474F', bg2: '#546E7A', h1: 'rgba(40,60,80,0.85)', h2: 'rgba(60,80,100,0.65)', ground: '#1a1a1a', cloud: 'rgba(100,120,140,0.6)', stars: false },
  candy: { bg1: '#F06292', bg2: '#FCE4EC', h1: 'rgba(180,60,120,0.65)', h2: 'rgba(230,120,170,0.45)', ground: '#880e4f', cloud: 'rgba(255,200,220,0.85)', stars: false },
  space: { bg1: '#0d0d2b', bg2: '#1a1a4e', h1: 'rgba(40,0,80,0.85)', h2: 'rgba(70,10,130,0.65)', ground: '#1a0033', cloud: 'rgba(100,60,180,0.4)', stars: true },
};

const LEVELS = [

  // ══ WORLD 1: Sky (1-10) — Gentle introduction ═══════════════════════════════

  // 1: The Long Canyon Expedition (Throttle Control, Moguls & Canyon Drop)
  {
    name: 'Level 1: Canyon Expedition', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 120, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'ramp', x: 10, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 16, y: 4.2, w: 5 },
      { type: 'ramp', x: 21, y: 4.2, w: 6, rise: -2.2 },
      { type: 'flat', x: 27, y: 2, w: 4 },
      { type: 'bump', x: 31, y: 2, w: 3.5, h: 0.50 },
      { type: 'flat', x: 34.5, y: 2, w: 3 },
      { type: 'bump', x: 37.5, y: 2, w: 3.5, h: 0.55 },
      { type: 'flat', x: 41, y: 2, w: 4 },
      { type: 'bridge', x: 45, y: 2, w: 16, sag: 1.3 },
      { type: 'flat', x: 61, y: 2, w: 5 },
      { type: 'ramp', x: 66, y: 2, w: 6, rise: 2.0 },
      { type: 'ramp', x: 72, y: 4.0, w: 5, rise: -1.6 },
      { type: 'ramp', x: 77, y: 2.4, w: 6, rise: 2.2 },
      { type: 'flat', x: 83, y: 4.6, w: 4 },
      { type: 'ramp', x: 87, y: 4.6, w: 7, rise: -2.6 },
      { type: 'flat', x: 94, y: 2, w: 4 },
      { type: 'ramp', x: 98, y: 2, w: 4, rise: 1.4 },
      { type: 'gap', x: 102, w: 2.2 },
      { type: 'ramp', x: 104.2, y: 3.2, w: 5, rise: -1.2 },
      { type: 'flat', x: 109.2, y: 2, w: 16 },
    ]
  },

  // 2: The Double See-Saw Ridge (Extended Mountain Balance Route)
  {
    name: 'Level 2: Ridge & See-Saws', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 122, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 5, rise: 1.8 },
      { type: 'flat', x: 13, y: 3.8, w: 4 },
      { type: 'ramp', x: 17, y: 3.8, w: 5, rise: 1.8 },
      { type: 'flat', x: 22, y: 5.6, w: 4 },
      { type: 'ramp', x: 26, y: 5.6, w: 7, rise: -3.2 },
      { type: 'flat', x: 33, y: 2.4, w: 3 },
      { type: 'gap', x: 36, w: 0.8 },
      { type: 'see-saw', x: 36.8, y: 2.4, w: 10 },
      { type: 'gap', x: 46.8, w: 0.8 },
      { type: 'flat', x: 47.6, y: 2.4, w: 5 },
      { type: 'bridge', x: 52.6, y: 2.4, w: 14, sag: 1.2 },
      { type: 'flat', x: 66.6, y: 2.4, w: 3 },
      { type: 'bump', x: 69.6, y: 2.4, w: 3.5, h: 0.50 },
      { type: 'flat', x: 73.1, y: 2.4, w: 3 },
      { type: 'ramp', x: 76.1, y: 2.4, w: 6, rise: 2.0 },
      { type: 'flat', x: 82.1, y: 4.4, w: 3 },
      { type: 'gap', x: 85.1, w: 0.8 },
      { type: 'see-saw', x: 85.9, y: 4.4, w: 10 },
      { type: 'gap', x: 95.9, w: 0.8 },
      { type: 'ramp', x: 96.7, y: 4.4, w: 6, rise: -2.4 },
      { type: 'flat', x: 102.7, y: 2, w: 4 },
      { type: 'bump', x: 106.7, y: 2, w: 3.5, h: 0.45 },
      { type: 'flat', x: 110.2, y: 2, w: 16 },
    ]
  },

  // 3: Turbo Canyon Odyssey (Long Stunt Route, Fixed Spinner Clearance)
  {
    name: 'Level 3: Turbo Odyssey', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 126, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'bump', x: 8, y: 2, w: 3, h: 0.45 },
      { type: 'flat', x: 11, y: 2, w: 3 },
      { type: 'bump', x: 14, y: 2, w: 3.5, h: 0.50 },
      { type: 'flat', x: 17.5, y: 2, w: 4 },
      { type: 'boost', x: 21.5, y: 2, w: 5, rise: 1.6, power: 22 },
      { type: 'gap', x: 26.5, w: 2.8 },
      { type: 'ramp', x: 29.3, y: 3.4, w: 6, rise: -1.4 },
      { type: 'flat', x: 35.3, y: 2, w: 5 },
      { type: 'bounce', x: 40.3, y: 2, w: 4, power: 10 },
      { type: 'flat', x: 44.3, y: 3.5, w: 8 },
      { type: 'ramp', x: 52.3, y: 3.5, w: 6, rise: -1.5 },
      { type: 'flat', x: 58.3, y: 2, w: 5 },
      { type: 'flat', x: 63.3, y: 2, w: 3 },
      { type: 'boost', x: 66.3, y: 2, w: 5, rise: 1.8, power: 24 },
      { type: 'gap', x: 71.3, w: 3.2 },
      { type: 'ramp', x: 74.5, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 80.5, y: 2, w: 6 },
      { type: 'flat', x: 86.5, y: 2, w: 16 },
      { type: 'bridge', x: 102.5, y: 2, w: 14, sag: 1.2 },
      { type: 'flat', x: 116.5, y: 2, w: 16 },
    ],
    obstacles: [
      { type: 'spinner', x: 94.5, y: 5.3, r: 1.0, speed: 1.8 }
    ]
  },

  // 4: The Great Moving Ferry & Canyon Moguls (Long Technical Course)
  {
    name: 'Level 4: Great Ferry Route', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 128, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'bump', x: 8, y: 2, w: 3.5, h: 0.52 },
      { type: 'flat', x: 11.5, y: 2, w: 2.5 },
      { type: 'bump', x: 14, y: 2, w: 3.5, h: 0.60 },
      { type: 'flat', x: 17.5, y: 2, w: 3 },
      { type: 'bump', x: 20.5, y: 2, w: 3.5, h: 0.48 },
      { type: 'flat', x: 24, y: 2, w: 4 },
      { type: 'ramp', x: 28, y: 2, w: 6, rise: 2.0 },
      { type: 'flat', x: 34, y: 4.0, w: 6 },
      { type: 'gap', x: 40, w: 14 },
      { type: 'moving', x: 42.3, y: 3.8, w: 9.2, range: 2.5, speed: 1.4 },
      { type: 'flat', x: 54, y: 3.8, w: 5 },
      { type: 'ramp', x: 59, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 65, y: 2, w: 4 },
      { type: 'bridge', x: 69, y: 2, w: 14, sag: 1.3 },
      { type: 'flat', x: 83, y: 2, w: 4 },
      { type: 'ramp', x: 87, y: 2, w: 5, rise: 1.6 },
      { type: 'bridge', x: 92, y: 3.6, w: 14, sag: 1.2 },
      { type: 'ramp', x: 106, y: 3.6, w: 5, rise: -1.6 },
      { type: 'flat', x: 111, y: 2, w: 3 },
      { type: 'bump', x: 114, y: 2, w: 3.5, h: 0.50 },
      { type: 'flat', x: 117.5, y: 2, w: 16 },
    ]
  },

  // 5: The Mega Gauntlet (Epic Long Finale, Fixed Spinner Clearance)
  {
    name: 'Level 5: Mega Gauntlet', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 132, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'bridge', x: 7, y: 2, w: 18, sag: 1.5 },
      { type: 'flat', x: 25, y: 2, w: 4 },
      { type: 'ramp', x: 29, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 35, y: 4.2, w: 4 },
      { type: 'gap', x: 39, w: 0.8 },
      { type: 'see-saw', x: 39.8, y: 4.2, w: 9 },
      { type: 'gap', x: 48.8, w: 0.8 },
      { type: 'flat', x: 49.6, y: 4.2, w: 4 },
      { type: 'ramp', x: 53.6, y: 4.2, w: 6, rise: -2.2 },
      { type: 'flat', x: 59.6, y: 2, w: 4 },
      { type: 'bump', x: 63.6, y: 2, w: 3.5, h: 0.52 },
      { type: 'flat', x: 67.1, y: 2, w: 3 },
      { type: 'bump', x: 70.1, y: 2, w: 3.5, h: 0.48 },
      { type: 'flat', x: 73.6, y: 2, w: 4 },
      { type: 'bridge', x: 77.6, y: 2, w: 15, sag: 1.3 },
      { type: 'flat', x: 92.6, y: 2, w: 14 },
      { type: 'boost', x: 106.6, y: 2, w: 5, rise: 1.6, power: 24 },
      { type: 'gap', x: 111.6, w: 2.8 },
      { type: 'ramp', x: 114.4, y: 3.4, w: 5, rise: -1.4 },
      { type: 'flat', x: 119.4, y: 2, w: 18 },
    ],
    obstacles: [
      { type: 'spinner', x: 95.5, y: 5.2, r: 1.0, speed: 1.8 }
    ]
  },

  // 6: The Mountain Abyss & Double Moving Ferries (Precision Timing & Technical Drops)
  {
    name: 'Level 6: Double Ferry Pass', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 148, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 6, rise: 2.5 },
      { type: 'flat', x: 14, y: 4.5, w: 4 },
      { type: 'bump', x: 18, y: 4.5, w: 3.5, h: 0.50 },
      { type: 'flat', x: 21.5, y: 4.5, w: 3.8 },
      { type: 'gap', x: 25.3, w: 13.2 },
      { type: 'moving', x: 27.6, y: 4.3, w: 8.4, range: 2.5, speed: 1.5 },
      { type: 'flat', x: 38.5, y: 4.3, w: 5 },
      { type: 'ramp', x: 43.5, y: 4.3, w: 6, rise: -2.3 },
      { type: 'flat', x: 49.5, y: 2, w: 4 },
      { type: 'bump', x: 53.5, y: 2, w: 3.5, h: 0.55 },
      { type: 'flat', x: 57, y: 2, w: 3 },
      { type: 'bump', x: 60, y: 2, w: 3.5, h: 0.60 },
      { type: 'flat', x: 63.5, y: 2, w: 4 },
      { type: 'bridge', x: 67.5, y: 2, w: 16, sag: 1.4 },
      { type: 'flat', x: 83.5, y: 2, w: 4 },
      { type: 'ramp', x: 87.5, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 93.5, y: 4.2, w: 4.8 },
      { type: 'gap', x: 98.3, w: 13.2 },
      { type: 'moving', x: 100.6, y: 4.0, w: 8.4, range: 2.5, speed: 1.6 },
      { type: 'flat', x: 111.5, y: 4.0, w: 4 },
      { type: 'ramp', x: 115.5, y: 4.0, w: 6, rise: -2.0 },
      { type: 'flat', x: 121.5, y: 2, w: 5 },
      { type: 'boost', x: 126.5, y: 2, w: 5, rise: 1.6, power: 24 },
      { type: 'gap', x: 131.5, w: 2.8 },
      { type: 'ramp', x: 134.3, y: 3.4, w: 5, rise: -1.4 },
      { type: 'flat', x: 139.3, y: 2, w: 16 },
    ]
  },

  // 7: Triple Bridge Cascade & High Mogul Ridge (Bouncy Suspension & Steep Drops)
  {
    name: 'Level 7: Triple Bridge Cascade', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 152, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'bridge', x: 8, y: 2, w: 16, sag: 1.4 },
      { type: 'flat', x: 24, y: 2, w: 3 },
      { type: 'ramp', x: 27, y: 2, w: 6, rise: 2.4 },
      { type: 'flat', x: 33, y: 4.4, w: 4 },
      { type: 'bump', x: 37, y: 4.4, w: 3.5, h: 0.55 },
      { type: 'bridge', x: 40.5, y: 4.4, w: 18, sag: 1.6 },
      { type: 'flat', x: 58.5, y: 4.4, w: 4 },
      { type: 'ramp', x: 62.5, y: 4.4, w: 7, rise: -2.4 },
      { type: 'flat', x: 69.5, y: 2, w: 3 },
      { type: 'bump', x: 72.5, y: 2, w: 3.5, h: 0.58 },
      { type: 'flat', x: 76, y: 2, w: 2.5 },
      { type: 'bump', x: 78.5, y: 2, w: 3.5, h: 0.65 },
      { type: 'flat', x: 82, y: 2, w: 4 },
      { type: 'bridge', x: 86, y: 2, w: 20, sag: 1.5 },
      { type: 'flat', x: 106, y: 2, w: 4 },
      { type: 'ramp', x: 110, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 116, y: 4.2, w: 5 },
      { type: 'ramp', x: 121, y: 4.2, w: 7, rise: -2.2 },
      { type: 'flat', x: 128, y: 2, w: 4 },
      { type: 'boost', x: 132, y: 2, w: 5, rise: 1.6, power: 24 },
      { type: 'gap', x: 137, w: 2.8 },
      { type: 'ramp', x: 139.8, y: 3.4, w: 5, rise: -1.4 },
      { type: 'flat', x: 144.8, y: 2, w: 16 },
    ]
  },

  // 8: The Triple See-Saw Gauntlet (Escalating High Altitude Balance)
  {
    name: 'Level 8: Triple See-Saw Ridge', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 158, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'ramp', x: 7, y: 2, w: 5, rise: 1.8 },
      { type: 'flat', x: 12, y: 3.8, w: 3 },
      { type: 'gap', x: 15, w: 0.8 },
      { type: 'see-saw', x: 15.8, y: 3.8, w: 10 },
      { type: 'gap', x: 25.8, w: 0.8 },
      { type: 'flat', x: 26.6, y: 3.8, w: 4 },
      { type: 'ramp', x: 30.6, y: 3.8, w: 6, rise: 2.0 },
      { type: 'flat', x: 36.6, y: 5.8, w: 3 },
      { type: 'gap', x: 39.6, w: 0.8 },
      { type: 'see-saw', x: 40.4, y: 5.8, w: 10 },
      { type: 'gap', x: 50.4, w: 0.8 },
      { type: 'flat', x: 51.2, y: 5.8, w: 4 },
      { type: 'ramp', x: 55.2, y: 5.8, w: 8, rise: -3.4 },
      { type: 'flat', x: 63.2, y: 2.4, w: 4 },
      { type: 'bump', x: 67.2, y: 2.4, w: 3.5, h: 0.52 },
      { type: 'flat', x: 70.7, y: 2.4, w: 3 },
      { type: 'bump', x: 73.7, y: 2.4, w: 3.5, h: 0.55 },
      { type: 'flat', x: 77.2, y: 2.4, w: 4 },
      { type: 'bridge', x: 81.2, y: 2.4, w: 16, sag: 1.3 },
      { type: 'flat', x: 97.2, y: 2.4, w: 3 },
      { type: 'ramp', x: 100.2, y: 2.4, w: 6, rise: 1.8 },
      { type: 'flat', x: 106.2, y: 4.2, w: 3 },
      { type: 'gap', x: 109.2, w: 0.8 },
      { type: 'see-saw', x: 110.0, y: 4.2, w: 10 },
      { type: 'gap', x: 120.0, w: 0.8 },
      { type: 'flat', x: 120.8, y: 4.2, w: 4 },
      { type: 'ramp', x: 124.8, y: 4.2, w: 6, rise: -2.2 },
      { type: 'flat', x: 130.8, y: 2, w: 4 },
      { type: 'bump', x: 134.8, y: 2, w: 3.5, h: 0.48 },
      { type: 'flat', x: 138.3, y: 2, w: 26 },
    ]
  },

  // 9: Twin Spinner Skyway & Leap of Faith (Speed, Bounce, Hazard Timing)
  {
    name: 'Level 9: Twin Spinner Skyway', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 162, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'bump', x: 8, y: 2, w: 3.5, h: 0.48 },
      { type: 'flat', x: 11.5, y: 2, w: 2.5 },
      { type: 'bump', x: 14, y: 2, w: 3.5, h: 0.52 },
      { type: 'flat', x: 17.5, y: 2, w: 4 },
      { type: 'boost', x: 21.5, y: 2, w: 5, rise: 1.6, power: 24 },
      { type: 'gap', x: 26.5, w: 3.0 },
      { type: 'ramp', x: 29.5, y: 3.4, w: 6, rise: -1.4 },
      { type: 'flat', x: 35.5, y: 2, w: 4 },
      { type: 'flat', x: 39.5, y: 2, w: 16 },
      { type: 'bounce', x: 55.5, y: 2, w: 4, power: 10 },
      { type: 'flat', x: 59.5, y: 3.6, w: 8 },
      { type: 'ramp', x: 67.5, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 73.5, y: 2, w: 4 },
      { type: 'bridge', x: 77.5, y: 2, w: 16, sag: 1.3 },
      { type: 'flat', x: 93.5, y: 2, w: 4 },
      { type: 'flat', x: 97.5, y: 2, w: 16 },
      { type: 'ramp', x: 113.5, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 119.5, y: 4.2, w: 4 },
      { type: 'ramp', x: 123.5, y: 4.2, w: 6, rise: -2.2 },
      { type: 'flat', x: 129.5, y: 2, w: 3 },
      { type: 'boost', x: 132.5, y: 2, w: 5, rise: 1.8, power: 25 },
      { type: 'gap', x: 137.5, w: 3.2 },
      { type: 'ramp', x: 140.7, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 146.7, y: 2, w: 22 },
    ],
    obstacles: [
      { type: 'spinner', x: 47.5, y: 5.3, r: 1.0, speed: 2.0 },
      { type: 'spinner', x: 105.5, y: 5.3, r: 1.0, speed: 2.2 }
    ]
  },

  // 10: The Colosseum of Chaos (World 1 Grand Climax)
  {
    name: 'Level 10: The Colosseum', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 170, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'bridge', x: 7, y: 2, w: 18, sag: 1.5 },
      { type: 'flat', x: 25, y: 2, w: 3 },
      { type: 'ramp', x: 28, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 34, y: 4.2, w: 5 },
      { type: 'gap', x: 39, w: 14 },
      { type: 'moving', x: 41.3, y: 4.0, w: 9.2, range: 2.5, speed: 1.5 },
      { type: 'flat', x: 53, y: 4.0, w: 4 },
      { type: 'ramp', x: 57, y: 4.0, w: 6, rise: -2.0 },
      { type: 'flat', x: 63, y: 2, w: 3 },
      { type: 'bump', x: 66, y: 2, w: 3.5, h: 0.55 },
      { type: 'flat', x: 69.5, y: 2, w: 2.5 },
      { type: 'bump', x: 72, y: 2, w: 3.5, h: 0.62 },
      { type: 'flat', x: 75.5, y: 2, w: 4 },
      { type: 'ramp', x: 79.5, y: 2, w: 6, rise: 2.4 },
      { type: 'flat', x: 85.5, y: 4.4, w: 3 },
      { type: 'gap', x: 88.5, w: 0.8 },
      { type: 'see-saw', x: 89.3, y: 4.4, w: 9 },
      { type: 'gap', x: 98.3, w: 0.8 },
      { type: 'flat', x: 99.1, y: 4.4, w: 4 },
      { type: 'ramp', x: 103.1, y: 4.4, w: 6, rise: -2.4 },
      { type: 'flat', x: 109.1, y: 2, w: 4 },
      { type: 'bridge', x: 113.1, y: 2, w: 16, sag: 1.3 },
      { type: 'flat', x: 129.1, y: 2, w: 16 },
      { type: 'boost', x: 145.1, y: 2, w: 5, rise: 1.6, power: 25 },
      { type: 'gap', x: 150.1, w: 3.0 },
      { type: 'ramp', x: 153.1, y: 3.4, w: 6, rise: -1.4 },
      { type: 'flat', x: 159.1, y: 2, w: 20 },
    ],
    obstacles: [
      { type: 'spinner', x: 137.1, y: 5.3, r: 1.0, speed: 2.0 }
    ]
  },

  // ══ WORLD 2: Sunset (11-20) — Bigger hills, longer bridges ══════════════════

  // 11: Sunset Mountain Expedition (Extreme Switchback Crests & Deep Crevasse Ferry)
  {
    name: 'Level 11: Sunset Expedition', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 185, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'ramp', x: 7, y: 2, w: 6, rise: 2.8 },
      { type: 'ramp', x: 13, y: 4.8, w: 5, rise: -2.8 },
      { type: 'ramp', x: 18, y: 2.0, w: 5, rise: 3.0 },
      { type: 'flat', x: 23, y: 5.0, w: 4 },
      { type: 'ramp', x: 27, y: 5.0, w: 6, rise: -2.6 },
      { type: 'flat', x: 33, y: 2.4, w: 5 },
      { type: 'gap', x: 38, w: 14 },
      { type: 'moving', x: 40.3, y: 2.4, w: 9.2, range: 2.5, speed: 1.5 },
      { type: 'flat', x: 52, y: 2.4, w: 4 },
      { type: 'bump', x: 56, y: 2.4, w: 3.5, h: 0.55 },
      { type: 'flat', x: 59.5, y: 2.4, w: 2.5 },
      { type: 'bump', x: 62, y: 2.4, w: 3.5, h: 0.65 },
      { type: 'flat', x: 65.5, y: 2.4, w: 3 },
      { type: 'bump', x: 68.5, y: 2.4, w: 3.5, h: 0.58 },
      { type: 'flat', x: 72, y: 2.4, w: 4 },
      { type: 'bridge', x: 76, y: 2.4, w: 22, sag: 1.6 },
      { type: 'flat', x: 98, y: 2.4, w: 4 },
      { type: 'ramp', x: 102, y: 2.4, w: 7, rise: 3.2 },
      { type: 'flat', x: 109, y: 5.6, w: 3 },
      { type: 'gap', x: 112, w: 0.8 },
      { type: 'see-saw', x: 112.8, y: 5.6, w: 10 },
      { type: 'gap', x: 122.8, w: 0.8 },
      { type: 'flat', x: 123.6, y: 5.6, w: 4 },
      { type: 'ramp', x: 127.6, y: 5.6, w: 8, rise: -3.6 },
      { type: 'flat', x: 135.6, y: 2, w: 4 },
      { type: 'bridge', x: 139.6, y: 2, w: 16, sag: 1.3 },
      { type: 'flat', x: 155.6, y: 2, w: 4 },
      { type: 'boost', x: 159.6, y: 2, w: 6, rise: 1.8, power: 25 },
      { type: 'gap', x: 165.6, w: 3.2 },
      { type: 'ramp', x: 168.8, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 174.8, y: 2, w: 20 },
    ]
  },

  // 12: The Great Sunset Viaducts (High Altitude Towers & Moving Links)
  {
    name: 'Level 12: Sunset Viaducts', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 190, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'ramp', x: 7, y: 2, w: 6, rise: 2.4 },
      { type: 'bridge', x: 13, y: 4.4, w: 20, sag: 1.5 },
      { type: 'flat', x: 33, y: 4.4, w: 4 },
      { type: 'ramp', x: 37, y: 4.4, w: 6, rise: 2.2 },
      { type: 'flat', x: 43, y: 6.6, w: 4 },
      { type: 'gap', x: 47, w: 0.8 },
      { type: 'see-saw', x: 47.8, y: 6.6, w: 10 },
      { type: 'gap', x: 57.8, w: 0.8 },
      { type: 'flat', x: 58.6, y: 6.6, w: 4 },
      { type: 'ramp', x: 62.6, y: 6.6, w: 7, rise: -2.6 },
      { type: 'flat', x: 69.6, y: 4.0, w: 4 },
      { type: 'ramp', x: 73.6, y: 4.0, w: 6, rise: -2.0 },
      { type: 'flat', x: 79.6, y: 2, w: 3 },
      { type: 'bump', x: 82.6, y: 2, w: 3.5, h: 0.55 },
      { type: 'flat', x: 86.1, y: 2, w: 2.5 },
      { type: 'bump', x: 88.6, y: 2, w: 3.5, h: 0.62 },
      { type: 'flat', x: 92.1, y: 2, w: 4 },
      { type: 'bridge', x: 96.1, y: 2, w: 22, sag: 1.6 },
      { type: 'flat', x: 118.1, y: 2, w: 16 },
      { type: 'ramp', x: 134.1, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 140.1, y: 4.2, w: 4.8 },
      { type: 'gap', x: 144.9, w: 13.2 },
      { type: 'moving', x: 147.2, y: 4.0, w: 8.4, range: 2.5, speed: 1.6 },
      { type: 'flat', x: 158.1, y: 4.0, w: 4 },
      { type: 'ramp', x: 162.1, y: 4.0, w: 6, rise: -2.0 },
      { type: 'boost', x: 168.1, y: 2, w: 6, rise: 1.6, power: 25 },
      { type: 'gap', x: 174.1, w: 2.8 },
      { type: 'ramp', x: 176.9, y: 3.4, w: 5, rise: -1.4 },
      { type: 'flat', x: 181.9, y: 2, w: 18 },
    ],
    obstacles: [
      { type: 'spinner', x: 126.1, y: 5.3, r: 1.0, speed: 2.2 }
    ]
  },

  // 13: The Mogul Mountains & Twin See-Saws (Severe Suspension & Pitch Control)
  {
    name: 'Level 13: Mogul Mountain Pass', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 195, segments: [
      { type: 'flat', x: 0, y: 2, w: 6 },
      { type: 'bump', x: 6, y: 2, w: 3.5, h: 0.52 },
      { type: 'flat', x: 9.5, y: 2, w: 2 },
      { type: 'bump', x: 11.5, y: 2, w: 3.5, h: 0.60 },
      { type: 'flat', x: 15, y: 2, w: 2 },
      { type: 'bump', x: 17, y: 2, w: 3.5, h: 0.65 },
      { type: 'flat', x: 20.5, y: 2, w: 4 },
      { type: 'ramp', x: 24.5, y: 2, w: 6, rise: 2.6 },
      { type: 'flat', x: 30.5, y: 4.6, w: 3 },
      { type: 'gap', x: 33.5, w: 0.8 },
      { type: 'see-saw', x: 34.3, y: 4.6, w: 10 },
      { type: 'gap', x: 44.3, w: 0.8 },
      { type: 'flat', x: 45.1, y: 4.6, w: 4 },
      { type: 'ramp', x: 49.1, y: 4.6, w: 6, rise: -2.4 },
      { type: 'flat', x: 55.1, y: 2.2, w: 4 },
      { type: 'bridge', x: 59.1, y: 2.2, w: 18, sag: 1.4 },
      { type: 'flat', x: 77.1, y: 2.2, w: 4 },
      { type: 'bounce', x: 81.1, y: 2.2, w: 4, power: 10 },
      { type: 'flat', x: 85.1, y: 3.8, w: 7 },
      { type: 'ramp', x: 92.1, y: 3.8, w: 5, rise: -1.6 },
      { type: 'flat', x: 97.1, y: 2.2, w: 4 },
      { type: 'ramp', x: 101.1, y: 2.2, w: 7, rise: 3.0 },
      { type: 'flat', x: 108.1, y: 5.2, w: 3 },
      { type: 'gap', x: 111.1, w: 0.8 },
      { type: 'see-saw', x: 111.9, y: 5.2, w: 10 },
      { type: 'gap', x: 121.9, w: 0.8 },
      { type: 'flat', x: 122.7, y: 5.2, w: 4 },
      { type: 'ramp', x: 126.7, y: 5.2, w: 8, rise: -3.2 },
      { type: 'flat', x: 134.7, y: 2, w: 3 },
      { type: 'bump', x: 137.7, y: 2, w: 3.5, h: 0.55 },
      { type: 'flat', x: 141.2, y: 2, w: 2.5 },
      { type: 'bump', x: 143.7, y: 2, w: 3.5, h: 0.58 },
      { type: 'flat', x: 147.2, y: 2, w: 3 },
      { type: 'bridge', x: 150.2, y: 2, w: 18, sag: 1.4 },
      { type: 'flat', x: 168.2, y: 2, w: 4 },
      { type: 'boost', x: 172.2, y: 2, w: 5, rise: 1.6, power: 24 },
      { type: 'gap', x: 177.2, w: 2.8 },
      { type: 'ramp', x: 180.0, y: 3.4, w: 5, rise: -1.4 },
      { type: 'flat', x: 185.0, y: 2, w: 20 },
    ]
  },

  // 14: The Canyon Skyway & Twin Hazards (Dual Hazards & High Speed Precision)
  {
    name: 'Level 14: Twin Hazard Skyway', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 200, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'bump', x: 7, y: 2, w: 3.5, h: 0.52 },
      { type: 'flat', x: 10.5, y: 2, w: 3 },
      { type: 'boost', x: 13.5, y: 2, w: 5, rise: 1.6, power: 24 },
      { type: 'gap', x: 18.5, w: 3.0 },
      { type: 'ramp', x: 21.5, y: 3.4, w: 6, rise: -1.4 },
      { type: 'flat', x: 27.5, y: 2, w: 4 },
      { type: 'flat', x: 31.5, y: 2, w: 16 },
      { type: 'ramp', x: 47.5, y: 2, w: 6, rise: 2.4 },
      { type: 'flat', x: 53.5, y: 4.4, w: 4.8 },
      { type: 'gap', x: 58.3, w: 14.2 },
      { type: 'moving', x: 61.3, y: 4.2, w: 8.0, range: 3.2, speed: 1.5 },
      { type: 'flat', x: 72.5, y: 4.2, w: 4 },
      { type: 'ramp', x: 76.5, y: 4.2, w: 6, rise: -2.2 },
      { type: 'flat', x: 82.5, y: 2, w: 4 },
      { type: 'bridge', x: 86.5, y: 2, w: 18, sag: 1.4 },
      { type: 'flat', x: 104.5, y: 2, w: 4 },
      { type: 'ramp', x: 108.5, y: 2, w: 5, rise: 1.8 },
      { type: 'bridge', x: 113.5, y: 3.8, w: 18, sag: 1.5 },
      { type: 'ramp', x: 131.5, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 137.5, y: 2, w: 16 },
      { type: 'bump', x: 153.5, y: 2, w: 3.5, h: 0.55 },
      { type: 'flat', x: 157, y: 2, w: 2.5 },
      { type: 'bump', x: 159.5, y: 2, w: 3.5, h: 0.60 },
      { type: 'flat', x: 163, y: 2, w: 4 },
      { type: 'boost', x: 167, y: 2, w: 6, rise: 1.8, power: 25 },
      { type: 'gap', x: 173, w: 3.2 },
      { type: 'ramp', x: 176.2, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 182.2, y: 2, w: 24 },
    ],
    obstacles: [
      { type: 'spinner', x: 39.5, y: 5.3, r: 1.0, speed: 2.0 },
      { type: 'spinner', x: 145.5, y: 5.3, r: 1.0, speed: 2.2 }
    ]
  },

  // 15: Sunset Roller Coaster Extreme (Masterpiece World 2 Climax)
  {
    name: 'Level 15: Sunset Roller Coaster', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 210, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'ramp', x: 7, y: 2, w: 6, rise: 2.8 },
      { type: 'ramp', x: 13, y: 4.8, w: 5, rise: -2.8 },
      { type: 'ramp', x: 18, y: 2, w: 6, rise: 3.2 },
      { type: 'ramp', x: 24, y: 5.2, w: 6, rise: -3.2 },
      { type: 'flat', x: 30, y: 2, w: 4 },
      { type: 'ramp', x: 34, y: 2, w: 6, rise: 2.4 },
      { type: 'flat', x: 40, y: 4.4, w: 3 },
      { type: 'gap', x: 43, w: 0.8 },
      { type: 'see-saw', x: 43.8, y: 4.4, w: 9 },
      { type: 'gap', x: 52.8, w: 0.8 },
      { type: 'flat', x: 53.6, y: 4.4, w: 4 },
      { type: 'ramp', x: 57.6, y: 4.4, w: 6, rise: -2.4 },
      { type: 'flat', x: 63.6, y: 2, w: 3 },
      { type: 'bridge', x: 66.6, y: 2, w: 20, sag: 1.6 },
      { type: 'flat', x: 86.6, y: 2, w: 16 },
      { type: 'ramp', x: 102.6, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 108.6, y: 4.2, w: 5 },
      { type: 'gap', x: 113.6, w: 14 },
      { type: 'moving', x: 115.9, y: 4.0, w: 9.2, range: 2.5, speed: 1.5 },
      { type: 'flat', x: 127.6, y: 4.0, w: 4 },
      { type: 'ramp', x: 131.6, y: 4.0, w: 6, rise: -2.0 },
      { type: 'flat', x: 137.6, y: 2, w: 3 },
      { type: 'bump', x: 140.6, y: 2, w: 3.5, h: 0.58 },
      { type: 'flat', x: 144.1, y: 2, w: 2.5 },
      { type: 'bump', x: 146.6, y: 2, w: 3.5, h: 0.65 },
      { type: 'flat', x: 150.1, y: 2, w: 16 },
      { type: 'bridge', x: 166.1, y: 2, w: 18, sag: 1.4 },
      { type: 'flat', x: 184.1, y: 2, w: 4 },
      { type: 'boost', x: 188.1, y: 2, w: 6, rise: 1.8, power: 26 },
      { type: 'gap', x: 194.1, w: 3.2 },
      { type: 'ramp', x: 197.3, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 203.3, y: 2, w: 20 },
    ],
    obstacles: [
      { type: 'spinner', x: 94.6, y: 5.3, r: 1.0, speed: 2.2 },
      { type: 'spinner', x: 158.1, y: 5.3, r: 1.0, speed: 2.2 }
    ]
  },

  // 16: The Devil's Switchbacks & Triple Mogul Trenches (Hairpin Turns & Bouncy Bridges)
  {
    name: "Level 16: Devil's Switchbacks", theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 215, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'ramp', x: 7, y: 2, w: 5, rise: 3.0 },
      { type: 'ramp', x: 12, y: 5.0, w: 5, rise: -3.0 },
      { type: 'ramp', x: 17, y: 2.0, w: 5, rise: 3.2 },
      { type: 'ramp', x: 22, y: 5.2, w: 6, rise: -2.8 },
      { type: 'flat', x: 28, y: 2.4, w: 4 },
      { type: 'bump', x: 32, y: 2.4, w: 3.5, h: 0.58 },
      { type: 'flat', x: 35.5, y: 2.4, w: 2.5 },
      { type: 'bump', x: 38, y: 2.4, w: 3.5, h: 0.65 },
      { type: 'flat', x: 41.5, y: 2.4, w: 3.5 },
      { type: 'bridge', x: 45, y: 2.4, w: 20, sag: 1.5 },
      { type: 'flat', x: 65, y: 2.4, w: 5 },
      { type: 'gap', x: 70, w: 14 },
      { type: 'moving', x: 72.3, y: 2.4, w: 9.2, range: 2.5, speed: 1.5 },
      { type: 'flat', x: 84, y: 2.4, w: 4 },
      { type: 'ramp', x: 88, y: 2.4, w: 6, rise: 2.8 },
      { type: 'flat', x: 94, y: 5.2, w: 3 },
      { type: 'gap', x: 97, w: 0.8 },
      { type: 'see-saw', x: 97.8, y: 5.2, w: 10 },
      { type: 'gap', x: 107.8, w: 0.8 },
      { type: 'flat', x: 108.6, y: 5.2, w: 4 },
      { type: 'ramp', x: 112.6, y: 5.2, w: 8, rise: -3.2 },
      { type: 'flat', x: 120.6, y: 2, w: 3 },
      { type: 'bump', x: 123.6, y: 2, w: 3.5, h: 0.55 },
      { type: 'flat', x: 127.1, y: 2, w: 2.5 },
      { type: 'bump', x: 129.6, y: 2, w: 3.5, h: 0.62 },
      { type: 'flat', x: 133.1, y: 2, w: 16 },
      { type: 'bridge', x: 149.1, y: 2, w: 22, sag: 1.6 },
      { type: 'flat', x: 171.1, y: 2, w: 4 },
      { type: 'ramp', x: 175.1, y: 2, w: 6, rise: 2.6 },
      { type: 'flat', x: 181.1, y: 4.6, w: 4 },
      { type: 'ramp', x: 185.1, y: 4.6, w: 6, rise: -2.6 },
      { type: 'flat', x: 191.1, y: 2, w: 3 },
      { type: 'boost', x: 194.1, y: 2, w: 6, rise: 1.8, power: 26 },
      { type: 'gap', x: 200.1, w: 3.2 },
      { type: 'ramp', x: 203.3, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 209.3, y: 2, w: 18 },
    ],
    obstacles: [
      { type: 'spinner', x: 141.1, y: 5.3, r: 1.0, speed: 2.0 }
    ]
  },

  // 17: The Razor's Edge Mountain Pass (High Altitude Multi-Tier Peaks)
  {
    name: "Level 17: Razor's Edge Pass", theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 225, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'ramp', x: 7, y: 2, w: 6, rise: 3.0 },
      { type: 'ramp', x: 13, y: 5.0, w: 5, rise: -2.6 },
      { type: 'flat', x: 18, y: 2.4, w: 3 },
      { type: 'gap', x: 21, w: 0.8 },
      { type: 'see-saw', x: 21.8, y: 2.4, w: 10 },
      { type: 'gap', x: 31.8, w: 0.8 },
      { type: 'flat', x: 32.6, y: 2.4, w: 4 },
      { type: 'bridge', x: 36.6, y: 2.4, w: 20, sag: 1.5 },
      { type: 'flat', x: 56.6, y: 2.4, w: 3 },
      { type: 'bump', x: 59.6, y: 2.4, w: 3.5, h: 0.58 },
      { type: 'flat', x: 63.1, y: 2.4, w: 2 },
      { type: 'bump', x: 65.1, y: 2.4, w: 3.5, h: 0.65 },
      { type: 'flat', x: 68.6, y: 2.4, w: 3 },
      { type: 'ramp', x: 71.6, y: 2.4, w: 7, rise: 3.6 },
      { type: 'flat', x: 78.6, y: 6.0, w: 3 },
      { type: 'gap', x: 81.6, w: 0.8 },
      { type: 'see-saw', x: 82.4, y: 6.0, w: 10 },
      { type: 'gap', x: 92.4, w: 0.8 },
      { type: 'flat', x: 93.2, y: 6.0, w: 4 },
      { type: 'ramp', x: 97.2, y: 6.0, w: 6, rise: -2.2 },
      { type: 'flat', x: 103.2, y: 3.8, w: 4 },
      { type: 'ramp', x: 107.2, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 113.2, y: 2, w: 4 },
      { type: 'bridge', x: 117.2, y: 2, w: 22, sag: 1.6 },
      { type: 'flat', x: 139.2, y: 2, w: 16 },
      { type: 'bounce', x: 155.2, y: 2, w: 4, power: 10 },
      { type: 'flat', x: 159.2, y: 3.6, w: 6 },
      { type: 'gap', x: 165.2, w: 14 },
      { type: 'moving', x: 167.5, y: 3.4, w: 9.2, range: 2.5, speed: 1.6 },
      { type: 'flat', x: 179.2, y: 3.4, w: 4 },
      { type: 'ramp', x: 183.2, y: 3.4, w: 6, rise: -1.4 },
      { type: 'bridge', x: 189.2, y: 2, w: 16, sag: 1.3 },
      { type: 'flat', x: 205.2, y: 2, w: 4 },
      { type: 'boost', x: 209.2, y: 2, w: 5, rise: 1.6, power: 25 },
      { type: 'gap', x: 214.2, w: 2.8 },
      { type: 'ramp', x: 217.0, y: 3.4, w: 5, rise: -1.4 },
      { type: 'flat', x: 222.0, y: 2, w: 16 },
    ],
    obstacles: [
      { type: 'spinner', x: 147.2, y: 5.3, r: 1.0, speed: 2.2 }
    ]
  },

  // 18: The Triple Switchback & Dual Spinner Gauntlet (Extreme Pitch & Hazards)
  {
    name: 'Level 18: Triple S-Turn Skyway', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 235, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'ramp', x: 7, y: 2, w: 5, rise: 3.0 },
      { type: 'ramp', x: 12, y: 5.0, w: 5, rise: -3.0 },
      { type: 'ramp', x: 17, y: 2, w: 6, rise: 3.2 },
      { type: 'ramp', x: 23, y: 5.2, w: 6, rise: -3.2 },
      { type: 'ramp', x: 29, y: 2, w: 6, rise: 2.8 },
      { type: 'ramp', x: 35, y: 4.8, w: 6, rise: -2.8 },
      { type: 'flat', x: 41, y: 2, w: 4 },
      { type: 'flat', x: 45, y: 2, w: 16 },
      { type: 'bridge', x: 61, y: 2, w: 20, sag: 1.5 },
      { type: 'flat', x: 81, y: 2, w: 4 },
      { type: 'ramp', x: 85, y: 2, w: 6, rise: 2.6 },
      { type: 'flat', x: 91, y: 4.6, w: 3 },
      { type: 'gap', x: 94, w: 0.8 },
      { type: 'see-saw', x: 94.8, y: 4.6, w: 10 },
      { type: 'gap', x: 104.8, w: 0.8 },
      { type: 'flat', x: 105.6, y: 4.6, w: 4 },
      { type: 'ramp', x: 109.6, y: 4.6, w: 6, rise: -2.2 },
      { type: 'flat', x: 115.6, y: 2.4, w: 5 },
      { type: 'gap', x: 120.6, w: 14 },
      { type: 'moving', x: 123.2, y: 2.4, w: 8.6, range: 2.8, speed: 1.5 },
      { type: 'flat', x: 134.6, y: 2.4, w: 4 },
      { type: 'bump', x: 138.6, y: 2.4, w: 3.5, h: 0.58 },
      { type: 'flat', x: 142.1, y: 2.4, w: 2.5 },
      { type: 'bump', x: 144.6, y: 2.4, w: 3.5, h: 0.65 },
      { type: 'flat', x: 148.1, y: 2.4, w: 3 },
      { type: 'ramp', x: 151.1, y: 2.4, w: 5, rise: -0.4 },
      { type: 'flat', x: 156.1, y: 2, w: 16 },
      { type: 'bridge', x: 172.1, y: 2, w: 22, sag: 1.6 },
      { type: 'flat', x: 194.1, y: 2, w: 4 },
      { type: 'ramp', x: 198.1, y: 2, w: 6, rise: 2.4 },
      { type: 'flat', x: 204.1, y: 4.4, w: 4 },
      { type: 'ramp', x: 208.1, y: 4.4, w: 6, rise: -2.4 },
      { type: 'flat', x: 214.1, y: 2, w: 3 },
      { type: 'boost', x: 217.1, y: 2, w: 6, rise: 1.8, power: 26 },
      { type: 'gap', x: 223.1, w: 3.2 },
      { type: 'ramp', x: 226.3, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 232.3, y: 2, w: 20 },
    ],
    obstacles: [
      { type: 'spinner', x: 53, y: 5.3, r: 1.0, speed: 2.0 },
      { type: 'spinner', x: 164.1, y: 5.3, r: 1.0, speed: 2.2 }
    ]
  },

  // 19: The Quadruple Bridge & Dual See-Saw Colossus (Massive Suspended System)
  {
    name: 'Level 19: Quad Bridge Colossus', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 242, segments: [
      { type: 'flat', x: 0, y: 2, w: 6 },
      { type: 'bridge', x: 6, y: 2, w: 18, sag: 1.4 },
      { type: 'flat', x: 24, y: 2, w: 3 },
      { type: 'ramp', x: 27, y: 2, w: 6, rise: 2.8 },
      { type: 'flat', x: 33, y: 4.8, w: 4 },
      { type: 'gap', x: 37, w: 0.8 },
      { type: 'see-saw', x: 37.8, y: 4.8, w: 10 },
      { type: 'gap', x: 47.8, w: 0.8 },
      { type: 'flat', x: 48.6, y: 4.8, w: 4 },
      { type: 'bridge', x: 52.6, y: 4.8, w: 20, sag: 1.5 },
      { type: 'flat', x: 72.6, y: 4.8, w: 4 },
      { type: 'ramp', x: 76.6, y: 4.8, w: 7, rise: -2.6 },
      { type: 'flat', x: 83.6, y: 2.2, w: 4 },
      { type: 'bump', x: 87.6, y: 2.2, w: 3.5, h: 0.58 },
      { type: 'flat', x: 91.1, y: 2.2, w: 2.5 },
      { type: 'bump', x: 93.6, y: 2.2, w: 3.5, h: 0.65 },
      { type: 'flat', x: 97.1, y: 2.2, w: 4 },
      { type: 'gap', x: 101.1, w: 14 },
      { type: 'moving', x: 103.4, y: 2.2, w: 9.2, range: 2.5, speed: 1.5 },
      { type: 'flat', x: 115.1, y: 2.2, w: 4 },
      { type: 'ramp', x: 119.1, y: 2.2, w: 7, rise: 3.2 },
      { type: 'flat', x: 126.1, y: 5.4, w: 3 },
      { type: 'gap', x: 129.1, w: 0.8 },
      { type: 'see-saw', x: 129.9, y: 5.4, w: 10 },
      { type: 'gap', x: 139.9, w: 0.8 },
      { type: 'flat', x: 140.7, y: 5.4, w: 4 },
      { type: 'ramp', x: 144.7, y: 5.4, w: 8, rise: -3.4 },
      { type: 'flat', x: 152.7, y: 2, w: 4 },
      { type: 'bridge', x: 156.7, y: 2, w: 22, sag: 1.6 },
      { type: 'flat', x: 178.7, y: 2, w: 16 },
      { type: 'bridge', x: 194.7, y: 2, w: 18, sag: 1.3 },
      { type: 'flat', x: 212.7, y: 2, w: 4 },
      { type: 'boost', x: 216.7, y: 2, w: 6, rise: 1.8, power: 25 },
      { type: 'gap', x: 222.7, w: 3.2 },
      { type: 'ramp', x: 225.9, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 231.9, y: 2, w: 20 },
    ],
    obstacles: [
      { type: 'spinner', x: 186.7, y: 5.3, r: 1.0, speed: 2.2 }
    ]
  },

  // 20: Grand Sunset Canyon Expedition (World 2 Ultimate Ultra-Long Climax)
  {
    name: 'Level 20: Canyon Finale', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 540, segments: [
      { type: 'flat', x: 0, y: 2, w: 7 },
      { type: 'bridge', x: 7, y: 2, w: 22, sag: 1.6 },
      { type: 'flat', x: 29, y: 2, w: 4 },
      { type: 'ramp', x: 33, y: 2, w: 6, rise: 3.0 },
      { type: 'flat', x: 39, y: 5.0, w: 3 },
      { type: 'gap', x: 42, w: 0.8 },
      { type: 'see-saw', x: 42.8, y: 5.0, w: 9 },
      { type: 'gap', x: 51.8, w: 0.8 },
      { type: 'flat', x: 52.6, y: 5.0, w: 4 },
      { type: 'ramp', x: 56.6, y: 5.0, w: 7, rise: -2.8 },
      { type: 'flat', x: 63.6, y: 2.2, w: 4 },
      { type: 'gap', x: 67.6, w: 14 },
      { type: 'moving', x: 70.0, y: 2.2, w: 8.1, range: 2.6, speed: 1.5 },
      { type: 'flat', x: 81.6, y: 2.2, w: 4 },
      { type: 'bump', x: 85.6, y: 2.2, w: 3.5, h: 0.58 },
      { type: 'flat', x: 89.1, y: 2.2, w: 2.5 },
      { type: 'bump', x: 91.6, y: 2.2, w: 3.5, h: 0.66 },
      { type: 'flat', x: 95.1, y: 2, w: 16 },
      { type: 'bridge', x: 111.1, y: 2, w: 20, sag: 1.5 },
      { type: 'flat', x: 131.1, y: 2, w: 4 },
      { type: 'ramp', x: 135.1, y: 2, w: 7, rise: 3.4 },
      { type: 'flat', x: 142.1, y: 5.4, w: 3 },
      { type: 'gap', x: 145.1, w: 0.8 },
      { type: 'see-saw', x: 145.9, y: 5.4, w: 10 },
      { type: 'gap', x: 155.9, w: 0.8 },
      { type: 'flat', x: 156.7, y: 5.4, w: 4 },
      { type: 'ramp', x: 160.7, y: 5.4, w: 8, rise: -3.4 },
      { type: 'flat', x: 168.7, y: 2, w: 4 },
      { type: 'ramp', x: 172.7, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 178.7, y: 4.2, w: 5 },
      { type: 'gap', x: 183.7, w: 14 },
      { type: 'moving', x: 186.0, y: 4.0, w: 9.2, range: 2.5, speed: 1.6 },
      { type: 'flat', x: 197.7, y: 4.0, w: 4 },
      { type: 'ramp', x: 201.7, y: 4.0, w: 6, rise: -2.0 },
      { type: 'flat', x: 207.7, y: 2, w: 16 },
      { type: 'bridge', x: 223.7, y: 2, w: 18, sag: 1.4 },
      { type: 'flat', x: 241.7, y: 2, w: 4 },
      { type: 'boost', x: 245.7, y: 2, w: 6, rise: 1.8, power: 26 },
      { type: 'gap', x: 251.7, w: 3.4 },
      { type: 'ramp', x: 255.1, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 261.1, y: 2, w: 4 },
      { type: 'ramp', x: 265.1, y: 2, w: 6, rise: 3.2 },
      { type: 'ramp', x: 271.1, y: 5.2, w: 5, rise: -3.2 },
      { type: 'flat', x: 276.1, y: 2, w: 3 },
      { type: 'ramp', x: 279.1, y: 2, w: 6, rise: 2.6 },
      { type: 'flat', x: 285.1, y: 4.6, w: 3 },
      { type: 'gap', x: 288.1, w: 0.8 },
      { type: 'see-saw', x: 288.9, y: 4.6, w: 10 },
      { type: 'gap', x: 298.9, w: 0.8 },
      { type: 'flat', x: 299.7, y: 4.6, w: 4 },
      { type: 'ramp', x: 303.7, y: 4.6, w: 6, rise: -2.6 },
      { type: 'flat', x: 309.7, y: 2, w: 3 },
      { type: 'bump', x: 312.7, y: 2, w: 3.5, h: 0.60 },
      { type: 'flat', x: 316.2, y: 2, w: 2.5 },
      { type: 'bump', x: 318.7, y: 2, w: 3.5, h: 0.68 },
      { type: 'flat', x: 322.2, y: 2, w: 16 },
      { type: 'bridge', x: 338.2, y: 2, w: 22, sag: 1.5 },
      { type: 'flat', x: 360.2, y: 2, w: 4 },
      { type: 'boost', x: 364.2, y: 2, w: 6, rise: 1.8, power: 26 },
      { type: 'gap', x: 370.2, w: 3.6 },
      { type: 'ramp', x: 373.8, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 379.8, y: 2, w: 6 },
      { type: 'ramp', x: 385.8, y: 2, w: 7, rise: 3.4 },
      { type: 'flat', x: 392.8, y: 5.4, w: 4 },
      { type: 'ramp', x: 396.8, y: 5.4, w: 7, rise: -3.4 },
      { type: 'flat', x: 403.8, y: 2, w: 4 },
      { type: 'gap', x: 407.8, w: 14 },
      { type: 'moving', x: 410.1, y: 2.0, w: 9.2, range: 2.5, speed: 1.6 },
      { type: 'flat', x: 421.8, y: 2, w: 4 },
      { type: 'bump', x: 425.8, y: 2, w: 3.5, h: 0.62 },
      { type: 'flat', x: 429.3, y: 2, w: 2.5 },
      { type: 'bump', x: 431.8, y: 2, w: 3.5, h: 0.70 },
      { type: 'flat', x: 435.3, y: 2, w: 16 },
      { type: 'ramp', x: 451.3, y: 2, w: 6, rise: 2.6 },
      { type: 'flat', x: 457.3, y: 4.6, w: 3 },
      { type: 'bridge', x: 460.3, y: 4.6, w: 22, sag: 1.6 },
      { type: 'flat', x: 482.3, y: 4.6, w: 3 },
      { type: 'gap', x: 485.3, w: 0.8 },
      { type: 'see-saw', x: 486.1, y: 4.6, w: 10 },
      { type: 'gap', x: 496.1, w: 0.8 },
      { type: 'flat', x: 496.9, y: 4.6, w: 4 },
      { type: 'ramp', x: 500.9, y: 4.6, w: 7, rise: -2.6 },
      { type: 'flat', x: 507.9, y: 2, w: 4 },
      { type: 'boost', x: 511.9, y: 2, w: 6, rise: 1.8, power: 27 },
      { type: 'gap', x: 517.9, w: 3.6 },
      { type: 'ramp', x: 521.5, y: 3.6, w: 6, rise: -1.6 },
      { type: 'flat', x: 527.5, y: 2, w: 26 },
    ],
    obstacles: [
      { type: 'spinner', x: 103.1, y: 5.3, r: 1.0, speed: 2.2 },
      { type: 'spinner', x: 215.7, y: 5.3, r: 1.0, speed: 2.2 },
      { type: 'spinner', x: 330.2, y: 5.3, r: 1.0, speed: 2.2 },
      { type: 'spinner', x: 443.3, y: 5.3, r: 1.0, speed: 2.2 }
    ]
  },

  // ══ WORLD 3: Forest (21-30) — Steeper hills, spinners ═══════════════════════

  // 21: Deep valley
  {
    name: 'Level 21', theme: 'forest', spawnX: 1.5, spawnY: 5, finishX: 88, segments: [
      { type: 'flat', x: 0, y: 4, w: 10 },
      { type: 'ramp', x: 10, y: 4, w: 8, rise: -2 },
      { type: 'flat', x: 18, y: 2, w: 8 },
      { type: 'ramp', x: 26, y: 2, w: 8, rise: 2 },
      { type: 'flat', x: 34, y: 4, w: 6 },
      { type: 'ramp', x: 40, y: 4, w: 8, rise: -2 },
      { type: 'flat', x: 48, y: 2, w: 6 },
      { type: 'ramp', x: 54, y: 2, w: 8, rise: 2 },
      { type: 'flat', x: 62, y: 4, w: 28 },
    ]
  },

  // 22: Bridge + bumps
  {
    name: 'Level 22', theme: 'forest', spawnX: 1.5, spawnY: 3, finishX: 92, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'bump', x: 9, y: 2, w: 3, h: 0.40 },
      { type: 'bridge', x: 13, y: 2, w: 18, sag: 1.3 },
      { type: 'flat', x: 31, y: 2, w: 6 },
      { type: 'bump', x: 35, y: 2, w: 3, h: 0.45 },
      { type: 'flat', x: 39, y: 2, w: 6 },
      { type: 'bridge', x: 45, y: 2, w: 20, sag: 1.4 },
      { type: 'flat', x: 65, y: 2, w: 30 },
    ]
  },

  // 23: Stepped mountain
  {
    name: 'Level 23', theme: 'forest', spawnX: 1.5, spawnY: 3, finishX: 100, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 5, rise: 1.2 },
      { type: 'flat', x: 13, y: 3.2, w: 4 },
      { type: 'ramp', x: 17, y: 3.2, w: 5, rise: 1.2 },
      { type: 'flat', x: 22, y: 4.4, w: 8 },
      { type: 'ramp', x: 30, y: 4.4, w: 6, rise: -1.2 },
      { type: 'flat', x: 36, y: 3.2, w: 4 },
      { type: 'ramp', x: 40, y: 3.2, w: 6, rise: -1.2 },
      { type: 'flat', x: 46, y: 2, w: 6 },
      { type: 'ramp', x: 52, y: 2, w: 5, rise: 1.5 },
      { type: 'ramp', x: 57, y: 3.5, w: 5, rise: -1.5 },
      { type: 'flat', x: 62, y: 2, w: 40 },
    ]
  },

  // 24: Bridge valley
  {
    name: 'Level 24', theme: 'forest', spawnX: 1.5, spawnY: 3, finishX: 96, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'ramp', x: 10, y: 2, w: 6, rise: 1.5 },
      { type: 'bridge', x: 16, y: 3.5, w: 22, sag: 1.3 },
      { type: 'ramp', x: 38, y: 3.5, w: 6, rise: -1.5 },
      { type: 'flat', x: 44, y: 2, w: 6 },
      { type: 'ramp', x: 50, y: 2, w: 6, rise: 1.2 },
      { type: 'bridge', x: 56, y: 3.2, w: 18, sag: 1.2 },
      { type: 'ramp', x: 74, y: 3.2, w: 6, rise: -1.2 },
      { type: 'flat', x: 80, y: 2, w: 18 },
    ]
  },

  // 25: Spinner dodge + gentle hill
  {
    name: 'Level 25', theme: 'forest', spawnX: 1.5, spawnY: 3, finishX: 96,
    obstacles: [{ type: 'spinner', x: 32, y: 5.6, r: 1.0, speed: 1.6 }],
    segments: [
      { type: 'flat', x: 0, y: 2, w: 12 },
      { type: 'ramp', x: 12, y: 2, w: 5, rise: 1.8 },
      { type: 'flat', x: 17, y: 3.8, w: 4 },
      { type: 'ramp', x: 21, y: 3.8, w: 5, rise: -1.8 },
      { type: 'flat', x: 26, y: 2, w: 16 },
      { type: 'ramp', x: 42, y: 2, w: 5, rise: 1.8 },
      { type: 'ramp', x: 47, y: 3.8, w: 5, rise: -1.8 },
      { type: 'flat', x: 52, y: 2, w: 6 },
      { type: 'ramp', x: 58, y: 2, w: 6, rise: 1.8 },
      { type: 'flat', x: 64, y: 3.8, w: 6 },
      { type: 'ramp', x: 70, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 76, y: 2, w: 22 },
    ]
  },

  // 26: Scenic mountain
  {
    name: 'Level 26', theme: 'forest', spawnX: 1.5, spawnY: 3, finishX: 100, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 9, rise: 2.5 },
      { type: 'flat', x: 17, y: 4.5, w: 8 },
      { type: 'ramp', x: 25, y: 4.5, w: 6, rise: 1.5 },
      { type: 'flat', x: 31, y: 6.0, w: 6 },
      { type: 'ramp', x: 37, y: 6.0, w: 6, rise: -1.5 },
      { type: 'flat', x: 43, y: 4.5, w: 6 },
      { type: 'ramp', x: 49, y: 4.5, w: 9, rise: -2.5 },
      { type: 'flat', x: 58, y: 2, w: 6 },
      { type: 'bump', x: 64, y: 2, w: 3, h: 0.45 },
      { type: 'flat', x: 67, y: 2, w: 36 },
    ]
  },

  // 27: Desert bridges
  {
    name: 'Level 27', theme: 'desert', spawnX: 1.5, spawnY: 3, finishX: 94, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'bridge', x: 10, y: 2, w: 24, sag: 1.3 },
      { type: 'flat', x: 34, y: 2, w: 6 },
      { type: 'ramp', x: 40, y: 2, w: 6, rise: 1.5 },
      { type: 'flat', x: 46, y: 3.5, w: 4 },
      { type: 'ramp', x: 50, y: 3.5, w: 6, rise: -1.5 },
      { type: 'bridge', x: 56, y: 2, w: 20, sag: 1.4 },
      { type: 'flat', x: 76, y: 2, w: 20 },
    ]
  },

  // 28: Desert bumpy road
  {
    name: 'Level 28', theme: 'desert', spawnX: 1.5, spawnY: 3, finishX: 90, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'bump', x: 8, y: 2, w: 3, h: 0.35 },
      { type: 'flat', x: 11, y: 2, w: 5 },
      { type: 'bump', x: 16, y: 2, w: 3, h: 0.45 },
      { type: 'flat', x: 19, y: 2, w: 5 },
      { type: 'bump', x: 24, y: 2, w: 4, h: 0.45 },
      { type: 'flat', x: 28, y: 2, w: 6 },
      { type: 'ramp', x: 34, y: 2, w: 8, rise: 2.0 },
      { type: 'flat', x: 42, y: 4.0, w: 8 },
      { type: 'ramp', x: 50, y: 4.0, w: 8, rise: -2.0 },
      { type: 'flat', x: 58, y: 2, w: 6 },
      { type: 'bump', x: 62, y: 2, w: 3, h: 0.40 },
      { type: 'flat', x: 65, y: 2, w: 28 },
    ]
  },

  // 29: Desert Nitro Jump Sprint
  {
    name: 'Level 29', theme: 'desert', spawnX: 1.5, spawnY: 3, finishX: 96, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'boost', x: 8, y: 2, w: 4, power: 22 },
      { type: 'ramp', x: 12, y: 2, w: 5, rise: 1.8 },
      { type: 'gap', x: 17, w: 2.2 },
      { type: 'ramp', x: 19.2, y: 3.8, w: 5, rise: -1.8 },
      { type: 'flat', x: 24.2, y: 2, w: 6 },
      { type: 'boost', x: 30.2, y: 2, w: 4, power: 22 },
      { type: 'ramp', x: 34.2, y: 2, w: 5, rise: 1.8 },
      { type: 'gap', x: 39.2, w: 2.2 },
      { type: 'ramp', x: 41.4, y: 3.8, w: 5, rise: -1.8 },
      { type: 'flat', x: 46.4, y: 2, w: 5 },
      { type: 'bounce', x: 51.4, y: 2, w: 3.5, power: 10 },
      { type: 'flat', x: 55, y: 3.8, w: 6 },
      { type: 'ramp', x: 61, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 67, y: 2, w: 6 },
      { type: 'boost', x: 73, y: 2, w: 4, power: 24 },
      { type: 'ramp', x: 77, y: 2, w: 5, rise: 1.8 },
      { type: 'flat', x: 82, y: 3.8, w: 5 },
      { type: 'ramp', x: 87, y: 3.8, w: 5, rise: -1.8 },
      { type: 'flat', x: 92, y: 2, w: 18 },
    ]
  },

  // 30: Desert epic
  {
    name: 'Level 30', theme: 'desert', spawnX: 1.5, spawnY: 3, finishX: 100, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 8, rise: 2.2 },
      { type: 'flat', x: 16, y: 4.2, w: 6 },
      { type: 'ramp', x: 22, y: 4.2, w: 8, rise: -2.2 },
      { type: 'flat', x: 30, y: 2, w: 4 },
      { type: 'bridge', x: 34, y: 2, w: 20, sag: 1.3 },
      { type: 'flat', x: 54, y: 2, w: 6 },
      { type: 'ramp', x: 60, y: 2, w: 6, rise: 1.8 },
      { type: 'gap', x: 66, w: 2.2 },
      { type: 'ramp', x: 68.2, y: 3.8, w: 5, rise: -1.8 },
      { type: 'flat', x: 73.2, y: 2, w: 6 },
      { type: 'ramp', x: 79.2, y: 2, w: 6, rise: 1.5 },
      { type: 'flat', x: 85.2, y: 3.5, w: 18 },
    ]
  },

  // ══ WORLD 4: Night (31-40) — Steep terrain, spinners ════════════════════════

  // 31: Night bumps
  {
    name: 'Level 31', theme: 'night', spawnX: 1.5, spawnY: 3, finishX: 88, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'bump', x: 8, y: 2, w: 3, h: 0.35 },
      { type: 'flat', x: 11, y: 2, w: 6 },
      { type: 'bump', x: 17, y: 2, w: 4, h: 0.45 },
      { type: 'flat', x: 21, y: 2, w: 6 },
      { type: 'ramp', x: 27, y: 2, w: 8, rise: 2.2 },
      { type: 'flat', x: 35, y: 4.2, w: 8 },
      { type: 'bump', x: 39, y: 4.2, w: 3, h: 0.40 },
      { type: 'ramp', x: 43, y: 4.2, w: 8, rise: -2.2 },
      { type: 'flat', x: 51, y: 2, w: 6 },
      { type: 'bump', x: 55, y: 2, w: 3, h: 0.35 },
      { type: 'flat', x: 58, y: 2, w: 32 },
    ]
  },

  // 32: Double bridge
  {
    name: 'Level 32', theme: 'night', spawnX: 1.5, spawnY: 3, finishX: 96, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'bridge', x: 10, y: 2, w: 20, sag: 1.3 },
      { type: 'flat', x: 30, y: 2, w: 6 },
      { type: 'ramp', x: 36, y: 2, w: 6, rise: 1.5 },
      { type: 'flat', x: 42, y: 3.5, w: 4 },
      { type: 'bridge', x: 46, y: 3.5, w: 18, sag: 1.3 },
      { type: 'ramp', x: 64, y: 3.5, w: 6, rise: -1.5 },
      { type: 'flat', x: 70, y: 2, w: 28 },
    ]
  },

  // 33: Night jump glide
  {
    name: 'Level 33', theme: 'night', spawnX: 1.5, spawnY: 3, finishX: 94, segments: [
      { type: 'flat', x: 0, y: 2, w: 12 },
      { type: 'ramp', x: 12, y: 2, w: 5, rise: 1.8 },
      { type: 'gap', x: 17, w: 2.2 },
      { type: 'ramp', x: 19.2, y: 3.8, w: 5, rise: -1.8 },
      { type: 'flat', x: 24.2, y: 2, w: 6 },
      { type: 'ramp', x: 30.2, y: 2, w: 4, rise: 1.8 },
      { type: 'flat', x: 34.2, y: 3.8, w: 4 },
      { type: 'ramp', x: 38.2, y: 3.8, w: 5, rise: 1.8 },
      { type: 'gap', x: 43.2, w: 2.2 },
      { type: 'ramp', x: 45.4, y: 5.6, w: 5, rise: -1.8 },
      { type: 'flat', x: 50.4, y: 3.8, w: 6 },
      { type: 'ramp', x: 56.4, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 62.4, y: 2, w: 34 },
    ]
  },

  // 34: Rolling night peaks
  {
    name: 'Level 34', theme: 'night', spawnX: 1.5, spawnY: 3, finishX: 104, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 8, rise: 2.2 },
      { type: 'flat', x: 16, y: 4.2, w: 6 },
      { type: 'ramp', x: 22, y: 4.2, w: 8, rise: -2.2 },
      { type: 'flat', x: 30, y: 2, w: 6 },
      { type: 'ramp', x: 36, y: 2, w: 8, rise: 2.2 },
      { type: 'flat', x: 44, y: 4.2, w: 6 },
      { type: 'ramp', x: 50, y: 4.2, w: 8, rise: -2.2 },
      { type: 'flat', x: 58, y: 2, w: 6 },
      { type: 'ramp', x: 64, y: 2, w: 6, rise: 1.5 },
      { type: 'flat', x: 70, y: 3.5, w: 36 },
    ]
  },

  // 35: Spinner + bridge
  {
    name: 'Level 35', theme: 'night', spawnX: 1.5, spawnY: 3, finishX: 96,
    obstacles: [{ type: 'spinner', x: 42, y: 4.8, r: 1.1, speed: 2.2 }],
    segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'ramp', x: 10, y: 2, w: 6, rise: 1.5 },
      { type: 'flat', x: 16, y: 3.5, w: 6 },
      { type: 'ramp', x: 22, y: 3.5, w: 6, rise: -1.5 },
      { type: 'flat', x: 28, y: 2, w: 6 },
      { type: 'bridge', x: 34, y: 2, w: 22, sag: 1.3 },
      { type: 'flat', x: 56, y: 2, w: 6 },
      { type: 'ramp', x: 62, y: 2, w: 6, rise: 1.5 },
      { type: 'flat', x: 68, y: 3.5, w: 6 },
      { type: 'ramp', x: 74, y: 3.5, w: 6, rise: -1.5 },
      { type: 'flat', x: 80, y: 2, w: 18 },
    ]
  },

  // 36: Storm Stunt Adventure — Smooth Coaster & Storm Chasm
  {
    name: 'Level 36', theme: 'storm', spawnX: 1.5, spawnY: 3, finishX: 114,
    obstacles: [
      { type: 'spinner', x: 88, y: 5.6, r: 1.0, speed: 1.6 }
    ],
    segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      // Section 1: Storm Nitro Highway (continuous smooth coaster, no death jump!)
      { type: 'boost', x: 10, y: 2, w: 8, rise: 1.2, power: 22 },
      { type: 'flat', x: 18, y: 3.2, w: 6 },
      { type: 'ramp', x: 24, y: 3.2, w: 7, rise: -1.2 },
      { type: 'flat', x: 31, y: 2, w: 6 },
      // Section 2: Storm Chasm Suspension Bridge
      { type: 'bridge', x: 37, y: 2, w: 18, sag: 1.2 },
      { type: 'flat', x: 55, y: 2, w: 6 },
      // Section 3: Storm Mountain Ridge (smooth climb, no bouncy spring!)
      { type: 'ramp', x: 61, y: 2, w: 7, rise: 1.8 },
      { type: 'flat', x: 68, y: 3.8, w: 6 },
      { type: 'bump', x: 70, y: 3.8, w: 3, h: 0.35 },
      { type: 'ramp', x: 74, y: 3.8, w: 7, rise: -1.8 },
      { type: 'flat', x: 81, y: 2, w: 6 },
      // Section 4: Storm Coast Bridge & Windmill Spinner
      { type: 'bridge', x: 87, y: 2, w: 14, sag: 1.2 },
      { type: 'flat', x: 101, y: 2, w: 6 },
      // Section 5: Victory Nitro Runway
      { type: 'boost', x: 107, y: 2, w: 6, power: 24 },
      { type: 'flat', x: 113, y: 2, w: 18 },
    ]
  },

  // 37: Storm triple bridge
  {
    name: 'Level 37', theme: 'storm', spawnX: 1.5, spawnY: 3, finishX: 100, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'bridge', x: 10, y: 2, w: 18, sag: 1.3 },
      { type: 'flat', x: 28, y: 2, w: 4 },
      { type: 'boost', x: 32, y: 2, w: 6, rise: 1.5, power: 22 },
      { type: 'flat', x: 38, y: 3.5, w: 4 },
      { type: 'bridge', x: 42, y: 3.5, w: 16, sag: 1.3 },
      { type: 'ramp', x: 58, y: 3.5, w: 6, rise: -1.5 },
      { type: 'flat', x: 64, y: 2, w: 4 },
      { type: 'bridge', x: 68, y: 2, w: 14, sag: 1.2 },
      { type: 'flat', x: 82, y: 2, w: 20 },
    ]
  },

  // 38: Storm Canyon & Moving Hover
  {
    name: 'Level 38', theme: 'storm', spawnX: 1.5, spawnY: 3, finishX: 106, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'bump', x: 8, y: 2, w: 3, h: 0.40 },
      { type: 'flat', x: 11, y: 2, w: 5 },
      { type: 'boost', x: 16, y: 2, w: 6, rise: 1.8, power: 22 },
      { type: 'flat', x: 22, y: 3.8, w: 4 },
      { type: 'ramp', x: 26, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 32, y: 2, w: 4.5 },
      { type: 'gap', x: 36.5, w: 9.5 },
      { type: 'moving', x: 38.3, y: 2.2, w: 7.2, range: 2.0, speed: 1.8 },
      { type: 'flat', x: 46, y: 2, w: 6 },
      { type: 'ramp', x: 52, y: 2, w: 6, rise: 1.8 },
      { type: 'flat', x: 58, y: 3.8, w: 6 },
      { type: 'ramp', x: 64, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 70, y: 2, w: 36 },
    ]
  },

  // 39: Storm Step Terraces & Ridge Pass
  {
    name: 'Level 39', theme: 'storm', spawnX: 1.5, spawnY: 3, finishX: 104, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      // Step Turn 1: Low terrace
      { type: 'ramp', x: 10, y: 2, w: 3.5, rise: 0.8 },
      { type: 'flat', x: 13.5, y: 2.8, w: 4 },
      // Step Turn 2: Mid terrace
      { type: 'ramp', x: 17.5, y: 2.8, w: 3.5, rise: 0.8 },
      { type: 'flat', x: 21, y: 3.6, w: 4 },
      // Step Turn 3: High terrace
      { type: 'ramp', x: 25, y: 3.6, w: 3.5, rise: 0.8 },
      { type: 'flat', x: 28.5, y: 4.4, w: 6 },
      // Step Turn 4: Stepping down
      { type: 'ramp', x: 34.5, y: 4.4, w: 3.5, rise: -0.8 },
      { type: 'flat', x: 38, y: 3.6, w: 4 },
      { type: 'ramp', x: 42, y: 3.6, w: 3.5, rise: -0.8 },
      { type: 'flat', x: 45.5, y: 2.8, w: 4 },
      { type: 'ramp', x: 49.5, y: 2.8, w: 3.5, rise: -0.8 },
      { type: 'flat', x: 53, y: 2, w: 6 },
      // Step Contours: Scenic rolling curves & bridge
      { type: 'bridge', x: 59, y: 2, w: 16, sag: 0.6 },
      { type: 'flat', x: 75, y: 2, w: 6 },
      // Step Turn 5: Final gentle step terrace
      { type: 'ramp', x: 81, y: 2, w: 4, rise: 1.0 },
      { type: 'flat', x: 85, y: 3.0, w: 5 },
      { type: 'ramp', x: 90, y: 3.0, w: 4, rise: -1.0 },
      { type: 'flat', x: 94, y: 2, w: 18 },
    ]
  },

  // 40: Storm finale
  {
    name: 'Level 40', theme: 'storm', spawnX: 1.5, spawnY: 3, finishX: 108, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 6, rise: 1.8 },
      { type: 'bridge', x: 14, y: 3.8, w: 16, sag: 1.3 },
      { type: 'ramp', x: 30, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 36, y: 2, w: 4 },
      { type: 'bump', x: 38, y: 2, w: 3, h: 0.45 },
      { type: 'flat', x: 41, y: 2, w: 4 },
      { type: 'ramp', x: 45, y: 2, w: 8, rise: 2.2 },
      { type: 'flat', x: 53, y: 4.2, w: 8 },
      { type: 'ramp', x: 61, y: 4.2, w: 8, rise: -2.2 },
      { type: 'flat', x: 69, y: 2, w: 4 },
      { type: 'bump', x: 71, y: 2, w: 4, h: 0.45 },
      { type: 'flat', x: 75, y: 2, w: 4 },
      { type: 'bridge', x: 79, y: 2, w: 14, sag: 1.3 },
      { type: 'flat', x: 93, y: 2, w: 18 },
    ]
  },

  // ══ WORLD 5: Candy & Space (41-50) — Hardest ════════════════════════════════

  // 41: Candy Nitro Stunt & Tilting Beam
  {
    name: 'Level 41', theme: 'candy', spawnX: 1.5, spawnY: 3, finishX: 108, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 6, rise: 2.0 },
      { type: 'flat', x: 14, y: 4.0, w: 4 },
      { type: 'ramp', x: 18, y: 4.0, w: 6, rise: -2.0 },
      { type: 'flat', x: 24, y: 2, w: 4 },
      { type: 'boost', x: 28, y: 2, w: 6, rise: 1.8, power: 22 },
      { type: 'gap', x: 34, w: 2.5 },
      { type: 'flat', x: 36.5, y: 3.5, w: 6 },
      { type: 'gap', x: 42.5, w: 9 },
      { type: 'see-saw', x: 44, y: 3.2, w: 9 },
      { type: 'flat', x: 53.5, y: 2.8, w: 5 },
      { type: 'ramp', x: 58.5, y: 2.8, w: 6, rise: 1.8 },
      { type: 'flat', x: 64.5, y: 4.6, w: 6 },
      { type: 'ramp', x: 70.5, y: 4.6, w: 7, rise: -2.0 },
      { type: 'flat', x: 77.5, y: 2.6, w: 31 },
    ]
  },

  // 42: Candy bridges
  {
    name: 'Level 42', theme: 'candy', spawnX: 1.5, spawnY: 3, finishX: 104, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'bridge', x: 10, y: 2, w: 22, sag: 1.3 },
      { type: 'flat', x: 32, y: 2, w: 4 },
      { type: 'ramp', x: 36, y: 2, w: 6, rise: 1.5 },
      { type: 'bridge', x: 42, y: 3.5, w: 20, sag: 1.3 },
      { type: 'ramp', x: 62, y: 3.5, w: 6, rise: -1.5 },
      { type: 'flat', x: 68, y: 2, w: 4 },
      { type: 'bridge', x: 72, y: 2, w: 16, sag: 1.2 },
      { type: 'flat', x: 88, y: 2, w: 18 },
    ]
  },

  // 43: Candy accelerating ramps
  {
    name: 'Level 43', theme: 'candy', spawnX: 1.5, spawnY: 3, finishX: 96, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'boost', x: 8, y: 2, w: 5, rise: 1.5, power: 22 },
      { type: 'gap', x: 13, w: 2.2 },
      { type: 'ramp', x: 15.2, y: 3.5, w: 5, rise: -1.5 },
      { type: 'flat', x: 20.2, y: 2, w: 6 },
      { type: 'ramp', x: 26.2, y: 2, w: 6, rise: 1.8 },
      { type: 'gap', x: 32.2, w: 2.2 },
      { type: 'ramp', x: 34.4, y: 3.8, w: 5, rise: -1.8 },
      { type: 'flat', x: 39.4, y: 2, w: 5 },
      { type: 'boost', x: 44.4, y: 2, w: 5, rise: 1.8, power: 24 },
      { type: 'gap', x: 49.4, w: 2.2 },
      { type: 'ramp', x: 51.6, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 57.6, y: 2, w: 6 },
      { type: 'ramp', x: 63.6, y: 2, w: 6, rise: 1.5 },
      { type: 'flat', x: 69.6, y: 3.5, w: 6 },
      { type: 'ramp', x: 75.6, y: 3.5, w: 6, rise: -1.5 },
      { type: 'flat', x: 81.6, y: 2, w: 20 },
    ]
  },

  // 44: Candy bumps + hills
  {
    name: 'Level 44', theme: 'candy', spawnX: 1.5, spawnY: 3, finishX: 100, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'bump', x: 8, y: 2, w: 3, h: 0.35 },
      { type: 'flat', x: 11, y: 2, w: 5 },
      { type: 'ramp', x: 16, y: 2, w: 8, rise: 2.2 },
      { type: 'flat', x: 24, y: 4.2, w: 6 },
      { type: 'bump', x: 26, y: 4.2, w: 3, h: 0.40 },
      { type: 'ramp', x: 30, y: 4.2, w: 8, rise: -2.2 },
      { type: 'flat', x: 38, y: 2, w: 6 },
      { type: 'bump', x: 42, y: 2, w: 4, h: 0.45 },
      { type: 'flat', x: 46, y: 2, w: 6 },
      { type: 'ramp', x: 52, y: 2, w: 8, rise: 2.0 },
      { type: 'flat', x: 60, y: 4.0, w: 6 },
      { type: 'ramp', x: 66, y: 4.0, w: 8, rise: -2.0 },
      { type: 'flat', x: 74, y: 2, w: 28 },
    ]
  },

  // 45: Candy spinners
  {
    name: 'Level 45', theme: 'candy', spawnX: 1.5, spawnY: 3, finishX: 104,
    obstacles: [
      { type: 'spinner', x: 38, y: 5.35, r: 1.0, speed: 1.8 },
      { type: 'spinner', x: 68, y: 5.35, r: 1.0, speed: 1.8 },
    ],
    segments: [
      { type: 'flat', x: 0, y: 2, w: 12 },
      { type: 'ramp', x: 12, y: 2, w: 8, rise: 2.0 },
      { type: 'flat', x: 20, y: 4.0, w: 6 },
      { type: 'ramp', x: 26, y: 4.0, w: 8, rise: -2.0 },
      { type: 'flat', x: 34, y: 2, w: 14 },
      { type: 'ramp', x: 48, y: 2, w: 6, rise: 1.8 },
      { type: 'flat', x: 54, y: 3.8, w: 4 },
      { type: 'ramp', x: 58, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 64, y: 2, w: 14 },
      { type: 'bridge', x: 78, y: 2, w: 12, sag: 1.2 },
      { type: 'flat', x: 90, y: 2, w: 16 },
    ]
  },

  // 46: Space Asteroid Nitro Rush
  {
    name: 'Level 46', theme: 'space', spawnX: 1.5, spawnY: 3, finishX: 116, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'boost', x: 8, y: 2, w: 6, rise: 1.8, power: 24 },
      { type: 'gap', x: 14, w: 3 },
      { type: 'ramp', x: 17, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 23, y: 2, w: 5.5 },
      { type: 'gap', x: 28.5, w: 9.5 },
      { type: 'moving', x: 30.3, y: 2.2, w: 7.2, range: 2.0, speed: 1.8 },
      { type: 'flat', x: 38, y: 2, w: 5 },
      { type: 'ramp', x: 43, y: 2, w: 6, rise: 2.0 },
      { type: 'flat', x: 49, y: 4.0, w: 6 },
      { type: 'ramp', x: 55, y: 4.0, w: 6, rise: -2.0 },
      { type: 'flat', x: 61, y: 2, w: 4 },
      { type: 'boost', x: 65, y: 2, w: 6, rise: 1.8, power: 24 },
      { type: 'gap', x: 71, w: 3.5 },
      { type: 'ramp', x: 74.5, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 80.5, y: 2, w: 36 },
    ]
  },

  // 47: Space high bridges
  {
    name: 'Level 47', theme: 'space', spawnX: 1.5, spawnY: 3, finishX: 110, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 8, rise: 1.8 },
      { type: 'bridge', x: 16, y: 3.8, w: 18, sag: 1.3 },
      { type: 'ramp', x: 34, y: 3.8, w: 8, rise: -1.8 },
      { type: 'flat', x: 42, y: 2, w: 4 },
      { type: 'boost', x: 46, y: 2, w: 6, rise: 1.8, power: 22 },
      { type: 'bridge', x: 52, y: 3.8, w: 18, sag: 1.3 },
      { type: 'ramp', x: 70, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 76, y: 2, w: 4 },
      { type: 'bridge', x: 80, y: 2, w: 14, sag: 1.2 },
      { type: 'flat', x: 94, y: 2, w: 16 },
    ]
  },

  // 48: Space gap marathon
  {
    name: 'Level 48', theme: 'space', spawnX: 1.5, spawnY: 3, finishX: 108, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'ramp', x: 10, y: 2, w: 6, rise: 1.5 },
      { type: 'gap', x: 16, w: 2.2 },
      { type: 'ramp', x: 18.2, y: 3.5, w: 5, rise: -1.5 },
      { type: 'flat', x: 23.2, y: 2, w: 6 },
      { type: 'ramp', x: 29.2, y: 2, w: 6, rise: 1.8 },
      { type: 'gap', x: 35.2, w: 2.2 },
      { type: 'ramp', x: 37.4, y: 3.8, w: 5, rise: -1.8 },
      { type: 'flat', x: 42.4, y: 2, w: 6 },
      { type: 'ramp', x: 48.4, y: 2, w: 6, rise: 1.8 },
      { type: 'gap', x: 54.4, w: 2.4 },
      { type: 'ramp', x: 56.8, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 62.8, y: 2, w: 6 },
      { type: 'ramp', x: 68.8, y: 2, w: 6, rise: 1.8 },
      { type: 'gap', x: 74.8, w: 2.4 },
      { type: 'ramp', x: 77.2, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 83.2, y: 2, w: 30 },
    ]
  },

  // 49: Space spinner epic
  {
    name: 'Level 49', theme: 'space', spawnX: 1.5, spawnY: 3, finishX: 112,
    obstacles: [{ type: 'spinner', x: 50, y: 5.0, r: 1.2, speed: 2.8 }],
    segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 8, rise: 2.2 },
      { type: 'flat', x: 16, y: 4.2, w: 6 },
      { type: 'ramp', x: 22, y: 4.2, w: 8, rise: -2.2 },
      { type: 'flat', x: 30, y: 2, w: 6 },
      { type: 'bridge', x: 36, y: 2, w: 22, sag: 1.4 },
      { type: 'flat', x: 58, y: 2, w: 6 },
      { type: 'ramp', x: 64, y: 2, w: 8, rise: 2.5 },
      { type: 'flat', x: 72, y: 4.5, w: 6 },
      { type: 'ramp', x: 78, y: 4.5, w: 8, rise: -2.5 },
      { type: 'flat', x: 86, y: 2, w: 28 },
    ]
  },

  // 50: FINAL — Grand Space Odyssey
  {
    name: 'Level 50', theme: 'space', spawnX: 1.5, spawnY: 3, finishX: 136,
    obstacles: [
      { type: 'spinner', x: 74, y: 6.8, r: 1.0, speed: 1.6 },
      { type: 'spinner', x: 99, y: 7.6, r: 1.0, speed: 1.6 }
    ],
    segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      // Section 1: Space Nitro Highway (continuous smooth coaster, no death jump!)
      { type: 'boost', x: 10, y: 2, w: 6, rise: 1.4, power: 22 },
      { type: 'flat', x: 16, y: 3.4, w: 4 },
      { type: 'ramp', x: 20, y: 3.4, w: 6, rise: -1.4 },
      { type: 'flat', x: 26, y: 2, w: 4 },
      // Section 2: Moving Space Ferry (safe overlapping margins)
      { type: 'gap', x: 30, w: 6 },
      { type: 'moving', x: 31, y: 2.2, w: 7.6, range: 1.2, speed: 1.2 },
      { type: 'flat', x: 36, y: 2, w: 7 },
      // Section 3: Orbital Space Ascent (smooth climb, no bouncy spring!)
      { type: 'ramp', x: 43, y: 2, w: 7, rise: 1.8 },
      { type: 'flat', x: 50, y: 3.8, w: 6 },
      { type: 'bump', x: 52, y: 3.8, w: 3, h: 0.35 },
      { type: 'ramp', x: 56, y: 3.8, w: 6, rise: -1.0 },
      { type: 'flat', x: 62, y: 2.8, w: 6 },
      // Section 4: Space Station Suspension Bridge (Spinner 1 overhead at x: 74)
      { type: 'bridge', x: 68, y: 2.8, w: 16, sag: 0.6 },
      { type: 'flat', x: 84, y: 2.8, w: 6 },
      // Section 5: High Orbital Crest (Spinner 2 overhead at x: 99)
      { type: 'ramp', x: 90, y: 2.8, w: 6, rise: 1.4 },
      { type: 'flat', x: 96, y: 4.2, w: 6 },
      { type: 'ramp', x: 102, y: 4.2, w: 6, rise: -1.4 },
      { type: 'flat', x: 108, y: 2.8, w: 6 },
      // Section 6: Mega Hyper-Boost Victory Runway (continuous acceleration)
      { type: 'boost', x: 114, y: 2.8, w: 8, power: 24 },
      { type: 'flat', x: 122, y: 2.8, w: 22 }
    ]
  },

];

// ─────────────────────────────────────────────────────────────────────────────
//  CAR CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const CAR_CONFIG = {
  engineForce: 13000, gravity: -20,
  maxSpeed: 16, friction: 0.88,
  brakeForce: 4000, airFriction: 0.985,
  reverseForce: 3500, tiltTorque: 2800,
  suspensionK: 660, suspensionDamp: 34,
  wheelRadius: 0.42, mass: 370,
  bodyWidth: 2.4, bodyHeight: 0.7,
  bodyColor: '#ff6b35', roofColor: '#1a1a2e',
  wheelColor: '#222', tireColor: '#333',
  headOffset: { x: -0.1, y: 0.9 },
  headRadius: 0.22,
};
