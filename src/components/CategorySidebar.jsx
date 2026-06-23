import { useStore } from '../store/StoreContext'
import './CategorySidebar.css'

export default function CategorySidebar() {
  const { majorCategories, categories, activeCategoryId, setActiveCategoryId } = useStore()

  return (
    <nav className="category-sidebar" aria-label="菜品分类">
      {majorCategories.map((major) => {
        const items = categories
          .filter((c) => c.majorCategoryId === major.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
        if (items.length === 0) return null
        return (
          <div key={major.id} className="category-group">
            <div className="category-group-label">{major.name}</div>
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
    </nav>
  )
}
