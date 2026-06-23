import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  DEFAULT_CATEGORIES,
  DEFAULT_DISHES,
  DEFAULT_MAJOR_CATEGORIES,
} from '../data/defaults'
import { fetchMenu, isCloudEnabled, saveMenu, subscribeMenu } from '../cloud/sync'
import { initCloud } from '../cloud/tcb'

const STORAGE_KEY = 'cixiong-shuangchu-data'
const DATA_VERSION = 5

const StoreContext = createContext(null)

function isPlaceholderImage(image) {
  return !image || image.startsWith('data:image/svg')
}

function ensureDishSortOrder(dishes) {
  const counters = {}
  return dishes.map((d) => {
    if (d.sortOrder != null) return d
    const cat = d.categoryId
    counters[cat] = counters[cat] ?? 0
    const order = counters[cat]
    counters[cat] += 1
    return { ...d, sortOrder: order }
  })
}

function mergeDishes(existing) {
  const dishes = ensureDishSortOrder([...(existing || [])])
  const defaultByCategory = Object.fromEntries(DEFAULT_DISHES.map((d) => [d.categoryId, d]))

  for (const cat of DEFAULT_CATEGORIES) {
    const inCategory = dishes.filter((d) => d.categoryId === cat.id)
    if (inCategory.length === 0 && defaultByCategory[cat.id]) {
      dishes.push({ ...defaultByCategory[cat.id] })
      continue
    }
    for (let i = 0; i < dishes.length; i++) {
      if (dishes[i].categoryId === cat.id && isPlaceholderImage(dishes[i].image)) {
        const fallback = defaultByCategory[cat.id]
        if (fallback) dishes[i] = { ...dishes[i], image: fallback.image }
      }
    }
  }

  return dishes
}

function migrate(data) {
  if (data.version >= 5 && data.majorCategories?.length && data.categories?.length) {
    return {
      version: DATA_VERSION,
      majorCategories: data.majorCategories,
      categories: data.categories,
      dishes: mergeDishes(data.dishes),
    }
  }
  return {
    version: DATA_VERSION,
    majorCategories: DEFAULT_MAJOR_CATEGORIES,
    categories: DEFAULT_CATEGORIES,
    dishes: DEFAULT_DISHES,
  }
}

function loadLocalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.version !== DATA_VERSION) return migrate(data)
      return data
    }
  } catch {
    /* ignore */
  }
  return {
    version: DATA_VERSION,
    majorCategories: DEFAULT_MAJOR_CATEGORIES,
    categories: DEFAULT_CATEGORIES,
    dishes: DEFAULT_DISHES,
  }
}

function saveLocalData(majorCategories, categories, dishes) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: DATA_VERSION, majorCategories, categories, dishes })
  )
}

