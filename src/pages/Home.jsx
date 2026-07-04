import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MentorLayout from '../components/MentorLayout'
import { getOracleDashboard } from '../services/api'

const Home = () => {
  const navigate = useNavigate()
  const [oracleCounts, setOracleCounts] = useState({ chercheurs: 0, projets: 0, equipements: 0 })
  const [loadingOracle, setLoadingOracle] = useState(true)

  useEffect(() => {
    getOracleDashboard()
      .then((data) => setOracleCounts(data.counts || { chercheurs: 0, projets: 0, equipements: 0 }))
      .catch(() => setOracleCounts({ chercheurs: 0, projets: 0, equipements: 0 }))
      .finally(() => setLoadingOracle(false))
  }, [])

  return (
    <MentorLayout
      title="Gestion d'un Laboratoire de Recherche"
      subtitle="Suivi des expériences, des projets Oracle et des rapports MongoDB."
    >
      <Row className="align-items-center g-4 mb-5 mentor-intro-section">
        <Col lg={7}>
          <p className="section-kicker">Plateforme intégrée</p>
          <h2 className="section-title">Un espace clair pour piloter les rapports de recherche</h2>
          <p className="lead text-muted">
            Les chercheurs créent leurs rapports, les soumettent, puis le directeur suit les indicateurs
            et valide les travaux depuis un tableau de bord dédié.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Button className="mentor-action-button" size="lg" variant="primary" onClick={() => navigate('/chercheur')}>
              Espace chercheur
            </Button>
            <Button className="mentor-action-button" size="lg" variant="outline-primary" onClick={() => navigate('/directeur')}>
              Espace directeur
            </Button>
          </div>
        </Col>
        <Col lg={5}>
          <Card className="mentor-feature-card">
            <Card.Body>
              <h5>Flux de validation</h5>
              <div className="status-flow">
                <span>Brouillon</span>
                <span>Soumis</span>
                <span>Validé</span>
              </div>
              <p className="text-muted mb-0">
                Chaque rapport conserve les champs français: titre, objectif, protocole, résultats,
                observations, conclusion, projetId, chercheurId, dateExperience et statut.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mentor-services">
        <Col md={4}>
          <Card className="mentor-service-card h-100">
            <Card.Body>
              <div className="service-icon">01</div>
              <h5>Rapports</h5>
              <p>Création, modification, suppression et soumission des rapports d'expérience.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mentor-service-card h-100">
            <Card.Body>
              <div className="service-icon">02</div>
              <h5>Validation</h5>
              <p>Le directeur visualise les rapports soumis et valide les travaux finalisés.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mentor-service-card h-100">
            <Card.Body>
              <div className="service-icon">03</div>
              <h5>Référentiel Oracle</h5>
              {loadingOracle ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <p>
                  {oracleCounts.projets} projets, {oracleCounts.chercheurs} chercheurs et{' '}
                  {oracleCounts.equipements} équipements disponibles dans la base Oracle.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </MentorLayout>
  )
}

export default Home
