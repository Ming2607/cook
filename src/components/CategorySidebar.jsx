import { CATEGORY_GROUPS } from '../data/defaults'
import { useStore } from '../store/StoreContext'
import './CategorySidebar.css'

export default function CategorySidebar() {
  const { categories, activeCategoryId, setActiveCategoryId } = useStore()

  return (
    <nav className="category-sidebar" aria-label="菜品分类">
      {CATEGORY_GROUPS.map((group) => {
        const items = categories.filter((c) => (c.group || '配菜') === group)
        if (items.length === 0) return null
        return (
          <div key={group} className="category-group">
            <div className="category-group-label">{group}</div>
            {items.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-item ${activeCategoryId === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategoryId(cat.id)}
              >
                <span className="category-name">{cat.name}</span>
              </button>
            ))}
          </div>
        )
      })}
      {categories
        .filter((c) => !CATEGORY_GROUPS.includes(c.group))
        .length > 0 && (
        <div className="category-group">
          <div className="category-group-label">其他</div>
          {categories
            .filter((c) => !CATEGORY_GROUPS.includes(c.group))
            .map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-item ${activeCategoryId === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategoryId(cat.id)}
              >
                <span className="category-name">{cat.name}</span>
              </button>
            ))}
        </div>
      )}
    </nav>
  )
}
