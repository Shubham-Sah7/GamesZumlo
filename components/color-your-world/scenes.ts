// SVG path helpers for premium coloring book illustrations
const r = (x: number, y: number, w: number, h: number, rx = 0) =>
  rx > 0 
    ? `M${x+rx},${y}h${w-2*rx}a${rx},${rx}0,0,1,${rx},${rx}v${h-2*rx}a${rx},${rx}0,0,1,${-rx},${rx}h${-(w-2*rx)}a${rx},${rx}0,0,1,${-rx},${-rx}v${-(h-2*rx)}a${rx},${rx}0,0,1,${rx},${-rx}Z`
    : `M${x},${y}h${w}v${h}h${-w}Z`
const c = (cx: number, cy: number, rad: number) =>
  `M${cx + rad},${cy}A${rad},${rad}0,1,1,${cx - rad},${cy}A${rad},${rad}0,1,1,${cx + rad},${cy}Z`
const e = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx + rx},${cy}A${rx},${ry}0,1,1,${cx - rx},${cy}A${rx},${ry}0,1,1,${cx + rx},${cy}Z`
const t = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) =>
  `M${x1},${y1}L${x2},${y2}L${x3},${y3}Z`

// Premium petal shape (smooth, organic)
const petal = (cx: number, cy: number, size: number, rotation: number) => {
  const rad = (rotation * Math.PI) / 180
  const cos = Math.cos(rad), sin = Math.sin(rad)
  const x1 = cx + size * cos, y1 = cy + size * sin
  const x2 = cx - size * cos, y2 = cy - size * sin
  const ctrl = size * 0.6
  return `M${cx},${cy}Q${x1 + ctrl * sin},${y1 - ctrl * cos},${x1},${y1}Q${x1 - ctrl * sin},${y1 + ctrl * cos},${cx},${cy}Q${x2 + ctrl * sin},${y2 - ctrl * cos},${x2},${y2}Q${x2 - ctrl * sin},${y2 + ctrl * cos},${cx},${cy}Z`
}

// Smooth leaf shape
const leaf = (x: number, y: number, w: number, h: number, flip = false) => {
  const dir = flip ? -1 : 1
  return `M${x},${y}Q${x + dir * w * 0.7},${y + h * 0.3},${x + dir * w},${y + h * 0.5}Q${x + dir * w * 0.7},${y + h * 0.7},${x},${y + h}Q${x + dir * w * 0.3},${y + h * 0.5},${x},${y}Z`
}

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

// ─── SCENE 2: Cozy Room (Premium Quality) ─────────────────────────────────────
const cozyRoom: Scene = {
  id: 'cozy-room',
  name: 'Cozy Room',
  emoji: '🏠',
  mood: 'warm & peaceful',
  viewBox: '0 0 400 500',
  background: '#FFF8E1',
  regions: [
    // Back wall
    { id: 'wall', d: r(0, 0, 400, 380), label: 'Wall', fill: '#FFECB3' },
    
    // Floor
    { id: 'floor', d: r(0, 380, 400, 120), label: 'Floor', fill: '#D7CCC8' },
    
    // Window - large, clear
    { id: 'window_frame', d: r(250, 40, 130, 140, 5), label: 'Window frame', fill: '#90CAF9' },
    { id: 'window_glass', d: r(260, 50, 110, 120), label: 'Window glass', fill: '#E3F2FD' },
    { id: 'window_div_v', d: r(312, 50, 6, 120), label: 'Window divider', fill: '#90CAF9' },
    { id: 'window_div_h', d: r(260, 107, 110, 6), label: 'Window divider', fill: '#90CAF9' },
    
    // Curtain left
    { id: 'curtain_l', d: `M240,40Q235,50,238,100Q240,150,235,180L245,180Q248,150,245,100Q248,50,240,40Z`, label: 'Curtain', fill: '#F48FB1' },
    // Curtain right
    { id: 'curtain_r', d: `M390,40Q395,50,392,100Q390,150,395,180L385,180Q382,150,385,100Q382,50,390,40Z`, label: 'Curtain', fill: '#F48FB1' },
    
    // Bookshelf
    { id: 'shelf_frame', d: r(20, 80, 100, 180, 3), label: 'Bookshelf', fill: '#8D6E63' },
    { id: 'shelf1', d: r(25, 130, 90, 4), label: 'Shelf', fill: '#6D4C41' },
    { id: 'shelf2', d: r(25, 180, 90, 4), label: 'Shelf', fill: '#6D4C41' },
    { id: 'shelf3', d: r(25, 230, 90, 4), label: 'Shelf', fill: '#6D4C41' },
    
    // Books - clear rectangles
    { id: 'book1', d: r(30, 90, 15, 35), label: 'Book', fill: '#EF5350' },
    { id: 'book2', d: r(48, 90, 12, 35), label: 'Book', fill: '#42A5F5' },
    { id: 'book3', d: r(63, 95, 18, 30), label: 'Book', fill: '#66BB6A' },
    { id: 'book4', d: r(84, 92, 14, 33), label: 'Book', fill: '#FFA726' },
    { id: 'book5', d: r(30, 140, 16, 35), label: 'Book', fill: '#AB47BC' },
    { id: 'book6', d: r(49, 138, 13, 37), label: 'Book', fill: '#FFEE58' },
    { id: 'book7', d: r(65, 142, 17, 33), label: 'Book', fill: '#26C6DA' },
    { id: 'book8', d: r(85, 140, 15, 35), label: 'Book', fill: '#EC407A' },
    { id: 'book9', d: r(30, 190, 14, 35), label: 'Book', fill: '#5C6BC0' },
    { id: 'book10', d: r(47, 192, 16, 33), label: 'Book', fill: '#FF7043' },
    { id: 'book11', d: r(66, 188, 13, 37), label: 'Book', fill: '#9CCC65' },
    { id: 'book12', d: r(82, 190, 18, 35), label: 'Book', fill: '#29B6F6' },
    
    // Plant pot on shelf
    { id: 'pot1', d: `M35,240L45,255L55,255L65,240Z`, label: 'Plant pot', fill: '#FF7043' },
    { id: 'plant1_l1', d: leaf(45, 225, 8, 15, true), label: 'Plant leaf', fill: '#66BB6A' },
    { id: 'plant1_l2', d: leaf(50, 220, 10, 18, false), label: 'Plant leaf', fill: '#66BB6A' },
    { id: 'plant1_l3', d: leaf(55, 225, 8, 15, false), label: 'Plant leaf', fill: '#66BB6A' },
    
    // Sofa - large, comfortable
    { id: 'sofa_back', d: r(140, 300, 180, 60, 8), label: 'Sofa back', fill: '#7986CB' },
    { id: 'sofa_seat', d: r(140, 350, 180, 30, 5), label: 'Sofa seat', fill: '#5C6BC0' },
    { id: 'sofa_arm_l', d: r(130, 310, 20, 70, 5), label: 'Sofa arm', fill: '#7986CB' },
    { id: 'sofa_arm_r', d: r(310, 310, 20, 70, 5), label: 'Sofa arm', fill: '#7986CB' },
    
    // Cushions on sofa
    { id: 'cushion1', d: r(160, 315, 35, 35, 5), label: 'Cushion', fill: '#F48FB1' },
    { id: 'cushion2', d: r(265, 315, 35, 35, 5), label: 'Cushion', fill: '#FFD54F' },
    
    // Coffee table
    { id: 'table_top', d: r(160, 400, 120, 15, 3), label: 'Table top', fill: '#A1887F' },
    { id: 'table_leg1', d: r(170, 415, 8, 35), label: 'Table leg', fill: '#8D6E63' },
    { id: 'table_leg2', d: r(262, 415, 8, 35), label: 'Table leg', fill: '#8D6E63' },
    
    // Items on table
    { id: 'mug', d: r(185, 385, 20, 15, 3), label: 'Mug', fill: '#EF5350' },
    { id: 'mug_handle', d: `M205,390Q215,390,215,395Q215,400,205,400Z`, label: 'Mug handle', fill: '#EF5350' },
    { id: 'book_table', d: r(220, 390, 40, 15, 2), label: 'Book', fill: '#42A5F5' },
    
    // Floor lamp
    { id: 'lamp_base', d: c(360, 480, 20), label: 'Lamp base', fill: '#8D6E63' },
    { id: 'lamp_pole', d: r(357, 280, 6, 200), label: 'Lamp pole', fill: '#6D4C41' },
    { id: 'lamp_shade', d: `M330,250L360,280L390,250Z`, label: 'Lamp shade', fill: '#FFF59D' },
    
    // Large potted plant
    { id: 'big_pot', d: `M50,420L70,460L90,460L110,420Z`, label: 'Plant pot', fill: '#FF7043' },
    { id: 'plant2_l1', d: leaf(60, 380, 15, 40, true), label: 'Plant leaf', fill: '#66BB6A' },
    { id: 'plant2_l2', d: leaf(70, 370, 18, 50, false), label: 'Plant leaf', fill: '#66BB6A' },
    { id: 'plant2_l3', d: leaf(85, 375, 16, 45, false), label: 'Plant leaf', fill: '#66BB6A' },
    { id: 'plant2_l4', d: leaf(75, 385, 14, 35, true), label: 'Plant leaf', fill: '#66BB6A' },
    
    // Rug
    { id: 'rug', d: e(230, 450, 80, 35), label: 'Rug', fill: '#FFAB91' },
    
    // Wall art/picture frame
    { id: 'frame', d: r(150, 100, 70, 90, 3), label: 'Picture frame', fill: '#8D6E63' },
    { id: 'picture', d: r(158, 108, 54, 74), label: 'Picture', fill: '#FFE082' },
    // Simple mountain scene in picture
    { id: 'pic_sky', d: r(158, 108, 54, 40), label: 'Sky in picture', fill: '#81D4FA' },
    { id: 'pic_mountain', d: `M158,148L185,120L212,148Z`, label: 'Mountain', fill: '#A1887F' },
  ],
  decorations: [
    // Book spines
    { d: 'M37,100v25 M55,105v20 M70,100v25 M91,98v27 M37,150v25 M56,148v27 M72,152v23 M92,150v25 M37,200v25 M55,202v23 M73,198v27 M89,200v25', stroke: '#FFFFFF', strokeWidth: 1 },
    // Window view (clouds)
    { d: 'M270,70Q275,65,285,70Q290,65,295,70 M320,90Q325,85,335,90Q340,85,345,90', stroke: '#90CAF9', strokeWidth: 1.5 },
    // Sofa buttons
    { d: 'M170,330a3,3,0,1,1-0.01,0 M290,330a3,3,0,1,1-0.01,0', stroke: '#3F51B5', strokeWidth: 1 },
    // Mug steam
    { d: 'M190,380Q188,370,190,365 M198,380Q196,370,198,365', stroke: '#BDBDBD', strokeWidth: 1 },
    // Rug pattern
    { d: 'M160,445h140 M160,455h140', stroke: '#FF8A65', strokeWidth: 1 },
  ],
}

// ─── SCENE 1: Enchanted Garden (Premium Quality) ──────────────────────────────
const enchantedGarden: Scene = {
  id: 'enchanted-garden',
  name: 'Enchanted Garden',
  emoji: '🌸',
  mood: 'magical & peaceful',
  viewBox: '0 0 400 500',
  background: '#fffde7',
  regions: [
    // Sky - clean gradient area
    { id: 'sky', d: r(0, 0, 400, 200), label: 'Sky', fill: '#E3F2FD' },
    
    // Sun - large, clear circle
    { id: 'sun', d: c(80, 60, 35), label: 'Sun', fill: '#FFF9C4' },
    
    // Sun rays - 8 clear triangular rays
    { id: 'ray1', d: `M80,20L75,10L85,10Z`, label: 'Sun ray', fill: '#FFF9C4' },
    { id: 'ray2', d: `M115,40L125,35L120,45Z`, label: 'Sun ray', fill: '#FFF9C4' },
    { id: 'ray3', d: `M120,75L130,75L125,85Z`, label: 'Sun ray', fill: '#FFF9C4' },
    { id: 'ray4', d: `M110,105L120,110L115,115Z`, label: 'Sun ray', fill: '#FFF9C4' },
    { id: 'ray5', d: `M80,120L75,130L85,130Z`, label: 'Sun ray', fill: '#FFF9C4' },
    { id: 'ray6', d: `M45,105L40,110L45,115Z`, label: 'Sun ray', fill: '#FFF9C4' },
    { id: 'ray7', d: `M35,75L25,75L30,85Z`, label: 'Sun ray', fill: '#FFF9C4' },
    { id: 'ray8', d: `M45,40L35,35L40,45Z`, label: 'Sun ray', fill: '#FFF9C4' },
    
    // Clouds - smooth, puffy shapes
    { id: 'cloud1', d: `M180,50Q185,35,200,35Q215,35,220,45Q230,45,230,55Q230,65,220,65Q185,65,180,55Z`, label: 'Cloud', fill: '#FFFFFF' },
    { id: 'cloud2', d: `M300,70Q305,55,320,55Q335,55,340,65Q350,65,350,75Q350,85,340,85Q305,85,300,75Z`, label: 'Cloud', fill: '#FFFFFF' },
    
    // Ground - rolling hills
    { id: 'ground', d: `M0,200Q100,180,200,200Q300,180,400,200L400,500L0,500Z`, label: 'Ground', fill: '#C8E6C9' },
    
    // Path - winding garden path
    { id: 'path', d: `M150,500Q160,450,180,420Q200,390,220,380Q240,370,260,380Q280,390,300,420Q320,450,330,500Z`, label: 'Garden path', fill: '#D7CCC8' },
    
    // LARGE FLOWER 1 (Left) - Sunflower style
    { id: 'f1_stem', d: r(70, 300, 8, 150), label: 'Flower stem', fill: '#81C784' },
    { id: 'f1_leaf1', d: leaf(78, 350, 30, 40, false), label: 'Leaf', fill: '#81C784' },
    { id: 'f1_leaf2', d: leaf(62, 380, 30, 40, true), label: 'Leaf', fill: '#81C784' },
    
    // Sunflower petals - 12 clear petals
    { id: 'f1_p1', d: petal(74, 280, 25, 0), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p2', d: petal(74, 280, 25, 30), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p3', d: petal(74, 280, 25, 60), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p4', d: petal(74, 280, 25, 90), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p5', d: petal(74, 280, 25, 120), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p6', d: petal(74, 280, 25, 150), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p7', d: petal(74, 280, 25, 180), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p8', d: petal(74, 280, 25, 210), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p9', d: petal(74, 280, 25, 240), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p10', d: petal(74, 280, 25, 270), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p11', d: petal(74, 280, 25, 300), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_p12', d: petal(74, 280, 25, 330), label: 'Petal', fill: '#FFD54F' },
    { id: 'f1_center', d: c(74, 280, 18), label: 'Flower center', fill: '#8D6E63' },
    
    // LARGE FLOWER 2 (Center) - Rose style
    { id: 'f2_stem', d: r(196, 280, 8, 170), label: 'Flower stem', fill: '#81C784' },
    { id: 'f2_leaf1', d: leaf(204, 330, 35, 45, false), label: 'Leaf', fill: '#81C784' },
    { id: 'f2_leaf2', d: leaf(180, 370, 35, 45, true), label: 'Leaf', fill: '#81C784' },
    
    // Rose petals - layered, organic
    { id: 'f2_p1', d: `M200,240Q185,235,180,250Q185,265,200,260Z`, label: 'Petal', fill: '#F48FB1' },
    { id: 'f2_p2', d: `M200,240Q215,235,220,250Q215,265,200,260Z`, label: 'Petal', fill: '#F48FB1' },
    { id: 'f2_p3', d: `M200,260Q185,265,185,280Q195,290,200,285Z`, label: 'Petal', fill: '#F48FB1' },
    { id: 'f2_p4', d: `M200,260Q215,265,215,280Q205,290,200,285Z`, label: 'Petal', fill: '#F48FB1' },
    { id: 'f2_p5', d: `M200,240Q190,245,195,255Q200,260,205,255Q210,245,200,240Z`, label: 'Petal', fill: '#F48FB1' },
    { id: 'f2_center', d: c(200, 260, 12), label: 'Flower center', fill: '#FCE4EC' },
    
    // LARGE FLOWER 3 (Right) - Daisy style
    { id: 'f3_stem', d: r(316, 310, 8, 140), label: 'Flower stem', fill: '#81C784' },
    { id: 'f3_leaf1', d: leaf(324, 360, 30, 40, false), label: 'Leaf', fill: '#81C784' },
    { id: 'f3_leaf2', d: leaf(308, 390, 30, 40, true), label: 'Leaf', fill: '#81C784' },
    
    // Daisy petals - 10 rounded petals
    { id: 'f3_p1', d: e(320, 280, 12, 20), label: 'Petal', fill: '#FFFFFF' },
    { id: 'f3_p2', d: e(335, 290, 20, 12), label: 'Petal', fill: '#FFFFFF' },
    { id: 'f3_p3', d: e(340, 310, 12, 20), label: 'Petal', fill: '#FFFFFF' },
    { id: 'f3_p4', d: e(335, 330, 20, 12), label: 'Petal', fill: '#FFFFFF' },
    { id: 'f3_p5', d: e(320, 340, 12, 20), label: 'Petal', fill: '#FFFFFF' },
    { id: 'f3_p6', d: e(305, 330, 20, 12), label: 'Petal', fill: '#FFFFFF' },
    { id: 'f3_p7', d: e(300, 310, 12, 20), label: 'Petal', fill: '#FFFFFF' },
    { id: 'f3_p8', d: e(305, 290, 20, 12), label: 'Petal', fill: '#FFFFFF' },
    { id: 'f3_center', d: c(320, 310, 15), label: 'Flower center', fill: '#FFF59D' },
    
    // MUSHROOMS - Clear toadstool shapes
    { id: 'mush1_cap', d: `M120,380Q110,360,130,355Q150,360,140,380Z`, label: 'Mushroom cap', fill: '#EF5350' },
    { id: 'mush1_stem', d: r(125, 380, 10, 25, 3), label: 'Mushroom stem', fill: '#FAFAFA' },
    { id: 'mush1_spot1', d: c(120, 368, 4), label: 'Spot', fill: '#FFFFFF' },
    { id: 'mush1_spot2', d: c(132, 365, 5), label: 'Spot', fill: '#FFFFFF' },
    { id: 'mush1_spot3', d: c(128, 375, 3.5), label: 'Spot', fill: '#FFFFFF' },
    
    { id: 'mush2_cap', d: `M270,400Q262,385,278,380Q294,385,286,400Z`, label: 'Mushroom cap', fill: '#EF5350' },
    { id: 'mush2_stem', d: r(274, 400, 8, 20, 3), label: 'Mushroom stem', fill: '#FAFAFA' },
    { id: 'mush2_spot1', d: c(272, 390, 3.5), label: 'Spot', fill: '#FFFFFF' },
    { id: 'mush2_spot2', d: c(282, 388, 4), label: 'Spot', fill: '#FFFFFF' },
    
    // BUTTERFLY - Clear, symmetrical
    { id: 'butterfly_body', d: e(200, 150, 4, 15), label: 'Butterfly body', fill: '#424242' },
    { id: 'butterfly_head', d: c(200, 138, 5), label: 'Butterfly head', fill: '#424242' },
    
    // Butterfly wings - large, clear shapes
    { id: 'bfly_wing_tl', d: `M196,145Q170,130,165,150Q170,170,196,160Z`, label: 'Wing', fill: '#BA68C8' },
    { id: 'bfly_wing_bl', d: `M196,160Q168,165,168,185Q180,195,196,185Z`, label: 'Wing', fill: '#BA68C8' },
    { id: 'bfly_wing_tr', d: `M204,145Q230,130,235,150Q230,170,204,160Z`, label: 'Wing', fill: '#BA68C8' },
    { id: 'bfly_wing_br', d: `M204,160Q232,165,232,185Q220,195,204,185Z`, label: 'Wing', fill: '#BA68C8' },
    
    // Wing spots
    { id: 'bfly_spot1', d: c(178, 148, 6), label: 'Wing spot', fill: '#FFFFFF' },
    { id: 'bfly_spot2', d: c(178, 175, 5), label: 'Wing spot', fill: '#FFFFFF' },
    { id: 'bfly_spot3', d: c(222, 148, 6), label: 'Wing spot', fill: '#FFFFFF' },
    { id: 'bfly_spot4', d: c(222, 175, 5), label: 'Wing spot', fill: '#FFFFFF' },
    
    // TREES - Simple, clear shapes
    { id: 'tree1_trunk', d: r(25, 220, 15, 80, 3), label: 'Tree trunk', fill: '#8D6E63' },
    { id: 'tree1_crown', d: c(32, 210, 30), label: 'Tree crown', fill: '#66BB6A' },
    
    { id: 'tree2_trunk', d: r(360, 230, 15, 70, 3), label: 'Tree trunk', fill: '#8D6E63' },
    { id: 'tree2_crown', d: c(367, 220, 28), label: 'Tree crown', fill: '#66BB6A' },
    
    // SMALL FLOWERS - Ground decoration
    { id: 'small_f1', d: c(40, 420, 8), label: 'Small flower', fill: '#F48FB1' },
    { id: 'small_f2', d: c(60, 440, 7), label: 'Small flower', fill: '#FFD54F' },
    { id: 'small_f3', d: c(340, 430, 8), label: 'Small flower', fill: '#BA68C8' },
    { id: 'small_f4', d: c(360, 450, 7), label: 'Small flower', fill: '#F48FB1' },
    { id: 'small_f5', d: c(180, 470, 7), label: 'Small flower', fill: '#FFD54F' },
    { id: 'small_f6', d: c(220, 475, 7), label: 'Small flower', fill: '#FFFFFF' },
  ],
  decorations: [
    // Butterfly antennae
    { d: 'M197,135Q192,125,194,120 M203,135Q208,125,206,120', stroke: '#424242', strokeWidth: 1.5 },
    // Flower stem details
    { d: 'M74,300v-20 M200,280v-20 M320,310v-20', stroke: '#558B2F', strokeWidth: 1.2 },
    // Path texture
    { d: 'M160,490Q170,470,180,450 M240,490Q250,470,260,450', stroke: '#BCAAA4', strokeWidth: 1 },
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
  enchantedGarden,
  cozyRoom,
]
