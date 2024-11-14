// mock-api.js
import Mock from 'mockjs';

// 模拟用户登录接口
Mock.mock('/api/login', 'post', (options) => {
  const {username, password} = JSON.parse(options.body);
  if (username === 'user' && password === '123456') {
    return {
      code: 200, message: 'Login successful', token: Mock.Random.guid(),
    };
  } else {
    return {
      code: 401, message: 'Invalid email or password',
    };
  }
});

Mock.mock('/api/music', 'get', () => {
  return [{
    "artist": "G.E.M.邓紫棋", "language": "中文", "music_id": 1, "note": "", "title": "A.I.N.Y.", "type": "华语流行"
  }, {
    "artist": "西野加奈", "language": "日语", "music_id": 2, "note": "", "title": "Darling", "type": "日语流行"
  }, {
    "artist": "Against The Current",
    "language": "英语",
    "music_id": 3,
    "note": "",
    "title": "legends never die",
    "type": "英语流行"
  }, {
    "artist": "蔡健雅", "language": "中文", "music_id": 4, "note": "", "title": "Letting Go", "type": "华语流行"
  }, {
    "artist": "蔡依林", "language": "中文", "music_id": 5, "note": "", "title": "Love Love Love", "type": "华语流行"
  }, {
    "artist": "Selena Gomez/Marshmello",
    "language": "英语",
    "music_id": 6,
    "note": "",
    "title": "Wolves",
    "type": "英语流行"
  }, {
    "artist": "袁娅维TIA RAY", "language": "中文", "music_id": 7, "note": "", "title": "阿楚姑娘", "type": "华语流行"
  }, {
    "artist": "蓝心羽", "language": "中文", "music_id": 8, "note": "", "title": "阿拉斯加海湾", "type": "华语流行"
  }, {
    "artist": "金莎", "language": "中文", "music_id": 9, "note": "", "title": "爱的魔法", "type": "华语流行"
  }, {
    "artist": "七元",
    "language": "中文",
    "music_id": 10,
    "note": "",
    "title": "爱你 (爱你爱你随时都要一起)",
    "type": "华语流行"
  }, {
    "artist": "告五人", "language": "中文", "music_id": 11, "note": "", "title": "爱人错过", "type": "华语流行"
  }, {
    "artist": "S.H.E", "language": "中文", "music_id": 12, "note": "", "title": "爱上你", "type": "华语流行"
  }, {
    "artist": "PENGUIN RESEARCH",
    "language": "日语",
    "music_id": 13,
    "note": "",
    "title": "败北的少年（敗北の少年）",
    "type": "ボカロ"
  }, {
    "artist": "丁当", "language": "中文", "music_id": 14, "note": "", "title": "猜不透", "type": "华语流行"
  }, {
    "artist": "周杰伦", "language": "中文", "music_id": 15, "note": "", "title": "彩虹", "type": "华语流行"
  }, {
    "artist": "王心凌", "language": "中文", "music_id": 16, "note": "", "title": "彩虹的微笑", "type": "华语流行"
  }, {
    "artist": "中岛美嘉",
    "language": "日语",
    "music_id": 17,
    "note": "",
    "title": "曾经我也想过一了百了（僕が死のうと思ったのは）",
    "type": "日语流行"
  }, {
    "artist": "上原玲奈",
    "language": "日语",
    "music_id": 18,
    "note": "",
    "title": "传达不到的爱恋（届かない恋）",
    "type": "日语二次元"
  }, {
    "artist": "余超颖", "language": "中文", "music_id": 19, "note": "", "title": "春泥", "type": "华语流行"
  }, {
    "artist": "滨崎步", "language": "日语", "music_id": 20, "note": "", "title": "春天，来吧（春よ、来い）", "type": "日语流行"
  }, {
    "artist": "王菲", "language": "中文", "music_id": 21, "note": "", "title": "匆匆那年", "type": "华语流行"
  }, {
    "artist": "王蓝茵", "language": "中文", "music_id": 22, "note": "", "title": "恶作剧", "type": "华语流行"
  }, {
    "artist": "吴青峰", "language": "中文", "music_id": 23, "note": "", "title": "蜂鸟", "type": "华语流行"
  }, {
    "artist": "太一", "language": "中文", "music_id": 24, "note": "", "title": "负重一万斤长大", "type": "华语流行"
  }, {
    "artist": "告五人", "language": "中文", "music_id": 25, "note": "", "title": "给你一瓶魔法药水", "type": "华语流行"
  }, {
    "artist": "A-Lin", "language": "中文", "music_id": 26, "note": "", "title": "给我一个理由忘记", "type": "华语流行"
  }, {
    "artist": "周杰伦", "language": "中文", "music_id": 27, "note": "", "title": "黑色幽默", "type": "华语流行"
  }, {
    "artist": "王菲", "language": "中文", "music_id": 28, "note": "", "title": "红豆", "type": "华语流行"
  }, {
    "artist": "蔡健雅", "language": "中文", "music_id": 29, "note": "", "title": "红色高跟鞋", "type": "华语流行"
  }, {
    "artist": "金贵晟", "language": "中文", "music_id": 30, "note": "", "title": "虹之间", "type": "华语流行"
  }, {
    "artist": "王心凌", "language": "中文", "music_id": 31, "note": "", "title": "黄昏晓", "type": "华语流行"
  }, {
    "artist": "miu-clips", "language": "日语", "music_id": 32, "note": "", "title": "羁绊（絆）", "type": "日语流行"
  }, {
    "artist": "张远", "language": "中文", "music_id": 33, "note": "", "title": "嘉宾", "type": "华语流行"
  }, {
    "artist": "周杰伦", "language": "中文", "music_id": 34, "note": "", "title": "简单爱", "type": "华语流行"
  }, {
    "artist": "池鱼", "language": "中文", "music_id": 35, "note": "", "title": "剑心", "type": "华语流行"
  }, {
    "artist": "曾惜", "language": "中文", "music_id": 36, "note": "", "title": "讲真的", "type": "华语流行"
  }, {
    "artist": "大塚愛", "language": "日语", "music_id": 37, "note": "", "title": "金鱼花火（金魚花火）", "type": "日语流行"
  }, {
    "artist": "曲肖冰", "language": "中文", "music_id": 38, "note": "", "title": "静悄悄", "type": "华语流行"
  }, {
    "artist": "容祖儿", "language": "中文", "music_id": 39, "note": "", "title": "就让这大雨全都落下", "type": "华语流行"
  }, {
    "artist": "罗震环", "language": "中文", "music_id": 40, "note": "", "title": "靠近", "type": "华语流行"
  }, {
    "artist": "陆虎", "language": "中文", "music_id": 41, "note": "", "title": "拉过勾的", "type": "华语流行"
  }, {
    "artist": "40mP", "language": "日语", "music_id": 42, "note": "", "title": "恋爱裁判（恋愛裁判）", "type": "ボカロ"
  }, {
    "artist": "陶喆", "language": "中文", "music_id": 43, "note": "", "title": "流沙", "type": "华语流行"
  }, {
    "artist": "林俊杰", "language": "中文", "music_id": 44, "note": "", "title": "美人鱼", "type": "华语流行"
  }, {
    "artist": "周杰伦", "language": "中文", "music_id": 45, "note": "", "title": "迷迭香", "type": "华语流行"
  }, {
    "artist": "柳爽", "language": "中文", "music_id": 46, "note": "", "title": "漠河舞厅", "type": "华语流行"
  }, {
    "artist": "那英", "language": "中文", "music_id": 47, "note": "", "title": "默", "type": "华语流行"
  }, {
    "artist": "马赛克乐队", "language": "中文", "music_id": 48, "note": "", "title": "霓虹甜心", "type": "华语流行"
  }, {
    "artist": "G.E.M.邓紫棋",
    "language": "中文",
    "music_id": 49,
    "note": "",
    "title": "你不是真正的快乐",
    "type": "华语流行"
  }, {
    "artist": "王力宏", "language": "中文", "music_id": 50, "note": "", "title": "你不知道的事", "type": "华语流行"
  }, {
    "artist": "田馥甄", "language": "中文", "music_id": 51, "note": "", "title": "你就不要想起我", "type": "华语流行"
  }, {
    "artist": "何洁", "language": "中文", "music_id": 52, "note": "", "title": "你是我的风景", "type": "华语流行"
  }, {
    "artist": "戴佩妮", "language": "中文", "music_id": 53, "note": "", "title": "你要的爱", "type": "华语流行"
  }, {
    "artist": "张碧晨", "language": "中文", "music_id": 54, "note": "", "title": "年轮", "type": "华语流行"
  }, {
    "artist": "Lia", "language": "日语", "music_id": 55, "note": "", "title": "鸟之诗（鳥の詩）", "type": "日语二次元"
  }, {
    "artist": "韦礼安", "language": "中文", "music_id": 56, "note": "", "title": "女孩", "type": "华语流行"
  }, {
    "artist": "梅艳芳", "language": "中文", "music_id": 57, "note": "", "title": "女人花", "type": "华语流行"
  }, {
    "artist": "YOASOBI", "language": "日语", "music_id": 58, "note": "", "title": "偶像（アイドル）", "type": "日语二次元"
  }, {
    "artist": "G.E.M.邓紫棋", "language": "中文", "music_id": 59, "note": "", "title": "泡沫", "type": "华语流行"
  }, {
    "artist": "豚乙女", "language": "日语", "music_id": 60, "note": "", "title": "泡沫（うたかた）", "type": "日语流行"
  }, {
    "artist": "张芸京", "language": "中文", "music_id": 61, "note": "", "title": "偏爱", "type": "华语流行"
  }, {
    "artist": "周杰伦", "language": "中文", "music_id": 62, "note": "", "title": "七里香", "type": "华语流行"
  }, {
    "artist": "郭顶", "language": "中文", "music_id": 63, "note": "", "title": "凄美地", "type": "华语流行"
  }, {
    "artist": "周深", "language": "中文", "music_id": 64, "note": "", "title": "起风了", "type": "华语流行"
  }, {
    "artist": "银临/Aki阿杰", "language": "中文", "music_id": 65, "note": "", "title": "牵丝戏", "type": "古风"
  }, {
    "artist": "周杰伦", "language": "中文", "music_id": 66, "note": "", "title": "青花瓷", "type": "华语流行"
  }, {
    "artist": "张大蕾", "language": "中文", "music_id": 67, "note": "", "title": "日不落", "type": "华语流行"
  }, {
    "artist": "戚薇", "language": "中文", "music_id": 68, "note": "", "title": "如果爱忘了", "type": "华语流行"
  }, {
    "artist": "范玮琪/张韶涵", "language": "中文", "music_id": 69, "note": "", "title": "如果的事", "type": "华语流行"
  }, {
    "artist": "Goose house",
    "language": "日语",
    "music_id": 70,
    "note": "",
    "title": "若能绽放光芒（光るなら）",
    "type": "日语二次元"
  }, {
    "artist": "何洁", "language": "中文", "music_id": 71, "note": "", "title": "是不是爱情", "type": "华语流行"
  }, {
    "artist": "郭顶", "language": "中文", "music_id": 72, "note": "", "title": "水星记", "type": "华语流行"
  }, {
    "artist": "刘至佳", "language": "中文", "music_id": 73, "note": "", "title": "说爱你", "type": "华语流行"
  }, {
    "artist": "袁娅维TIA RAY", "language": "中文", "music_id": 74, "note": "", "title": "说散就散", "type": "华语流行"
  }, {
    "artist": "薛凯琪", "language": "中文", "music_id": 75, "note": "", "title": "苏州河", "type": "华语流行"
  }, {
    "artist": "陈绮贞", "language": "中文", "music_id": 76, "note": "", "title": "太聪明", "type": "华语流行"
  }, {
    "artist": "于文文", "language": "中文", "music_id": 77, "note": "", "title": "体面", "type": "华语流行"
  }, {
    "artist": "A-Lin", "language": "中文", "music_id": 78, "note": "", "title": "天若有情", "type": "华语流行"
  }, {
    "artist": "五月天", "language": "中文", "music_id": 79, "note": "", "title": "突然好想你", "type": "华语流行"
  }, {
    "artist": "カニ研究会", "language": "日语", "music_id": 80, "note": "", "title": "我愛你-上海蟹-", "type": "日语二次元"
  }, {
    "artist": "谢春花", "language": "中文", "music_id": 81, "note": "", "title": "我从崖边跌落", "type": "华语流行"
  }, {
    "artist": "ChiliChill", "language": "中文", "music_id": 82, "note": "", "title": "我的悲伤是水做的", "type": "中文二次元"
  }, {
    "artist": "曲婉婷", "language": "中文", "music_id": 83, "note": "", "title": "我的歌声里", "type": "华语流行"
  }, {
    "artist": "CHiCO with HoneyWorks",
    "language": "日语",
    "music_id": 84,
    "note": "",
    "title": "我的世界已坠入爱河（世界は恋に落ちている）",
    "type": "日语二次元"
  }, {
    "artist": "苏打绿",
    "language": "中文",
    "music_id": 85,
    "note": "",
    "title": "我好想你 (I Miss You So)",
    "type": "华语流行"
  }, {
    "artist": "孙燕姿", "language": "中文", "music_id": 86, "note": "", "title": "我怀念的", "type": "华语流行"
  }, {
    "artist": "徐薇", "language": "中文", "music_id": 87, "note": "", "title": "我们的纪念", "type": "华语流行"
  }, {
    "artist": "陈绮贞",
    "language": "中文",
    "music_id": 88,
    "note": "",
    "title": "我喜欢上你时的内心活动",
    "type": "华语流行"
  }, {
    "artist": "张惠妹", "language": "中文", "music_id": 89, "note": "", "title": "我最亲爱的", "type": "华语流行"
  }, {
    "artist": "孟根花", "language": "中文", "music_id": 90, "note": "", "title": "乌兰巴托的夜", "type": "华语流行"
  }, {
    "artist": "苏打绿", "language": "中文", "music_id": 91, "note": "", "title": "无与伦比的美丽", "type": "华语流行"
  }, {
    "artist": "单依纯", "language": "中文", "music_id": 92, "note": "", "title": "想你时风起", "type": "华语流行"
  }, {
    "artist": "苏打绿", "language": "中文", "music_id": 93, "note": "", "title": "小情歌", "type": "华语流行"
  }, {
    "artist": "容祖儿", "language": "中文", "music_id": 94, "note": "", "title": "小小", "type": "华语流行"
  }, {
    "artist": "田馥甄", "language": "中文", "music_id": 95, "note": "", "title": "小幸运", "type": "华语流行"
  }, {
    "artist": "蓝心羽", "language": "中文", "music_id": 96, "note": "", "title": "小宇", "type": "华语流行"
  }, {
    "artist": "王菲", "language": "中文", "music_id": 97, "note": "", "title": "笑忘书", "type": "华语流行"
  }, {
    "artist": "郭静", "language": "中文", "music_id": 98, "note": "", "title": "心墙", "type": "华语流行"
  }, {
    "artist": "黄霄雲", "language": "中文", "music_id": 99, "note": "", "title": "星辰大海", "type": "华语流行"
  }, {
    "artist": "陈粒", "language": "中文", "music_id": 100, "note": "", "title": "虚拟", "type": "华语流行"
  }, {
    "artist": "葛东琪", "language": "中文", "music_id": 101, "note": "", "title": "悬溺", "type": "华语流行"
  }, {
    "artist": "當山みれい", "language": "日语", "music_id": 102, "note": "", "title": "雪恋（ユキコイ）", "type": "日语流行"
  }, {
    "artist": "卫兰", "language": "中文", "music_id": 103, "note": "", "title": "一格格", "type": "华语流行"
  }, {
    "artist": "曾沛慈", "language": "中文", "music_id": 104, "note": "", "title": "一个人想着一个人", "type": "华语流行"
  }, {
    "artist": "汪苏泷", "language": "中文", "music_id": 105, "note": "", "title": "一笑倾城", "type": "华语流行"
  }, {
    "artist": "阿桑", "language": "中文", "music_id": 106, "note": "", "title": "一直很安静", "type": "华语流行"
  }, {
    "artist": "姜眠", "language": "中文", "music_id": 107, "note": "", "title": "遗失的心跳", "type": "华语流行"
  }, {
    "artist": "Ado", "language": "日语", "music_id": 108, "note": "", "title": "踊", "type": "日语二次元"
  }, {
    "artist": "杨丞琳", "language": "中文", "music_id": 109, "note": "", "title": "雨爱", "type": "华语流行"
  }, {
    "artist": "孙燕姿", "language": "中文", "music_id": 110, "note": "", "title": "遇见", "type": "华语流行"
  }, {
    "artist": "林俊杰", "language": "中文", "music_id": 111, "note": "", "title": "愿与愁", "type": "华语流行"
  }, {
    "artist": "胡彦斌", "language": "中文", "music_id": 112, "note": "", "title": "月光", "type": "华语流行"
  }, {
    "artist": "阿鸣", "language": "中文", "music_id": 113, "note": "", "title": "真相是真", "type": "华语流行"
  }, {
    "artist": "Lil Ghost小鬼 / 吴宣仪 / 王子异",
    "language": "中文",
    "music_id": 114,
    "note": "",
    "title": "只对你有感觉",
    "type": "华语流行"
  }, {
    "artist": "岑宁儿", "language": "中文", "music_id": 115, "note": "", "title": "追光者", "type": "华语流行"
  }, {
    "artist": "江语晨", "language": "中文", "music_id": 116, "note": "", "title": "最后一页", "type": "华语流行"
  }]
});

