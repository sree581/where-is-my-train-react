
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function Layout() {
  const { pathname } = useLocation()

  // Start every page at the top, like a normal page load.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app-layout">
      <Header />
      <div className="app-main">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
