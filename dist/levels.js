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
  sky:    { bg1:'#87CEEB', bg2:'#E0F7FA', h1:'rgba(100,180,130,0.65)', h2:'rgba(140,210,160,0.45)', ground:'#5d4037', cloud:'rgba(255,255,255,0.85)', stars:false },
  sunset: { bg1:'#FF8C42', bg2:'#FFD180', h1:'rgba(200,90,50,0.65)',   h2:'rgba(230,130,70,0.45)', ground:'#4e342e', cloud:'rgba(255,220,200,0.8)', stars:false },
  forest: { bg1:'#3D9970', bg2:'#A8D5A2', h1:'rgba(20,80,40,0.75)',    h2:'rgba(50,120,60,0.55)',  ground:'#3e2723', cloud:'rgba(255,255,255,0.75)', stars:false },
  desert: { bg1:'#FFD54F', bg2:'#FFF8E1', h1:'rgba(200,140,60,0.55)',  h2:'rgba(235,190,100,0.4)', ground:'#bf360c', cloud:'rgba(255,255,220,0.7)', stars:false },
  night:  { bg1:'#1a1a2e', bg2:'#16213e', h1:'rgba(15,40,90,0.85)',    h2:'rgba(25,60,120,0.65)',  ground:'#212121', cloud:'rgba(80,100,160,0.5)', stars:true  },
  storm:  { bg1:'#37474F', bg2:'#546E7A', h1:'rgba(40,60,80,0.85)',    h2:'rgba(60,80,100,0.65)',  ground:'#1a1a1a', cloud:'rgba(100,120,140,0.6)', stars:false },
  candy:  { bg1:'#F06292', bg2:'#FCE4EC', h1:'rgba(180,60,120,0.65)',  h2:'rgba(230,120,170,0.45)', ground:'#880e4f', cloud:'rgba(255,200,220,0.85)', stars:false },
  space:  { bg1:'#0d0d2b', bg2:'#1a1a4e', h1:'rgba(40,0,80,0.85)',     h2:'rgba(70,10,130,0.65)',  ground:'#1a0033', cloud:'rgba(100,60,180,0.4)', stars:true  },
};

const LEVELS = [

// ══ WORLD 1: Sky (1-10) — Gentle introduction ═══════════════════════════════

// 1: Simple hill
{name:'Level 1', theme:'sky', spawnX:1.5, spawnY:3, finishX:52, segments:[
  {type:'flat', x:0, y:2, w:14},
  {type:'ramp', x:14, y:2, w:8, rise:1.5},
  {type:'flat', x:22, y:3.5, w:10},
  {type:'ramp', x:32, y:3.5, w:8, rise:-1.5},
  {type:'flat', x:40, y:2, w:14},
]},

// 2: Two rolling hills
{name:'Level 2', theme:'sky', spawnX:1.5, spawnY:3, finishX:68, segments:[
  {type:'flat', x:0, y:2, w:10},
  {type:'ramp', x:10, y:2, w:6, rise:2},
  {type:'flat', x:16, y:4, w:6},
  {type:'ramp', x:22, y:4, w:6, rise:-2},
  {type:'flat', x:28, y:2, w:6},
  {type:'ramp', x:34, y:2, w:6, rise:2.5},
  {type:'flat', x:40, y:4.5, w:8},
  {type:'ramp', x:48, y:4.5, w:6, rise:-2.5},
  {type:'flat', x:54, y:2, w:16},
]},

// 3: First tiny gap + Turbo Boost
{name:'Level 3', theme:'sky', spawnX:1.5, spawnY:3, finishX:58, segments:[
  {type:'flat',  x:0, y:2, w:10},
  {type:'boost', x:10, y:2, w:3, power:28},
  {type:'ramp',  x:13, y:2, w:5, rise:2},
  {type:'gap',   x:18, w:4},
  {type:'flat',  x:22, y:2, w:10},
  {type:'boost', x:32, y:2, w:3, power:28},
  {type:'ramp',  x:35, y:2, w:5, rise:2},
  {type:'gap',   x:40, w:4},
  {type:'flat',  x:44, y:2, w:16},
]},

// 4: Speed bumps
{name:'Level 4', theme:'sky', spawnX:1.5, spawnY:3, finishX:62, segments:[
  {type:'flat', x:0, y:2, w:12},
  {type:'bump', x:12, y:2, w:3, h:0.6},
  {type:'flat', x:15, y:2, w:8},
  {type:'bump', x:23, y:2, w:3, h:0.8},
  {type:'flat', x:26, y:2, w:8},
  {type:'bump', x:34, y:2, w:4, h:1.0},
  {type:'flat', x:38, y:2, w:6},
  {type:'bump', x:44, y:2, w:3, h:0.7},
  {type:'flat', x:47, y:2, w:18},
]},

// 5: First bridge
{name:'Level 5', theme:'sky', spawnX:1.5, spawnY:3, finishX:68, segments:[
  {type:'flat',   x:0, y:2, w:12},
  {type:'bridge', x:12, y:2, w:16, sag:1.2},
  {type:'flat',   x:28, y:2, w:8},
  {type:'ramp',   x:36, y:2, w:6, rise:2},
  {type:'flat',   x:42, y:4, w:10},
  {type:'ramp',   x:52, y:4, w:6, rise:-2},
  {type:'flat',   x:58, y:2, w:12},
]},

// 6: Hill climb valley + Smooth Boost Jump Launch (100% winnable!)
{name:'Level 6', theme:'sky', spawnX:1.5, spawnY:3, finishX:76, segments:[
  {type:'flat',  x:0, y:2, w:10},
  {type:'ramp',  x:10, y:2, w:8, rise:3},
  {type:'flat',  x:18, y:5, w:6},
  {type:'ramp',  x:24, y:5, w:8, rise:-3},
  {type:'flat',  x:32, y:2, w:4},
  {type:'boost', x:36, y:2, w:4, rise:1.5, power:24}, // Accelerating boost ramp launch
  {type:'gap',   x:40, w:3.5},
  {type:'ramp',  x:43.5, y:3.5, w:5, rise:-1.5},       // Smooth landing ramp
  {type:'flat',  x:48.5, y:2, w:8},
  {type:'ramp',  x:56.5, y:2, w:6, rise:2},
  {type:'flat',  x:62.5, y:4, w:16},
]},

// 7: Bridge and bumps combo
{name:'Level 7', theme:'sky', spawnX:1.5, spawnY:3, finishX:78, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'bridge', x:10, y:2, w:16, sag:1.2},
  {type:'flat',   x:26, y:2, w:6},
  {type:'bump',   x:30, y:2, w:3, h:0.8},
  {type:'flat',   x:33, y:2, w:5},
  {type:'ramp',   x:38, y:2, w:6, rise:2.5},
  {type:'bridge', x:44, y:4.5, w:14, sag:1.8},
  {type:'ramp',   x:58, y:4.5, w:6, rise:-2.5},
  {type:'flat',   x:64, y:2, w:18},
]},

