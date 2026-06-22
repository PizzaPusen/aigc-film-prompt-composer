/**
 * 技术类标签示意 SVG（极简几何，非电影海报）
 */

const BG = '#f5f5f7';
const INK = '#1d1d1f';
const MUTED = '#86868b';
const ACCENT = '#0071e3';
const LIGHT = '#d2d2d7';

function wrap(content, w = 480, h = 270) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<rect width="100%" height="100%" fill="${BG}"/>
${content}
</svg>`;
}

function label(text, x = 240, y = 248) {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="${MUTED}">${text}</text>`;
}

function frameRect(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${ACCENT}" stroke-width="3" rx="4"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${ACCENT}" fill-opacity="0.06" rx="4"/>`;
}

function person(cx, cy, scale = 1) {
  const s = scale;
  return `<g fill="${MUTED}" stroke="none">
<circle cx="${cx}" cy="${cy - 52 * s}" r="${11 * s}"/>
<rect x="${cx - 13 * s}" y="${cy - 38 * s}" width="${26 * s}" height="${42 * s}" rx="3"/>
<rect x="${cx - 16 * s}" y="${cy + 4 * s}" width="${10 * s}" height="${38 * s}" rx="3"/>
<rect x="${cx + 6 * s}" y="${cy + 4 * s}" width="${10 * s}" height="${38 * s}" rx="3"/>
</g>`;
}

function ground(y = 210) {
  return `<line x1="40" y1="${y}" x2="440" y2="${y}" stroke="${LIGHT}" stroke-width="2"/>`;
}

function camera(x, y, rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot})">
<rect x="-18" y="-12" width="36" height="24" rx="4" fill="${INK}"/>
<circle cx="0" cy="0" r="8" fill="${ACCENT}"/>
<rect x="18" y="-6" width="10" height="12" rx="2" fill="${INK}"/>
</g>`;
}

function arrow(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const ax = x2 - ux * 12;
  const ay = y2 - uy * 12;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ACCENT}" stroke-width="3" stroke-linecap="round"/>
<polygon points="${x2},${y2} ${ax - uy * 6},${ay + ux * 6} ${ax + uy * 6},${ay - ux * 6}" fill="${ACCENT}"/>`;
}

function swatches(colors, y = 90, h = 90) {
  const w = 360 / colors.length;
  return colors
    .map(
      (c, i) =>
        `<rect x="${60 + i * w}" y="${y}" width="${w - 4}" height="${h}" rx="6" fill="${c}"/>`
    )
    .join('');
}

function renderShotSize(zh) {
  const specs = {
    大远景: { fx: 30, fy: 30, fw: 420, fh: 210, px: 240, py: 195, ps: 0.35 },
    远景: { fx: 70, fy: 45, fw: 340, fh: 185, px: 240, py: 192, ps: 0.55 },
    全景: { fx: 110, fy: 35, fw: 260, fh: 200, px: 240, py: 188, ps: 0.75 },
    中远景: { fx: 140, fy: 50, fw: 200, fh: 175, px: 240, py: 185, ps: 0.85, crop: 'knee' },
    中景: { fx: 155, fy: 65, fw: 170, fh: 145, px: 240, py: 178, ps: 0.95, crop: 'waist' },
    中特写: { fx: 170, fy: 75, fw: 140, fh: 120, px: 240, py: 165, ps: 1.05, crop: 'chest' },
    特写: { fx: 185, fy: 70, fw: 110, fh: 115, px: 240, py: 145, ps: 1.25, crop: 'face' },
    大特写: null,
    主观视角: null,
    过肩镜头: null,
    低角度仰拍: null,
    高角度俯拍: null,
    上帝视角: null,
    荷兰式倾斜: null,
    剪影镜头: null
  };

  if (zh === '大特写') {
    return wrap(
      `${frameRect(155, 55, 170, 130)}
<ellipse cx="240" cy="120" rx="55" ry="32" fill="${MUTED}"/>
<circle cx="240" cy="118" r="22" fill="${INK}"/>
<circle cx="246" cy="112" r="6" fill="#fff"/>
${label('大特写 · 局部细节')}`
    );
  }
  if (zh === '主观视角') {
    return wrap(
      `${frameRect(60, 40, 360, 180)}
