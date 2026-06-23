import { useStore } from '../store/StoreContext'
import './CategorySidebar.css'

export default function CategorySidebar() {
  const { categories, activeCategoryId, setActiveCategoryId } = useStore()

  return (
    <nav className="category-sidebar" aria-label="菜品分类">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`category-item ${activeCategoryId === cat.id ? 'active' : ''}`}
          onClick={() => setActiveCategoryId(cat.id)}
        >
          <span className="category-name">{cat.name}</span>
        </button>
      ))}
    </nav>
  )
}