Mock.mock('/api/archive', 'post', (req) => {
  return {'message': '10 条消息已归档'}
});

Mock.mock('/api/upload', 'post', (req) => {
  return {
    "message_id": "number|+1", "success": true, "uploaded_images": []
  }
});

Mock.mock('/api/livestatus', 'get', (req) => {
  return {live_time: 1730728421000, status: 1}
})
Mock.mock('/api/messages', 'get', (req) => {
  return [{
    id: 1,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'approved',
    images: ['https://picsum.photos/1500/1500?image=10', 'https://picsum.photos/500/300?image=11', 'https://picsum.photos/300/300?image=12', 'https://picsum.photos/500/300?image=13', 'https://picsum.photos/500/300?image=14', 'https://picsum.photos/500/300?image=15', 'https://picsum.photos/500/300?image=16', 'https://picsum.photos/500/300?image=17',]
  }, {
    id: 2,
    title: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'pending'
  }, {
    id: 3,
    title: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'approved'
  }, {
    id: 4,
    title: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'pending'
  }, {
    id: 5,
    title: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'approved'
  }, {
    id: 6,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'pending'
  }, {
    id: 7,
    title: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'approved'
  }, {
    id: 8,
    title: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'pending'
  }, {
    id: 9,
    title: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'approved'
  }, {
    id: 10,
    title: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'pending'
  }, {
    id: 11,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'approved'
  }, {
    id: 12,
    title: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'pending'
  }, {
    id: 13,
    title: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'approved'
  }, {
    id: 14,
    title: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'pending'
  }, {
    id: 15,
    title: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'approved'
  }, {
    id: 16,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    status: 'pending'
  }]
})
// 匹配 /api/approve/{id} 路由，方法为 POST ，id为数字
// 返回值为 { message: "消息已通过审核" }
// 该路由用于审核消息

