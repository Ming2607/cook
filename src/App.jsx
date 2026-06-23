import { useState } from 'react'
import CategorySidebar from './components/CategorySidebar'
import DishList from './components/DishList'
import CartBar from './components/CartBar'
import MyPage from './components/MyPage'
import './App.css'

export default function App() {
  const [showMy, setShowMy] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">雌雄双厨</h1>
        <button
          type="button"
          className="my-entry-btn"
          onClick={() => setShowMy(true)}
          aria-label="我的"
        >
          <span
            className="chef-hat-icon"
            style={{
              WebkitMaskImage: `url(${import.meta.env.BASE_URL}icons/chef-hat.png)`,
              maskImage: `url(${import.meta.env.BASE_URL}icons/chef-hat.png)`,
            }}
            aria-hidden="true"
          />
        </button>
      </header>
      <div className="menu-content">
        <CategorySidebar />
        <DishList />
      </div>
      <CartBar />
      {showMy && <MyPage onClose={() => setShowMy(false)} />}
    </div>
  )
}
