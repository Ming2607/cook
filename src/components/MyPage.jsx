import { useMemo, useState } from 'react'
import { useStore } from '../store/StoreContext'
import { CATEGORY_GROUPS, MENU_SECTIONS } from '../data/defaults'
import { compressImage } from '../utils/image'
import './MyPage.css'

function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', group: '配菜', menuSection: '主菜' })

  const startAdd = () => {
    setEditing('new')
    setForm({ name: '', group: '配菜', menuSection: '主菜' })
  }

  const startEdit = (cat) => {
    setEditing(cat.id)
    setForm({ name: cat.name, group: cat.group || '配菜', menuSection: cat.menuSection })
  }

  const save = () => {
    if (!form.name.trim()) return
    if (editing === 'new') addCategory(form)
    else updateCategory(editing, form)
    setEditing(null)
  }

  return (
    <section className="my-section">
      <div className="section-header">
        <span className="section-count">共 {categories.length} 个分类</span>
        <button type="button" className="text-btn" onClick={startAdd}>
          + 新增
        </button>
      </div>

      {editing && (
        <div className="inline-form">
          <input
            type="text"
            placeholder="分类名称，如：前菜冷盘"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            value={form.group}
            onChange={(e) => setForm({ ...form, group: e.target.value })}
          >
            {CATEGORY_GROUPS.map((g) => (
              <option key={g} value={g}>
                侧边栏分组：{g}
              </option>
            ))}
          </select>
          <select
            value={form.menuSection}
            onChange={(e) => setForm({ ...form, menuSection: e.target.value })}
          >
            {MENU_SECTIONS.map((s) => (
              <option key={s} value={s}>
                菜单归类：{s}
              </option>
            ))}
          </select>
          <div className="form-actions">
            <button type="button" onClick={() => setEditing(null)}>
              取消
            </button>
            <button type="button" className="primary" onClick={save}>
              保存
            </button>
          </div>
        </div>
      )}

      <ul className="manage-list">
        {categories.map((cat) => (
          <li key={cat.id} className="manage-item">
            <div className="item-info">
              <span className="item-name">{cat.name}</span>
              <span className="item-meta">{cat.group} · {cat.menuSection}</span>
            </div>
            <div className="item-actions">
              <button type="button" onClick={() => startEdit(cat)}>
                编辑
              </button>
              <button type="button" className="danger" onClick={() => deleteCategory(cat.id)}>
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function DishManager() {
  const { categories, dishes, addDish, updateDish, deleteDish } = useStore()
  const [editing, setEditing] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [form, setForm] = useState({ name: '', categoryId: '', image: '' })

  const groupedDishes = useMemo(() => {
    return categories
      .map((cat) => ({
        category: cat,
        dishes: dishes.filter((d) => d.categoryId === cat.id),
      }))
      .filter((g) => g.dishes.length > 0)
      .filter((g) => filterCategory === 'all' || g.category.id === filterCategory)
  }, [categories, dishes, filterCategory])

  const startAdd = () => {
    setEditing('new')
    const defaultCat = filterCategory !== 'all' ? filterCategory : categories[0]?.id || ''
    setForm({ name: '', categoryId: defaultCat, image: '' })
  }

  const startEdit = (dish) => {
    setEditing(dish.id)
    setForm({ name: dish.name, categoryId: dish.categoryId, image: dish.image })
  }

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await compressImage(file)
      setForm((prev) => ({ ...prev, image: dataUrl }))
    } catch {
      alert('图片处理失败，请换一张试试')
    }
  }

  const save = () => {
    if (!form.name.trim() || !form.categoryId || !form.image) return
    if (editing === 'new') addDish(form)
    else updateDish(editing, form)
    setEditing(null)
  }

  return (
    <section className="my-section">
      <div className="section-header">
        <span className="section-count">共 {dishes.length} 道菜品</span>
        <button type="button" className="text-btn" onClick={startAdd} disabled={categories.length === 0}>
          + 新增
        </button>
      </div>

      <div className="category-filter" role="tablist" aria-label="按分类筛选">
        <button
          type="button"
          className={`filter-chip ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          全部
        </button>
        {categories.map((cat) => {
          const count = dishes.filter((d) => d.categoryId === cat.id).length
          if (count === 0) return null
          return (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip ${filterCategory === cat.id ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat.id)}
            >
              {cat.name}
              <span className="chip-count">{count}</span>
            </button>
          )
        })}
      </div>

      {editing && (
        <div className="inline-form dish-form">
          <input
            type="text"
            placeholder="菜品名称"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label className="image-upload">
            {form.image ? (
              <img src={form.image} alt="预览" className="upload-preview" />
            ) : (
              <span className="upload-placeholder">📷 点击上传图片</span>
            )}
            <input type="file" accept="image/*" onChange={handleImage} hidden />
          </label>
          <div className="form-actions">
            <button type="button" onClick={() => setEditing(null)}>
              取消
            </button>
            <button type="button" className="primary" onClick={save}>
              保存
            </button>
          </div>
        </div>
      )}

      {groupedDishes.length === 0 ? (
        <p className="empty-hint">暂无菜品，点击右上角新增</p>
      ) : (
        groupedDishes.map(({ category, dishes: catDishes }) => (
          <div key={category.id} className="dish-group">
            <h3 className="dish-group-title">
              <span className="group-name">{category.name}</span>
              <span className="group-meta">{category.group}</span>
            </h3>
            <ul className="manage-list dish-manage-list">
              {catDishes.map((dish) => (
                <li key={dish.id} className="manage-item dish-manage-item">
                  <img src={dish.image} alt={dish.name} className="dish-thumb" />
                  <div className="item-info">
                    <span className="item-name">{dish.name}</span>
                    <span className="category-tag">{category.name}</span>
                  </div>
                  <div className="item-actions">
                    <button type="button" onClick={() => startEdit(dish)}>
                      编辑
                    </button>
                    <button type="button" className="danger" onClick={() => deleteDish(dish.id)}>
                      删除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  )
}

export default function MyPage({ onClose }) {
  const [tab, setTab] = useState('categories')

  return (
    <div className="my-overlay" onClick={onClose}>
      <div className="my-page" onClick={(e) => e.stopPropagation()}>
        <header className="my-topbar">
          <div className="my-tabs">
            <button
              type="button"
              className={`my-tab ${tab === 'categories' ? 'active' : ''}`}
              onClick={() => setTab('categories')}
            >
              分类管理
            </button>
            <button
              type="button"
              className={`my-tab ${tab === 'dishes' ? 'active' : ''}`}
              onClick={() => setTab('dishes')}
            >
              菜品管理
            </button>
          </div>
          <button type="button" className="my-close-btn" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </header>

        {tab === 'categories' ? <CategoryManager /> : <DishManager />}
      </div>
    </div>
  )
}