// 8: Rolling hills + accelerating launch ramp
{name:'Level 8', theme:'sky', spawnX:1.5, spawnY:3, finishX:82, segments:[
  {type:'flat',  x:0, y:2, w:8},
  {type:'ramp',  x:8, y:2, w:6, rise:2},
  {type:'flat',  x:14, y:4, w:4},
  {type:'ramp',  x:18, y:4, w:6, rise:-2},
  {type:'flat',  x:24, y:2, w:4},
  {type:'ramp',  x:28, y:2, w:6, rise:3},
  {type:'flat',  x:34, y:5, w:6},
  {type:'ramp',  x:40, y:5, w:6, rise:-3},
  {type:'flat',  x:46, y:2, w:4},
  {type:'boost', x:50, y:2, w:5, rise:2, power:26}, // Accelerating boost ramp
  {type:'flat',  x:55, y:4, w:5},
  {type:'ramp',  x:60, y:4, w:6, rise:-2},
  {type:'flat',  x:66, y:2, w:18},
]},

// 9: Bumpy road with hills
{name:'Level 9', theme:'sky', spawnX:1.5, spawnY:3, finishX:80, segments:[
  {type:'flat', x:0, y:2, w:10},
  {type:'bump', x:10, y:2, w:3, h:0.7},
  {type:'flat', x:13, y:2, w:5},
  {type:'bump', x:18, y:2, w:3, h:0.9},
  {type:'flat', x:21, y:2, w:5},
  {type:'ramp', x:26, y:2, w:6, rise:2},
  {type:'flat', x:32, y:4, w:6},
  {type:'bump', x:36, y:4, w:3, h:0.8},
  {type:'ramp', x:39, y:4, w:6, rise:-2},
  {type:'flat', x:45, y:2, w:6},
  {type:'bump', x:49, y:2, w:4, h:1.0},
  {type:'flat', x:53, y:2, w:30},
]},

// 10: Bridge + accelerating ramp gap
{name:'Level 10', theme:'sky', spawnX:1.5, spawnY:3, finishX:84, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'bridge', x:10, y:2, w:18, sag:1.5},
  {type:'flat',   x:28, y:2, w:4},
  {type:'boost',  x:32, y:2, w:5, rise:2, power:28}, // Accelerating boost ramp
  {type:'gap',    x:37, w:3.5},
  {type:'flat',   x:40.5, y:2, w:6},
  {type:'bridge', x:46.5, y:2, w:18, sag:1.8},
  {type:'flat',   x:64.5, y:2, w:22},
]},

// ══ WORLD 2: Sunset (11-20) — Bigger hills, longer bridges ══════════════════

// 11: Big mountain + steep approach
{name:'Level 11', theme:'sunset', spawnX:1.5, spawnY:3, finishX:86, segments:[
  {type:'flat', x:0, y:2, w:10},
  {type:'ramp', x:10, y:2, w:10, rise:4},
  {type:'flat', x:20, y:6, w:8},
  {type:'ramp', x:28, y:6, w:6, rise:-4},
  {type:'ramp', x:34, y:2, w:4, rise:2.5},
  {type:'ramp', x:38, y:4.5, w:4, rise:-2.5},
  {type:'flat', x:42, y:2, w:4},
  {type:'ramp', x:46, y:2, w:8, rise:3},
  {type:'flat', x:54, y:5, w:6},
  {type:'ramp', x:60, y:5, w:8, rise:-3},
  {type:'flat', x:68, y:2, w:20},
]},

// 12: Long bridges
{name:'Level 12', theme:'sunset', spawnX:1.5, spawnY:3, finishX:90, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'bridge', x:10, y:2, w:22, sag:1.8},
  {type:'flat',   x:32, y:2, w:6},
  {type:'ramp',   x:38, y:2, w:6, rise:2},
  {type:'bridge', x:44, y:4, w:20, sag:2.2},
  {type:'ramp',   x:64, y:4, w:6, rise:-2},
  {type:'flat',   x:70, y:2, w:22},
]},

// 13: Bumps + ramps
{name:'Level 13', theme:'sunset', spawnX:1.5, spawnY:3, finishX:82, segments:[
  {type:'flat', x:0, y:2, w:10},
  {type:'bump', x:10, y:2, w:3, h:0.8},
  {type:'flat', x:13, y:2, w:4},
  {type:'bump', x:17, y:2, w:3, h:1.0},
  {type:'flat', x:20, y:2, w:4},
  {type:'bump', x:24, y:2, w:3, h:1.2},
  {type:'flat', x:27, y:2, w:6},
  {type:'ramp', x:33, y:2, w:8, rise:3},
  {type:'flat', x:41, y:5, w:8},
  {type:'ramp', x:49, y:5, w:8, rise:-3},
  {type:'flat', x:57, y:2, w:6},
  {type:'bump', x:63, y:2, w:4, h:1.0},
  {type:'flat', x:67, y:2, w:18},
]},