Mock.mock(/\/api\/approve\/\d/, 'post', (req) => {
  return {
    'message': "消息已通过审核"
  }
})

Mock.mock(/\/api\/reject\/\d/, 'post', (req) => {
  return {
    'message': "消息已删除"
  }
})

Mock.mock(/\/api\/gift-count\/\d/, 'get', (req) => {
  return {
    "gift_count": 10, "user_uid": "254086959", "username": "夜丶阑雨"
  }
})

Mock.mock('/api/gift-ranking', 'get', (req) => {
  return [{
    "gift_count": 10387, "user_uid": "36912056", "username": "两个鸡蛋炒饭"
  }, {
    "gift_count": 8411, "user_uid": "108005133", "username": "哒可狩死"
  }, {
    "gift_count": 7534, "user_uid": "383084364", "username": "-LeiBniZ-"
  }, {
    "gift_count": 4993, "user_uid": "2871839", "username": "淡定の立华奏"
  }, {
    "gift_count": 4202, "user_uid": "3118708", "username": "mosonze"
  }, {
    "gift_count": 4000, "user_uid": "145061371", "username": "橘子橘i"
  }, {
    "gift_count": 3661, "user_uid": "1301867328", "username": "l三余无梦生l"
  }, {
    "gift_count": 3624, "user_uid": "4328663", "username": "米凯拉的锋刃z"
  }, {
    "gift_count": 3142, "user_uid": "259162605", "username": "Arichi_"
  }, {
    "gift_count": 2383, "user_uid": "171919", "username": "珈蓝梦华"
  }]
})
