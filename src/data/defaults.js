export const MENU_SECTIONS = ['前菜', '刺身', '海鲜', '主菜', '汤品', '主食', '甜品', '饮品']

export const CATEGORY_GROUPS = ['前菜', '主荤', '菜系', '汤面', '配菜', '甜品饮']

export const DEFAULT_CATEGORIES = [
  { id: 'cat-01', name: '前菜冷盘', group: '前菜', menuSection: '前菜', sortOrder: 0 },
  { id: 'cat-02', name: '刺身佐肴', group: '前菜', menuSection: '刺身', sortOrder: 1 },
  { id: 'cat-03', name: '海鲜臻品', group: '主荤', menuSection: '海鲜', sortOrder: 2 },
  { id: 'cat-04', name: '禽类佳肴', group: '主荤', menuSection: '主菜', sortOrder: 3 },
  { id: 'cat-05', name: '牛羊匠心', group: '主荤', menuSection: '主菜', sortOrder: 4 },
  { id: 'cat-06', name: '猪脂风韵', group: '主荤', menuSection: '主菜', sortOrder: 5 },
  { id: 'cat-07', name: '川味麻辣', group: '菜系', menuSection: '主菜', sortOrder: 6 },
  { id: 'cat-08', name: '粤菜清鲜', group: '菜系', menuSection: '主菜', sortOrder: 7 },
  { id: 'cat-09', name: '淮扬精工', group: '菜系', menuSection: '主菜', sortOrder: 8 },
  { id: 'cat-10', name: '本帮浓醇', group: '菜系', menuSection: '主菜', sortOrder: 9 },
  { id: 'cat-11', name: '湘赣烈味', group: '菜系', menuSection: '主菜', sortOrder: 10 },
  { id: 'cat-12', name: '闽台海味', group: '菜系', menuSection: '主菜', sortOrder: 11 },
  { id: 'cat-13', name: '汤羹滋补', group: '汤面', menuSection: '汤品', sortOrder: 12 },
  { id: 'cat-14', name: '面食点心', group: '汤面', menuSection: '主食', sortOrder: 13 },
  { id: 'cat-15', name: '饭粥主食', group: '汤面', menuSection: '主食', sortOrder: 14 },
  { id: 'cat-16', name: '时令蔬菜', group: '配菜', menuSection: '主菜', sortOrder: 15 },
  { id: 'cat-17', name: '卤味熏酱', group: '配菜', menuSection: '前菜', sortOrder: 16 },
  { id: 'cat-18', name: '甜品佳果', group: '甜品饮', menuSection: '甜品', sortOrder: 17 },
  { id: 'cat-19', name: '茗茶酒饮', group: '甜品饮', menuSection: '饮品', sortOrder: 18 },
]

const dishImg = (file) => `${import.meta.env.BASE_URL}dishes/${file}`

export const DEFAULT_DISHES = [
  { id: 'dish-01', categoryId: 'cat-01', name: '凉拌黄瓜', image: dishImg('01-liangban-huangua.jpg') },
  { id: 'dish-02', categoryId: 'cat-02', name: '三文鱼刺身', image: dishImg('02-salmon-sashimi.jpg') },
  { id: 'dish-03', categoryId: 'cat-03', name: '清蒸鲈鱼', image: dishImg('03-steamed-fish.jpg') },
  { id: 'dish-04', categoryId: 'cat-04', name: '白切鸡', image: dishImg('04-white-cut-chicken.jpg') },
  { id: 'dish-05', categoryId: 'cat-05', name: '红烧牛腩', image: dishImg('05-braised-beef.jpg') },
  { id: 'dish-06', categoryId: 'cat-06', name: '红烧肉', image: dishImg('06-hongshao-rou.jpg') },
  { id: 'dish-07', categoryId: 'cat-07', name: '宫保鸡丁', image: dishImg('07-kungpao-chicken.jpg') },
  { id: 'dish-08', categoryId: 'cat-08', name: '蜜汁叉烧', image: dishImg('08-char-siu.jpg') },
  { id: 'dish-09', categoryId: 'cat-09', name: '清炖狮子头', image: dishImg('09-lions-head.jpg') },
  { id: 'dish-10', categoryId: 'cat-10', name: '油爆大虾', image: dishImg('10-fried-shrimp.jpg') },
  { id: 'dish-11', categoryId: 'cat-11', name: '剁椒鱼头', image: dishImg('11-fish-head-chili.jpg') },
  { id: 'dish-12', categoryId: 'cat-12', name: '蚵仔煎', image: dishImg('12-oyster-omelette.jpg') },
  { id: 'dish-13', categoryId: 'cat-13', name: '老母鸡汤', image: dishImg('13-chicken-soup.jpg') },
  { id: 'dish-14', categoryId: 'cat-14', name: '小笼包', image: dishImg('14-xiaolongbao.jpg') },
  { id: 'dish-15', categoryId: 'cat-15', name: '皮蛋瘦肉粥', image: dishImg('15-congee.jpg') },
  { id: 'dish-16', categoryId: 'cat-16', name: '清炒时蔬', image: dishImg('16-stir-fry-vegetables.jpg') },
  { id: 'dish-17', categoryId: 'cat-17', name: '酱牛肉', image: dishImg('17-braised-beef-slices.jpg') },
  { id: 'dish-18', categoryId: 'cat-18', name: '杨枝甘露', image: dishImg('18-mango-dessert.jpg') },
  { id: 'dish-19', categoryId: 'cat-19', name: '功夫茶', image: dishImg('19-chinese-tea.jpg') },
]
