import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { directorCategories, cinematographyCategory } from './directors-extra.mjs';
import { enrichDirectorCategories } from './director-enrich.mjs';
import { syncTechDiagramRefs } from './generate-tech-diagrams.mjs';

const enrichedDirectorCategories = enrichDirectorCategories(directorCategories);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const data = {
  version: 4,
  categories: [
    {
      id: 'shot_size',
      label: '景别',
      items: [
        { zh: '大远景', en: 'Extreme Long Shot', desc: '展现宏大叙事、环境、孤独感' },
        { zh: '远景', en: 'Long Shot', desc: '交代人物与生存环境的关系' },
        { zh: '全景', en: 'Full Shot', desc: '展现人物全身及周围主要环境' },
        { zh: '中远景', en: 'Medium Long Shot', desc: '膝盖以上，兼顾动作与环境' },
        { zh: '中景', en: 'Medium Shot', desc: '腰部以上，标准的叙事、对话景别' },
        { zh: '中特写', en: 'Medium Close-up', desc: '胸部以上，强化表情和情绪' },
        { zh: '特写', en: 'Close-up', desc: '脸部或特定物体，放大心理活动' },
        { zh: '大特写', en: 'Extreme Close-up', desc: '眼睛、局部细节，制造强烈的视觉冲击' },
        { zh: '主观视角', en: 'POV Shot', desc: '观众即主角，第一人称沉浸感' },
        { zh: '过肩镜头', en: 'Over-the-Shoulder Shot', desc: '经典对话双人景，建立空间关系' },
        { zh: '低角度仰拍', en: 'Low Angle Shot', desc: '凸显角色的伟岸、权力或压迫感' },
        { zh: '高角度俯拍', en: 'High Angle Shot', desc: '展现角色的无助、渺小或全局鸟瞰' },
        { zh: '上帝视角', en: "Bird's Eye View", desc: '垂直向下俯瞰，充满命运感和疏离感' },
        { zh: '荷兰式倾斜', en: 'Dutch Angle', desc: '画面倾斜，表现不安、疯狂、局势失控' },
        { zh: '剪影镜头', en: 'Silhouette Shot', desc: '逆光剪影，极具戏剧张力和神秘感' }
      ]
    },
    {
      id: 'camera_move',
      label: '运镜',
      items: [
        { zh: '横摇镜头', en: 'Pan Shot', desc: '镜头水平转动，环视环境' },
        { zh: '纵摇镜头', en: 'Tilt Shot', desc: '镜头垂直上下转动，展现高度' },
        { zh: '推镜头', en: 'Dolly In', desc: '相机向前推进，引导视觉焦点' },
        { zh: '拉镜头', en: 'Dolly Out', desc: '相机向后拉远，揭示更大环境' },
        { zh: '跟拍镜头', en: 'Tracking Shot', desc: '紧跟角色移动，强烈的临场感' },
        { zh: '环绕运镜', en: 'Orbit Shot', desc: '360度围绕主体旋转，烘托高光时刻' },
        { zh: '摇臂升降', en: 'Crane Shot', desc: '画面拔地而起或降落，宏大开场/结尾' },
        { zh: '手持摇晃', en: 'Handheld Movement', desc: '纪实感、混乱、紧张、临场' },
        { zh: '希区柯克变焦', en: 'Vertigo Shot', desc: '慢推同时反向变焦，产生空间扭曲的眩晕感' },
        { zh: '第一人称走动', en: 'Steadicam Walk', desc: '极其平稳的运动跟拍，沉浸式跟随' },
        { zh: '无人机航拍', en: 'Drone Flyover', desc: '广阔的动态俯瞰视角' },
        { zh: '慢动作', en: 'Slow Motion', desc: '放大动作细节，拉长情绪时间' },
        { zh: '快动作', en: 'Fast Motion', desc: '压缩时间，表现忙碌或时空穿梭' },
        { zh: '快速摇切', en: 'Whip Pan', desc: '极快的横摇，用于充满动感的转场' },
        { zh: '静止机位', en: 'Static Shot', desc: '毫无移动，克制、冷静的东方美学' }
      ]
    },
    {
      id: 'lighting',
      label: '光影',
      items: [
        { zh: '伦勃朗光', en: 'Rembrandt Lighting', desc: '经典的45度侧光，脸部暗侧呈现三角光，复古有质感' },
        { zh: '高反差戏剧顶光', en: 'High-contrast Top Light', desc: '强烈头顶光，形成深邃眼窝，压抑且戏剧化' },
        { zh: '自然窗光', en: 'Natural Window Light', desc: '柔和的侧向自然光，富有生活气息与唯美感' },
        { zh: '赛博朋克霓虹光', en: 'Cyberpunk Neon Glow', desc: '蓝紫、红绿的高饱和度人造霓虹，街头科幻感' },
        { zh: '丁达尔神圣光芒', en: 'God Rays / Tyndall Effect', desc: '穿透云雾/窗户的可见光束，神圣、唯美' },
        { zh: '逆光/轮廓光', en: 'Backlighting / Rim Light', desc: '勾勒主体金边轮廓，分离背景，具高级感' },
        { zh: '魔幻时刻光晕', en: 'Golden Hour Glow', desc: '日落前/日出后的温暖金色顺光，浪漫且情绪饱满' },
        { zh: '冷酷月光', en: 'Cinematic Moonlight', desc: '冷蓝色调孤寂光影，神秘、恐怖或凄凉' },
        { zh: '电影高调光', en: 'High-key Lighting', desc: '明亮、少阴影，干净、积极、科幻未来感' },
        { zh: '暗黑低调光', en: 'Low-key Lighting', desc: '大面积阴影，极少亮部，黑色电影标配' },
        { zh: '容积光/烟雾光', en: 'Volumetric Smoke Lighting', desc: '配合烟雾扩散的光束，极强空气感与空间深度' },
        { zh: '侧逆光', en: 'Kick Light', desc: '从后侧方打来的硬光，突出人物面部骨骼线条' },
        { zh: '霓虹环境反光', en: 'Ambient Neon Reflection', desc: '潮湿地面或皮肤上的彩色反光，层次丰富' },
        { zh: '柔和散射光', en: 'Soft Diffused Light', desc: '阴天或大型蝴蝶布的光效，温和、无硬阴影' },
        { zh: '剧场追光', en: 'Stage Spotlight', desc: '强烈的局部聚焦光，主角宿命感' }
      ]
    },
    {
      id: 'color_palette',
      label: '色彩',
      items: [
        { zh: '莫兰迪高级色系', en: 'Morandi Palette', desc: '低饱和度、高级灰色调，优雅平和' },
        { zh: '经典青橙电影色调', en: 'Teal and Orange', desc: '好莱坞商业大片最爱，冷暖对比强烈，主体突出' },
        { zh: '双色调赛博朋克', en: 'Cyberpunk Duotone', desc: '霓虹粉与青蓝的极致对立，未来主义' },
        { zh: '复古黑白', en: 'Monochrome Noir', desc: '纯粹的黑白灰，高对比，致敬经典老电影' },
        { zh: '韦斯·安德森美学', en: 'Wes Anderson Palette', desc: '高饱和、粉嫩、复古、童话般的马卡龙配色' },
        { zh: '高对比度胶片色彩', en: 'Kodachrome Colors', desc: '复古柯达胶片色，红黄浓郁，充满人文故事感' },
        { zh: '末日废土黄昏色', en: 'Wasteland Sepia Tone', desc: '棕黄、沙尘、荒凉的末日色调' },
        { zh: '冷酷工业反乌托邦', en: 'Desaturated Industrial Cold', desc: '低饱和度冷灰、青绿，压抑的科幻乌托邦' },
        { zh: '酸性迷幻色调', en: 'Acid Psychedelic Tones', desc: '荧光绿、紫、高对比，迷幻反叛视觉' },
        { zh: '复古宝丽来色调', en: 'Polaroid Warm Nostalgia', desc: '褪色感、发黄的暖调，极具回忆感' },
        { zh: '新好莱坞冷绿', en: 'Moody Cinematic Green', desc: '带有一丝病态、阴郁的墨绿调' },
        { zh: '王家卫式流金', en: 'Wong Kar-wai Warm Gold', desc: '浓郁的复古红黄、环境混杂色，暧昧且诗意' },
        { zh: '大地自然色系', en: 'Earthy Muted Tones', desc: '棕、褐、暗绿，纪实、质朴的史诗感' },
        { zh: '极简冷白未来', en: 'Minimalist Sci-fi White', desc: '纯净白、浅蓝灰，冰冷理性的未来科技感' },
        { zh: '蜡笔柔和色调', en: 'Pastel Cinematic Tones', desc: '轻盈、浪漫、日系治愈或法式文艺电影感' }
      ]
    },
    {
      id: 'texture',
      label: '画面质感',
      items: [
        { zh: '35mm胶片颗粒', en: '35mm film grain', desc: '经典的电影质感，颗粒细腻，人文感十足' },
        { zh: 'IMAX超清质感', en: 'IMAX crisp texture', desc: '极致的清晰度、宽广的视野与通透度' },
        { zh: '浅景深焦外虚化', en: 'Shallow Depth of Field', desc: '背景柔美融化，极度聚焦于主体' },
        { zh: '变型镜头椭圆焦外', en: 'Anamorphic Bokeh', desc: '电影变形镜头特有的椭圆形光斑，极为高级' },
        { zh: '变形镜头炫光', en: 'Anamorphic Lens Flare', desc: '水平一字划开的蓝色/金色光炫，好莱坞标配' },
        { zh: '复古微粒', en: 'Vintage Film Dust and Scratches', desc: '带有轻微划痕与灰尘的复古老电影胶片感' },
        { zh: '宝丽来微噪点', en: 'Polaroid Texture', desc: '柔和的低反差、轻微冲洗瑕疵的相片质感' },
        { zh: '微距质感', en: 'Macro Detail Sharpness', desc: '纤毫毕现的微观材质，如皮肤毛孔、水滴、纤维' },
        { zh: '监控/伪纪录片低画质', en: 'CCTV / VHS Degraded Quality', desc: '带有复古扫描线、低画质的纪实悬疑感' },
        { zh: '潮湿/雨天反射质感', en: 'Wet and Rainy Surface Texture', desc: '泥泞、反光、水渍，增强画面细节厚度' },
        { zh: '磨砂哑光', en: 'Matte Finish', desc: '消除刺眼高光，呈现高档的高级灰、低反差质感' },
        { zh: '柔光镜效果', en: 'Pro-mist Filter Effect', desc: '亮部微微爆开、散发朦胧光晕的浪漫唯美质感' },
        { zh: '浓郁胶片厚重感', en: 'Dense Film Halation', desc: '胶片特有的红色边缘晕染，色彩厚重' },
        { zh: '超现实主义数码质感', en: 'Ultra-realistic 8K Resolution', desc: '现代数码摄影机的极致锐度与动态范围' },
        { zh: '烟雾缭绕丁达尔质感', en: 'Atmospheric Haze', desc: '充满雾气、尘埃颗粒的空气阻尼感' }
      ]
    },
    {
      id: 'lens_hardware',
      label: '镜头与相机',
      items: [
        { zh: 'ARRI 摄影机拍摄', en: 'Shot on ARRI Alexa Mini', desc: '业界公认最具有电影感、肤色最完美的机器质感' },
        { zh: 'RED V-Raptor 质感', en: 'Shot on RED V-Raptor', desc: '高锐度、高动态范围，适合现代动作大片' },
        { zh: '35mm 经典人文镜头', en: '35mm Cinematic Lens', desc: '最符合人类双眼视角的叙事镜头' },
        { zh: '50mm 定焦大师镜头', en: '50mm Prime Lens', desc: '黄金标准人像定焦，虚化真实自然' },
        { zh: '85mm 唯美特写镜头', en: '85mm Portrait Lens', desc: '空间压缩感强，极其唯美的人物特写镜头' },
        { zh: '广角大片镜头', en: '24mm Wide Angle Lens', desc: '带来轻微的透视张力，适合大场景或环境人像' },
        { zh: '超广角戏剧性镜头', en: '12mm Ultra-wide Lens', desc: '极强的空间延伸与视觉压迫感' },
        { zh: '电影变形镜头', en: 'Anamorphic Lens', desc: '物理层面呈现 2.39:1 的院线电影视觉感' },
        { zh: '老镜头氛围', en: 'Vintage Cooke Lens', desc: '著名的库克镜头温暖感，锐利而不锐噪' },
        { zh: '蔡司硬核画质', en: 'Zeiss Master Prime', desc: '极致的透亮感、色彩还原与极低的色散' },
        { zh: 'Panavision 经典', en: 'Panavision Panaflex', desc: '好莱坞复古大片的黄金标准机质感' },
        { zh: '长焦空间压缩', en: '200mm Telephoto Lens', desc: '极度压缩前后景空间，将背景放大贴近主体' },
        { zh: '鱼眼夸张镜头', en: 'Fisheye Lens', desc: '180度扭曲视场，表现疯狂、幻觉或极限运动' },
        { zh: '针孔复古摄影', en: 'Pinhole Camera Aesthetic', desc: '边缘失光严重、带有梦境和不确定性的复古感' },
        { zh: '16毫米独立电影', en: '16mm Bolex Camera', desc: '粗糙、颗粒大、复古文艺风、独立电影质感' }
      ]
    },
    ...enrichedDirectorCategories,
    {
      id: 'scene_environment',
      label: '场景环境',
      items: [
        { zh: '雨夜潮湿霓虹街头', en: 'Cyberpunk rainy neon street', desc: '地面积水、霓虹倒影，极佳的色彩和质感载体' },
        { zh: '末日荒凉废土大漠', en: 'Desolate post-apocalyptic desert', desc: '狂风沙尘、枯木、苍凉荒芜的宏大感' },
        { zh: '孤寂深空宇宙飞船', en: 'Lonely deep space spaceship interior', desc: '机械、冷光、无限的宇宙，孤独与未知感' },
        { zh: '北欧冰雪冷寂荒原', en: 'Nordic moody snowy wilderness', desc: '极简、冷色调、纯净而残酷的自然质感' },
        { zh: '复古港风迷幻小巷', en: 'Vintage 90s Hong Kong alley', desc: '繁华斑驳的招牌、充满烟火气与市井罪恶感' },
        { zh: '中世纪暗黑神秘城堡', en: 'Dark medieval gothic castle interior', desc: '烛光、石墙、冷冽的阴郁历史或魔幻质感' },
        { zh: '赛博大都市高空俯瞰', en: 'Cyberpunk megacity megastructure panorama', desc: '鳞次栉比的摩天大楼、全息投影、极致震撼' },
        { zh: '浓雾弥漫的静谧森林', en: 'Misty cinematic morning forest', desc: '烟雾扩散、丁达尔光线极佳的载体，充满未知' },
        { zh: '复古美式公路旅馆', en: 'Retro American highway motel', desc: '霓虹灯牌、孤独长路、公路电影的漂泊感' },
        { zh: '迷幻夜总会地下酒吧', en: 'Moody hazy underground speakeasy bar', desc: '红色/绿色氛围灯、烟雾、混乱慵懒的罪恶感' },
        { zh: '暴风雨降临的前夕', en: 'Ominous thunderstorm incoming sky', desc: '极具压迫感乌云、戏剧化的自然光线突变' },
        { zh: '烈日灼烫的烈火黄昏', en: 'Scorching golden hour sunset sky', desc: '浓烈、黏稠、充满情绪和宿命感的红黄色调' },
        { zh: '极简主义白空间', en: 'Minimalist clean futuristic laboratory', desc: '纯白、线条、无暇无垢的近未来硬核科幻感' },
        { zh: '废弃工业重金属厂房', en: 'Abandoned brutalist industrial factory', desc: '铁锈、钢筋、庞大的机械结构、暴力美学基础' },
        { zh: '喧嚣孤独的深夜地铁', en: 'Cinematic moody moving subway car', desc: '掠过的窗外灯光、工业冷光、孤独通勤感' }
      ]
    },
    cinematographyCategory
  ],
  aspectRatios: [
    { id: '16_9', label: '16:9 电影宽屏', suffix: '--ar 16:9' },
    { id: '2_39_1', label: '2.39:1 超宽银幕', suffix: '--ar 2.39:1' },
    { id: '1_1', label: '1:1 方形', suffix: '--ar 1:1' },
    { id: '9_16', label: '9:16 竖屏', suffix: '--ar 9:16' },
    { id: 'none', label: '不追加比例', suffix: '' }
  ]
};

syncTechDiagramRefs(data.categories);
const { enrichAllImages } = await import('./image-enrich.mjs');
enrichAllImages(data);

const root = __dirname;
fs.writeFileSync(path.join(root, 'data.json'), JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(
  path.join(root, 'prompt-data.js'),
  '// 由 build-data.mjs 生成，供双击打开 index.html 时离线加载\nwindow.PROMPT_DATA = ' +
    JSON.stringify(data) +
    ';\n',
  'utf8'
);
console.log('Wrote data.json and prompt-data.js, categories:', data.categories.length);