// 14: Hill with bridge on top + accelerating gap launch
{name:'Level 14', theme:'sunset', spawnX:1.5, spawnY:3, finishX:88, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'ramp',   x:10, y:2, w:8, rise:3},
  {type:'bridge', x:18, y:5, w:18, sag:1.5},
  {type:'ramp',   x:36, y:5, w:8, rise:-3},
  {type:'flat',   x:44, y:2, w:6},
  {type:'boost',  x:50, y:2, w:5, rise:2.2, power:28}, // Accelerating boost ramp
  {type:'gap',    x:55, w:3.5},
  {type:'flat',   x:58.5, y:2, w:6},
  {type:'ramp',   x:64.5, y:2, w:6, rise:1.5},
  {type:'flat',   x:70.5, y:3.5, w:20},
]},

// 15: Roller coaster with steep switchbacks
{name:'Level 15', theme:'sunset', spawnX:1.5, spawnY:3, finishX:90, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'ramp', x:8, y:2, w:4, rise:3},
  {type:'ramp', x:12, y:5, w:4, rise:-3},
  {type:'ramp', x:16, y:2, w:4, rise:4},
  {type:'ramp', x:20, y:6, w:4, rise:-4},
  {type:'flat', x:24, y:2, w:4},
  {type:'ramp', x:28, y:2, w:5, rise:3.5},
  {type:'flat', x:33, y:5.5, w:3},
  {type:'ramp', x:36, y:5.5, w:5, rise:-3.5},
  {type:'ramp', x:41, y:2, w:5, rise:4.5},
  {type:'flat', x:46, y:6.5, w:6},
  {type:'ramp', x:52, y:6.5, w:6, rise:-4.5},
  {type:'flat', x:58, y:2, w:4},
  {type:'ramp', x:62, y:2, w:3, rise:2.5},
  {type:'ramp', x:65, y:4.5, w:3, rise:-2.5},
  {type:'flat', x:68, y:2, w:24},
]},

// 16: Bumpy bridge
{name:'Level 16', theme:'sunset', spawnX:1.5, spawnY:3, finishX:88, segments:[
  {type:'flat',   x:0, y:2, w:8},
  {type:'bump',   x:8, y:2, w:3, h:0.8},
  {type:'flat',   x:11, y:2, w:4},
  {type:'bridge', x:15, y:2, w:18, sag:1.5},
  {type:'flat',   x:33, y:2, w:4},
  {type:'bump',   x:37, y:2, w:4, h:1.0},
  {type:'flat',   x:41, y:2, w:4},
  {type:'bridge', x:45, y:2, w:18, sag:2},
  {type:'flat',   x:63, y:2, w:28},
]},

// 17: Tall mountain + steep descent + bridge
{name:'Level 17', theme:'sunset', spawnX:1.5, spawnY:3, finishX:96, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'ramp',   x:10, y:2, w:10, rise:5},
  {type:'flat',   x:20, y:7, w:4},
  {type:'ramp',   x:24, y:7, w:4, rise:2},
  {type:'ramp',   x:28, y:9, w:5, rise:-4},
  {type:'ramp',   x:33, y:5, w:5, rise:-3},
  {type:'flat',   x:38, y:2, w:4},
  {type:'bridge', x:42, y:2, w:20, sag:2},
  {type:'flat',   x:62, y:2, w:4},
  {type:'ramp',   x:66, y:2, w:4, rise:3},
  {type:'ramp',   x:70, y:5, w:4, rise:-3},
  {type:'flat',   x:74, y:2, w:24},
]},

// 18: Mountain pass + accelerating gap launch
{name:'Level 18', theme:'sunset', spawnX:1.5, spawnY:3, finishX:92, segments:[
  {type:'flat',  x:0, y:2, w:10},
  {type:'ramp',  x:10, y:2, w:8, rise:4},
  {type:'flat',  x:18, y:6, w:6},
  {type:'boost', x:24, y:6, w:6, rise:2, power:28}, // Accelerating boost ramp
  {type:'gap',   x:30, w:4},
  {type:'flat',  x:34, y:6, w:8},
  {type:'ramp',  x:42, y:6, w:8, rise:-4},
  {type:'flat',  x:50, y:2, w:6},
  {type:'ramp',  x:56, y:2, w:8, rise:3},
  {type:'flat',  x:64, y:5, w:6},
  {type:'ramp',  x:70, y:5, w:8, rise:-3},
  {type:'flat',  x:78, y:2, w:16},
]},

// 19: Double bridge height
{name:'Level 19', theme:'sunset', spawnX:1.5, spawnY:3, finishX:94, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'ramp',   x:10, y:2, w:6, rise:2},
  {type:'bridge', x:16, y:4, w:16, sag:1.5},
  {type:'ramp',   x:32, y:4, w:6, rise:-2},
  {type:'flat',   x:38, y:2, w:6},
  {type:'ramp',   x:44, y:2, w:6, rise:3},
  {type:'bridge', x:50, y:5, w:18, sag:2},
  {type:'ramp',   x:68, y:5, w:6, rise:-3},
  {type:'flat',   x:74, y:2, w:22},
]},

// 20: Grand finale with steep chicanes
{name:'Level 20', theme:'sunset', spawnX:1.5, spawnY:3, finishX:102, segments:[
  {type:'flat',   x:0, y:2, w:8},
  {type:'ramp',   x:8, y:2, w:4, rise:3},
  {type:'bridge', x:12, y:5, w:16, sag:1.8},
  {type:'ramp',   x:28, y:5, w:4, rise:-3},
  {type:'flat',   x:32, y:2, w:4},
  {type:'ramp',   x:36, y:2, w:3, rise:2.5},
  {type:'ramp',   x:39, y:4.5, w:3, rise:-2.5},
  {type:'bump',   x:42, y:2, w:3, h:1.0},
  {type:'flat',   x:45, y:2, w:4},
  {type:'ramp',   x:49, y:2, w:5, rise:4.5},
  {type:'flat',   x:54, y:6.5, w:4},
  {type:'ramp',   x:58, y:6.5, w:5, rise:-4.5},
  {type:'flat',   x:63, y:2, w:3},
  {type:'ramp',   x:66, y:2, w:3, rise:3},
  {type:'ramp',   x:69, y:5, w:3, rise:-3},
  {type:'flat',   x:72, y:2, w:4},
  {type:'bridge', x:76, y:2, w:12, sag:1.5},
  {type:'flat',   x:88, y:2, w:16},
]},

