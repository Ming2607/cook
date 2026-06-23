import { useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { useStore } from '../store/StoreContext'
import { MENU_SECTIONS } from '../data/defaults'
import './MenuPreview.css'

async function saveMenuImage(element) {
  const canvas = await html2canvas(element, {
    backgroundColor: '#faf6f0',
    scale: 2,
    useCORS: true,
    logging: false,
    height: element.scrollHeight,
    windowHeight: element.scrollHeight,
  })

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1))
  if (!blob) throw new Error('生成图片失败')

  const date = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')
  const filename = `雌雄双厨-菜单-${date}.png`
  const file = new File([blob], filename, { type: 'image/png' })

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: '雌雄双厨菜单' })
    return 'shared'
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  return 'downloaded'
}

export default function MenuPreview({ onClose }) {
  const { getMenuItems, clearCart } = useStore()
  const menuPaperRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [saveHint, setSaveHint] = useState('')

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

  const handleSave = async () => {
    if (!menuPaperRef.current || saving) return
    setSaving(true)
    setSaveHint('')
    try {
      const result = await saveMenuImage(menuPaperRef.current)
      setSaveHint(result === 'shared' ? '已通过分享保存，可选择「存储图像」' : '图片已下载，请在相册或下载中查看')
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setSaveHint('保存失败，请重试')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="menu-overlay" onClick={onClose}>
      <div className="menu-sheet" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="menu-close" onClick={onClose} aria-label="关闭">
          ×
        </button>

        <div className="menu-paper" ref={menuPaperRef}>
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
          <button type="button" className="action-btn save-btn" onClick={handleSave} disabled={saving}>
            {saving ? '生成中…' : '保存到相册'}
          </button>
          <div className="action-row">
            <button type="button" className="action-btn secondary" onClick={onClose}>
              继续选菜
            </button>
            <button
              type="button"
              className="action-btn secondary"
              onClick={() => {
                clearCart()
                onClose()
              }}
            >
              清空重置
            </button>
          </div>
          {saveHint && <p className="save-hint">{saveHint}</p>}
        </div>
      </div>
    </div>
  )
}