<path d="M90 210 Q240 120 390 210" fill="none" stroke="${LIGHT}" stroke-width="2"/>
<ellipse cx="130" cy="205" rx="28" ry="14" fill="${MUTED}" opacity="0.7"/>
<ellipse cx="350" cy="205" rx="28" ry="14" fill="${MUTED}" opacity="0.7"/>
${person(240, 175, 0.7)}
${label('主观视角 · 第一人称')}`
    );
  }
  if (zh === '过肩镜头') {
    return wrap(
      `${frameRect(80, 45, 320, 175)}
<ellipse cx="120" cy="185" rx="42" ry="28" fill="${INK}" opacity="0.85"/>
${person(290, 175, 0.8)}
${label('过肩镜头 · 对话构图')}`
    );
  }
  if (zh === '低角度仰拍') {
    return wrap(
      `${frameRect(100, 35, 280, 195)}
${person(240, 185, 1.1)}
${camera(240, 235, 0)}
${arrow(240, 228, 240, 200)}
${label('低角度仰拍')}`
    );
  }
  if (zh === '高角度俯拍') {
    return wrap(
      `${frameRect(100, 35, 280, 195)}
${person(240, 185, 0.65)}
${camera(240, 30, 0)}
${arrow(240, 52, 240, 120)}
${label('高角度俯拍')}`
    );
  }
  if (zh === '上帝视角') {
    return wrap(
      `${frameRect(90, 40, 300, 185)}
<circle cx="240" cy="130" r="18" fill="${MUTED}"/>
<line x1="240" y1="148" x2="240" y2="175" stroke="${MUTED}" stroke-width="4"/>
${camera(240, 28, 90)}
${arrow(240, 48, 240, 95)}
${label('上帝视角 · 垂直俯瞰')}`
    );
  }
  if (zh === '荷兰式倾斜') {
    return wrap(
      `<g transform="translate(240,135) rotate(-12)">
${frameRect(-130, -90, 260, 180)}
${person(0, 35, 0.85)}
</g>
${label('荷兰式倾斜 · 画面倾斜')}`
    );
  }
  if (zh === '剪影镜头') {
    return wrap(
      `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffd60a"/><stop offset="100%" stop-color="#ff9f0a"/></linearGradient></defs>