// ══ WORLD 3: Forest (21-30) — Steeper hills, spinners ═══════════════════════

// 21: Deep valley
{name:'Level 21', theme:'forest', spawnX:1.5, spawnY:6, finishX:88, segments:[
  {type:'flat', x:0, y:5, w:10},
  {type:'ramp', x:10, y:5, w:8, rise:-3},
  {type:'flat', x:18, y:2, w:8},
  {type:'ramp', x:26, y:2, w:8, rise:3},
  {type:'flat', x:34, y:5, w:6},
  {type:'ramp', x:40, y:5, w:8, rise:-3},
  {type:'flat', x:48, y:2, w:6},
  {type:'ramp', x:54, y:2, w:8, rise:3},
  {type:'flat', x:62, y:5, w:28},
]},

// 22: Bridge + bumps
{name:'Level 22', theme:'forest', spawnX:1.5, spawnY:3, finishX:92, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'bump',   x:9, y:2, w:3, h:0.8},
  {type:'bridge', x:13, y:2, w:18, sag:1.8},
  {type:'flat',   x:31, y:2, w:6},
  {type:'bump',   x:35, y:2, w:3, h:1.0},
  {type:'flat',   x:39, y:2, w:6},
  {type:'bridge', x:45, y:2, w:20, sag:2},
  {type:'flat',   x:65, y:2, w:30},
]},

// 23: Steep staircase mountain
{name:'Level 23', theme:'forest', spawnX:1.5, spawnY:3, finishX:100, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'ramp', x:8, y:2, w:4, rise:2.5},
  {type:'flat', x:12, y:4.5, w:3},
  {type:'ramp', x:15, y:4.5, w:4, rise:2.5},
  {type:'flat', x:19, y:7, w:3},
  {type:'ramp', x:22, y:7, w:4, rise:3},
  {type:'flat', x:26, y:10, w:8},
  {type:'ramp', x:34, y:10, w:4, rise:-3},
  {type:'flat', x:38, y:7, w:3},
  {type:'ramp', x:41, y:7, w:4, rise:-2.5},
  {type:'flat', x:45, y:4.5, w:3},
  {type:'ramp', x:48, y:4.5, w:4, rise:-2.5},
  {type:'flat', x:52, y:2, w:4},
  {type:'ramp', x:56, y:2, w:3, rise:2},
  {type:'ramp', x:59, y:4, w:3, rise:-2},
  {type:'flat', x:62, y:2, w:40},
]},

// 24: Bridge valley
{name:'Level 24', theme:'forest', spawnX:1.5, spawnY:3, finishX:96, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'ramp',   x:10, y:2, w:6, rise:3},
  {type:'bridge', x:16, y:5, w:22, sag:2.5},
  {type:'ramp',   x:38, y:5, w:6, rise:-3},
  {type:'flat',   x:44, y:2, w:6},
  {type:'ramp',   x:50, y:2, w:6, rise:2},
  {type:'bridge', x:56, y:4, w:18, sag:2},
  {type:'ramp',   x:74, y:4, w:6, rise:-2},
  {type:'flat',   x:80, y:2, w:18},
]},

// 25: Spinner dodge + steep approach
{name:'Level 25', theme:'forest', spawnX:1.5, spawnY:3, finishX:96,
 obstacles:[{type:'spinner', x:32, y:5.5, r:1.2, speed:2.5}],
 segments:[
  {type:'flat', x:0, y:2, w:12},
  {type:'ramp', x:12, y:2, w:4, rise:3},
  {type:'flat', x:16, y:5, w:4},
  {type:'ramp', x:20, y:5, w:4, rise:-3},
  {type:'flat', x:24, y:2, w:6},
  {type:'flat', x:30, y:2, w:12},
  {type:'ramp', x:42, y:2, w:4, rise:3.5},
  {type:'ramp', x:46, y:5.5, w:4, rise:-3.5},
  {type:'flat', x:50, y:2, w:4},
  {type:'ramp', x:54, y:2, w:5, rise:2.5},
  {type:'flat', x:59, y:4.5, w:6},
  {type:'ramp', x:65, y:4.5, w:5, rise:-2.5},
  {type:'flat', x:70, y:2, w:28},
]},

// 26: Grand mountain
{name:'Level 26', theme:'forest', spawnX:1.5, spawnY:3, finishX:100, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'ramp', x:8, y:2, w:10, rise:5},
  {type:'flat', x:18, y:7, w:8},
  {type:'ramp', x:26, y:7, w:6, rise:2},
  {type:'flat', x:32, y:9, w:6},
  {type:'ramp', x:38, y:9, w:6, rise:-2},
  {type:'flat', x:44, y:7, w:6},
  {type:'ramp', x:50, y:7, w:10, rise:-5},
  {type:'flat', x:60, y:2, w:6},
  {type:'bump', x:64, y:2, w:3, h:0.9},
  {type:'flat', x:67, y:2, w:36},
]},

// 27: Desert bridges
{name:'Level 27', theme:'desert', spawnX:1.5, spawnY:3, finishX:94, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'bridge', x:10, y:2, w:24, sag:2},
  {type:'flat',   x:34, y:2, w:6},
  {type:'ramp',   x:40, y:2, w:6, rise:2},
  {type:'flat',   x:46, y:4, w:4},
  {type:'ramp',   x:50, y:4, w:6, rise:-2},
  {type:'bridge', x:56, y:2, w:20, sag:2.5},
  {type:'flat',   x:76, y:2, w:20},
]},

