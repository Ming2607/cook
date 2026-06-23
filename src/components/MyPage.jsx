import { useMemo, useState } from 'react'
import { useStore } from '../store/StoreContext'
import { compressImage } from '../utils/image'
import SortableList from './SortableList'
import './MyPage.css'

function MajorCategoryManager() {
  const {
    majorCategories,
    categories,
    addMajorCategory,
    updateMajorCategory,
    deleteMajorCategory,
    reorderMajorCategories,
  } = useStore()
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')

  const startAdd = () => {
    setEditing('new')
    setName('')
  }

  const startEdit = (major) => {
    setEditing(major.id)
    setName(major.name)
  }

  const save = () => {
    if (!name.trim()) return
    if (editing === 'new') addMajorCategory(name.trim())
    else updateMajorCategory(editing, { name: name.trim() })
    setEditing(null)
  }

  return (
    <div className="category-block">
      <div className="block-header">
        <h3 className="block-title">大类</h3>
        <button type="button" className="text-btn" onClick={startAdd}>
          + 新增大类
        </button>
      </div>

      {editing && (
        <div className="inline-form compact-form">
          <input
            type="text"
            placeholder="大类名称，如：前菜"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

      <SortableList
        items={majorCategories}
        keyExtractor={(m) => m.id}
        onReorder={reorderMajorCategories}
        renderItem={(major) => {
          const subCount = categories.filter((c) => c.majorCategoryId === major.id).length
          return (
            <>
              <div className="item-info">
                <span className="item-name">{major.name}</span>
                <span className="item-meta">{subCount} 个小类</span>
              </div>
              <div className="item-actions">
                <button type="button" onClick={() => startEdit(major)}>
                  编辑
                </button>
                <button type="button" className="danger" onClick={() => deleteMajorCategory(major.id)}>
                  删除
                </button>
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

function SubCategoryManager() {
  const {
    majorCategories,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategoriesInMajor,
  } = useStore()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', majorCategoryId: '' })

  const startAdd = (majorId) => {
    setEditing('new')
    setForm({ name: '', majorCategoryId: majorId || majorCategories[0]?.id || '' })
  }

  const startEdit = (cat) => {
    setEditing(cat.id)
    setForm({ name: cat.name, majorCategoryId: cat.majorCategoryId })
  }

  const save = () => {
    if (!form.name.trim() || !form.majorCategoryId) return
    if (editing === 'new') addCategory(form)
    else updateCategory(editing, form)
    setEditing(null)
  }

  if (majorCategories.length === 0) {
    return <p className="empty-hint">请先添加大类</p>
  }

  return (
    <div className="category-block">
      <div className="block-header">
        <h3 className="block-title">小类</h3>
      </div>

      {editing && (
        <div className="inline-form compact-form">
          <input
            type="text"
            placeholder="小类名称，如：川菜"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            value={form.majorCategoryId}
            onChange={(e) => setForm({ ...form, majorCategoryId: e.target.value })}
          >
            {majorCategories.map((m) => (
              <option key={m.id} value={m.id}>
                所属大类：{m.name}
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

      {majorCategories.map((major) => {
        const subs = categories
          .filter((c) => c.majorCategoryId === major.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
        return (
          <div key={major.id} className="subcategory-group">
            <div className="subcategory-group-header">
              <span className="subcategory-major-name">{major.name}</span>
              <button type="button" className="text-btn" onClick={() => startAdd(major.id)}>
                + 新增小类
              </button>
            </div>
            {subs.length === 0 ? (
              <p className="subcategory-empty">暂无小类</p>
            ) : (
              <SortableList
                items={subs}
                keyExtractor={(c) => c.id}
                className="manage-list sub-list"
                onReorder={(ordered) => reorderCategoriesInMajor(major.id, ordered)}
                renderItem={(cat) => (
                  <>
                    <div className="item-info">
                      <span className="item-name">{cat.name}</span>
                    </div>
                    <div className="item-actions">
                      <button type="button" onClick={() => startEdit(cat)}>
                        编辑
                      </button>
                      <button type="button" className="danger" onClick={() => deleteCategory(cat.id)}>
                        删除
                      </button>
                    </div>
                  </>
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function CategoryManager() {
  const { majorCategories, categories } = useStore()

  return (
    <section className="my-section">
      <div className="section-header">
        <span className="section-count">
          {majorCategories.length} 个大类 · {categories.length} 个小类 · 长按拖动排序
        </span>
      </div>
      <MajorCategoryManager />
      <SubCategoryManager />
    </section>
  )
}

function DishManager() {
  const {
    majorCategories,
    categories,
    dishes,
    addDish,
    updateDish,
    deleteDish,
    reorderDishesInCategory,
  } = useStore()
  const [editing, setEditing] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [form, setForm] = useState({ name: '', categoryId: '', image: '' })

  const groupedDishes = useMemo(() => {
    return majorCategories
      .map((major) => ({
        major,
        groups: categories
          .filter((c) => c.majorCategoryId === major.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((cat) => ({
            category: cat,
            dishes: dishes
              .filter((d) => d.categoryId === cat.id)
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
          }))
          .filter((g) => g.dishes.length > 0)
          .filter((g) => filterCategory === 'all' || g.category.id === filterCategory),
      }))
      .filter((m) => m.groups.length > 0)
  }, [majorCategories, categories, dishes, filterCategory])

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
        <span className="section-count">共 {dishes.length} 道菜品 · 长按拖动排序</span>
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
            {majorCategories.map((major) => (
              <optgroup key={major.id} label={major.name}>
                {categories
                  .filter((c) => c.majorCategoryId === major.id)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </optgroup>
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
        groupedDishes.map(({ major, groups }) => (
          <div key={major.id} className="dish-major-group">
            <h2 className="dish-major-title">{major.name}</h2>
            {groups.map(({ category, dishes: catDishes }) => (
              <div key={category.id} className="dish-group">
                <h3 className="dish-group-title">
                  <span className="group-name">{category.name}</span>
                  <span className="group-meta">{major.name}</span>
                </h3>
                <SortableList
                  items={catDishes}
                  keyExtractor={(dish) => dish.id}
                  className="manage-list dish-manage-list"
                  itemClassName="manage-item dish-manage-item"
                  onReorder={(ordered) => reorderDishesInCategory(category.id, ordered)}
                  renderItem={(dish) => (
                    <>
                      <img src={dish.image} alt={dish.name} className="dish-thumb" />
                      <div className="item-info">
                        <span className="item-name">{dish.name}</span>
                        <span className="category-tag">
                          {major.name} · {category.name}
                        </span>
                      </div>
                      <div className="item-actions">
                        <button type="button" onClick={() => startEdit(dish)}>
                          编辑
                        </button>
                        <button type="button" className="danger" onClick={() => deleteDish(dish.id)}>
                          删除
                        </button>
                      </div>
                    </>
                  )}
                />
              </div>
            ))}
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
