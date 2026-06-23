export const MENU_SECTIONS = ['前菜', '主菜', '汤品', '主食', '甜品']

export const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: '凉菜', menuSection: '前菜', sortOrder: 0 },
  { id: 'cat-2', name: '川菜', menuSection: '主菜', sortOrder: 1 },
  { id: 'cat-3', name: '粤菜', menuSection: '主菜', sortOrder: 2 },
  { id: 'cat-4', name: '面', menuSection: '主食', sortOrder: 3 },
  { id: 'cat-5', name: '甜品', menuSection: '甜品', sortOrder: 4 },
]

const placeholder = (color, text) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect fill="${color}" width="400" height="300"/>
      <text x="200" y="155" text-anchor="middle" fill="#f5e6d3" font-size="28" font-family="serif">${text}</text>
    </svg>`
  )}`

export const DEFAULT_DISHES = [
  { id: 'dish-1', categoryId: 'cat-1', name: '凉拌黄瓜', image: placeholder('#3d5a4a', '凉拌黄瓜') },
  { id: 'dish-2', categoryId: 'cat-1', name: '口水鸡', image: placeholder('#4a3d3d', '口水鸡') },
  { id: 'dish-3', categoryId: 'cat-2', name: '宫保鸡丁', image: placeholder('#6b2d2d', '宫保鸡丁') },
  { id: 'dish-4', categoryId: 'cat-2', name: '麻婆豆腐', image: placeholder('#5c3a1e', '麻婆豆腐') },
  { id: 'dish-5', categoryId: 'cat-3', name: '白切鸡', image: placeholder('#4a4a3d', '白切鸡') },
  { id: 'dish-6', categoryId: 'cat-3', name: '清蒸鲈鱼', image: placeholder('#2d4a5a', '清蒸鲈鱼') },
  { id: 'dish-7', categoryId: 'cat-4', name: '担担面', image: placeholder('#5a4a2d', '担担面') },
  { id: 'dish-8', categoryId: 'cat-4', name: '葱油拌面', image: placeholder('#3d4a2d', '葱油拌面') },
  { id: 'dish-9', categoryId: 'cat-5', name: '杨枝甘露', image: placeholder('#8b6914', '杨枝甘露') },
  { id: 'dish-10', categoryId: 'cat-5', name: '红豆沙', image: placeholder('#6b1e3c', '红豆沙') },
]
