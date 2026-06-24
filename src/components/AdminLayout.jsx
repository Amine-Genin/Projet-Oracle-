import React, { useState } from 'react'
import { Button, Container, Nav } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'

const AdminLayout = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('rl_user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('rl_user')
    navigate('/login')
  }

  return (
    <div className={`admin-shell ${collapsed ? 'admin-collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>Admin Lab</span>
          <small>Direction scientifique</small>
        </div>
        <Nav className="flex-column px-2">
          <Nav.Link as={NavLink} to="/directeur">Tableau de bord</Nav.Link>
          <Nav.Link as={NavLink} to="/">Accueil</Nav.Link>
          <Nav.Link as={NavLink} to="/chercheur">Espace chercheur</Nav.Link>
        </Nav>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
         
          <div>
            <span className="admin-breadcrumb">Laboratoire / Direction</span>
            <h1>{title || 'Tableau de bord'}</h1>
          </div>
          <div className="admin-user">
            <span>{user?.name || 'Directeur'}</span>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </header>

        <main className="admin-main">
          <Container fluid>{children}</Container>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
