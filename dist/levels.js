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

  // 1: Simple hill
  {
    name: 'Level 1', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 52, segments: [
      { type: 'flat', x: 0, y: 2, w: 14 },
      { type: 'ramp', x: 14, y: 2, w: 8, rise: 1.5 },
      { type: 'flat', x: 22, y: 3.5, w: 10 },
      { type: 'ramp', x: 32, y: 3.5, w: 8, rise: -1.5 },
      { type: 'flat', x: 40, y: 2, w: 14 },
    ]
  },

  // 2: Two rolling hills
  {
    name: 'Level 2', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 68, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'ramp', x: 10, y: 2, w: 6, rise: 2 },
      { type: 'flat', x: 16, y: 4, w: 6 },
      { type: 'ramp', x: 22, y: 4, w: 6, rise: -2 },
      { type: 'flat', x: 28, y: 2, w: 6 },
      { type: 'ramp', x: 34, y: 2, w: 6, rise: 2.5 },
      { type: 'flat', x: 40, y: 4.5, w: 8 },
      { type: 'ramp', x: 48, y: 4.5, w: 6, rise: -2.5 },
      { type: 'flat', x: 54, y: 2, w: 16 },
    ]
  },

  // 3: First tiny gap + Turbo Boost
  {
    name: 'Level 3', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 62, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'boost', x: 10, y: 2, w: 4, power: 22 },
      { type: 'ramp', x: 14, y: 2, w: 5, rise: 1.5 },
      { type: 'gap', x: 19, w: 2.2 },
      { type: 'ramp', x: 21.2, y: 3.5, w: 5, rise: -1.5 },
      { type: 'flat', x: 26.2, y: 2, w: 8 },
      { type: 'boost', x: 34.2, y: 2, w: 4, power: 22 },
      { type: 'ramp', x: 38.2, y: 2, w: 5, rise: 1.5 },
      { type: 'gap', x: 43.2, w: 2.2 },
      { type: 'ramp', x: 45.4, y: 3.5, w: 5, rise: -1.5 },
      { type: 'flat', x: 50.4, y: 2, w: 16 },
    ]
  },

  // 4: Speed bumps
  {
    name: 'Level 4', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 62, segments: [
      { type: 'flat', x: 0, y: 2, w: 12 },
      { type: 'bump', x: 12, y: 2, w: 3, h: 0.35 },
      { type: 'flat', x: 15, y: 2, w: 8 },
      { type: 'bump', x: 23, y: 2, w: 3, h: 0.45 },
      { type: 'flat', x: 26, y: 2, w: 8 },
      { type: 'bump', x: 34, y: 2, w: 4, h: 0.50 },
      { type: 'flat', x: 38, y: 2, w: 6 },
      { type: 'bump', x: 44, y: 2, w: 3, h: 0.40 },
      { type: 'flat', x: 47, y: 2, w: 18 },
    ]
  },

  // 5: First bridge
  {
    name: 'Level 5', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 68, segments: [
      { type: 'flat', x: 0, y: 2, w: 12 },
      { type: 'bridge', x: 12, y: 2, w: 16, sag: 1.2 },
      { type: 'flat', x: 28, y: 2, w: 8 },
      { type: 'ramp', x: 36, y: 2, w: 6, rise: 1.8 },
      { type: 'flat', x: 42, y: 3.8, w: 10 },
      { type: 'ramp', x: 52, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 58, y: 2, w: 12 },
    ]
  },

  // 6: Hill climb valley + Smooth Boost Jump Launch (100% winnable!)
  {
    name: 'Level 6', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 76, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'ramp', x: 10, y: 2, w: 8, rise: 2.5 },
      { type: 'flat', x: 18, y: 4.5, w: 6 },
      { type: 'ramp', x: 24, y: 4.5, w: 8, rise: -2.5 },
      { type: 'flat', x: 32, y: 2, w: 4 },
      { type: 'boost', x: 36, y: 2, w: 4, rise: 1.5, power: 22 },
      { type: 'gap', x: 40, w: 2.5 },
      { type: 'ramp', x: 42.5, y: 3.5, w: 5, rise: -1.5 },
      { type: 'flat', x: 47.5, y: 2, w: 8 },
      { type: 'ramp', x: 55.5, y: 2, w: 6, rise: 1.8 },
      { type: 'flat', x: 61.5, y: 3.8, w: 16 },
    ]
  },

  // 7: Bridge and bumps combo
  {
    name: 'Level 7', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 78, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'bridge', x: 10, y: 2, w: 16, sag: 1.2 },
      { type: 'flat', x: 26, y: 2, w: 6 },
      { type: 'bump', x: 30, y: 2, w: 3, h: 0.45 },
      { type: 'flat', x: 33, y: 2, w: 5 },
      { type: 'ramp', x: 38, y: 2, w: 6, rise: 1.8 },
      { type: 'bridge', x: 44, y: 3.8, w: 14, sag: 1.2 },
      { type: 'ramp', x: 58, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 64, y: 2, w: 18 },
    ]
  },

  // 8: Rolling hills + accelerating launch ramp
  {
    name: 'Level 8', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 82, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 6, rise: 1.8 },
      { type: 'flat', x: 14, y: 3.8, w: 4 },
      { type: 'ramp', x: 18, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 24, y: 2, w: 4 },
      { type: 'ramp', x: 28, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 34, y: 4.2, w: 6 },
      { type: 'ramp', x: 40, y: 4.2, w: 6, rise: -2.2 },
      { type: 'flat', x: 46, y: 2, w: 4 },
      { type: 'boost', x: 50, y: 2, w: 5, rise: 1.8, power: 22 },
      { type: 'flat', x: 55, y: 3.8, w: 5 },
      { type: 'ramp', x: 60, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 66, y: 2, w: 18 },
    ]
  },

  // 9: Bumpy road with hills
  {
    name: 'Level 9', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 80, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'bump', x: 10, y: 2, w: 3, h: 0.35 },
      { type: 'flat', x: 13, y: 2, w: 5 },
      { type: 'bump', x: 18, y: 2, w: 3, h: 0.45 },
      { type: 'flat', x: 21, y: 2, w: 5 },
      { type: 'ramp', x: 26, y: 2, w: 6, rise: 1.8 },
      { type: 'flat', x: 32, y: 3.8, w: 6 },
      { type: 'bump', x: 36, y: 3.8, w: 3, h: 0.40 },
      { type: 'ramp', x: 39, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 45, y: 2, w: 6 },
      { type: 'bump', x: 49, y: 2, w: 4, h: 0.45 },
      { type: 'flat', x: 53, y: 2, w: 30 },
    ]
  },

  // 10: Bridge + accelerating ramp gap
  {
    name: 'Level 10', theme: 'sky', spawnX: 1.5, spawnY: 3, finishX: 84, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'bridge', x: 10, y: 2, w: 18, sag: 1.3 },
      { type: 'flat', x: 28, y: 2, w: 4 },
      { type: 'boost', x: 32, y: 2, w: 5, rise: 1.8, power: 22 },
      { type: 'gap', x: 37, w: 2.2 },
      { type: 'ramp', x: 39.2, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 45.2, y: 2, w: 4 },
      { type: 'bridge', x: 49.2, y: 2, w: 16, sag: 1.3 },
      { type: 'flat', x: 65.2, y: 2, w: 22 },
    ]
  },

  // ══ WORLD 2: Sunset (11-20) — Bigger hills, longer bridges ══════════════════

  // 11: Sunset Mountain Expedition
  {
    name: 'Level 11', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 94, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 8, rise: 2.5 },
      { type: 'flat', x: 16, y: 4.5, w: 6 },
      { type: 'bump', x: 18, y: 4.5, w: 3, h: 0.45 },
      { type: 'ramp', x: 22, y: 4.5, w: 8, rise: -2.5 },
      { type: 'flat', x: 30, y: 2, w: 6 },
      { type: 'bridge', x: 36, y: 2, w: 18, sag: 1.3 },
      { type: 'flat', x: 54, y: 2, w: 4 },
      { type: 'boost', x: 58, y: 2, w: 6, rise: 1.8, power: 22 },
      { type: 'ramp', x: 64, y: 3.8, w: 8, rise: -1.8 },
      { type: 'flat', x: 72, y: 2, w: 6 },
      { type: 'ramp', x: 78, y: 2, w: 6, rise: 1.5 },
      { type: 'flat', x: 84, y: 3.5, w: 18 },
    ]
  },

  // 12: Long bridges
  {
    name: 'Level 12', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 90, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'bridge', x: 10, y: 2, w: 22, sag: 1.3 },
      { type: 'flat', x: 32, y: 2, w: 6 },
      { type: 'ramp', x: 38, y: 2, w: 6, rise: 1.5 },
      { type: 'bridge', x: 44, y: 3.5, w: 20, sag: 1.3 },
      { type: 'ramp', x: 64, y: 3.5, w: 6, rise: -1.5 },
      { type: 'flat', x: 70, y: 2, w: 22 },
    ]
  },

  // 13: Bumps + ramps
  {
    name: 'Level 13', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 82, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'bump', x: 10, y: 2, w: 3, h: 0.35 },
      { type: 'flat', x: 13, y: 2, w: 4 },
      { type: 'bump', x: 17, y: 2, w: 3, h: 0.45 },
      { type: 'flat', x: 20, y: 2, w: 4 },
      { type: 'bump', x: 24, y: 2, w: 3, h: 0.45 },
      { type: 'flat', x: 27, y: 2, w: 6 },
      { type: 'ramp', x: 33, y: 2, w: 8, rise: 2.0 },
      { type: 'flat', x: 41, y: 4.0, w: 8 },
      { type: 'ramp', x: 49, y: 4.0, w: 8, rise: -2.0 },
      { type: 'flat', x: 57, y: 2, w: 6 },
      { type: 'bump', x: 63, y: 2, w: 4, h: 0.40 },
      { type: 'flat', x: 67, y: 2, w: 18 },
    ]
  },

  // 14: Hill with gentle bridge + smooth boost glide
  {
    name: 'Level 14', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 88, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'ramp', x: 10, y: 2, w: 8, rise: 2.0 },
      { type: 'bridge', x: 18, y: 4.0, w: 18, sag: 1.2 },
      { type: 'ramp', x: 36, y: 4.0, w: 8, rise: -2.0 },
      { type: 'flat', x: 44, y: 2, w: 6 },
      { type: 'boost', x: 50, y: 2, w: 6, rise: 1.5, power: 22 },
      { type: 'ramp', x: 56, y: 3.5, w: 8, rise: -1.5 },
      { type: 'flat', x: 64, y: 2, w: 6 },
      { type: 'ramp', x: 70, y: 2, w: 6, rise: 1.5 },
      { type: 'flat', x: 76, y: 3.5, w: 16 },
    ]
  },

  // 15: Sunset Rolling Coaster
  {
    name: 'Level 15', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 94, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'ramp', x: 8, y: 2, w: 6, rise: 2.2 },
      { type: 'flat', x: 14, y: 4.2, w: 4 },
      { type: 'ramp', x: 18, y: 4.2, w: 6, rise: -2.2 },
      { type: 'flat', x: 24, y: 2, w: 5 },
      { type: 'ramp', x: 29, y: 2, w: 7, rise: 2.2 },
      { type: 'flat', x: 36, y: 4.2, w: 5 },
      { type: 'ramp', x: 41, y: 4.2, w: 7, rise: -2.2 },
      { type: 'flat', x: 48, y: 2, w: 5 },
      { type: 'boost', x: 53, y: 2, w: 6, rise: 1.6, power: 22 },
      { type: 'ramp', x: 59, y: 3.6, w: 8, rise: -1.6 },
      { type: 'flat', x: 67, y: 2, w: 5 },
      { type: 'bridge', x: 72, y: 2, w: 14, sag: 1.3 },
      { type: 'flat', x: 86, y: 2, w: 18 },
    ]
  },

  // 16: Bumpy bridge
  {
    name: 'Level 16', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 88, segments: [
      { type: 'flat', x: 0, y: 2, w: 8 },
      { type: 'bump', x: 8, y: 2, w: 3, h: 0.40 },
      { type: 'flat', x: 11, y: 2, w: 4 },
      { type: 'bridge', x: 15, y: 2, w: 18, sag: 1.3 },
      { type: 'flat', x: 33, y: 2, w: 4 },
      { type: 'bump', x: 37, y: 2, w: 4, h: 0.45 },
      { type: 'flat', x: 41, y: 2, w: 4 },
      { type: 'bridge', x: 45, y: 2, w: 18, sag: 1.4 },
      { type: 'flat', x: 63, y: 2, w: 28 },
    ]
  },

  // 17: Mountain pass & bridge
  {
    name: 'Level 17', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 96, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'ramp', x: 10, y: 2, w: 9, rise: 2.5 },
      { type: 'flat', x: 19, y: 4.5, w: 6 },
      { type: 'ramp', x: 25, y: 4.5, w: 8, rise: -2.5 },
      { type: 'flat', x: 33, y: 2, w: 6 },
      { type: 'bridge', x: 39, y: 2, w: 20, sag: 1.3 },
      { type: 'flat', x: 59, y: 2, w: 5 },
      { type: 'ramp', x: 64, y: 2, w: 6, rise: 2.0 },
      { type: 'flat', x: 70, y: 4.0, w: 5 },
      { type: 'ramp', x: 75, y: 4.0, w: 6, rise: -2.0 },
      { type: 'flat', x: 81, y: 2, w: 20 },
    ]
  },

  // 18: Mountain pass + accelerating launch
  {
    name: 'Level 18', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 92, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'ramp', x: 10, y: 2, w: 8, rise: 2.2 },
      { type: 'flat', x: 18, y: 4.2, w: 6 },
      { type: 'boost', x: 24, y: 4.2, w: 6, rise: 1.5, power: 22 },
      { type: 'gap', x: 30, w: 2.2 },
      { type: 'ramp', x: 32.2, y: 5.7, w: 6, rise: -1.5 },
      { type: 'flat', x: 38.2, y: 4.2, w: 6 },
      { type: 'ramp', x: 44.2, y: 4.2, w: 7, rise: -2.2 },
      { type: 'flat', x: 51.2, y: 2, w: 6 },
      { type: 'ramp', x: 57.2, y: 2, w: 7, rise: 2.0 },
      { type: 'flat', x: 64.2, y: 4.0, w: 6 },
      { type: 'ramp', x: 70.2, y: 4.0, w: 7, rise: -2.0 },
      { type: 'flat', x: 77.2, y: 2, w: 18 },
    ]
  },

  // 19: Double bridge
  {
    name: 'Level 19', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 94, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      { type: 'ramp', x: 10, y: 2, w: 6, rise: 1.5 },
      { type: 'bridge', x: 16, y: 3.5, w: 16, sag: 1.2 },
      { type: 'ramp', x: 32, y: 3.5, w: 6, rise: -1.5 },
      { type: 'flat', x: 38, y: 2, w: 6 },
      { type: 'ramp', x: 44, y: 2, w: 6, rise: 1.8 },
      { type: 'bridge', x: 50, y: 3.8, w: 18, sag: 1.3 },
      { type: 'ramp', x: 68, y: 3.8, w: 6, rise: -1.8 },
      { type: 'flat', x: 74, y: 2, w: 22 },
    ]
  },

  // 20: Grand Sunset Canyon Expedition
  {
    name: 'Level 20', theme: 'sunset', spawnX: 1.5, spawnY: 3, finishX: 120, segments: [
      { type: 'flat', x: 0, y: 2, w: 10 },
      // 1: Grand Canyon Suspension Bridge (smooth, gentle flex, majestic 24-unit span)
      { type: 'bridge', x: 10, y: 2, w: 24, sag: 0.6 },
      { type: 'flat', x: 34, y: 2, w: 8 },
      // 2: Motorized Canyon Hover Ferry (overlapping safety decks, smooth crossing)
      { type: 'gap', x: 42, w: 6 },
      { type: 'moving', x: 43, y: 2.2, w: 7.5, range: 1.2, speed: 1.2 },
      { type: 'flat', x: 48, y: 2, w: 10 },
      // 3: Sunset Nitro Coaster (smooth continuous highway, no blind drops)
      { type: 'boost', x: 58, y: 2, w: 7, rise: 1.2, power: 22 },
      { type: 'flat', x: 65, y: 3.2, w: 6 },
      { type: 'ramp', x: 71, y: 3.2, w: 7, rise: -1.2 },
      { type: 'flat', x: 78, y: 2, w: 6 },
      // 4: Sunset Canyon Trestle Bridge (replaces the tilting death-gap)
      { type: 'bridge', x: 84, y: 2, w: 18, sag: 0.6 },
      { type: 'flat', x: 102, y: 2, w: 6 },
      // 5: Final Scenic Sunset Suspension Bridge & Victory Runway
      { type: 'bridge', x: 108, y: 2, w: 16, sag: 0.5 },
      { type: 'flat', x: 124, y: 2, w: 18 },
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
      { type: 'flat', x: 32, y: 2, w: 4 },
      { type: 'gap', x: 36, w: 8 },
      { type: 'moving', x: 38, y: 2.2, w: 6.5, range: 2.0, speed: 1.8 },
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
      { type: 'flat', x: 23, y: 2, w: 5 },
      { type: 'gap', x: 28, w: 8 },
      { type: 'moving', x: 30, y: 2.2, w: 6.5, range: 2.0, speed: 1.8 },
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
      { type: 'moving', x: 31, y: 2.2, w: 7.5, range: 1.2, speed: 1.2 },
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