export function StoreProvider({ children }) {
  const cloudEnabled = isCloudEnabled()
  const local = loadLocalData()

  const [majorCategories, setMajorCategories] = useState(local.majorCategories)
  const [categories, setCategories] = useState(local.categories)
  const [dishes, setDishes] = useState(local.dishes)
  const [cart, setCart] = useState({})
  const [activeCategoryId, setActiveCategoryId] = useState(local.categories[0]?.id ?? null)
  const [syncStatus, setSyncStatus] = useState(cloudEnabled ? 'loading' : 'offline')
  const [ready, setReady] = useState(!cloudEnabled)

  const skipSaveRef = useRef(false)
  const savingRef = useRef(false)
  const saveTimerRef = useRef(null)

  useEffect(() => {
    if (!cloudEnabled) return undefined

    let watcher = null

    async function bootstrap() {
      try {
        setSyncStatus('loading')
        await initCloud()
        const remote = await fetchMenu()

        if (remote?.categories?.length && remote?.majorCategories?.length) {
          skipSaveRef.current = true
          setMajorCategories(remote.majorCategories)
          setCategories(remote.categories)
          setDishes(remote.dishes || [])
          setActiveCategoryId(remote.categories[0]?.id ?? null)
        } else {
          const seed = loadLocalData()
          await saveMenu(seed.majorCategories, seed.categories, seed.dishes)
          skipSaveRef.current = true
          setMajorCategories(seed.majorCategories)
          setCategories(seed.categories)
          setDishes(seed.dishes)
        }

        watcher = await subscribeMenu((doc) => {
          if (savingRef.current || !doc?.categories) return
          skipSaveRef.current = true
          if (doc.majorCategories) setMajorCategories(doc.majorCategories)
          setCategories(doc.categories)
          setDishes(doc.dishes || [])
          setSyncStatus('synced')
        })

        setSyncStatus('synced')
        setReady(true)
      } catch (err) {
        console.error('cloud bootstrap failed', err)
        setSyncStatus('error')
        setReady(true)
      }
    }

    bootstrap()

    return () => {
      watcher?.close?.()
    }
  }, [cloudEnabled])

  useEffect(() => {
    if (!ready) return undefined

    if (!cloudEnabled) {
      saveLocalData(majorCategories, categories, dishes)
      return undefined
    }

    if (skipSaveRef.current) {
      skipSaveRef.current = false
      return undefined
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)

    saveTimerRef.current = setTimeout(async () => {
      savingRef.current = true
      setSyncStatus('syncing')
      try {
        const updatedDishes = await saveMenu(majorCategories, categories, dishes)
        skipSaveRef.current = true
        setDishes(updatedDishes)
        setSyncStatus('synced')
      } catch (err) {
        console.error('cloud save failed', err)
        setSyncStatus('error')
      } finally {
        savingRef.current = false
      }
    }, 900)

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [majorCategories, categories, dishes, cloudEnabled, ready])

  const sortedMajors = [...majorCategories].sort((a, b) => a.sortOrder - b.sortOrder)
  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)

  const addMajorCategory = (name) => {
    const id = `major-${Date.now()}`
    setMajorCategories((prev) => [...prev, { id, name, sortOrder: prev.length }])
    return id
  }

  const updateMajorCategory = (id, updates) => {
    setMajorCategories((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  const deleteMajorCategory = (id) => {
    const subIds = categories.filter((c) => c.majorCategoryId === id).map((c) => c.id)
    setMajorCategories((prev) => prev.filter((m) => m.id !== id))
    setCategories((prev) => prev.filter((c) => c.majorCategoryId !== id))
    setDishes((prev) => prev.filter((d) => !subIds.includes(d.categoryId)))
    setCart((prev) => {
      const next = { ...prev }
      dishes.filter((d) => subIds.includes(d.categoryId)).forEach((d) => delete next[d.id])
      return next
    })
    if (subIds.includes(activeCategoryId)) {
      const remaining = categories.filter((c) => c.majorCategoryId !== id)
      setActiveCategoryId(remaining[0]?.id ?? null)
    }
  }

  const reorderMajorCategories = (ordered) => {
    setMajorCategories(ordered.map((m, i) => ({ ...m, sortOrder: i })))
  }

  const addCategory = (cat) => {
    const id = `cat-${Date.now()}`
    const inMajor = categories.filter((c) => c.majorCategoryId === cat.majorCategoryId)
    const sortOrder = inMajor.length
    setCategories((prev) => [...prev, { ...cat, id, sortOrder }])
    return id
  }

  const updateCategory = (id, updates) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setDishes((prev) => prev.filter((d) => d.categoryId !== id))
    setCart((prev) => {
      const next = { ...prev }
      dishes.filter((d) => d.categoryId === id).forEach((d) => delete next[d.id])
      return next
    })
    if (activeCategoryId === id) {
      setActiveCategoryId(categories.find((c) => c.id !== id)?.id ?? null)
    }
  }

  const reorderCategoriesInMajor = (majorCategoryId, ordered) => {
    setCategories((prev) => {
      const others = prev.filter((c) => c.majorCategoryId !== majorCategoryId)
      const updated = ordered.map((c, i) => ({ ...c, sortOrder: i }))
      return [...others, ...updated]
    })
  }

  const addDish = (dish) => {
    const id = `dish-${Date.now()}`
    setDishes((prev) => {
      const inCat = prev.filter((d) => d.categoryId === dish.categoryId)
      const maxOrder = inCat.reduce((m, d) => Math.max(m, d.sortOrder ?? 0), -1)
      return [...prev, { ...dish, id, sortOrder: maxOrder + 1 }]
    })
    return id
  }

  const updateDish = (id, updates) => {
    setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)))
  }

  const deleteDish = (id) => {
    setDishes((prev) => prev.filter((d) => d.id !== id))
    setCart((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const reorderDishesInCategory = (categoryId, ordered) => {
    setDishes((prev) => {
      const others = prev.filter((d) => d.categoryId !== categoryId)
      const updated = ordered.map((d, i) => ({ ...d, sortOrder: i }))
      return [...others, ...updated]
    })
  }

  const getQty = (dishId) => cart[dishId] || 0

  const setQty = (dishId, qty) => {
    setCart((prev) => {
      const next = { ...prev }
      if (qty <= 0) delete next[dishId]
      else next[dishId] = qty
      return next
    })
  }

  const cartTotal = Object.values(cart).reduce((s, n) => s + n, 0)

  const clearCart = () => setCart({})

  const getMajorName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId)
    if (!cat) return '主菜'
    const major = majorCategories.find((m) => m.id === cat.majorCategoryId)
    return major?.name || '主菜'
  }

  const getMenuItems = () => {
    const items = []
    for (const [dishId, qty] of Object.entries(cart)) {
      const dish = dishes.find((d) => d.id === dishId)
      if (!dish) continue
      items.push({ dish, qty, menuSection: getMajorName(dish.categoryId) })
    }
    return items
  }

  return (
    <StoreContext.Provider
      value={{
        majorCategories: sortedMajors,
        categories: sortedCategories,
        dishes,
        cart,
        activeCategoryId,
        setActiveCategoryId,
        addMajorCategory,
        updateMajorCategory,
        deleteMajorCategory,
        reorderMajorCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategoriesInMajor,
        addDish,
        updateDish,
        deleteDish,
        reorderDishesInCategory,
        getQty,
        setQty,
        cartTotal,
        clearCart,
        getMenuItems,
        getMajorName,
        syncStatus,
        cloudEnabled,
        ready,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
