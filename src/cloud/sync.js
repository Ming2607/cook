import { dataUrlToFile, getCloudApp, isCloudEnabled } from './tcb'

const MENU_DOC = 'shared'
const MENU_COL = 'menu'

export { isCloudEnabled }

async function getDb() {
  const app = await getCloudApp()
  return app.database()
}

function isCloudFileRef(image) {
  return image?.startsWith('cloud://')
}

async function resolveDishImages(dishes) {
  const app = await getCloudApp()
  const cloudDishes = dishes.filter((d) => isCloudFileRef(d.image))
  if (cloudDishes.length === 0) return dishes

  const fileList = cloudDishes.map((d) => d.image.replace('cloud://', ''))
  const urlRes = await app.getTempFileURL({ fileList })
  const urlMap = Object.fromEntries(
    (urlRes.fileList || []).map((f) => [f.fileID, f.tempFileURL])
  )

  return dishes.map((d) => {
    if (!isCloudFileRef(d.image)) return d
    const fileId = d.image.replace('cloud://', '')
    return { ...d, image: urlMap[fileId] || d.image }
  })
}

export async function fetchMenu() {
  const db = await getDb()
  const res = await db.collection(MENU_COL).doc(MENU_DOC).get()
  const doc = res.data?.[0]
  if (!doc) return null
  return { ...doc, dishes: await resolveDishImages(doc.dishes || []) }
}

export async function uploadDishImage(image, dishId) {
  if (!image || !image.startsWith('data:')) return image

  const app = await getCloudApp()
  const file = dataUrlToFile(image, `${dishId}.jpg`)
  const cloudPath = `dishes/${dishId}-${Date.now()}.jpg`
  const uploadRes = await app.uploadFile({ cloudPath, filePath: file })
  return `cloud://${uploadRes.fileID}`
}

export async function prepareDishesForCloud(dishes) {
  const prepared = []
  for (const dish of dishes) {
    if (dish.image?.startsWith('data:')) {
      const image = await uploadDishImage(dish.image, dish.id)
      prepared.push({ ...dish, image })
    } else {
      prepared.push(dish)
    }
  }
  return prepared
}

export async function saveMenu(majorCategories, categories, dishes) {
  const db = await getDb()
  const dishesForCloud = await prepareDishesForCloud(dishes)
  await db.collection(MENU_COL).doc(MENU_DOC).set({
    majorCategories,
    categories,
    dishes: dishesForCloud,
    updatedAt: Date.now(),
  })
  return resolveDishImages(dishesForCloud)
}

export async function subscribeMenu(onData) {
  const db = await getDb()
  const watcher = db.collection(MENU_COL).doc(MENU_DOC).watch({
    onChange: async (snapshot) => {
      const doc = snapshot.docs?.[0]
      if (!doc) return
      const dishes = await resolveDishImages(doc.dishes || [])
      onData({ ...doc, dishes })
    },
    onError: (err) => {
      console.error('cloud watch error', err)
    },
  })
  return watcher
}
