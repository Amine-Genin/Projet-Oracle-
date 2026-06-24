import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap'
import MentorLayout from '../components/MentorLayout'
import ReportForm from '../components/ReportForm'
import { projects } from '../data/oracleMockData'
import { getReports, deleteReport, submitReport } from '../services/api'

const currentResearcherId = '1'

const ResearcherPage = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const all = await getReports()
      setReports(all.filter(r => r.chercheurId === currentResearcherId))
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleNew = () => { setEditing(null); setShowForm(true) }
  const handleEdit = (r) => { setEditing(r); setShowForm(true) }
  const handleSaved = () => { setSuccess('Rapport sauvegardé !'); load(); setTimeout(() => setSuccess(null), 3000) }
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) return
    try {
      setError(null)
      await deleteReport(id)
      setSuccess('Rapport supprimé !')
      load()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }
  const handleSubmit = async (id) => {
    try {
      setError(null)
      await submitReport(id)
      setSuccess('Rapport soumis !')
      load()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  const draftCount = reports.filter(r => r.statut === 'brouillon').length
  const submittedCount = reports.filter(r => r.statut === 'soumis').length
  const validatedCount = reports.filter(r => r.statut === 'validé').length

  const getStatutBadge = (statut) => {
    switch(statut) {
      case 'brouillon': return <Badge bg="secondary">Brouillon</Badge>
      case 'soumis': return <Badge bg="warning" text="dark">Soumis</Badge>
      case 'validé': return <Badge bg="success">Validé</Badge>
      default: return <Badge bg="light" text="dark">{statut}</Badge>
    }
  }

  return (
    <MentorLayout title="Espace Chercheur" subtitle="Gérez vos projets et rapports d'expériences">
      {/* Alertes */}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {/* Statistiques */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="research-stat-card research-stat-draft">
            <Card.Body className="text-center">
              <h5 className="text-secondary">{draftCount}</h5>
              <small className="text-muted">Brouillons</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="research-stat-card research-stat-submitted">
            <Card.Body className="text-center">
              <h5 className="text-warning">{submittedCount}</h5>
              <small className="text-muted">Soumis</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="research-stat-card research-stat-validated">
            <Card.Body className="text-center">
              <h5 className="text-success">{validatedCount}</h5>
              <small className="text-muted">Validés</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="research-stat-card research-stat-total">
            <Card.Body className="text-center">
              <h5 className="text-primary">{reports.length}</h5>
              <small className="text-muted">Total</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bouton Nouveau Rapport */}
      <div className="research-toolbar d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Mes Rapports d'Expériences</h4>
        <Button className="mentor-action-button" variant="primary" onClick={handleNew}>
          + Nouveau rapport
        </Button>
      </div>

      {/* Liste des rapports */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : reports.length === 0 ? (
        <Card className="empty-research-card py-5 text-center">
          <Card.Body>
            <p className="text-muted mb-0">Aucun rapport pour le moment.</p>
            <small className="text-muted">Créez votre premier rapport en cliquant sur le bouton ci-dessus.</small>
          </Card.Body>
        </Card>
      ) : (
        <div className="research-report-list">
          {reports.map(r => (
            <div key={r._id || r.id} className="research-report-item">
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3">
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-bold">{r.titre}</h6>
                  <p className="text-muted small mb-1">{r.objectif}</p>
                  <div className="research-report-meta small">
                    <span className="text-muted">Projet:</span> {projects.find(p => p.id === r.projetId)?.name || r.projetId} |{' '}
                    <span className="text-muted">Date:</span> {r.dateExperience ? new Date(r.dateExperience).toLocaleDateString('fr-FR') : 'N/A'}
                  </div>
                </div>
                <div className="text-end">
                  <div className="mb-2">{getStatutBadge(r.statut)}</div>
                  <div className="btn-group btn-group-sm research-actions" role="group">
                    {r.statut === 'brouillon' && (
                      <>
                        <Button size="sm" variant="outline-primary" onClick={() => handleEdit(r)}>Éditer</Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(r._id || r.id)}>Supprimer</Button>
                        <Button size="sm" variant="success" onClick={() => handleSubmit(r._id || r.id)}>Soumettre</Button>
                      </>
                    )}
                    {r.statut !== 'brouillon' && (
                      <Button size="sm" variant="outline-secondary" disabled>Lecture seule</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Formulaire */}
      <ReportForm show={showForm} onHide={() => setShowForm(false)} initial={editing} onSaved={handleSaved} />
    </MentorLayout>
  )
}

export default ResearcherPage
