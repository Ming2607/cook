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

const placeholder = (color, text) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect fill="${color}" width="400" height="300"/>
      <text x="200" y="155" text-anchor="middle" fill="#f5e6d3" font-size="28" font-family="serif">${text}</text>
    </svg>`
  )}`

export const DEFAULT_DISHES = [
  { id: 'dish-1', categoryId: 'cat-01', name: '凉拌黄瓜', image: placeholder('#3d5a4a', '凉拌黄瓜') },
  { id: 'dish-2', categoryId: 'cat-01', name: '口水鸡', image: placeholder('#4a3d3d', '口水鸡') },
  { id: 'dish-3', categoryId: 'cat-03', name: '清蒸鲈鱼', image: placeholder('#2d4a5a', '清蒸鲈鱼') },
  { id: 'dish-4', categoryId: 'cat-04', name: '白切鸡', image: placeholder('#4a4a3d', '白切鸡') },
  { id: 'dish-5', categoryId: 'cat-07', name: '宫保鸡丁', image: placeholder('#6b2d2d', '宫保鸡丁') },
  { id: 'dish-6', categoryId: 'cat-07', name: '麻婆豆腐', image: placeholder('#5c3a1e', '麻婆豆腐') },
  { id: 'dish-7', categoryId: 'cat-08', name: '蜜汁叉烧', image: placeholder('#6b3a2d', '蜜汁叉烧') },
  { id: 'dish-8', categoryId: 'cat-14', name: '葱油拌面', image: placeholder('#3d4a2d', '葱油拌面') },
  { id: 'dish-9', categoryId: 'cat-18', name: '杨枝甘露', image: placeholder('#8b6914', '杨枝甘露') },
  { id: 'dish-10', categoryId: 'cat-18', name: '桂花糕', image: placeholder('#6b1e3c', '桂花糕') },
]
