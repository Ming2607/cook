import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { MENU_SECTIONS } from '../data/defaults'
import { compressImage } from '../utils/image'
import './MyPage.css'

function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', menuSection: '主菜' })

  const startAdd = () => {
    setEditing('new')
    setForm({ name: '', menuSection: '主菜' })
  }

  const startEdit = (cat) => {
    setEditing(cat.id)
    setForm({ name: cat.name, menuSection: cat.menuSection })
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
        <h2>菜品分类</h2>
        <button type="button" className="text-btn" onClick={startAdd}>
          + 新增
        </button>
      </div>

      {editing && (
        <div className="inline-form">
          <input
            type="text"
            placeholder="分类名称，如：凉菜"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
              <span className="item-meta">{cat.menuSection}</span>
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
  const [form, setForm] = useState({ name: '', categoryId: '', image: '' })

  const startAdd = () => {
    setEditing('new')
    setForm({ name: '', categoryId: categories[0]?.id || '', image: '' })
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
        <h2>我的菜品</h2>
        <button type="button" className="text-btn" onClick={startAdd} disabled={categories.length === 0}>
          + 新增
        </button>
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

      <ul className="manage-list dish-manage-list">
        {dishes.map((dish) => {
          const cat = categories.find((c) => c.id === dish.categoryId)
          return (
            <li key={dish.id} className="manage-item dish-manage-item">
              <img src={dish.image} alt={dish.name} className="dish-thumb" />
              <div className="item-info">
                <span className="item-name">{dish.name}</span>
                <span className="item-meta">{cat?.name || '未分类'}</span>
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
          )
        })}
      </ul>
    </section>
  )
}

export default function MyPage() {
  return (
    <div className="my-page">
      <header className="my-header">
        <h1>我的</h1>
        <p>管理分类与菜品，数据保存在本机浏览器</p>
      </header>
      <CategoryManager />
      <DishManager />
    </div>
  )
}
