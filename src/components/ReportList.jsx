import React from 'react'
import { Alert, Badge, Button, Card } from 'react-bootstrap'

const statutVariant = {
  brouillon: 'secondary',
  soumis: 'warning',
  valide: 'success',
  'validé': 'success'
}

const ReportList = ({ reports, projects, onEdit, onDelete, onSubmit, error }) => {
  if (error) return <Alert variant="danger">{error}</Alert>

  if (!reports.length) {
    return (
      <Card className="empty-state">
        <Card.Body>
          <h5>Aucun rapport</h5>
          <p>Créer un nouveau rapport pour commencer le suivi des expériences.</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <div className="report-list">
      {reports.map((report) => {
        const id = report._id || report.id
        const project = projects.find((item) => String(item.id) === String(report.projetId))
        const isDraft = report.statut === 'brouillon'

        return (
          <Card key={id} className="report-card">
            <Card.Body>
              <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <h5 className="mb-0">{report.titre}</h5>
                    <Badge bg={statutVariant[report.statut] || 'light'} text={report.statut === 'soumis' ? 'dark' : undefined}>
                      {report.statut}
                    </Badge>
                  </div>
                  <p className="text-muted mb-2">{report.objectif}</p>
                  <div className="report-meta">
                    <span>Projet: {project?.name || report.projetId}</span>
                    <span>Chercheur: {report.chercheurId}</span>
                    <span>Date: {report.dateExperience ? new Date(report.dateExperience).toLocaleDateString('fr-FR') : 'Non definie'}</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => onEdit(report)} disabled={!isDraft}>
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => onDelete(id)} disabled={!isDraft}>
                    Supprimer
                  </Button>
                  <Button size="sm" variant="success" onClick={() => onSubmit(id)} disabled={!isDraft}>
                    Soumettre
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        )
      })}
    </div>
  )
}

export default ReportList
