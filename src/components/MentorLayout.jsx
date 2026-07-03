import React from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'

const getUserName = (user) => {
  if (!user) return ''
  return `${user.prenom || ''} ${user.nom || ''}`.trim() || user.name || ''
}

const MentorLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('rl_user') || 'null')
  const userName = getUserName(user)

  const handleLogout = () => {
    // Deconnexion simple: suppression de la session locale puis retour au login.
    localStorage.removeItem('rl_user')
    navigate('/login')
  }

  return (
    <div className="mentor-shell">
      <div className="top-strip">
        <Container className="d-flex justify-content-between align-items-center">
          <span>Université - Laboratoire de recherche</span>
        </Container>
      </div>

      <Navbar expand="lg" variant="dark" className="mentor-navbar" sticky="top">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">
            Laboratoire Oracle
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto align-items-lg-center gap-lg-2">
              <Nav.Link as={NavLink} to="/">Accueil</Nav.Link>
              <Nav.Link as={NavLink} to="/chercheur">Espace chercheur</Nav.Link>
              <Nav.Link as={NavLink} to="/directeur">Espace directeur</Nav.Link>
              {user ? (
                <>
                  <span className="text-white small">{userName}</span>
                  <Button className="mentor-nav-button" variant="outline-light" size="sm" onClick={handleLogout}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button className="mentor-nav-button" variant="light" size="sm" onClick={() => navigate('/login')}>
                  Connexion
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {title && (
        <section className="mentor-hero">
          <Container>
            <div className="mentor-hero-content col-lg-8">
              <p className="mentor-eyebrow">Gestion académique des expériences</p>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
              <div className="mentor-hero-tags">
                <span>Rapports</span>
                <span>Validation</span>
                <span>Suivi scientifique</span>
              </div>
            </div>
          </Container>
        </section>
      )}

      <main className="mentor-main">
        <Container>{children}</Container>
      </main>
    </div>
  )
}

export default MentorLayout
