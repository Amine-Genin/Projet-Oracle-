import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { projects } from '../data/oracleMockData'
import { createReport, updateReport } from '../services/api'

const emptyReport = {
  titre: '',
  objectif: '',
  protocole: '',
  resultats: '',
  observations: '',
  conclusion: '',
  projetId: '',
  chercheurId: '1',
  dateExperience: '',
  statut: 'brouillon'
}

const ReportForm = ({ show, onHide, initial, onSaved }) => {
  const defaultProjectId = useMemo(() => String(projects[0]?.id || ''), [])
  const [form, setForm] = useState({ ...emptyReport, projetId: defaultProjectId })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initial) {
      setForm({
        ...emptyReport,
        ...initial,
        projetId: String(initial.projetId || defaultProjectId),
        chercheurId: String(initial.chercheurId || '1'),
        dateExperience: initial.dateExperience ? String(initial.dateExperience).split('T')[0] : '',
        statut: initial.statut || 'brouillon'
      })
    } else {
      setForm({ ...emptyReport, projetId: defaultProjectId })
    }
    setError(null)
  }, [initial, show, defaultProjectId])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.titre.trim()) {
      setError('Le titre est obligatoire.')
      return
    }

    if (!form.objectif.trim()) {
      setError("L'objectif est obligatoire.")
      return
    }

    try {
      setSaving(true)
      setError(null)
      const payload = {
        ...form,
        projetId: form.projetId || defaultProjectId,
        chercheurId: form.chercheurId || '1',
        statut: form.statut || 'brouillon'
      }

      if (payload._id || payload.id) {
        await updateReport(payload._id || payload.id, payload)
      } else {
        await createReport(payload)
      }

      onSaved()
      onHide()
    } catch (err) {
      setError(err.message || 'Impossible de sauvegarder le rapport.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{form._id || form.id ? 'Modifier le rapport' : 'Nouveau rapport'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control name="titre" value={form.titre} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Date d'expérience</Form.Label>
                <Form.Control type="date" name="dateExperience" value={form.dateExperience} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Projet</Form.Label>
                <Form.Select name="projetId" value={form.projetId} onChange={handleChange}>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Chercheur</Form.Label>
                <Form.Control name="chercheurId" value={form.chercheurId} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Objectif</Form.Label>
            <Form.Control as="textarea" rows={2} name="objectif" value={form.objectif} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Protocole</Form.Label>
            <Form.Control as="textarea" rows={2} name="protocole" value={form.protocole} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Résultats</Form.Label>
            <Form.Control as="textarea" rows={2} name="resultats" value={form.resultats} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observations</Form.Label>
            <Form.Control as="textarea" rows={2} name="observations" value={form.observations} onChange={handleChange} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Conclusion</Form.Label>
            <Form.Control as="textarea" rows={2} name="conclusion" value={form.conclusion} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide} disabled={saving}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ReportForm
