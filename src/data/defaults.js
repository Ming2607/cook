export const MENU_SECTIONS = ['前菜', '主菜', '主食', '甜品', '饮品&酒单']

export const DEFAULT_MAJOR_CATEGORIES = [
  { id: 'major-01', name: '前菜', sortOrder: 0 },
  { id: 'major-02', name: '主菜', sortOrder: 1 },
  { id: 'major-03', name: '主食', sortOrder: 2 },
  { id: 'major-04', name: '甜品', sortOrder: 3 },
  { id: 'major-05', name: '饮品&酒单', sortOrder: 4 },
]

function buildSubcategories(majorId, names, idStart) {
  return names.map((name, i) => ({
    id: `cat-${String(idStart + i).padStart(2, '0')}`,
    name,
    majorCategoryId: majorId,
    sortOrder: i,
  }))
}

export const DEFAULT_CATEGORIES = [
  ...buildSubcategories('major-01', ['中式凉菜', '西式沙拉', '日式前菜', '腌渍/泡菜', '汤品（前）', '小吃/佐酒'], 1),
  ...buildSubcategories('major-02', ['川菜', '粤菜', '鲁菜', '湘菜', '江浙菜', '东北菜', '西餐', '日料', '东南亚菜', '融合创意菜'], 7),
  ...buildSubcategories('major-03', ['米饭', '面条', '面点', '粥/羹', '杂粮/粗粮', '面包/三明治'], 17),
  ...buildSubcategories('major-04', ['中式', '西式', '冰品', '水果'], 23),
  ...buildSubcategories(
    'major-05',
    ['茶饮', '咖啡', '果汁', '气泡水', '奶昔', '白酒', '黄酒', '清酒', '鸡尾酒', '红酒', '精酿'],
    27
  ),
]

const dishImg = (file) => `${import.meta.env.BASE_URL}dishes/${file}`

export const DEFAULT_DISHES = [
  { id: 'dish-01', categoryId: 'cat-01', name: '凉拌黄瓜', image: dishImg('01-liangban-huangua.jpg'), sortOrder: 0 },
  { id: 'dish-02', categoryId: 'cat-02', name: '凯撒沙拉', image: dishImg('16-stir-fry-vegetables.jpg'), sortOrder: 0 },
  { id: 'dish-03', categoryId: 'cat-03', name: '刺身拼盘', image: dishImg('02-salmon-sashimi.jpg'), sortOrder: 0 },
  { id: 'dish-04', categoryId: 'cat-07', name: '宫保鸡丁', image: dishImg('07-kungpao-chicken.jpg'), sortOrder: 0 },
  { id: 'dish-05', categoryId: 'cat-08', name: '蜜汁叉烧', image: dishImg('08-char-siu.jpg'), sortOrder: 0 },
  { id: 'dish-06', categoryId: 'cat-10', name: '剁椒鱼头', image: dishImg('11-fish-head-chili.jpg'), sortOrder: 0 },
  { id: 'dish-07', categoryId: 'cat-13', name: '香煎牛排', image: dishImg('05-braised-beef.jpg'), sortOrder: 0 },
  { id: 'dish-08', categoryId: 'cat-18', name: '葱油拌面', image: dishImg('14-xiaolongbao.jpg'), sortOrder: 0 },
  { id: 'dish-09', categoryId: 'cat-19', name: '小笼包', image: dishImg('14-xiaolongbao.jpg'), sortOrder: 0 },
  { id: 'dish-10', categoryId: 'cat-20', name: '皮蛋瘦肉粥', image: dishImg('15-congee.jpg'), sortOrder: 0 },
  { id: 'dish-11', categoryId: 'cat-23', name: '杨枝甘露', image: dishImg('18-mango-dessert.jpg'), sortOrder: 0 },
  { id: 'dish-12', categoryId: 'cat-27', name: '功夫茶', image: dishImg('19-chinese-tea.jpg'), sortOrder: 0 },
]