// 28: Desert bumpy road
{name:'Level 28', theme:'desert', spawnX:1.5, spawnY:3, finishX:90, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'bump', x:8, y:2, w:3, h:0.7},
  {type:'flat', x:11, y:2, w:5},
  {type:'bump', x:16, y:2, w:3, h:0.9},
  {type:'flat', x:19, y:2, w:5},
  {type:'bump', x:24, y:2, w:4, h:1.1},
  {type:'flat', x:28, y:2, w:6},
  {type:'ramp', x:34, y:2, w:8, rise:3},
  {type:'flat', x:42, y:5, w:8},
  {type:'ramp', x:50, y:5, w:8, rise:-3},
  {type:'flat', x:58, y:2, w:6},
  {type:'bump', x:62, y:2, w:3, h:0.8},
  {type:'flat', x:65, y:2, w:28},
]},

// 29: Desert Nitro Jump Sprint
{name:'Level 29', theme:'desert', spawnX:1.5, spawnY:3, finishX:92, segments:[
  {type:'flat',  x:0, y:2, w:8},
  {type:'boost', x:8, y:2, w:3, power:30},
  {type:'ramp',  x:11, y:2, w:5, rise:2.5},
  {type:'gap',   x:16, w:3.5},
  {type:'flat',  x:19.5, y:2, w:6},
  {type:'boost', x:25.5, y:2, w:3, power:32},
  {type:'ramp',  x:28.5, y:2, w:5, rise:3},
  {type:'gap',   x:33.5, w:4},
  {type:'flat',  x:37.5, y:2, w:6},
  {type:'bounce',x:43.5, y:2, w:3, power:16},
  {type:'ramp',  x:46.5, y:2, w:4, rise:3.5},
  {type:'gap',   x:50.5, w:4.5},
  {type:'flat',  x:55, y:2, w:6},
  {type:'boost', x:61, y:2, w:3, power:35},
  {type:'ramp',  x:64, y:2, w:5, rise:3.5},
  {type:'gap',   x:69, w:5},
  {type:'flat',  x:74, y:2, w:20},
]},

// 30: Desert epic
{name:'Level 30', theme:'desert', spawnX:1.5, spawnY:3, finishX:100, segments:[
  {type:'flat',   x:0, y:2, w:8},
  {type:'ramp',   x:8, y:2, w:8, rise:4},
  {type:'flat',   x:16, y:6, w:6},
  {type:'ramp',   x:22, y:6, w:8, rise:-4},
  {type:'flat',   x:30, y:2, w:4},
  {type:'bridge', x:34, y:2, w:20, sag:2},
  {type:'flat',   x:54, y:2, w:6},
  {type:'ramp',   x:60, y:2, w:6, rise:2.5},
  {type:'gap',    x:66, w:3},
  {type:'flat',   x:69, y:2, w:4},
  {type:'ramp',   x:73, y:2, w:6, rise:2},
  {type:'flat',   x:79, y:4, w:24},
]},

// ══ WORLD 4: Night (31-40) — Steep terrain, spinners ════════════════════════

// 31: Night bumps
{name:'Level 31', theme:'night', spawnX:1.5, spawnY:3, finishX:88, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'bump', x:8, y:2, w:3, h:0.9},
  {type:'flat', x:11, y:2, w:6},
  {type:'bump', x:17, y:2, w:4, h:1.2},
  {type:'flat', x:21, y:2, w:6},
  {type:'ramp', x:27, y:2, w:8, rise:4},
  {type:'flat', x:35, y:6, w:8},
  {type:'bump', x:39, y:6, w:3, h:0.8},
  {type:'ramp', x:43, y:6, w:8, rise:-4},
  {type:'flat', x:51, y:2, w:6},
  {type:'bump', x:55, y:2, w:3, h:0.7},
  {type:'flat', x:58, y:2, w:32},
]},

// 32: Double bridge
{name:'Level 32', theme:'night', spawnX:1.5, spawnY:3, finishX:96, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'bridge', x:10, y:2, w:20, sag:2},
  {type:'flat',   x:30, y:2, w:6},
  {type:'ramp',   x:36, y:2, w:6, rise:3},
  {type:'flat',   x:42, y:5, w:4},
  {type:'bridge', x:46, y:5, w:18, sag:2.5},
  {type:'ramp',   x:64, y:5, w:6, rise:-3},
  {type:'flat',   x:70, y:2, w:28},
]},

// 33: Big jump launches with steep ramps
{name:'Level 33', theme:'night', spawnX:1.5, spawnY:3, finishX:94, segments:[
  {type:'flat', x:0, y:2, w:12},
  {type:'ramp', x:12, y:2, w:5, rise:3.5},
  {type:'gap',  x:17, w:4},
  {type:'flat', x:21, y:2, w:6},
  {type:'ramp', x:27, y:2, w:3, rise:3},
  {type:'ramp', x:30, y:5, w:3, rise:-3},
  {type:'flat', x:33, y:2, w:4},
  {type:'ramp', x:37, y:2, w:5, rise:4.5},
  {type:'gap',  x:42, w:4},
  {type:'flat', x:46, y:2, w:4},
  {type:'ramp', x:50, y:2, w:4, rise:3},
  {type:'ramp', x:54, y:5, w:4, rise:-3},
  {type:'flat', x:58, y:2, w:38},
]},

// 34: Tall peaks
{name:'Level 34', theme:'night', spawnX:1.5, spawnY:3, finishX:104, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'ramp', x:8, y:2, w:10, rise:6},
  {type:'flat', x:18, y:8, w:6},
  {type:'ramp', x:24, y:8, w:10, rise:-6},
  {type:'flat', x:34, y:2, w:6},
  {type:'ramp', x:40, y:2, w:10, rise:7},
  {type:'flat', x:50, y:9, w:6},
  {type:'ramp', x:56, y:9, w:10, rise:-7},
  {type:'flat', x:66, y:2, w:6},
  {type:'ramp', x:72, y:2, w:8, rise:3},
  {type:'flat', x:80, y:5, w:26},
]},

