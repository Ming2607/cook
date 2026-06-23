import { useMemo } from 'react'
import { useStore } from '../store/StoreContext'
import { MENU_SECTIONS } from '../data/defaults'
import './MenuPreview.css'

export default function MenuPreview({ onClose }) {
  const { getMenuItems, clearCart } = useStore()

  const grouped = useMemo(() => {
    const items = getMenuItems()
    const map = {}
    for (const section of MENU_SECTIONS) map[section] = []
    for (const item of items) {
      if (!map[item.menuSection]) map[item.menuSection] = []
      map[item.menuSection].push(item)
    }
    return MENU_SECTIONS.filter((s) => map[s]?.length > 0).map((s) => ({
      section: s,
      items: map[s],
    }))
  }, [getMenuItems])

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="menu-overlay" onClick={onClose}>
      <div className="menu-sheet" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="menu-close" onClick={onClose} aria-label="关闭">
          ×
        </button>

        <div className="menu-paper">
          <header className="menu-header">
            <div className="menu-ornament">✦</div>
            <h1 className="menu-title">雌雄双厨</h1>
            <p className="menu-subtitle">TODAY&apos;S TASTING MENU</p>
            <p className="menu-date">{today}</p>
            <div className="menu-divider" />
          </header>

          <div className="menu-body">
            {grouped.map(({ section, items }) => (
              <section key={section} className="menu-section">
                <h2 className="section-title">{section}</h2>
                <ul className="section-items">
                  {items.map(({ dish, qty }) => (
                    <li key={dish.id} className="menu-line">
                      <span className="line-name">
                        {dish.name}
                        {qty > 1 && <span className="line-qty"> ×{qty}</span>}
                      </span>
                      <span className="line-dots" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <footer className="menu-footer">
            <div className="menu-divider" />
            <p className="footer-note">匠心烹制 · 仅供品鉴</p>
          </footer>
        </div>

        <div className="menu-actions">
          <button type="button" className="action-btn secondary" onClick={onClose}>
            继续选菜
          </button>
          <button
            type="button"
            className="action-btn primary"
            onClick={() => {
              clearCart()
              onClose()
            }}
          >
            清空并重置
          </button>
        </div>
      </div>
    </div>
  )
}