<rect x="60" y="40" width="360" height="180" rx="6" fill="url(#g)" opacity="0.35"/>
${frameRect(120, 50, 240, 165)}
<path d="M210 200 L240 120 L270 200 Z" fill="${INK}"/>
${label('剪影 · 逆光轮廓')}`
    );
  }

  const s = specs[zh] || specs['中景'];
  let body = person(s.px, s.py, s.ps);
  if (s.crop === 'knee') body = person(s.px, s.py + 18, s.ps);
  if (s.crop === 'waist') body = person(s.px, s.py + 32, s.ps);
  if (s.crop === 'chest') body = person(s.px, s.py + 42, s.ps);
  if (s.crop === 'face') {
    body = `<circle cx="${s.px}" cy="${s.py - 10}" r="38" fill="${MUTED}"/>`;
  }
  return wrap(`${ground()}${body}${frameRect(s.fx, s.fy, s.fw, s.fh)}${label(zh)}`);
}

function renderCameraMove(zh) {
  const moves = {
    横摇镜头: () =>
      `${camera(240, 135, 0)}${arrow(120, 135, 190, 135)}${arrow(360, 135, 290, 135)}${label('横摇 · 水平转动')}`,
    纵摇镜头: () =>
      `${camera(240, 135, 0)}${arrow(240, 210, 240, 170)}${arrow(240, 60, 240, 100)}${label('纵摇 · 垂直转动')}`,
    推镜头: () =>
      `${camera(120, 135, 0)}${person(320, 175, 0.8)}${arrow(150, 135, 270, 135)}${label('推镜头 · 向前推进')}`,
    拉镜头: () =>
      `${camera(360, 135, 180)}${person(160, 175, 0.8)}${arrow(330, 135, 210, 135)}${label('拉镜头 · 向后拉远')}`,
    跟拍镜头: () =>
      `${camera(130, 155, 0)}${person(260, 175, 0.85)}${arrow(170, 155, 220, 155)}${label('跟拍 · 跟随移动')}`,
    环绕运镜: () =>
      `${person(240, 165, 0.9)}<ellipse cx="240" cy="165" rx="95" ry="45" fill="none" stroke="${ACCENT}" stroke-width="2.5" stroke-dasharray="8 6"/>${camera(335, 165, 0)}${label('环绕 · 360° 旋转')}`,
    摇臂升降: () =>
      `${camera(240, 70, 0)}<line x1="240" y1="78" x2="240" y2="190" stroke="${LIGHT}" stroke-width="3" stroke-dasharray="6 5"/>${person(240, 185, 0.55)}${arrow(240, 185, 240, 110)}${label('摇臂升降')}`,
    手持摇晃: () =>
      `${camera(240, 135, -8)}<path d="M170 200 Q200 175 230 200 T290 185" fill="none" stroke="${ACCENT}" stroke-width="2.5"/>${person(300, 175, 0.75)}${label('手持 · 轻微晃动')}`,
    希区柯克变焦: () =>
      `${frameRect(130, 55, 220, 155)}${person(240, 165, 1)}${arrow(240, 215, 240, 175)}<text x="355" y="90" font-size="11" fill="${MUTED}">zoom</text>${arrow(355, 100, 355, 140)}${label('变焦 · 空间扭曲')}`,
    第一人称走动: () =>
      `${frameRect(70, 45, 340, 170)}<path d="M120 210 Q240 150 360 210" fill="none" stroke="${ACCENT}" stroke-width="2.5"/>${label('稳定器 · 沉浸跟随')}`,
    无人机航拍: () =>
      `<polygon points="240,45 210,65 270,65" fill="${INK}"/>${arrow(240, 68, 240, 110)}${ground(200)}${person(240, 185, 0.45)}${label('无人机 · 航拍俯瞰')}`,
    慢动作: () =>
      `${person(240, 175, 0.9)}<text x="240" y="95" text-anchor="middle" font-size="42" font-weight="700" fill="${ACCENT}" opacity="0.25">×0.25</text>${label('慢动作')}`,
    快动作: () =>
      `${person(240, 175, 0.9)}<text x="240" y="95" text-anchor="middle" font-size="42" font-weight="700" fill="${ACCENT}" opacity="0.25">×4</text>${label('快动作')}`,
    快速摇切: () =>
      `${frameRect(60, 60, 160, 120)}${frameRect(260, 60, 160, 120)}${arrow(220, 120, 260, 120)}<path d="M180 80 L220 120 L180 160" fill="none" stroke="${ACCENT}" stroke-width="3"/>${label('快速摇切 · 转场')}`,
    静止机位: () =>
      `${camera(240, 135, 0)}${person(240, 175, 0.85)}<rect x="200" y="100" width="80" height="60" fill="none" stroke="${ACCENT}" stroke-width="2" rx="3"/>${label('静止机位 · 固定画面')}`
  };
  const fn = moves[zh] || moves['横摇镜头'];
  return wrap(fn());
}

function renderLighting(zh) {
  const face = `<circle cx="240" cy="130" r="42" fill="${LIGHT}"/><circle cx="240" cy="130" r="38" fill="#e8e8ed"/>`;
  const lights = {
    伦勃朗光: () =>
      `${face}<circle cx="120" cy="70" r="16" fill="#ffd60a"/>${arrow(136, 82, 205, 115)}<path d="M215 118 L228 138 L202 138 Z" fill="${INK}" opacity="0.35"/>${label('伦勃朗光 · 三角暗部')}`,
    高反差戏剧顶光: () =>
      `${face}<circle cx="240" cy="45" r="18" fill="#ffd60a"/>${arrow(240, 63, 240, 88)}${label('顶光 · 深眼窝')}`,
    自然窗光: () =>
      `${face}<rect x="60" y="50" width="24" height="120" fill="${ACCENT}" opacity="0.2"/>${arrow(84, 110, 198, 125)}${label('窗光 · 柔和侧光')}`,
    赛博朋克霓虹光: () =>
      `${face}${swatches(['#bf5af2', '#0a84ff', '#ff375f'], 165, 28)}${label('霓虹 · 高饱和人造光')}`,
    丁达尔神圣光芒: () =>
      `${face}<polygon points="240,30 180,200 300,200" fill="#ffd60a" opacity="0.12"/>${label('丁达尔 · 可见光束')}`,
    '逆光/轮廓光': () =>
      `<circle cx="240" cy="130" r="42" fill="${INK}"/><circle cx="380" cy="130" r="20" fill="#ffd60a"/>${arrow(360, 130, 282, 130)}${label('逆光 · 轮廓金边')}`,
    魔幻时刻光晕: () =>
      `${face}<rect x="60" y="40" width="360" height="150" fill="#ff9f0a" opacity="0.15" rx="8"/>${label('魔幻时刻 · 金色顺光')}`,
    冷酷月光: () =>
      `${face}<circle cx="340" cy="60" r="14" fill="#64d2ff"/>${arrow(326, 72, 270, 110)}<rect x="60" y="40" width="360" height="150" fill="#0a84ff" opacity="0.08" rx="8"/>${label('月光 · 冷蓝调')}`,
    电影高调光: () =>
      `<rect x="60" y="40" width="360" height="150" fill="#fff" stroke="${LIGHT}" rx="8"/>${face}${label('高调光 · 明亮少阴影')}`,
    暗黑低调光: () =>
      `<rect x="60" y="40" width="360" height="150" fill="#2c2c2e" rx="8"/>${face.replace('#e8e8ed', '#48484a')}${label('低调光 · 大面积阴影')}`,
    '容积光/烟雾光': () =>
      `${face}<rect x="100" y="60" width="280" height="120" fill="#86868b" opacity="0.15" rx="8"/><line x1="240" y1="40" x2="240" y2="200" stroke="#ffd60a" stroke-width="24" opacity="0.12"/>${label('体积光 · 烟雾光束')}`,
    侧逆光: () =>
      `${face}<circle cx="360" cy="100" r="14" fill="#ffd60a"/>${arrow(346, 108, 278, 122)}${label('侧逆光 · 骨骼线条')}`,
    霓虹环境反光: () =>
      `${ground(200)}<rect x="120" y="200" width="240" height="20" fill="#0a84ff" opacity="0.35" rx="4"/>${face}${label('霓虹反光 · 湿地反射')}`,
    柔和散射光: () =>
      `${face}<rect x="80" y="50" width="320" height="130" fill="#fff" opacity="0.6" rx="40"/>${label('散射光 · 无硬阴影')}`,
    剧场追光: () =>
      `<rect x="60" y="40" width="360" height="150" fill="#1d1d1f" opacity="0.85" rx="8"/><polygon points="240,20 170,200 310,200" fill="#fff" opacity="0.18"/>${face.replace('#e8e8ed', '#f5f5f7')}${label('追光 · 局部聚焦')}`
  };
  const fn = lights[zh] || lights['自然窗光'];
  return wrap(fn());
}

function renderColor(zh) {
  const palettes = {
    莫兰迪高级色系: ['#a8a29a', '#9ca3af', '#b8a99a', '#a3a89c'],
    经典青橙电影色调: ['#0a9396', '#005f73', '#ee9b00', '#ca6702'],
    双色调赛博朋克: ['#ff006e', '#8338ec', '#3a86ff', '#00f5d4'],
    复古黑白: ['#1d1d1f', '#48484a', '#86868b', '#d2d2d7'],
    韦斯·安德森美学: ['#f4a3b5', '#7eb6ff', '#ffd6a5', '#caffbf'],
    高对比度胶片色彩: ['#d00000', '#ffba08', '#3a5a40', '#588157'],
    末日废土黄昏色: ['#bc6c25', '#dda15e', '#606c38', '#283618'],
    冷酷工业反乌托邦: ['#415a77', '#778da9', '#1b263b', '#0d1b2a'],
    酸性迷幻色调: ['#b5179b', '#7209b7', '#4cc9f0', '#80ffdb'],
    复古宝丽来色调: ['#e9c46a', '#f4a261', '#e76f51', '#d4a373'],
    新好莱坞冷绿: ['#1b4332', '#2d6a4f', '#40916c', '#52b788'],
    王家卫式流金: ['#ffba08', '#faa307', '#f48c06', '#dc2f02'],
    大地自然色系: ['#6b705c', '#a5a58d', '#cb997e', '#b7b7a4'],
    极简冷白未来: ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da'],
    蜡笔柔和色调: ['#ffc8dd', '#bde0fe', '#cdb4db', '#ffafcc']
  };
  const colors = palettes[zh] || palettes['莫兰迪高级色系'];
  return wrap(`${swatches(colors)}${label(zh)}`);
}

function renderTexture(zh) {
  const textures = {
    '35mm胶片颗粒': () =>
      `<rect x="60" y="60" width="360" height="130" fill="#3a3a3c" rx="6"/>${Array.from({ length: 80 }, (_, i) => `<circle cx="${70 + (i * 17) % 340}" cy="${75 + (i * 13) % 100}" r="1.2" fill="#fff" opacity="${0.08 + (i % 5) * 0.04}"/>`).join('')}${label('胶片颗粒')}`,
    IMAX超清质感: () =>
      `${frameRect(100, 50, 280, 155)}<text x="240" y="130" text-anchor="middle" font-size="28" font-weight="700" fill="${ACCENT}">IMAX</text>${label('超清 · 通透细节')}`,
    浅景深焦外虚化: () =>
      `<circle cx="240" cy="130" r="36" fill="${INK}"/><circle cx="120" cy="130" r="28" fill="${LIGHT}" opacity="0.5"/><circle cx="360" cy="130" r="28" fill="${LIGHT}" opacity="0.5"/>${label('浅景深 · 背景虚化')}`,
    变型镜头椭圆焦外: () =>
      `${Array.from({ length: 6 }, (_, i) => `<ellipse cx="${110 + i * 55}" cy="130" rx="10" ry="18" fill="#ffd60a" opacity="0.35"/>`).join('')}${label('椭圆焦外光斑')}`,
    变形镜头炫光: () =>
      `<line x1="80" y1="130" x2="400" y2="130" stroke="#64d2ff" stroke-width="6" opacity="0.55"/>${label('水平镜头炫光')}`,
    复古微粒: () =>
      `<rect x="60" y="60" width="360" height="130" fill="#2c2c2e" rx="6"/><line x1="90" y1="80" x2="380" y2="82" stroke="#fff" opacity="0.08"/><line x1="100" y1="140" x2="350" y2="138" stroke="#fff" opacity="0.06"/>${label('划痕 · 复古胶片')}`,
    宝丽来微噪点: () =>
      `<rect x="110" y="55" width="260" height="150" fill="#f4efe6" stroke="${LIGHT}" rx="4"/>${label('宝丽来 · 褪色边框')}`,
    微距质感: () =>
      `<circle cx="240" cy="130" r="48" fill="none" stroke="${ACCENT}" stroke-width="2"/><circle cx="240" cy="130" r="20" fill="${MUTED}"/><circle cx="246" cy="124" r="5" fill="#fff"/>${label('微距 · 局部细节')}`,
    '监控/伪纪录片低画质': () =>
      `<rect x="80" y="50" width="320" height="155" fill="#1d1d1f" rx="4"/><text x="240" y="120" text-anchor="middle" fill="#30d158" font-family="monospace" font-size="14">REC ● 04:32</text>${label('监控 · 低画质')}`,
    '潮湿/雨天反射质感': () =>
      `${ground(190)}<rect x="100" y="195" width="280" height="25" fill="#0a84ff" opacity="0.25" rx="4"/>${person(240, 170, 0.8)}${label('雨天 · 地面反射')}`,
    磨砂哑光: () =>
      `<rect x="80" y="60" width="320" height="130" fill="#aeaeb2" rx="8"/>${label('哑光 · 低反差')}`,
    柔光镜效果: () =>
      `<circle cx="240" cy="130" r="30" fill="#ffd60a" opacity="0.45"/><circle cx="240" cy="130" r="18" fill="#ffd60a" opacity="0.65"/>${label('柔光镜 · 光晕')}`,
    浓郁胶片厚重感: () =>
      `<rect x="80" y="60" width="320" height="130" fill="#6b3a2a" rx="6"/><rect x="80" y="60" width="320" height="130" fill="#ff453a" opacity="0.08" rx="6"/>${label('胶片晕光 · 厚重')}`,
    超现实主义数码质感: () =>
      `<text x="240" y="120" text-anchor="middle" font-size="36" font-weight="700" fill="${INK}">8K</text><text x="240" y="150" text-anchor="middle" font-size="13" fill="${MUTED}">Ultra Sharp</text>${label('数码 · 极致锐度')}`,
    烟雾缭绕丁达尔质感: () =>
      `<rect x="80" y="70" width="320" height="110" fill="#86868b" opacity="0.2" rx="8"/><line x1="240" y1="50" x2="240" y2="200" stroke="#fff" stroke-width="18" opacity="0.12"/>${label('空气感 · 烟雾颗粒')}`
  };
  const fn = textures[zh] || textures['35mm胶片颗粒'];
  return wrap(fn());
}

function renderLens(zh) {
  const fov = {
    'ARRI 摄影机拍摄': ['ARRI', 50],
    'RED V-Raptor 质感': ['RED', 50],
    '35mm 经典人文镜头': ['35mm', 58],
    '50mm 定焦大师镜头': ['50mm', 48],
    '85mm 唯美特写镜头': ['85mm', 28],
    广角大片镜头: ['24mm', 72],
    超广角戏剧性镜头: ['12mm', 95],
    电影变形镜头: ['Anamorphic', 62],
    老镜头氛围: ['Vintage', 52],
    蔡司硬核画质: ['Zeiss', 50],
    'Panavision 经典': ['PV', 50],
    长焦空间压缩: ['200mm', 18],
    鱼眼夸张镜头: ['Fisheye', 120],
    针孔复古摄影: ['Pinhole', 40],
    '16毫米独立电影': ['16mm', 55]
  };
  const [name, angle] = fov[zh] || ['Lens', 50];
  const rad = (angle / 2) * (Math.PI / 180);
  const len = 120;
  const x1 = 240 - Math.sin(rad) * len;
  const y1 = 170 - Math.cos(rad) * len;
  const x2 = 240 + Math.sin(rad) * len;
  return wrap(
    `${camera(240, 170, 0)}
