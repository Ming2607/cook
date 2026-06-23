import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_CATEGORIES, DEFAULT_DISHES } from '../data/defaults'

const STORAGE_KEY = 'cixiong-shuangchu-data'

const StoreContext = createContext(null)

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return { categories: DEFAULT_CATEGORIES, dishes: DEFAULT_DISHES }
}

function saveData(categories, dishes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories, dishes }))
}

export function StoreProvider({ children }) {
  const [categories, setCategories] = useState(() => loadData().categories)
  const [dishes, setDishes] = useState(() => loadData().dishes)
  const [cart, setCart] = useState({})
  const [activeCategoryId, setActiveCategoryId] = useState(
    () => loadData().categories[0]?.id ?? null
  )

  useEffect(() => {
    saveData(categories, dishes)
  }, [categories, dishes])

  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)

  const addCategory = (cat) => {
    const id = `cat-${Date.now()}`
    setCategories((prev) => [...prev, { ...cat, id, sortOrder: prev.length }])
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
    setDishes((prev) => [...prev, { ...dish, id }])
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
        getQty,
        setQty,
        cartTotal,
        clearCart,
        getMenuItems,
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
