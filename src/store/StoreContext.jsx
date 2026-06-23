import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { DEFAULT_CATEGORIES, DEFAULT_DISHES } from '../data/defaults'
import {
  fetchMenu,
  isCloudEnabled,
  saveMenu,
  subscribeMenu,
} from '../cloud/sync'
import { initCloud } from '../cloud/tcb'

const STORAGE_KEY = 'cixiong-shuangchu-data'
const DATA_VERSION = 4

const StoreContext = createContext(null)

function isPlaceholderImage(image) {
  return !image || image.startsWith('data:image/svg')
}

function mergeCategories(existing) {
  const existingNames = new Set((existing || []).map((c) => c.name))
  const merged = [...(existing || [])]
  for (const cat of DEFAULT_CATEGORIES) {
    if (!existingNames.has(cat.name)) {
      merged.push({ ...cat, sortOrder: merged.length })
    }
  }
  merged.forEach((c) => {
    if (!c.group) c.group = '配菜'
  })
  return merged
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
    if (inCategory.length === 0) {
      dishes.push({ ...defaultByCategory[cat.id] })
      continue
    }
    for (let i = 0; i < dishes.length; i++) {
      if (dishes[i].categoryId === cat.id && isPlaceholderImage(dishes[i].image)) {
        dishes[i] = { ...dishes[i], image: defaultByCategory[cat.id].image }
      }
    }
  }

  return dishes
}

function migrate(data) {
  const categories = mergeCategories(data.categories)
  const dishes = mergeDishes(data.dishes?.length ? data.dishes : [])
  return { version: DATA_VERSION, categories, dishes }
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
  return { version: DATA_VERSION, categories: DEFAULT_CATEGORIES, dishes: DEFAULT_DISHES }
}

function saveLocalData(categories, dishes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: DATA_VERSION, categories, dishes }))
}

export function StoreProvider({ children }) {
  const cloudEnabled = isCloudEnabled()
  const local = loadLocalData()

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

        if (remote?.categories?.length) {
          skipSaveRef.current = true
          setCategories(remote.categories)
          setDishes(remote.dishes || [])
          setActiveCategoryId(remote.categories[0]?.id ?? null)
        } else {
          const seed = loadLocalData()
          await saveMenu(seed.categories, seed.dishes)
          skipSaveRef.current = true
          setCategories(seed.categories)
          setDishes(seed.dishes)
        }

        watcher = await subscribeMenu((doc) => {
          if (savingRef.current || !doc?.categories) return
          skipSaveRef.current = true
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
      saveLocalData(categories, dishes)
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
        const updatedDishes = await saveMenu(categories, dishes)
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
  }, [categories, dishes, cloudEnabled, ready])

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)

  const addCategory = (cat) => {
    const id = `cat-${Date.now()}`
    setCategories((prev) => [...prev, { group: '配菜', ...cat, id, sortOrder: prev.length }])
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

  const reorderCategories = (ordered) => {
    setCategories(ordered.map((cat, i) => ({ ...cat, sortOrder: i })))
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

  const getMenuItems = () => {
    const items = []
    for (const [dishId, qty] of Object.entries(cart)) {
      const dish = dishes.find((d) => d.id === dishId)
      if (!dish) continue
      const cat = categories.find((c) => c.id === dish.categoryId)
      items.push({ dish, qty, menuSection: cat?.menuSection || '主菜' })
    }
    return items
  }

  return (
    <StoreContext.Provider
      value={{
        categories: sortedCategories,
        dishes,
        cart,
        activeCategoryId,
        setActiveCategoryId,
        addCategory,
        updateCategory,
        deleteCategory,
        addDish,
        updateDish,
        deleteDish,
        reorderCategories,
        reorderDishesInCategory,
        getQty,
        setQty,
        cartTotal,
        clearCart,
        getMenuItems,
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
