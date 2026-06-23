import './BottomNav.css'

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      <button
        type="button"
        className={`nav-item ${active === 'menu' ? 'active' : ''}`}
        onClick={() => onChange('menu')}
      >
        <span className="nav-icon">🍽</span>
        <span className="nav-label">点菜</span>
      </button>
      <button
        type="button"
        className={`nav-item ${active === 'my' ? 'active' : ''}`}
        onClick={() => onChange('my')}
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">我的</span>
      </button>
    </nav>
  )
}
