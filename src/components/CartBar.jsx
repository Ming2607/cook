import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import MenuPreview from './MenuPreview'
import './CartBar.css'

export default function CartBar() {
  const { cartTotal } = useStore()
  const [showMenu, setShowMenu] = useState(false)

  if (cartTotal === 0) return null

  return (
    <>
      <div className="cart-bar">
        <div className="cart-info">
          <span className="cart-label">已选</span>
          <span className="cart-count">{cartTotal}</span>
          <span className="cart-unit">道</span>
        </div>
        <button type="button" className="generate-btn" onClick={() => setShowMenu(true)}>
          生成菜单
        </button>
      </div>
      {showMenu && <MenuPreview onClose={() => setShowMenu(false)} />}
    </>
  )
}
