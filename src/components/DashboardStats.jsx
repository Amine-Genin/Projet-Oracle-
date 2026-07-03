import React, { useMemo } from 'react'
import { Badge, Card, Col, Row } from 'react-bootstrap'
import { projects } from '../data/oracleMockData'

const DashboardStats = ({ reports = [], statsStatus = [], productive = [] }) => {
  const projectStats = useMemo(() => {
    return projects.map((project) => {
      const projectReports = reports.filter((report) => String(report.projetId) === String(project.id))
      const validated = projectReports.filter((report) => report.statut === 'validé' || report.statut === 'valide').length
      const rate = projectReports.length ? Math.round((validated / projectReports.length) * 100) : 0

      return {
        ...project,
        total: projectReports.length,
        validated,
        rate
      }
    })
  }, [reports])

  return (
    <Row className="g-4">
      <Col lg={4}>
        <Card className="admin-card h-100">
          <Card.Header>Rapports par statut</Card.Header>
          <Card.Body>
            {statsStatus.length ? statsStatus.map((item) => (
              <div key={item.statut || item._id} className="d-flex justify-content-between py-2 border-bottom">
                <span>{item.statut || item._id}</span>
                <Badge bg="primary">{item.count}</Badge>
              </div>
            )) : <p className="text-muted mb-0">Aucune donnée disponible.</p>}
          </Card.Body>
        </Card>
      </Col>

      <Col lg={4}>
        <Card className="admin-card h-100">
          <Card.Header>Chercheurs productifs</Card.Header>
          <Card.Body>
            {productive.length ? productive.map((item) => (
              <div key={item._id || item.chercheurId} className="d-flex justify-content-between py-2 border-bottom">
                <span>Chercheur {item._id || item.chercheurId}</span>
                <Badge bg="success">{item.count}</Badge>
              </div>
            )) : <p className="text-muted mb-0">Aucun chercheur productif.</p>}
          </Card.Body>
        </Card>
      </Col>

      <Col lg={4}>
        <Card className="admin-card h-100">
          <Card.Header>Progression par projet</Card.Header>
          <Card.Body>
            {projectStats.map((project) => (
              <div key={project.id} className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">{project.name}</span>
                  <span>{project.rate}%</span>
                </div>
                <div className="progress admin-progress">
                  <div className="progress-bar bg-success" style={{ width: `${project.rate}%` }} />
                </div>
                <small className="text-muted">{project.validated}/{project.total} rapports validés</small>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default DashboardStats