// 35: Spinner + bridge
{name:'Level 35', theme:'night', spawnX:1.5, spawnY:3, finishX:96,
 obstacles:[{type:'spinner', x:42, y:5.5, r:1.2, speed:2.5}],
 segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'ramp',   x:10, y:2, w:6, rise:2},
  {type:'flat',   x:16, y:4, w:6},
  {type:'ramp',   x:22, y:4, w:6, rise:-2},
  {type:'flat',   x:28, y:2, w:6},
  {type:'bridge', x:34, y:2, w:22, sag:2},
  {type:'flat',   x:56, y:2, w:6},
  {type:'ramp',   x:62, y:2, w:6, rise:2.5},
  {type:'flat',   x:68, y:4.5, w:6},
  {type:'ramp',   x:74, y:4.5, w:6, rise:-2.5},
  {type:'flat',   x:80, y:2, w:18},
]},

// 36: Storm steep switchbacks
{name:'Level 36', theme:'storm', spawnX:1.5, spawnY:3, finishX:100, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'ramp', x:8, y:2, w:3, rise:3},
  {type:'ramp', x:11, y:5, w:3, rise:-3},
  {type:'flat', x:14, y:2, w:3},
  {type:'ramp', x:17, y:2, w:3, rise:4},
  {type:'ramp', x:20, y:6, w:3, rise:-4},
  {type:'flat', x:23, y:2, w:3},
  {type:'ramp', x:26, y:2, w:4, rise:5},
  {type:'flat', x:30, y:7, w:4},
  {type:'ramp', x:34, y:7, w:4, rise:-5},
  {type:'flat', x:38, y:2, w:4},
  {type:'ramp', x:42, y:2, w:3, rise:3.5},
  {type:'ramp', x:45, y:5.5, w:3, rise:-3.5},
  {type:'flat', x:48, y:2, w:3},
  {type:'ramp', x:51, y:2, w:4, rise:2.5},
  {type:'flat', x:55, y:4.5, w:4},
  {type:'ramp', x:59, y:4.5, w:4, rise:-2.5},
  {type:'flat', x:63, y:2, w:40},
]},

// 37: Storm triple bridge
{name:'Level 37', theme:'storm', spawnX:1.5, spawnY:3, finishX:100, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'bridge', x:10, y:2, w:18, sag:2},
  {type:'flat',   x:28, y:2, w:4},
  {type:'ramp',   x:32, y:2, w:6, rise:3},
  {type:'flat',   x:38, y:5, w:4},
  {type:'bridge', x:42, y:5, w:16, sag:2.5},
  {type:'ramp',   x:58, y:5, w:6, rise:-3},
  {type:'flat',   x:64, y:2, w:4},
  {type:'bridge', x:68, y:2, w:14, sag:1.8},
  {type:'flat',   x:82, y:2, w:20},
]},

// 38: Bumps and hills
{name:'Level 38', theme:'storm', spawnX:1.5, spawnY:3, finishX:96, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'bump', x:8, y:2, w:3, h:0.8},
  {type:'flat', x:11, y:2, w:7},
  {type:'ramp', x:18, y:2, w:8, rise:4},
  {type:'flat', x:26, y:6, w:6},
  {type:'bump', x:28, y:6, w:3, h:0.9},
  {type:'ramp', x:32, y:6, w:8, rise:-4},
  {type:'flat', x:40, y:2, w:8},
  {type:'bump', x:46, y:2, w:3, h:1.0},
  {type:'flat', x:49, y:2, w:8},
  {type:'ramp', x:57, y:2, w:6, rise:3},
  {type:'flat', x:63, y:5, w:6},
  {type:'ramp', x:69, y:5, w:6, rise:-3},
  {type:'flat', x:75, y:2, w:24},
]},

// 39: Storm epic peaks with sharp drops
{name:'Level 39', theme:'storm', spawnX:1.5, spawnY:3, finishX:108, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'ramp', x:8, y:2, w:6, rise:5},
  {type:'flat', x:14, y:7, w:4},
  {type:'ramp', x:18, y:7, w:3, rise:3},
  {type:'ramp', x:21, y:10, w:3, rise:-3},
  {type:'flat', x:24, y:7, w:3},
  {type:'ramp', x:27, y:7, w:4, rise:2},
  {type:'gap',  x:31, w:3},
  {type:'flat', x:34, y:7, w:4},
  {type:'ramp', x:38, y:7, w:5, rise:-5},
  {type:'flat', x:43, y:2, w:4},
  {type:'ramp', x:47, y:2, w:5, rise:6},
  {type:'flat', x:52, y:8, w:4},
  {type:'ramp', x:56, y:8, w:3, rise:2.5},
  {type:'ramp', x:59, y:10.5, w:3, rise:-2.5},
  {type:'ramp', x:62, y:8, w:5, rise:-6},
  {type:'flat', x:67, y:2, w:44},
]},

// 40: Storm finale
{name:'Level 40', theme:'storm', spawnX:1.5, spawnY:3, finishX:108, segments:[
  {type:'flat',   x:0, y:2, w:8},
  {type:'ramp',   x:8, y:2, w:6, rise:3},
  {type:'bridge', x:14, y:5, w:16, sag:2},
  {type:'ramp',   x:30, y:5, w:6, rise:-3},
  {type:'flat',   x:36, y:2, w:4},
  {type:'bump',   x:38, y:2, w:3, h:1.0},
  {type:'flat',   x:41, y:2, w:4},
  {type:'ramp',   x:45, y:2, w:8, rise:5},
  {type:'flat',   x:53, y:7, w:8},
  {type:'ramp',   x:61, y:7, w:8, rise:-5},
  {type:'flat',   x:69, y:2, w:4},
  {type:'bump',   x:71, y:2, w:4, h:1.1},
  {type:'flat',   x:75, y:2, w:4},
  {type:'bridge', x:79, y:2, w:14, sag:2},
  {type:'flat',   x:93, y:2, w:18},
]},

// ══ WORLD 5: Candy & Space (41-50) — Hardest ════════════════════════════════

