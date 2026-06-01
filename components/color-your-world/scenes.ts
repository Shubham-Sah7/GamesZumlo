// SVG path helpers
const r = (x: number, y: number, w: number, h: number) =>
  `M${x},${y}h${w}v${h}h${-w}Z`
const c = (cx: number, cy: number, rad: number) =>
  `M${cx + rad},${cy}A${rad},${rad}0,1,1,${cx - rad},${cy}A${rad},${rad}0,1,1,${cx + rad},${cy}Z`
const e = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx + rx},${cy}A${rx},${ry}0,1,1,${cx - rx},${cy}A${rx},${ry}0,1,1,${cx + rx},${cy}Z`
const t = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) =>
  `M${x1},${y1}L${x2},${y2}L${x3},${y3}Z`

export interface Region {
  id:           string
  d:            string
  label:        string
  fill:         string  // default / "uncolored" fill
  stroke?:      string
  strokeWidth?: number
  fillRule?:    'nonzero' | 'evenodd'
}

export interface Scene {
  id:          string
  name:        string
  emoji:       string
  mood:        string
  viewBox:     string
  background:  string
  regions:     Region[]
  decorations: Array<{ d: string; stroke: string; strokeWidth?: number }> // non-interactive overlays
}

// ─── SCENE 1: Moonlight Village ──────────────────────────────────────────────
const moonlightVillage: Scene = {
  id: 'moonlight-village',
  name: 'Moonlight Village',
  emoji: '🌙',
  mood: 'cozy & dreamy',
  viewBox: '0 0 400 480',
  background: '#1a2744',
  regions: [
    // Sky & Ground
    { id: 'sky',    d: r(0,0,400,280),    label: 'Night sky',   fill: '#e8eaf6' },
    { id: 'ground', d: r(0,280,400,200),  label: 'Ground',      fill: '#e8f5e9' },
    { id: 'road',   d: 'M150,480Q175,375,200,342L250,342Q268,372,260,480Z', label: 'Road', fill: '#f5f5f5' },

    // Moon + craters
    { id: 'moon',    d: c(325,65,42),    label: 'Moon',         fill: '#fff9c4' },
    { id: 'mc1',     d: e(310,54,9,6),   label: 'Moon crater',  fill: '#f5e6a3', strokeWidth: 0.8 },
    { id: 'mc2',     d: e(338,78,7,4),   label: 'Moon crater',  fill: '#f5e6a3', strokeWidth: 0.8 },

    // Stars
    { id: 'st1', d: c(50,32,4),    label: 'Star', fill: '#fff9c4' },
    { id: 'st2', d: c(95,20,4.5),  label: 'Star', fill: '#fff9c4' },
    { id: 'st3', d: c(155,46,3.5), label: 'Star', fill: '#fff9c4' },
    { id: 'st4', d: c(212,29,4),   label: 'Star', fill: '#fff9c4' },
    { id: 'st5', d: c(258,50,3),   label: 'Star', fill: '#fff9c4' },
    { id: 'st6', d: c(82,144,3),   label: 'Star', fill: '#fff9c4' },
    { id: 'st7', d: c(186,122,3.5),label: 'Star', fill: '#fff9c4' },

    // Clouds
    { id: 'cl1', d: 'M35,115Q42,96,65,98Q76,82,100,92Q115,82,120,98Q130,98,125,116Q110,126,80,126Q50,124,35,115Z', label: 'Cloud', fill: '#fafafa' },
    { id: 'cl2', d: 'M168,90Q175,72,200,74Q212,60,230,70Q242,66,240,82Q244,94,230,98Q210,102,192,100Q165,100,168,90Z', label: 'Cloud', fill: '#fafafa' },

    // House 1 (left)
    { id: 'h1_body',  d: r(18,222,90,78),    label: 'House wall',    fill: '#fafafa' },
    { id: 'h1_roof',  d: t(5,222,63,157,120,222), label: 'Roof',     fill: '#fafafa' },
    { id: 'h1_door',  d: r(50,263,24,37),    label: 'Door',          fill: '#fafafa' },
    { id: 'h1_win_l', d: r(24,240,26,23),    label: 'Window',        fill: '#fafafa' },
    { id: 'h1_win_r', d: r(72,240,26,23),    label: 'Window',        fill: '#fafafa' },
    { id: 'h1_chim',  d: r(86,170,12,48),    label: 'Chimney',       fill: '#fafafa' },
    // Cat on roof 1
    { id: 'cat_body', d: e(58,163,12,7),     label: 'Cat body',      fill: '#fafafa' },
    { id: 'cat_head', d: c(70,153,8),         label: 'Cat head',      fill: '#fafafa' },
    { id: 'cat_el',   d: t(65,147,70,139,75,146), label: 'Cat ear',  fill: '#fafafa' },
    { id: 'cat_er',   d: t(72,146,77,138,82,145), label: 'Cat ear',  fill: '#fafafa' },

    // House 2 (center, tallest)
    { id: 'h2_body',  d: r(143,180,118,130), label: 'House wall',    fill: '#fafafa' },
    { id: 'h2_roof',  d: t(130,180,202,112,274,180), label: 'Roof',  fill: '#fafafa' },
    { id: 'h2_door',  d: r(185,255,34,55),   label: 'Door',          fill: '#fafafa' },
    { id: 'h2_wl',    d: r(153,206,32,30),   label: 'Window',        fill: '#fafafa' },
    { id: 'h2_wr',    d: r(219,206,32,30),   label: 'Window',        fill: '#fafafa' },
    { id: 'h2_attic', d: r(190,132,24,24),   label: 'Attic window',  fill: '#fafafa' },
    { id: 'h2_chim',  d: r(250,138,14,38),   label: 'Chimney',       fill: '#fafafa' },

    // House 3 (right)
    { id: 'h3_body', d: r(295,226,88,74),    label: 'House wall',    fill: '#fafafa' },
    { id: 'h3_roof', d: t(283,226,339,172,394,226), label: 'Roof',  fill: '#fafafa' },
    { id: 'h3_door', d: r(323,263,22,37),    label: 'Door',          fill: '#fafafa' },
    { id: 'h3_win',  d: r(303,246,24,21),    label: 'Window',        fill: '#fafafa' },
    { id: 'h3_chim', d: r(360,182,12,40),    label: 'Chimney',       fill: '#fafafa' },

    // Trees
    { id: 'tr1t', d: r(120,287,10,17),  label: 'Tree trunk', fill: '#fafafa' },
    { id: 'tr1c', d: c(125,269,21),      label: 'Tree crown', fill: '#fafafa' },
    { id: 'tr2t', d: r(267,291,10,17),  label: 'Tree trunk', fill: '#fafafa' },
    { id: 'tr2c', d: c(272,273,19),      label: 'Tree crown', fill: '#fafafa' },
    { id: 'tr3t', d: r(380,284,10,16),  label: 'Tree trunk', fill: '#fafafa' },
    { id: 'tr3c', d: c(385,268,20),      label: 'Tree crown', fill: '#fafafa' },

    // Flowers
    { id: 'fp1', d: e(55,344,5,10),  label: 'Petal', fill: '#fafafa' },
    { id: 'fp2', d: e(65,354,10,5),  label: 'Petal', fill: '#fafafa' },
    { id: 'fp3', d: e(55,364,5,8),   label: 'Petal', fill: '#fafafa' },
    { id: 'fp4', d: e(45,354,8,5),   label: 'Petal', fill: '#fafafa' },
    { id: 'fc',  d: c(55,354,7),      label: 'Flower center', fill: '#fafafa' },
    { id: 'gp1', d: e(360,346,5,10), label: 'Petal', fill: '#fafafa' },
    { id: 'gp2', d: e(370,356,10,5), label: 'Petal', fill: '#fafafa' },
    { id: 'gp3', d: e(360,366,5,8),  label: 'Petal', fill: '#fafafa' },
    { id: 'gp4', d: e(350,356,8,5),  label: 'Petal', fill: '#fafafa' },
    { id: 'gc',  d: c(360,356,7),     label: 'Flower center', fill: '#fafafa' },

    // Lanterns & pond
    { id: 'lan1',  d: r(14,285,9,14),    label: 'Lantern', fill: '#fafafa' },
    { id: 'lan2',  d: r(377,288,9,12),   label: 'Lantern', fill: '#fafafa' },
    { id: 'pond',  d: e(320,412,46,18),  label: 'Pond',    fill: '#fafafa' },
  ],
  decorations: [
    // Window panes
    { d: 'M37,251h13M30,244v16M85,251h13M78,244v16M166,221h19M159,215v22M232,221h19M225,215v22M315,256h12M308,249v15', stroke: '#ccc', strokeWidth: 1 },
    // Smoke from chimneys
    { d: 'M92,168Q96,158,92,148 M255,136Q260,126,255,116 M364,180Q368,170,364,160', stroke: '#ddd', strokeWidth: 1.5 },
    // Cat tail
    { d: 'M46,168Q32,175,30,168Q34,162,46,163', stroke: '#888', strokeWidth: 1.5 },
    // Door knobs
    { d: 'M71,283a2,2,0,1,1-0.01,0 M218,289a2,2,0,1,1-0.01,0 M342,281a2,2,0,1,1-0.01,0', stroke: '#aaa', strokeWidth: 1 },
  ],
}

// ─── SCENE 2: Enchanted Garden ────────────────────────────────────────────────
const enchantedGarden: Scene = {
  id: 'enchanted-garden',
  name: 'Enchanted Garden',
  emoji: '🌸',
  mood: 'magical & peaceful',
  viewBox: '0 0 400 480',
  background: '#fffde7',
  regions: [
    // Sky & ground
    { id: 'sky',    d: r(0,0,400,210),   label: 'Sky',     fill: '#fafafa' },
    { id: 'hills',  d: 'M0,210Q80,165,160,192Q240,165,320,185Q370,172,400,188V310H0Z', label: 'Hills', fill: '#fafafa' },
    { id: 'ground', d: r(0,310,400,170), label: 'Ground',  fill: '#fafafa' },

    // Sun
    { id: 'sun', d: c(62,60,36), label: 'Sun', fill: '#fafafa' },
    { id: 'sun_ray1', d: e(62,14,5,10), label: 'Sun ray', fill: '#fafafa' },
    { id: 'sun_ray2', d: e(108,34,10,5),label: 'Sun ray', fill: '#fafafa' },
    { id: 'sun_ray3', d: e(14,34,10,5), label: 'Sun ray', fill: '#fafafa' },

    // Clouds
    { id: 'cla', d: 'M130,52Q138,34,158,36Q168,22,185,32Q195,28,196,44Q198,58,185,62Q162,66,145,64Q128,62,130,52Z', label: 'Cloud', fill: '#fafafa' },
    { id: 'clb', d: 'M258,78Q265,60,285,62Q295,48,312,58Q322,54,322,70Q326,82,312,86Q290,92,272,90Q256,88,258,78Z', label: 'Cloud', fill: '#fafafa' },

    // FLOWER 1 (large, left — pink)
    { id: 'f1_stem', d: r(80,282,8,88),  label: 'Flower stem', fill: '#fafafa' },
    { id: 'f1_ll',   d: 'M88,348Q120,330,112,312Q92,326,88,348Z', label: 'Leaf', fill: '#fafafa' },
    { id: 'f1_lr',   d: 'M80,342Q48,322,56,305Q76,318,80,342Z',    label: 'Leaf', fill: '#fafafa' },
    { id: 'f1_pt',   d: e(84,260,11,18), label: 'Petal', fill: '#fafafa' },
    { id: 'f1_pr',   d: e(102,277,18,11),label: 'Petal', fill: '#fafafa' },
    { id: 'f1_pb',   d: e(84,294,11,15), label: 'Petal', fill: '#fafafa' },
    { id: 'f1_pl',   d: e(66,277,18,11), label: 'Petal', fill: '#fafafa' },
    { id: 'f1_c',    d: c(84,277,14),     label: 'Flower center', fill: '#fafafa' },

    // FLOWER 2 (large, center — purple)
    { id: 'f2_stem', d: r(210,262,8,98), label: 'Flower stem', fill: '#fafafa' },
    { id: 'f2_ll',   d: 'M218,338Q248,318,240,300Q222,314,218,338Z', label: 'Leaf', fill: '#fafafa' },
    { id: 'f2_lr',   d: 'M210,332Q178,312,186,295Q206,308,210,332Z', label: 'Leaf', fill: '#fafafa' },
    { id: 'f2_pt',   d: e(214,242,11,18),label: 'Petal', fill: '#fafafa' },
    { id: 'f2_pr',   d: e(232,259,18,11),label: 'Petal', fill: '#fafafa' },
    { id: 'f2_pb',   d: e(214,276,11,15),label: 'Petal', fill: '#fafafa' },
    { id: 'f2_pl',   d: e(196,259,18,11),label: 'Petal', fill: '#fafafa' },
    { id: 'f2_c',    d: c(214,259,14),    label: 'Flower center', fill: '#fafafa' },

    // FLOWER 3 (large, right — yellow)
    { id: 'f3_stem', d: r(332,278,8,92), label: 'Flower stem', fill: '#fafafa' },
    { id: 'f3_ll',   d: 'M340,355Q370,335,362,318Q344,330,340,355Z', label: 'Leaf', fill: '#fafafa' },
    { id: 'f3_lr',   d: 'M332,348Q300,328,308,312Q328,324,332,348Z', label: 'Leaf', fill: '#fafafa' },
    { id: 'f3_pt',   d: e(336,258,11,18),label: 'Petal', fill: '#fafafa' },
    { id: 'f3_pr',   d: e(354,275,18,11),label: 'Petal', fill: '#fafafa' },
    { id: 'f3_pb',   d: e(336,292,11,15),label: 'Petal', fill: '#fafafa' },
    { id: 'f3_pl',   d: e(318,275,18,11),label: 'Petal', fill: '#fafafa' },
    { id: 'f3_c',    d: c(336,275,14),    label: 'Flower center', fill: '#fafafa' },

    // Big mushrooms
    { id: 'm1_cap',  d: 'M130,352Q118,322,136,308Q154,296,170,308Q182,322,172,352Z', label: 'Mushroom cap', fill: '#fafafa' },
    { id: 'm1_stem', d: r(140,352,24,26), label: 'Mushroom stem', fill: '#fafafa' },
    { id: 'm1_s1',   d: c(148,328,5),     label: 'Spot',          fill: '#fafafa' },
    { id: 'm1_s2',   d: c(163,318,4.5),   label: 'Spot',          fill: '#fafafa' },
    { id: 'm2_cap',  d: 'M280,346Q270,320,286,308Q300,298,314,308Q324,320,314,346Z', label: 'Mushroom cap', fill: '#fafafa' },
    { id: 'm2_stem', d: r(288,346,20,22), label: 'Mushroom stem', fill: '#fafafa' },
    { id: 'm2_s1',   d: c(295,326,4),     label: 'Spot',          fill: '#fafafa' },

    // Butterfly
    { id: 'bf_body', d: e(187,200,4,13),  label: 'Butterfly body',      fill: '#fafafa' },
    { id: 'bf_wlt',  d: 'M183,195Q148,178,150,208Q160,220,183,213Z',    label: 'Wing',  fill: '#fafafa' },
    { id: 'bf_wlb',  d: 'M183,213Q154,218,157,240Q170,250,183,236Z',    label: 'Wing',  fill: '#fafafa' },
    { id: 'bf_wrt',  d: 'M191,195Q226,178,224,208Q214,220,191,213Z',    label: 'Wing',  fill: '#fafafa' },
    { id: 'bf_wrb',  d: 'M191,213Q220,218,217,240Q204,250,191,236Z',    label: 'Wing',  fill: '#fafafa' },

    // Pond & lily pad
    { id: 'pond',  d: e(220,422,62,22),  label: 'Pond',      fill: '#fafafa' },
    { id: 'lily1', d: c(212,418,11),      label: 'Lily pad',  fill: '#fafafa' },
    { id: 'lily2', d: c(235,426,9),       label: 'Lily pad',  fill: '#fafafa' },
    { id: 'lily_fl', d: c(212,412,5),     label: 'Lily flower', fill: '#fafafa' },

    // Small ground flowers
    { id: 'gf1', d: c(42,388,8),  label: 'Flower', fill: '#fafafa' },
    { id: 'gf2', d: c(28,368,6),  label: 'Flower', fill: '#fafafa' },
    { id: 'gf3', d: c(372,378,8), label: 'Flower', fill: '#fafafa' },
    { id: 'gf4', d: c(388,358,6), label: 'Flower', fill: '#fafafa' },
    { id: 'gf5', d: c(168,438,7), label: 'Flower', fill: '#fafafa' },
    { id: 'gf6', d: c(300,445,7), label: 'Flower', fill: '#fafafa' },
  ],
  decorations: [
    // Butterfly antennae
    { d: 'M184,188Q176,174,178,168 M190,188Q198,174,196,168', stroke: '#999', strokeWidth: 1.2 },
    // Lily pad notch
    { d: 'M212,418L212,407 M235,426L235,417', stroke: '#4a7c59', strokeWidth: 1 },
    // Sun rays (lines from sun)
    { d: 'M62,18v-10 M62,106v10 M18,60h-10 M106,60h10 M32,30l-7,-7 M99,30l7,-7 M32,90l-7,7 M99,90l7,7', stroke: '#FFD54F', strokeWidth: 1.5 },
    // Mushroom stem lines
    { d: 'M144,358v18 M152,358v18 M160,358v18 M292,354v14 M300,354v14', stroke: '#ddd', strokeWidth: 0.8 },
  ],
}

// ─── SCENE 3: Dream Planet ────────────────────────────────────────────────────
const dreamPlanet: Scene = {
  id: 'dream-planet',
  name: 'Dream Planet',
  emoji: '🌌',
  mood: 'cosmic & wondrous',
  viewBox: '0 0 400 480',
  background: '#0d0d2b',
  regions: [
    // Space bg
    { id: 'space', d: r(0,0,400,480), label: 'Deep space', fill: '#e8eaf6' },

    // Nebula clouds (painterly background regions)
    { id: 'neb1', d: 'M340,45Q380,20,398,55Q388,92,360,88Q338,80,340,45Z',       label: 'Nebula', fill: '#fafafa' },
    { id: 'neb2', d: 'M8,375Q2,350,22,340Q42,338,55,360Q50,385,8,375Z',          label: 'Nebula', fill: '#fafafa' },
    { id: 'neb3', d: 'M5,55Q15,35,38,40Q48,60,35,75Q15,72,5,55Z',               label: 'Nebula', fill: '#fafafa' },

    // Stars (many small)
    { id: 's1', d: c(25,38,3.5), label: 'Star', fill: '#fafafa' },
    { id: 's2', d: c(78,18,4),   label: 'Star', fill: '#fafafa' },
    { id: 's3', d: c(148,30,3),  label: 'Star', fill: '#fafafa' },
    { id: 's4', d: c(365,25,4),  label: 'Star', fill: '#fafafa' },
    { id: 's5', d: c(392,80,3),  label: 'Star', fill: '#fafafa' },
    { id: 's6', d: c(18,205,3),  label: 'Star', fill: '#fafafa' },
    { id: 's7', d: c(378,256,3.5),label: 'Star', fill: '#fafafa' },
    { id: 's8', d: c(38,452,3),  label: 'Star', fill: '#fafafa' },
    { id: 's9', d: c(372,428,4), label: 'Star', fill: '#fafafa' },
    { id: 's10',d: c(185,48,3),  label: 'Star', fill: '#fafafa' },
    { id: 's11',d: c(310,68,3.5),label: 'Star', fill: '#fafafa' },

    // Small moon (top right)
    { id: 'small_moon',    d: c(348,78,24),  label: 'Moon',         fill: '#fafafa' },
    { id: 'small_crater',  d: e(354,70,8,5), label: 'Crater',       fill: '#fafafa' },

    // Planet ring (outer ellipse, behind planet)
    { id: 'ring_outer', d: e(200,262,175,42), label: 'Planetary ring', fill: '#fafafa' },
    { id: 'ring_inner', d: e(200,262,148,32), label: 'Planetary ring', fill: '#e8eaf6' }, // covers middle

    // Main planet
    { id: 'planet', d: c(200,262,128), label: 'Planet surface', fill: '#fafafa' },

    // Planet continents
    { id: 'cont1', d: 'M135,208Q162,192,190,202Q208,196,218,216Q212,242,188,248Q162,250,142,236Z', label: 'Continent', fill: '#fafafa' },
    { id: 'cont2', d: 'M218,288Q248,272,268,285Q276,305,256,318Q234,324,218,312Z',               label: 'Continent', fill: '#fafafa' },
    { id: 'river', d: 'M165,248Q188,256,208,248Q228,240,248,252L248,268Q228,256,208,264Q188,272,165,262Z', label: 'River', fill: '#fafafa' },

    // Tiny houses on planet
    { id: 'ph1_body', d: r(152,172,28,28),       label: 'Space house',  fill: '#fafafa' },
    { id: 'ph1_roof', d: t(148,172,166,150,184,172), label: 'Roof',     fill: '#fafafa' },
    { id: 'ph1_door', d: r(161,190,8,10),         label: 'Door',        fill: '#fafafa' },
    { id: 'ph1_win',  d: r(155,177,10,10),         label: 'Window',     fill: '#fafafa' },
    { id: 'ph2_body', d: r(212,162,32,30),         label: 'Space house', fill: '#fafafa' },
    { id: 'ph2_roof', d: t(208,162,228,138,244,162), label: 'Roof',     fill: '#fafafa' },
    { id: 'ph2_door', d: r(222,181,8,11),          label: 'Door',        fill: '#fafafa' },
    { id: 'ph2_win',  d: r(217,168,10,10),          label: 'Window',     fill: '#fafafa' },

    // Trees on planet
    { id: 'pt1t', d: r(194,207,6,13), label: 'Space tree trunk', fill: '#fafafa' },
    { id: 'pt1c', d: c(197,200,10),    label: 'Space tree',       fill: '#fafafa' },
    { id: 'pt2t', d: r(244,200,6,12), label: 'Space tree trunk', fill: '#fafafa' },
    { id: 'pt2c', d: c(247,193,9),     label: 'Space tree',       fill: '#fafafa' },

    // Rocket (left side)
    { id: 'rk_body',  d: r(52,108,26,52),          label: 'Rocket body',  fill: '#fafafa' },
    { id: 'rk_nose',  d: t(52,108,65,74,78,108),   label: 'Rocket nose',  fill: '#fafafa' },
    { id: 'rk_wl',    d: t(42,158,52,144,52,162),  label: 'Wing',         fill: '#fafafa' },
    { id: 'rk_wr',    d: t(78,144,78,162,88,158),  label: 'Wing',         fill: '#fafafa' },
    { id: 'rk_win',   d: c(65,124,9),               label: 'Porthole',     fill: '#fafafa' },
    { id: 'rk_flame', d: 'M58,160Q65,180,65,192Q65,180,72,160Z',           label: 'Flame', fill: '#fafafa' },

    // Alien creatures
    { id: 'al_body', d: e(288,202,13,9),  label: 'Alien body', fill: '#fafafa' },
    { id: 'al_head', d: c(288,189,10),    label: 'Alien head', fill: '#fafafa' },
    { id: 'al_el',   d: c(282,185,4),     label: 'Alien eye',  fill: '#fafafa' },
    { id: 'al_er',   d: c(294,185,4),     label: 'Alien eye',  fill: '#fafafa' },
  ],
  decorations: [
    // Ring lines (divides ring into sections)
    { d: 'M26,272Q200,225,374,272 M26,252Q200,300,374,252', stroke: '#ccc', strokeWidth: 0.8 },
    // Rocket details
    { d: 'M58,120h14 M58,132h14 M58,144h14', stroke: '#bbb', strokeWidth: 0.8 },
    // Alien antennae
    { d: 'M282,180Q274,166,276,160 M294,180Q302,166,300,160', stroke: '#aaa', strokeWidth: 1 },
    // Stars sparkle
    { d: 'M78,18v-8 M78,26v8 M74,22h-8 M82,22h8 M365,25v-8 M365,33v8 M361,29h-8 M369,29h8', stroke: '#E8EAF6', strokeWidth: 1 },
    // House details
    { d: 'M155,177v10 M160,172h10 M218,168v10 M222,163h10', stroke: '#ccc', strokeWidth: 0.8 },
  ],
}

// ─── SCENE 4: Woodland Friends ────────────────────────────────────────────────
const woodlandFriends: Scene = {
  id: 'woodland-friends',
  name: 'Woodland Friends',
  emoji: '🦊',
  mood: 'cozy & joyful',
  viewBox: '0 0 400 480',
  background: '#ffe0b2',
  regions: [
    // Background sky & ground
    { id: 'sky',     d: r(0,0,400,222),   label: 'Sky',         fill: '#fafafa' },
    { id: 'mid',     d: 'M0,280Q100,252,200,268Q300,252,400,268V335H0Z', label: 'Meadow', fill: '#fafafa' },
    { id: 'ground',  d: r(0,335,400,145), label: 'Ground',      fill: '#fafafa' },
    { id: 'stream',  d: 'M0,438Q85,425,165,436Q240,447,330,432Q368,424,400,428V462Q368,452,330,456Q240,468,165,458Q85,448,0,460Z', label: 'Stream', fill: '#fafafa' },

    // Background trees (large, frame scene)
    { id: 'ltree_t', d: r(18,178,32,200), label: 'Tree trunk', fill: '#fafafa' },
    { id: 'ltree_c', d: c(34,172,52),      label: 'Tree canopy', fill: '#fafafa' },
    { id: 'ltree_c2',d: c(55,152,42),      label: 'Tree canopy', fill: '#fafafa' },
    { id: 'rtree_t', d: r(350,188,32,180), label: 'Tree trunk', fill: '#fafafa' },
    { id: 'rtree_c', d: c(366,182,52),      label: 'Tree canopy', fill: '#fafafa' },
    { id: 'rtree_c2',d: c(345,162,42),      label: 'Tree canopy', fill: '#fafafa' },

    // Central oak
    { id: 'oak_t',   d: r(168,252,64,128), label: 'Oak trunk',    fill: '#fafafa' },
    { id: 'oak_rl',  d: 'M168,345Q143,375,122,386Q143,380,168,362Z', label: 'Root', fill: '#fafafa' },
    { id: 'oak_rr',  d: 'M232,345Q257,375,278,386Q257,380,232,362Z', label: 'Root', fill: '#fafafa' },
    { id: 'oak_can', d: c(200,215,95),      label: 'Oak canopy',   fill: '#fafafa' },
    { id: 'oak_bl',  d: 'M168,264Q135,238,124,222Q140,228,168,261Z', label: 'Branch', fill: '#fafafa' },
    { id: 'oak_br',  d: 'M232,264Q265,238,276,222Q260,228,232,261Z', label: 'Branch', fill: '#fafafa' },
    { id: 'oak_hol', d: e(200,295,20,14),  label: 'Tree hollow',  fill: '#fafafa' },

    // Big mushroom cluster
    { id: 'bm_cap',  d: 'M105,322Q88,292,104,276Q120,263,140,274Q156,284,150,322Z', label: 'Mushroom cap', fill: '#fafafa' },
    { id: 'bm_stem', d: r(112,322,26,28),  label: 'Mushroom stem', fill: '#fafafa' },
    { id: 'bm_s1',   d: c(116,298,5.5),    label: 'Spot', fill: '#fafafa' },
    { id: 'bm_s2',   d: c(134,288,5),      label: 'Spot', fill: '#fafafa' },
    { id: 'bm_s3',   d: c(126,312,4.5),    label: 'Spot', fill: '#fafafa' },
    { id: 'sm1_cap', d: 'M268,334Q260,318,268,310Q278,304,286,310Q292,318,286,334Z', label: 'Mushroom cap', fill: '#fafafa' },
    { id: 'sm1_stm', d: r(270,334,14,18),  label: 'Mushroom stem', fill: '#fafafa' },
    { id: 'sm2_cap', d: 'M322,342Q315,328,322,320Q330,314,338,320Q344,328,338,342Z', label: 'Mushroom cap', fill: '#fafafa' },
    { id: 'sm2_stm', d: r(324,342,13,16),  label: 'Mushroom stem', fill: '#fafafa' },

    // Picnic blanket + food
    { id: 'blanket', d: r(138,362,124,55), label: 'Picnic blanket', fill: '#fafafa' },
    { id: 'apple',   d: c(190,380,10),      label: 'Apple',          fill: '#fafafa' },
    { id: 'apple_l', d: e(190,370,4,5),     label: 'Apple leaf',     fill: '#fafafa' },
    { id: 'cake',    d: r(206,368,30,18),   label: 'Cake',           fill: '#fafafa' },
    { id: 'cake_tp', d: r(210,362,22,10),   label: 'Cake frosting',  fill: '#fafafa' },
    { id: 'berries', d: c(168,377,8),        label: 'Berries bowl',   fill: '#fafafa' },
    { id: 'cup',     d: r(242,373,18,18),   label: 'Cup',            fill: '#fafafa' },

    // FOX
    { id: 'fox_b', d: e(128,393,19,14),  label: 'Fox body',  fill: '#fafafa' },
    { id: 'fox_h', d: c(128,371,14),      label: 'Fox head',  fill: '#fafafa' },
    { id: 'fox_el',d: t(118,362,122,348,130,360), label: 'Fox ear', fill: '#fafafa' },
    { id: 'fox_er',d: t(130,361,134,348,140,361), label: 'Fox ear', fill: '#fafafa' },
    { id: 'fox_mz',d: e(128,374,9,7),    label: 'Fox muzzle', fill: '#fafafa' },
    { id: 'fox_tl',d: 'M110,400Q88,384,86,366Q94,362,110,378Q112,388,110,400Z', label: 'Fox tail', fill: '#fafafa' },
    { id: 'fox_tt',d: 'M86,366Q76,355,80,346Q90,350,94,362Z', label: 'Tail tip', fill: '#fafafa' },

    // RABBIT
    { id: 'rab_b',  d: e(272,393,17,14),  label: 'Rabbit body', fill: '#fafafa' },
    { id: 'rab_h',  d: c(272,369,12),      label: 'Rabbit head', fill: '#fafafa' },
    { id: 'rab_el', d: e(265,350,5,14),   label: 'Rabbit ear',  fill: '#fafafa' },
    { id: 'rab_er', d: e(278,350,5,14),   label: 'Rabbit ear',  fill: '#fafafa' },
    { id: 'rab_eli',d: e(265,350,3,10),   label: 'Ear inside',  fill: '#fafafa' },
    { id: 'rab_eri',d: e(278,350,3,10),   label: 'Ear inside',  fill: '#fafafa' },

    // BIRD on branch
    { id: 'bird_b', d: e(142,228,13,8),   label: 'Bird body',  fill: '#fafafa' },
    { id: 'bird_h', d: c(154,221,8),       label: 'Bird head',  fill: '#fafafa' },
    { id: 'bird_w', d: 'M130,226Q138,212,150,220Z', label: 'Wing', fill: '#fafafa' },
    { id: 'bird_bk',d: t(159,218,168,221,159,224), label: 'Beak', fill: '#fafafa' },

    // Flowers around scene
    { id: 'wfl1', d: c(58,418,8),   label: 'Flower', fill: '#fafafa' },
    { id: 'wfl2', d: c(42,396,6),   label: 'Flower', fill: '#fafafa' },
    { id: 'wfl3', d: c(342,428,8),  label: 'Flower', fill: '#fafafa' },
    { id: 'wfl4', d: c(362,406,6),  label: 'Flower', fill: '#fafafa' },
    { id: 'wfl5', d: c(200,445,7),  label: 'Flower', fill: '#fafafa' },
  ],
  decorations: [
    // Blanket pattern
    { d: 'M138,380h124 M138,397h124 M162,362v55 M200,362v55 M238,362v55', stroke: '#f8bbd0', strokeWidth: 1 },
    // Fox features
    { d: 'M124,374a3,2,0,1,1-0.01,0 M132,374a3,2,0,1,1-0.01,0 M128,378l-4,3h8', stroke: '#666', strokeWidth: 1 },
    // Rabbit face
    { d: 'M268,371a2,2,0,1,1-0.01,0 M276,371a2,2,0,1,1-0.01,0 M272,375l-3,3h6', stroke: '#999', strokeWidth: 1 },
    // Bird eye
    { d: 'M156,219a2.5,2.5,0,1,1-0.01,0', stroke: '#333', strokeWidth: 1 },
    // Tree bark texture
    { d: 'M175,275Q200,268,225,275 M172,300Q200,290,228,300 M170,325Q200,315,230,325', stroke: '#c8a06a', strokeWidth: 1 },
    // Oak hollow
    { d: 'M200,295v14', stroke: '#5d3a1a', strokeWidth: 1.2 },
    // Cup steam
    { d: 'M247,370Q244,360,247,352 M253,370Q250,360,253,352', stroke: '#ccc', strokeWidth: 1 },
  ],
}

export const SCENES: Scene[] = [
  moonlightVillage,
  enchantedGarden,
  dreamPlanet,
  woodlandFriends,
]
