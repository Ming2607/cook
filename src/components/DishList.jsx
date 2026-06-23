import { useStore } from '../store/StoreContext'
import './DishList.css'

export default function DishList() {
  const { dishes, activeCategoryId, getQty, setQty } = useStore()
  const filtered = dishes
    .filter((d) => d.categoryId === activeCategoryId)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  if (!activeCategoryId) {
    return (
      <div className="dish-list empty">
        <p>请先在「我的」中添加分类</p>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="dish-list empty">
        <p>该分类暂无菜品</p>
        <p className="hint">前往「我的」添加菜品</p>
      </div>
    )
  }

  return (
    <div className="dish-list">
      {filtered.map((dish) => {
        const qty = getQty(dish.id)
        return (
          <article key={dish.id} className="dish-card">
            <div className="dish-image-wrap">
              <img src={dish.image} alt={dish.name} className="dish-image" loading="lazy" />
            </div>
            <div className="dish-info">
              <h3 className="dish-name">{dish.name}</h3>
              <div className="qty-control">
                {qty > 0 && (
                  <button
                    type="button"
                    className="qty-btn minus"
                    onClick={() => setQty(dish.id, qty - 1)}
                    aria-label={`减少 ${dish.name}`}
                  >
                    −
                  </button>
                )}
                {qty > 0 && <span className="qty-num">{qty}</span>}
                <button
                  type="button"
                  className={`qty-btn plus ${qty === 0 ? 'solo' : ''}`}
                  onClick={() => setQty(dish.id, qty + 1)}
                  aria-label={`添加 ${dish.name}`}
                >
                  +
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