// 41: Candy steep hills
{name:'Level 41', theme:'candy', spawnX:1.5, spawnY:3, finishX:104, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'ramp', x:8, y:2, w:4, rise:3.5},
  {type:'flat', x:12, y:5.5, w:3},
  {type:'ramp', x:15, y:5.5, w:4, rise:-3.5},
  {type:'flat', x:19, y:2, w:3},
  {type:'ramp', x:22, y:2, w:4, rise:4.5},
  {type:'flat', x:26, y:6.5, w:4},
  {type:'ramp', x:30, y:6.5, w:4, rise:-4.5},
  {type:'flat', x:34, y:2, w:3},
  {type:'ramp', x:37, y:2, w:3, rise:3},
  {type:'ramp', x:40, y:5, w:3, rise:-3},
  {type:'ramp', x:43, y:2, w:3, rise:4},
  {type:'ramp', x:46, y:6, w:3, rise:-4},
  {type:'flat', x:49, y:2, w:4},
  {type:'bump', x:51, y:2, w:3, h:1.2},
  {type:'flat', x:54, y:2, w:4},
  {type:'ramp', x:58, y:2, w:4, rise:3},
  {type:'flat', x:62, y:5, w:4},
  {type:'ramp', x:66, y:5, w:4, rise:-3},
  {type:'flat', x:70, y:2, w:36},
]},

// 42: Candy bridges
{name:'Level 42', theme:'candy', spawnX:1.5, spawnY:3, finishX:104, segments:[
  {type:'flat',   x:0, y:2, w:10},
  {type:'bridge', x:10, y:2, w:22, sag:2.5},
  {type:'flat',   x:32, y:2, w:4},
  {type:'ramp',   x:36, y:2, w:6, rise:3},
  {type:'bridge', x:42, y:5, w:20, sag:3},
  {type:'ramp',   x:62, y:5, w:6, rise:-3},
  {type:'flat',   x:68, y:2, w:4},
  {type:'bridge', x:72, y:2, w:16, sag:2},
  {type:'flat',   x:88, y:2, w:18},
]},

// 43: Candy accelerating ramps
{name:'Level 43', theme:'candy', spawnX:1.5, spawnY:3, finishX:96, segments:[
  {type:'flat',  x:0, y:2, w:8},
  {type:'boost', x:8, y:2, w:5, rise:2, power:28}, // Accelerating ramp 1
  {type:'gap',   x:13, w:3.5},
  {type:'flat',  x:16.5, y:2, w:6},
  {type:'ramp',  x:22.5, y:2, w:6, rise:2.5},
  {type:'gap',   x:28.5, w:3.5},
  {type:'flat',  x:32, y:2, w:6},
  {type:'boost', x:38, y:2, w:5, rise:3, power:32}, // Accelerating ramp 2
  {type:'gap',   x:43, w:4.5},
  {type:'flat',  x:47.5, y:2, w:8},
  {type:'ramp',  x:55.5, y:2, w:6, rise:2},
  {type:'flat',  x:61.5, y:4, w:6},
  {type:'ramp',  x:67.5, y:4, w:6, rise:-2},
  {type:'flat',  x:73.5, y:2, w:25},
]},

// 44: Candy bumps + hills
{name:'Level 44', theme:'candy', spawnX:1.5, spawnY:3, finishX:100, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'bump', x:8, y:2, w:3, h:0.8},
  {type:'flat', x:11, y:2, w:5},
  {type:'ramp', x:16, y:2, w:8, rise:4},
  {type:'flat', x:24, y:6, w:6},
  {type:'bump', x:26, y:6, w:3, h:0.9},
  {type:'ramp', x:30, y:6, w:8, rise:-4},
  {type:'flat', x:38, y:2, w:6},
  {type:'bump', x:42, y:2, w:4, h:1.0},
  {type:'flat', x:46, y:2, w:6},
  {type:'ramp', x:52, y:2, w:8, rise:3},
  {type:'flat', x:60, y:5, w:6},
  {type:'ramp', x:66, y:5, w:8, rise:-3},
  {type:'flat', x:74, y:2, w:28},
]},

// 45: Candy spinners
{name:'Level 45', theme:'candy', spawnX:1.5, spawnY:3, finishX:104,
 obstacles:[
   {type:'spinner', x:38, y:5.5, r:1.2, speed:3},
   {type:'spinner', x:68, y:5.5, r:1.2, speed:3.5},
 ],
 segments:[
  {type:'flat', x:0, y:2, w:12},
  {type:'ramp', x:12, y:2, w:8, rise:3},
  {type:'flat', x:20, y:5, w:6},
  {type:'ramp', x:26, y:5, w:8, rise:-3},
  {type:'flat', x:34, y:2, w:14},
  {type:'ramp', x:48, y:2, w:6, rise:2},
  {type:'flat', x:54, y:4, w:4},
  {type:'ramp', x:58, y:4, w:6, rise:-2},
  {type:'flat', x:64, y:2, w:14},
  {type:'bridge', x:78, y:2, w:12, sag:1.5},
  {type:'flat', x:90, y:2, w:16},
]},

// 46: Space steep peaks
{name:'Level 46', theme:'space', spawnX:1.5, spawnY:3, finishX:112, segments:[
  {type:'flat', x:0, y:2, w:8},
  {type:'ramp', x:8, y:2, w:5, rise:5},
  {type:'flat', x:13, y:7, w:3},
  {type:'ramp', x:16, y:7, w:3, rise:3},
  {type:'ramp', x:19, y:10, w:3, rise:-3},
  {type:'ramp', x:22, y:7, w:5, rise:-5},
  {type:'flat', x:27, y:2, w:4},
  {type:'ramp', x:31, y:2, w:5, rise:6},
  {type:'flat', x:36, y:8, w:3},
  {type:'ramp', x:39, y:8, w:3, rise:3},
  {type:'ramp', x:42, y:11, w:3, rise:-3},
  {type:'ramp', x:45, y:8, w:5, rise:-6},
  {type:'flat', x:50, y:2, w:4},
  {type:'ramp', x:54, y:2, w:4, rise:4.5},
  {type:'ramp', x:58, y:6.5, w:4, rise:-4.5},
  {type:'ramp', x:62, y:2, w:4, rise:4},
  {type:'flat', x:66, y:6, w:4},
  {type:'ramp', x:70, y:6, w:4, rise:-4},
  {type:'flat', x:74, y:2, w:40},
]},