<polygon points="240,170 ${x1},${y1 - 40} ${x2},${y1 - 40}" fill="${ACCENT}" opacity="0.12"/>
<line x1="240" y1="170" x2="${x1}" y2="${y1 - 40}" stroke="${ACCENT}" stroke-width="2"/>
<line x1="240" y1="170" x2="${x2}" y2="${y1 - 40}" stroke="${ACCENT}" stroke-width="2"/>
<text x="240" y="95" text-anchor="middle" font-size="22" font-weight="700" fill="${INK}">${name}</text>
${label(zh)}`
  );
}

function renderScene(zh) {
  const scenes = {
    雨夜潮湿霓虹街头: () =>
      `${ground(200)}<rect x="100" y="198" width="280" height="18" fill="#0a84ff" opacity="0.35" rx="3"/>${swatches(['#ff375f', '#0a84ff', '#bf5af2'], 70, 24)}${label('雨夜霓虹')}`,
    末日荒凉废土大漠: () =>
      `<path d="M60 200 Q160 150 260 190 T440 170 L440 220 L60 220 Z" fill="#dda15e" opacity="0.45"/>${label('废土 · 荒漠')}`,
    孤寂深空宇宙飞船: () =>
      `<rect x="60" y="40" width="360" height="150" fill="#0d1b2a" rx="8"/><circle cx="320" cy="80" r="3" fill="#fff"/><circle cx="350" cy="110" r="2" fill="#fff"/><rect x="170" y="110" width="140" height="50" rx="6" fill="${MUTED}"/>${label('深空 · 飞船')}`,
    北欧冰雪冷寂荒原: () =>
      `<rect x="60" y="120" width="360" height="80" fill="#e0fbfc" rx="4"/><path d="M120 120 L140 90 L160 120" fill="#fff"/>${label('北欧 · 冰雪')}`,
    复古港风迷幻小巷: () =>
      `${ground(200)}<rect x="90" y="120" width="50" height="80" fill="#ff453a" opacity="0.5"/><rect x="160" y="100" width="60" height="100" fill="#ffd60a" opacity="0.45"/><rect x="250" y="110" width="55" height="90" fill="#0a84ff" opacity="0.45"/>${label('港风 · 霓虹巷')}`,
    中世纪暗黑神秘城堡: () =>
      `<path d="M180 200 L180 100 L210 130 L240 90 L270 130 L300 100 L300 200 Z" fill="#415a77"/>${label('哥特 · 城堡')}`,
    赛博大都市高空俯瞰: () =>
      `${Array.from({ length: 8 }, (_, i) => `<rect x="${90 + i * 38}" y="${130 - (i % 3) * 20}" width="28" height="${70 + (i % 4) * 15}" fill="${i % 2 ? '#3a3a3c' : '#48484a'}"/>`).join('')}${label('赛博 · 都市')}`,
    浓雾弥漫的静谧森林: () =>
      `<rect x="60" y="80" width="360" height="110" fill="#86868b" opacity="0.2" rx="8"/><rect x="220" y="110" width="16" height="70" fill="#6b705c"/>${label('雾林 · 丁达尔')}`,
    复古美式公路旅馆: () =>
      `${ground(200)}<rect x="170" y="130" width="140" height="70" fill="#ff9f0a" opacity="0.35" rx="4"/><text x="240" y="168" text-anchor="middle" font-size="14" fill="${INK}">MOTEL</text>${label('公路 · 旅馆')}`,
    迷幻夜总会地下酒吧: () =>
      `<rect x="60" y="40" width="360" height="150" fill="#1d1d1f" rx="8"/><circle cx="180" cy="110" r="22" fill="#ff375f" opacity="0.45"/><circle cx="300" cy="120" r="18" fill="#30d158" opacity="0.4"/>${label('地下 · 酒吧')}`,
    暴风雨降临的前夕: () =>
      `<rect x="60" y="50" width="360" height="90" fill="#415a77" opacity="0.5" rx="6"/><path d="M120 140 L140 110 L160 140" fill="#ffd60a" opacity="0.7"/>${label('暴风雨 · 前夕')}`,
    烈日灼烫的烈火黄昏: () =>
      `<rect x="60" y="80" width="360" height="100" fill="#ff9f0a" opacity="0.35" rx="8"/><circle cx="360" cy="95" r="28" fill="#ff453a" opacity="0.55"/>${label('烈火 · 黄昏')}`,
    极简主义白空间: () =>
      `<rect x="80" y="50" width="320" height="140" fill="#fff" stroke="${LIGHT}" rx="8"/><line x1="120" y1="80" x2="360" y2="80" stroke="${LIGHT}"/>${label('极简 · 白空间')}`,
    废弃工业重金属厂房: () =>
      `${Array.from({ length: 5 }, (_, i) => `<rect x="${100 + i * 55}" y="${120 - (i % 2) * 15}" width="20" height="${80 + i * 5}" fill="#6b705c"/>`).join('')}${label('工业 · 厂房')}`,
    喧嚣孤独的深夜地铁: () =>
      `<rect x="80" y="100" width="320" height="70" fill="#48484a" rx="6"/><rect x="110" y="115" width="50" height="35" fill="#64d2ff" opacity="0.35" rx="2"/><rect x="200" y="115" width="50" height="35" fill="#64d2ff" opacity="0.25" rx="2"/>${label('地铁 · 深夜')}`
  };
  const fn = scenes[zh] || scenes['雨夜潮湿霓虹街头'];
  return wrap(fn());
}

function renderCinematography(zh) {
  const filmColors = {
    '《银翼杀手2049》': ['#c9a227', '#6b5b4a', '#1a1a2e'],
    '《沙丘》': ['#b8860b', '#8b7355', '#2f2f2f'],
    '《阿凡达》': ['#00b4d8', '#0077b6', '#023e8a'],
    '《星际穿越》': ['#03045e', '#0077b6', '#caf0f8'],
    '《疯狂麦克斯4》': ['#ff6b35', '#004e89', '#f7c59f'],
    '《黑客帝国》': ['#1b4332', '#2d6a4f', '#081c15'],
    '《地心引力》': ['#03071e', '#6c757d', '#f8f9fa'],
    '《魔戒》': ['#606c38', '#283618', '#dda15e'],
    '《创：战纪》': ['#00f5d4', '#0077b6', '#03071e'],
    '《流浪地球》': ['#e85d04', '#370617', '#6a040f'],
    '《教父》': ['#1b1b1e', '#6b4c3b', '#c9a66b'],
    '《小丑》': ['#2d6a4f', '#40916c', '#d00000'],
    '《七宗罪》': ['#212529', '#495057', '#6c757d'],
    '《极速追杀》': ['#7209b7', '#f72585', '#4cc9f0'],
    '《花样年华》': ['#9d0208', '#6a040f', '#370617'],
    '《白日焰火》': ['#8d99ae', '#edf2f4', '#ef233c'],
    '《大红灯笼高高挂》': ['#d00000', '#1b1b1e', '#6a040f'],
    '《刺客聂隐娘》': ['#588157', '#a3b18a', '#344e41'],
    '《老无所依》': ['#bc6c25', '#dda15e', '#fefae0'],
    '《囚徒》': ['#415a77', '#778da9', '#e0e1dd'],
    '《布达佩斯大饭店》': ['#f4acb7', '#84a59d', '#f7cad0'],
    '《天使爱美丽》': ['#d00000', '#2b9348', '#ffba08'],
    '《情书》': ['#caf0f8', '#90e0ef', '#ffffff'],
    '《请以你的名字呼唤我》': ['#ffd60a', '#ff9f0a', '#52b788'],
    '《爱乐之城》': ['#7209b7', '#f72585', '#ffd60a'],
    '《罗马》': ['#1d1d1f', '#86868b', '#d2d2d7'],
    '《海边的曼彻斯特》': ['#8ecae6', '#219ebc', '#023047'],
    '《生命之树》': ['#588157', '#a3b18a', '#fefae0'],
    '《重庆森林》': ['#ff006e', '#fb5607', '#ffbe0b'],
    '《悲情城市》': ['#6b705c', '#a5a58d', '#cb997e']
  };
  const colors = filmColors[zh] || ['#86868b', '#d2d2d7', '#1d1d1f'];
  const title = zh.replace(/[《》]/g, '');
  return wrap(
    `${swatches(colors, 80, 100)}
<text x="240" y="215" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" font-weight="600" fill="${INK}">${title}</text>
${label('色彩风格参考 · 非海报')}`
  );
}

const RENDERERS = {
  shot_size: renderShotSize,
  camera_move: renderCameraMove,
  lighting: renderLighting,
  color_palette: renderColor,
  texture: renderTexture,
  lens_hardware: renderLens,
  scene_environment: renderScene,
  cinematography: renderCinematography
};

export function slugify(en) {
  return String(en || 'item')
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export function renderTechDiagram(categoryId, item) {
  const fn = RENDERERS[categoryId];
  if (!fn) {
    return wrap(`<text x="240" y="135" text-anchor="middle" font-size="16" fill="${MUTED}">${item.zh}</text>${label('示意参考')}`);
  }
  return fn(item.zh);
}
