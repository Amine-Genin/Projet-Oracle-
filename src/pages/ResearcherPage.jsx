import React, { useEffect, useMemo, useState } from 'react'
import { Row, Col, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap'
import MentorLayout from '../components/MentorLayout'
import ReportForm from '../components/ReportForm'
import { deleteReport, getAffectations, getChercheurs, getProjets, getReports, submitReport } from '../services/api'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('rl_user') || 'null')
  } catch (err) {
    return null
  }
}

const normalize = (value) => String(value || '').trim().toLowerCase()

const getResearcherName = (researcher) => {
  if (!researcher) return ''
  return `${researcher.prenom || ''} ${researcher.nom || ''}`.trim() || researcher.email || ''
}

const getProjectName = (project) => project?.intitule || project?.id || ''

const isValidated = (statut) => statut === 'validé' || statut === 'valide' || statut === 'validÃ©'

const ResearcherPage = () => {
  const storedUser = useMemo(() => getStoredUser(), [])

  const [reports, setReports] = useState([])
  const [chercheurs, setChercheurs] = useState([])
  const [projets, setProjets] = useState([])
  const [affectations, setAffectations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const currentResearcher = useMemo(() => {
    const matchedOracleResearcher = chercheurs.find((item) => normalize(item.email) === normalize(storedUser?.email))

    return matchedOracleResearcher || {
      id: storedUser?.email,
      nom: storedUser?.nom || '',
      prenom: storedUser?.prenom || '',
      email: storedUser?.email || ''
    }
  }, [chercheurs, storedUser])

  const currentResearcherId = String(currentResearcher?.id || '')

  const assignedProjects = useMemo(() => {
    const assignedIds = affectations
      .filter((item) => String(item.chercheurId) === currentResearcherId)
      .map((item) => String(item.projetId))

    return projets.filter((project) => assignedIds.includes(String(project.id)))
  }, [affectations, projets, currentResearcherId])

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const [chercheursData, projetsData, affectationsData, allReports] = await Promise.all([
        getChercheurs(),
        getProjets(),
        getAffectations(),
        getReports()
      ])

      setChercheurs(chercheursData)
      setProjets(projetsData)
      setAffectations(affectationsData)
      setReports(allReports)
    } catch (err) {
      setError(err.message || 'Impossible de charger les données Oracle.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const visibleReports = useMemo(() => {
    return reports.filter((report) => String(report.chercheurId) === currentResearcherId)
  }, [reports, currentResearcherId])

  const handleNew = () => { setEditing(null); setShowForm(true) }
  const handleEdit = (report) => { setEditing(report); setShowForm(true) }
  const handleSaved = () => {
    setSuccess('Rapport sauvegardé !')
    load()
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) return
    try {
      setError(null)
      await deleteReport(id)
      setSuccess('Rapport supprimé !')
      load()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
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
      setError(err.message)
    }
  }

  const draftCount = visibleReports.filter((report) => report.statut === 'brouillon').length
  const submittedCount = visibleReports.filter((report) => report.statut === 'soumis').length
  const validatedCount = visibleReports.filter((report) => isValidated(report.statut)).length

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'brouillon': return <Badge bg="secondary">Brouillon</Badge>
      case 'soumis': return <Badge bg="warning" text="dark">Soumis</Badge>
      case 'validé':
      case 'valide':
      case 'validÃ©': return <Badge bg="success">Validé</Badge>
      default: return <Badge bg="light" text="dark">{statut}</Badge>
    }
  }

  const isKnownResearcher = chercheurs.some((item) => normalize(item.email) === normalize(storedUser?.email))

  return (
    <MentorLayout title="Espace Chercheur" subtitle="Gérez vos projets et rapports d'expériences">
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

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
              <h5 className="text-primary">{visibleReports.length}</h5>
              <small className="text-muted">Total</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="research-toolbar d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0">Mes Rapports d'Expériences</h4>
          <small className="text-muted">{getResearcherName(currentResearcher)}</small>
        </div>
        <Button className="mentor-action-button" variant="primary" onClick={handleNew} disabled={!assignedProjects.length}>
          + Nouveau rapport
        </Button>
      </div>

      {!loading && !isKnownResearcher && (
        <Alert variant="warning">
          Votre email n'est pas enregistré dans Oracle. Connectez-vous avec un chercheur existant
          (ex. alice.dupont@laboratoire.test).
        </Alert>
      )}

      {!loading && isKnownResearcher && !assignedProjects.length && (
        <Alert variant="warning">
          Aucun projet n'est affecté à ce chercheur dans Oracle.
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : visibleReports.length === 0 ? (
        <Card className="empty-research-card py-5 text-center">
          <Card.Body>
            <p className="text-muted mb-0">Aucun rapport pour le moment.</p>
            <small className="text-muted">Créez votre premier rapport en cliquant sur le bouton ci-dessus.</small>
          </Card.Body>
        </Card>
      ) : (
        <div className="research-report-list">
          {visibleReports.map((report) => {
            const project = projets.find((item) => String(item.id) === String(report.projetId))

            return (
              <div key={report._id || report.id} className="research-report-item">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-bold">{report.titre}</h6>
                    <p className="text-muted small mb-1">{report.objectif}</p>
                    <div className="research-report-meta small">
                      <span className="text-muted">Projet:</span> {getProjectName(project) || report.projetId} |{' '}
                      <span className="text-muted">Date:</span> {report.dateExperience ? new Date(report.dateExperience).toLocaleDateString('fr-FR') : 'N/A'}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="mb-2">{getStatutBadge(report.statut)}</div>
                    <div className="btn-group btn-group-sm research-actions" role="group">
                      {report.statut === 'brouillon' && (
                        <>
                          <Button size="sm" variant="outline-primary" onClick={() => handleEdit(report)}>Éditer</Button>
                          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(report._id || report.id)}>Supprimer</Button>
                          <Button size="sm" variant="success" onClick={() => handleSubmit(report._id || report.id)}>Soumettre</Button>
                        </>
                      )}
                      {report.statut !== 'brouillon' && (
                        <Button size="sm" variant="outline-secondary" disabled>Lecture seule</Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ReportForm
        show={showForm}
        onHide={() => setShowForm(false)}
        initial={editing}
        onSaved={handleSaved}
        currentResearcher={currentResearcher}
        assignedProjects={assignedProjects}
      />
    </MentorLayout>
  )
}

export default ResearcherPage