// 47: Space high bridges
{name:'Level 47', theme:'space', spawnX:1.5, spawnY:3, finishX:110, segments:[
  {type:'flat',   x:0, y:2, w:8},
  {type:'ramp',   x:8, y:2, w:10, rise:7},
  {type:'bridge', x:18, y:9, w:18, sag:2.5},
  {type:'ramp',   x:36, y:9, w:10, rise:-7},
  {type:'flat',   x:46, y:2, w:6},
  {type:'ramp',   x:52, y:2, w:10, rise:8},
  {type:'flat',   x:62, y:10, w:8},
  {type:'ramp',   x:70, y:10, w:10, rise:-8},
  {type:'flat',   x:80, y:2, w:6},
  {type:'bridge', x:86, y:2, w:12, sag:1.5},
  {type:'flat',   x:98, y:2, w:14},
]},

// 48: Space gap marathon
{name:'Level 48', theme:'space', spawnX:1.5, spawnY:3, finishX:108, segments:[
  {type:'flat', x:0, y:2, w:10},
  {type:'ramp', x:10, y:2, w:6, rise:2},
  {type:'gap',  x:16, w:3},
  {type:'flat', x:19, y:2, w:8},
  {type:'ramp', x:27, y:2, w:6, rise:2.5},
  {type:'gap',  x:33, w:3.5},
  {type:'flat', x:36.5, y:2, w:8},
  {type:'ramp', x:44.5, y:2, w:6, rise:3},
  {type:'gap',  x:50.5, w:4},
  {type:'flat', x:54.5, y:2, w:8},
  {type:'ramp', x:62.5, y:2, w:6, rise:3},
  {type:'gap',  x:68.5, w:4},
  {type:'flat', x:72.5, y:2, w:38},
]},

// 49: Space spinner epic
{name:'Level 49', theme:'space', spawnX:1.5, spawnY:3, finishX:112,
 obstacles:[{type:'spinner', x:50, y:5.5, r:1.3, speed:4}],
 segments:[
  {type:'flat',   x:0, y:2, w:8},
  {type:'ramp',   x:8, y:2, w:8, rise:4},
  {type:'flat',   x:16, y:6, w:6},
  {type:'ramp',   x:22, y:6, w:8, rise:-4},
  {type:'flat',   x:30, y:2, w:6},
  {type:'bridge', x:36, y:2, w:22, sag:2.5},
  {type:'flat',   x:58, y:2, w:6},
  {type:'ramp',   x:64, y:2, w:8, rise:5},
  {type:'flat',   x:72, y:7, w:6},
  {type:'ramp',   x:78, y:7, w:8, rise:-5},
  {type:'flat',   x:86, y:2, w:28},
]},

// 50: FINAL — Ultimate steep challenge
{name:'Level 50', theme:'space', spawnX:1.5, spawnY:3, finishX:136,
 obstacles:[
   {type:'spinner', x:60, y:5.5, r:1.3, speed:4},
   {type:'spinner', x:100, y:11.5, r:1.3, speed:4.5},
 ],
 segments:[
  {type:'flat',   x:0, y:2, w:8},
  {type:'ramp',   x:8, y:2, w:4, rise:4},
  {type:'flat',   x:12, y:6, w:3},
  {type:'ramp',   x:15, y:6, w:3, rise:3},
  {type:'ramp',   x:18, y:9, w:3, rise:-3},
  {type:'ramp',   x:21, y:6, w:4, rise:-4},
  {type:'flat',   x:25, y:2, w:3},
  {type:'bump',   x:26, y:2, w:3, h:1.2},
  {type:'flat',   x:29, y:2, w:4},
  {type:'bridge', x:33, y:2, w:18, sag:2.5},
  {type:'flat',   x:51, y:2, w:4},
  {type:'ramp',   x:55, y:2, w:4, rise:3},
  {type:'gap',    x:59, w:3.5},
  {type:'flat',   x:62.5, y:2, w:4},
  {type:'ramp',   x:66.5, y:2, w:3, rise:3.5},
  {type:'ramp',   x:69.5, y:5.5, w:3, rise:-3.5},
  {type:'flat',   x:72.5, y:2, w:4},
  {type:'ramp',   x:76.5, y:2, w:5, rise:6},
  {type:'flat',   x:81.5, y:8, w:3},
  {type:'ramp',   x:84.5, y:8, w:3, rise:3},
  {type:'ramp',   x:87.5, y:11, w:3, rise:-3},
  {type:'ramp',   x:90.5, y:8, w:5, rise:-6},
  {type:'flat',   x:95.5, y:2, w:3},
  {type:'ramp',   x:98.5, y:2, w:3, rise:4},
  {type:'ramp',   x:101.5, y:6, w:3, rise:-4},
  {type:'flat',   x:104.5, y:2, w:34},
]},

];

// ─────────────────────────────────────────────────────────────────────────────
//  CAR CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const CAR_CONFIG = {
  engineForce:  13000,  gravity:        -20,
  maxSpeed:        16,  friction:       0.88,
  brakeForce:    4000,  airFriction:   0.985,
  reverseForce:  3500,  tiltTorque:    2800,
  suspensionK:    600,  suspensionDamp:  30,
  wheelRadius:   0.42,  mass:           370,
  bodyWidth:      2.4,  bodyHeight:     0.7,
  bodyColor:   '#ff6b35', roofColor: '#1a1a2e',
  wheelColor:  '#222',  tireColor:  '#333',
  headOffset: { x: -0.1, y: 0.9 },
  headRadius:  0.28,
};
