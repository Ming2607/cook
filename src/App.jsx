import { useState } from 'react'
import CategorySidebar from './components/CategorySidebar'
import DishList from './components/DishList'
import CartBar from './components/CartBar'
import BottomNav from './components/BottomNav'
import MyPage from './components/MyPage'
import './App.css'

function MenuPage() {
  return (
    <div className="menu-page">
      <header className="app-header">
        <h1 className="app-title">雌雄双厨</h1>
      </header>
      <div className="menu-content">
        <CategorySidebar />
        <DishList />
      </div>
      <CartBar />
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('menu')

  return (
    <div className="app">
      {tab === 'menu' ? <MenuPage /> : <MyPage />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
