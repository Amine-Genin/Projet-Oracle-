import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Table, Badge, Button, Alert, Spinner, Form } from 'react-bootstrap'
import AdminLayout from '../components/AdminLayout'
import StatCard from '../components/StatCard'
import { getReports, statsByStatus, productiveResearchers, validateReport } from '../services/api'
import { projects } from '../data/oracleMockData'

const isValidated = (statut) => statut === 'valide' || statut === 'validé'

const DirectorPage = () => {
  const [reports, setReports] = useState([])
  const [statsStatus, setStatsStatus] = useState([])
  const [productive, setProductive] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const [allReports, statusStats, prodResearchers] = await Promise.all([
        getReports(),
        statsByStatus(),
        productiveResearchers()
      ])
      setReports(allReports)
      setStatsStatus(statusStats)
      setProductive(prodResearchers)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleValidate = async (id) => {
    try {
      setError(null)
      await validateReport(id)
      setSuccess('Rapport validé !')
      load()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = reports.filter((report) => {
    if (filter === 'all') return true
    if (filter === 'validé') return isValidated(report.statut)
    return report.statut === filter
  })
  const totalReports = reports.length
  const submittedReports = reports.filter((report) => report.statut === 'soumis').length
  const validatedReports = reports.filter((report) => isValidated(report.statut)).length
  const progressRate = totalReports > 0 ? Math.round((validatedReports / totalReports) * 100) : 0

  const getStatutBadge = (statut) => {
    if (statut === 'brouillon') return <Badge bg="secondary">brouillon</Badge>
    if (statut === 'soumis') return <Badge bg="warning" text="dark">soumis</Badge>
    if (isValidated(statut)) return <Badge bg="success">validé</Badge>
    return <Badge bg="light" text="dark">{statut}</Badge>
  }

  const projectStats = projects.map((project) => {
    const projectReports = reports.filter((report) => String(report.projetId) === String(project.id))
    const validated = projectReports.filter((report) => isValidated(report.statut)).length
    const rate = projectReports.length > 0 ? Math.round((validated / projectReports.length) * 100) : 0

    return {
      id: project.id,
      name: project.name,
      total: projectReports.length,
      validated,
      rate
    }
  })

  const normalizedStatsStatus = statsStatus.map((item) => ({
    statut: isValidated(item.statut || item._id) ? 'validé' : item.statut || item._id,
    count: item.count || 0
  }))

  return (
    <AdminLayout title="Tableau de bord directeur">
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row className="g-3 mb-4">
            <Col md={3}>
              <StatCard title="Rapports totaux" value={totalReports} label="Total" color="primary" />
            </Col>
            <Col md={3}>
              <StatCard title="En attente" value={submittedReports} label="soumis" color="warning" />
            </Col>
            <Col md={3}>
              <StatCard title="Rapports validés" value={validatedReports} label="validé" color="success" />
            </Col>
            <Col md={3}>
              <StatCard title="Taux de validation" value={`${progressRate}%`} label="progression" color="info" />
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col lg={6}>
              <Card className="admin-panel-card h-100">
                <Card.Header>
                  <h6 className="mb-0">Expériences par projet</h6>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Projet</th>
                        <th>Total</th>
                        <th>Validés</th>
                        <th>Taux</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectStats.map((project) => (
                        <tr key={project.id}>
                          <td>{project.name.split('-')[0].trim()}</td>
                          <td>{project.total}</td>
                          <td>{project.validated}</td>
                          <td>{project.rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="admin-panel-card h-100">
                <Card.Header>
                  <h6 className="mb-0">Distribution par statut</h6>
                </Card.Header>
                <Card.Body>
                  {normalizedStatsStatus.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {normalizedStatsStatus.map((item) => (
                        <div key={item.statut} className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <span>{getStatutBadge(item.statut)}</span>
                          <Badge bg="primary">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-5">Aucune donnée</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col lg={6}>
              <Card className="admin-panel-card">
                <Card.Header>
                  <h6 className="mb-0">Chercheurs productifs</h6>
                </Card.Header>
                <Card.Body>
                  {productive.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {productive.map((item) => (
                        <div key={item._id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <span>Chercheur #{item._id}</span>
                          <Badge bg="primary">{item.count} rapports validés</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-3">Aucun chercheur productif</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="admin-panel-card">
                <Card.Header>
                  <h6 className="mb-0">Projets actifs</h6>
                </Card.Header>
                <Card.Body>
                  <div className="list-group list-group-flush">
                    {projectStats.map((project) => (
                      <div key={project.id} className="list-group-item px-0">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold small">{project.name.split('-')[0].trim()}</span>
                          <Badge bg="info">{project.total} expériences</Badge>
                        </div>
                        <div className="progress" style={{ height: '0.5rem' }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${project.rate}%` }}
                            aria-valuenow={project.rate}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                        <small className="text-muted">{project.rate}% validés</small>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="admin-panel-card admin-table-card">
            <Card.Header>
              <div className="admin-table-toolbar d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Liste des rapports</h6>
                <Form.Select
                  className="admin-filter-select"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="brouillon">brouillon</option>
                  <option value="soumis">soumis</option>
                  <option value="validé">validé</option>
                </Form.Select>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {filtered.length === 0 ? (
                <div className="text-center text-muted py-5">Aucun rapport</div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Titre</th>
                        <th>Chercheur</th>
                        <th>Projet</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((report) => (
                        <tr key={report._id || report.id}>
                          <td className="fw-bold">{report.titre}</td>
                          <td>#{report.chercheurId}</td>
                          <td>{projects.find((project) => String(project.id) === String(report.projetId))?.name.split('-')[0].trim() || report.projetId}</td>
                          <td>{getStatutBadge(report.statut)}</td>
                          <td>{report.dateExperience ? new Date(report.dateExperience).toLocaleDateString('fr-FR') : 'N/A'}</td>
                          <td>
                            {report.statut === 'soumis' ? (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleValidate(report._id || report.id)}
                              >
                                Valider
                              </Button>
                            ) : (
                              <span className="text-muted small">Lecture seule</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </AdminLayout>
  )
}

export default DirectorPage
