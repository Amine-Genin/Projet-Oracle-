import React, { useState } from 'react'
import { Button, Container, Nav } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'

const getUserName = (user) => {
  if (!user) return 'Directeur'
  return `${user.prenom || ''} ${user.nom || ''}`.trim() || user.name || 'Directeur'
}

const AdminLayout = ({ children, title, menuItems = [], activeItem, onSelectItem }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('rl_user') || 'null')
  const userName = getUserName(user)

  const handleLogout = () => {
    // Deconnexion simple: suppression de la session locale puis retour au login.
    localStorage.removeItem('rl_user')
    navigate('/login')
  }

  return (
    <div className={`admin-shell ${collapsed ? 'admin-collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>Directeur Labo</span>
          <small>Direction scientifique</small>
        </div>
        {menuItems.length > 0 ? (
          <Nav className="flex-column px-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`admin-nav-button ${activeItem === item.key ? 'active' : ''}`}
                onClick={() => onSelectItem(item.key)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </Nav>
        ) : (
          <Nav className="flex-column px-2">
            <Nav.Link as={NavLink} to="/directeur">Tableau de bord</Nav.Link>
            <Nav.Link as={NavLink} to="/">Accueil</Nav.Link>
            <Nav.Link as={NavLink} to="/chercheur">Espace chercheur</Nav.Link>
          </Nav>
        )}
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <Button variant="outline-secondary" size="sm" onClick={() => setCollapsed(!collapsed)}>
            Menu
          </Button>
          <div>
            <span className="admin-breadcrumb">Laboratoire / Direction</span>
            <h1>{title || 'Tableau de bord'}</h1>
          </div>
          <div className="admin-user">
            <span>{userName}</span>
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
