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
          <svg className="chef-hat-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3c-2.8 0-5 1.6-5.8 4.1-.5.2-1 .6-1.3 1.1-.5.8-.6 1.7-.4 2.6.3 1.2 1.2 2.1 2.4 2.4v.3c0 .6.4 1 1 1h7.2c.6 0 1-.4 1-1v-.3c1.2-.3 2.1-1.2 2.4-2.4.2-.9.1-1.8-.4-2.6-.3-.5-.8-.9-1.3-1.1C17 4.6 14.8 3 12 3z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 11.5h11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M7.5 11.5v2.2c0 .8.7 1.5 1.5 1.5h6c.8 0 1.5-.7 1.5-1.5v-2.2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 6.2c.8-.6 1.7-.9 2.5-.9s1.7.3 2.5.9"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
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
