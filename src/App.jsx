import { useState } from 'react'
import CategorySidebar from './components/CategorySidebar'
import DishList from './components/DishList'
import CartBar from './components/CartBar'
import MyPage from './components/MyPage'
import ChefHatIcon from './components/ChefHatIcon'
import SyncStatus from './components/SyncStatus'
import { useStore } from './store/StoreContext'
import './App.css'

function AppContent() {
  const [showMy, setShowMy] = useState(false)
  const { ready } = useStore()

  if (!ready) {
    return (
      <div className="app-loading">
        <p className="app-loading-title">雌雄双厨</p>
        <p className="app-loading-hint">正在连接云端菜单…</p>
      </div>
    )
  }

  return (
    <>
      <header className="app-header">
        <div className="app-header-left">
          <h1 className="app-title">雌雄双厨</h1>
          <SyncStatus />
        </div>
        <button
          type="button"
          className="my-entry-btn"
          onClick={() => setShowMy(true)}
          aria-label="我的"
        >
          <ChefHatIcon className="chef-hat-icon" />
        </button>
      </header>
      <div className="menu-content">
        <CategorySidebar />
        <DishList />
      </div>
      <CartBar />
      {showMy && <MyPage onClose={() => setShowMy(false)} />}
    </>
  )
}

export default function App() {
  return (
    <div className="app">
      <AppContent />
    </div>
  )
}
