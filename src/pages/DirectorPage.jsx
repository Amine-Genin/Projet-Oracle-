import React, { useEffect, useMemo, useState } from 'react'
import { Row, Col, Card, Table, Badge, Button, Alert, Spinner, Form, Modal } from 'react-bootstrap'
import AdminLayout from '../components/AdminLayout'
import StatCard from '../components/StatCard'
import {
  getReports,
  statsByStatus,
  productiveResearchers,
  validateReport,
  getChercheurs,
  createChercheur,
  updateChercheur,
  deleteChercheur,
  getProjets,
  createProjet,
  updateProjet,
  deleteProjet,
  getEquipements,
  createEquipement,
  updateEquipement,
  deleteEquipement,
  getAffectations,
  createAffectation,
  deleteAffectation,
  getReservations,
  createReservation,
  deleteReservation,
  getStatsProjetsActifs,
  getStatsProjetsChercheurs
} from '../services/api'

const sections = [
  { key: 'dashboard', label: 'Tableau de bord', icon: '📊' },
  { key: 'rapports', label: 'Rapports MongoDB', icon: '📝' },
  { key: 'chercheurs', label: 'Gestion des chercheurs', icon: '👩‍🔬' },
  { key: 'projets', label: 'Gestion des projets', icon: '📁' },
  { key: 'equipements', label: 'Gestion des équipements', icon: '🔬' },
  { key: 'affectations', label: 'Affectations chercheurs-projets', icon: '🔗' },
  { key: 'reservations', label: 'Réservations équipements-projets', icon: '📅' }
]

const emptyForms = {
  chercheur: { nom: '', prenom: '', email: '', grade: '', specialite: '' },
  projet: { intitule: '', dateDebut: '', dateFin: '', budget: '', statut: 'en cours', specialite: '' },
  equipement: { designation: '', reference: '', etat: 'disponible' },
  affectation: { chercheurId: '', projetId: '', dateAffectation: '', roleProjet: '' },
  reservation: { equipementId: '', projetId: '', dateReservation: '', dateRetourPrevue: '', statutReservation: 'confirmée' }
}

const isValidated = (statut) => statut === 'valide' || statut === 'validé'

const DirectorPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [reports, setReports] = useState([])
  const [statsStatus, setStatsStatus] = useState([])
  const [productive, setProductive] = useState([])
  const [filter, setFilter] = useState('all')
  const [chercheurs, setChercheurs] = useState([])
  const [projets, setProjets] = useState([])
  const [equipements, setEquipements] = useState([])
  const [affectations, setAffectations] = useState([])
  const [reservations, setReservations] = useState([])
  const [statsActifs, setStatsActifs] = useState([])
  const [statsProjetsChercheurs, setStatsProjetsChercheurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [modal, setModal] = useState({ show: false, type: null, mode: 'create', data: {} })

  const loadReports = async () => {
    const [allReports, statusStats, prodResearchers] = await Promise.all([
      getReports(),
      statsByStatus(),
      productiveResearchers()
    ])
    setReports(allReports)
    setStatsStatus(statusStats)
    setProductive(prodResearchers)
  }

  const loadOracle = async () => {
    const [
      chercheursData,
      projetsData,
      equipementsData,
      affectationsData,
      reservationsData,
      actifsData,
      projetsChercheursData
    ] = await Promise.all([
      getChercheurs(),
      getProjets(),
      getEquipements(),
      getAffectations(),
      getReservations(),
      getStatsProjetsActifs(),
      getStatsProjetsChercheurs()
    ])

    setChercheurs(chercheursData)
    setProjets(projetsData)
    setEquipements(equipementsData)
    setAffectations(affectationsData)
    setReservations(reservationsData)
    setStatsActifs(actifsData)
    setStatsProjetsChercheurs(projetsChercheursData)
  }

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      await Promise.all([loadReports(), loadOracle()])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const showSuccess = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleValidate = async (id) => {
    try {
      setError(null)
      await validateReport(id)
      showSuccess('Rapport validé !')
      await loadReports()
    } catch (err) {
      setError(err.message)
    }
  }

  const openModal = (type, mode = 'create', data = {}) => {
    setModal({
      show: true,
      type,
      mode,
      data: { ...emptyForms[type], ...data }
    })
  }

  const closeModal = () => {
    setModal({ show: false, type: null, mode: 'create', data: {} })
  }

  const updateModalField = (name, value) => {
    setModal((current) => ({
      ...current,
      data: { ...current.data, [name]: value }
    }))
  }

  const handleModalSubmit = async (event) => {
    event.preventDefault()

    try {
      setError(null)
      const { type, mode, data } = modal
      const payload = type === 'projet' ? { ...data, budget: Number(data.budget) || 0 } : data

      if (type === 'chercheur') {
        mode === 'edit' ? await updateChercheur(data.id, payload) : await createChercheur(payload)
        await loadOracle()
        showSuccess('Chercheur enregistré.')
      }

      if (type === 'projet') {
        mode === 'edit' ? await updateProjet(data.id, payload) : await createProjet(payload)
        await loadOracle()
        showSuccess('Projet enregistré.')
      }

      if (type === 'equipement') {
        mode === 'edit' ? await updateEquipement(data.id, payload) : await createEquipement(payload)
        await loadOracle()
        showSuccess('Équipement enregistré.')
      }

      if (type === 'affectation') {
        await createAffectation(payload)
        await loadOracle()
        showSuccess('Affectation créée.')
      }

      if (type === 'reservation') {
        await createReservation(payload)
        await loadOracle()
        showSuccess('Réservation créée.')
      }

      closeModal()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm('Confirmer la suppression ?')) return

    try {
      setError(null)
      if (type === 'chercheur') await deleteChercheur(id)
      if (type === 'projet') await deleteProjet(id)
      if (type === 'equipement') await deleteEquipement(id)
      if (type === 'affectation') await deleteAffectation(id)
      if (type === 'reservation') await deleteReservation(id)
      await loadOracle()
      showSuccess('Suppression effectuée.')
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatutBadge = (statut) => {
    if (statut === 'brouillon') return <Badge bg="secondary">brouillon</Badge>
    if (statut === 'soumis') return <Badge bg="warning" text="dark">soumis</Badge>
    if (isValidated(statut)) return <Badge bg="success">validé</Badge>
    if (statut === 'en cours') return <Badge bg="primary">en cours</Badge>
    if (statut === 'clôturé') return <Badge bg="dark">clôturé</Badge>
    return <Badge bg="light" text="dark">{statut}</Badge>
  }

  const filteredReports = reports.filter((report) => {
    if (filter === 'all') return true
    if (filter === 'validé') return isValidated(report.statut)
    return report.statut === filter
  })

  const submittedReports = reports.filter((report) => report.statut === 'soumis').length
  const validatedReports = reports.filter((report) => isValidated(report.statut)).length
  const progressRate = reports.length > 0 ? Math.round((validatedReports / reports.length) * 100) : 0

  const normalizedStatsStatus = statsStatus.map((item) => ({
    statut: isValidated(item.statut || item._id) ? 'validé' : item.statut || item._id,
    count: item.count || 0
  }))

  const sectionTitle = useMemo(() => {
    return sections.find((item) => item.key === activeSection)?.label || 'Tableau de bord'
  }, [activeSection])

  const findChercheur = (id) => {
    const chercheur = chercheurs.find((item) => item.id === id)
    return chercheur ? `${chercheur.prenom} ${chercheur.nom}` : id
  }

  const findProjet = (id) => projets.find((item) => item.id === id)?.intitule || id
  const findEquipement = (id) => equipements.find((item) => item.id === id)?.designation || id

  const renderDashboard = () => (
    <>
      <Row className="g-3 mb-4">
        <Col md={3}><StatCard title="Chercheurs" value={chercheurs.length} label="Oracle simulé" color="primary" /></Col>
        <Col md={3}><StatCard title="Projets" value={projets.length} label="Oracle simulé" color="info" /></Col>
        <Col md={3}><StatCard title="Équipements" value={equipements.length} label="Oracle simulé" color="success" /></Col>
        <Col md={3}><StatCard title="Rapports soumis" value={submittedReports} label="MongoDB" color="warning" /></Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={6}>
          <Card className="admin-panel-card h-100">
            <Card.Header><h6 className="mb-0">Projets actifs par spécialité</h6></Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light"><tr><th>Spécialité</th><th>Projets actifs</th><th>Budget engagé</th></tr></thead>
                <tbody>
                  {statsActifs.map((item) => (
                    <tr key={item.specialite}>
                      <td>{item.specialite}</td>
                      <td>{item.nombreProjetsActifs}</td>
                      <td>{Number(item.budgetTotalEngage).toLocaleString('fr-FR')} DH</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="admin-panel-card h-100">
            <Card.Header><h6 className="mb-0">Projets et chercheurs affectés</h6></Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light"><tr><th>Projet</th><th>Budget</th><th>Chercheurs</th></tr></thead>
                <tbody>
                  {statsProjetsChercheurs.map((item) => (
                    <tr key={item.projet}>
                      <td>{item.projet}</td>
                      <td>{Number(item.budget).toLocaleString('fr-FR')} DH</td>
                      <td>{item.nombreChercheursAffectes}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={4}><StatCard title="Rapports MongoDB" value={reports.length} label={`${progressRate}% validés`} color="primary" /></Col>
        <Col lg={4}>
          <Card className="admin-panel-card h-100">
            <Card.Header><h6 className="mb-0">Statuts des rapports</h6></Card.Header>
            <Card.Body>
              {normalizedStatsStatus.map((item) => (
                <div key={item.statut} className="d-flex justify-content-between border-bottom py-2">
                  <span>{getStatutBadge(item.statut)}</span>
                  <Badge bg="primary">{item.count}</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="admin-panel-card h-100">
            <Card.Header><h6 className="mb-0">Chercheurs productifs</h6></Card.Header>
            <Card.Body>
              {productive.length ? productive.map((item) => (
                <div key={item._id} className="d-flex justify-content-between border-bottom py-2">
                  <span>Chercheur #{item._id}</span>
                  <Badge bg="success">{item.count}</Badge>
                </div>
              )) : <p className="text-muted mb-0">Aucun chercheur productif.</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )

  const renderReports = () => (
    <Card className="admin-panel-card admin-table-card">
      <Card.Header>
        <div className="admin-table-toolbar d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Liste des rapports MongoDB</h6>
          <Form.Select className="admin-filter-select" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="brouillon">brouillon</option>
            <option value="soumis">soumis</option>
            <option value="validé">validé</option>
          </Form.Select>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0">
          <thead className="table-light"><tr><th>Titre</th><th>Chercheur</th><th>Projet</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report._id || report.id}>
                <td className="fw-bold">{report.titre}</td>
                <td>#{report.chercheurId}</td>
                <td>{findProjet(report.projetId)}</td>
                <td>{getStatutBadge(report.statut)}</td>
                <td>{report.dateExperience ? new Date(report.dateExperience).toLocaleDateString('fr-FR') : 'N/A'}</td>
                <td>
                  {report.statut === 'soumis' ? (
                    <Button size="sm" variant="success" onClick={() => handleValidate(report._id || report.id)}>Valider</Button>
                  ) : (
                    <span className="text-muted small">Lecture seule</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )

  const renderCrudTable = (type, title, rows, columns) => (
    <Card className="admin-panel-card admin-table-card">
      <Card.Header>
        <div className="admin-table-toolbar d-flex justify-content-between align-items-center">
          <h6 className="mb-0">{title}</h6>
          <Button size="sm" variant="primary" onClick={() => openModal(type)}>Ajouter</Button>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0">
          <thead className="table-light">
            <tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
                <td>
                  <div className="d-flex gap-2">
                    {(type === 'chercheur' || type === 'projet' || type === 'equipement') && (
                      <Button size="sm" variant="outline-primary" onClick={() => openModal(type, 'edit', row)}>Modifier</Button>
                    )}
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(type, row.id)}>Supprimer</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )

  const renderCurrentSection = () => {
    if (activeSection === 'dashboard') return renderDashboard()
    if (activeSection === 'rapports') return renderReports()
    if (activeSection === 'chercheurs') {
      return renderCrudTable('chercheur', 'Gestion des chercheurs', chercheurs, [
        { key: 'nom', label: 'Nom' },
        { key: 'prenom', label: 'Prénom' },
        { key: 'email', label: 'Email' },
        { key: 'grade', label: 'Grade' },
        { key: 'specialite', label: 'Spécialité' }
      ])
    }
    if (activeSection === 'projets') {
      return renderCrudTable('projet', 'Gestion des projets', projets, [
        { key: 'intitule', label: 'Intitulé' },
        { key: 'dateDebut', label: 'Début' },
        { key: 'dateFin', label: 'Fin' },
        { key: 'budget', label: 'Budget', render: (row) => `${Number(row.budget).toLocaleString('fr-FR')} DH` },
        { key: 'statut', label: 'Statut', render: (row) => getStatutBadge(row.statut) },
        { key: 'specialite', label: 'Spécialité' }
      ])
    }
    if (activeSection === 'equipements') {
      return renderCrudTable('equipement', 'Gestion des équipements', equipements, [
        { key: 'designation', label: 'Désignation' },
        { key: 'reference', label: 'Référence' },
        { key: 'etat', label: 'État' }
      ])
    }
    if (activeSection === 'affectations') {
      return renderCrudTable('affectation', 'Affectations chercheurs-projets', affectations, [
        { key: 'chercheurId', label: 'Chercheur', render: (row) => findChercheur(row.chercheurId) },
        { key: 'projetId', label: 'Projet', render: (row) => findProjet(row.projetId) },
        { key: 'dateAffectation', label: 'Date' },
        { key: 'roleProjet', label: 'Rôle projet' }
      ])
    }
    return renderCrudTable('reservation', 'Réservations équipements-projets', reservations, [
      { key: 'equipementId', label: 'Équipement', render: (row) => findEquipement(row.equipementId) },
      { key: 'projetId', label: 'Projet', render: (row) => findProjet(row.projetId) },
      { key: 'dateReservation', label: 'Réservation' },
      { key: 'dateRetourPrevue', label: 'Retour prévu' },
      { key: 'statutReservation', label: 'Statut' }
    ])
  }

  const renderModalFields = () => {
    if (!modal.type) return null
    const data = modal.data

    if (modal.type === 'chercheur') {
      return (
        <>
          <Form.Group className="mb-3"><Form.Label>Nom</Form.Label><Form.Control value={data.nom} onChange={(e) => updateModalField('nom', e.target.value)} required /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Prénom</Form.Label><Form.Control value={data.prenom} onChange={(e) => updateModalField('prenom', e.target.value)} required /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={data.email} onChange={(e) => updateModalField('email', e.target.value)} required /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Grade</Form.Label><Form.Control value={data.grade} onChange={(e) => updateModalField('grade', e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Spécialité</Form.Label><Form.Control value={data.specialite} onChange={(e) => updateModalField('specialite', e.target.value)} /></Form.Group>
        </>
      )
    }

    if (modal.type === 'projet') {
      return (
        <>
          <Form.Group className="mb-3"><Form.Label>Intitulé</Form.Label><Form.Control value={data.intitule} onChange={(e) => updateModalField('intitule', e.target.value)} required /></Form.Group>
          <Row>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Date de début</Form.Label><Form.Control type="date" value={data.dateDebut} onChange={(e) => updateModalField('dateDebut', e.target.value)} /></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Date de fin</Form.Label><Form.Control type="date" value={data.dateFin} onChange={(e) => updateModalField('dateFin', e.target.value)} /></Form.Group></Col>
          </Row>
          <Form.Group className="mb-3"><Form.Label>Budget</Form.Label><Form.Control type="number" value={data.budget} onChange={(e) => updateModalField('budget', e.target.value)} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Statut</Form.Label><Form.Select value={data.statut} onChange={(e) => updateModalField('statut', e.target.value)}><option value="en cours">en cours</option><option value="clôturé">clôturé</option><option value="prévu">prévu</option></Form.Select></Form.Group>
          <Form.Group><Form.Label>Spécialité</Form.Label><Form.Control value={data.specialite} onChange={(e) => updateModalField('specialite', e.target.value)} /></Form.Group>
        </>
      )
    }

    if (modal.type === 'equipement') {
      return (
        <>
          <Form.Group className="mb-3"><Form.Label>Désignation</Form.Label><Form.Control value={data.designation} onChange={(e) => updateModalField('designation', e.target.value)} required /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Référence</Form.Label><Form.Control value={data.reference} onChange={(e) => updateModalField('reference', e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>État</Form.Label><Form.Select value={data.etat} onChange={(e) => updateModalField('etat', e.target.value)}><option value="disponible">disponible</option><option value="en utilisation">en utilisation</option><option value="maintenance">maintenance</option></Form.Select></Form.Group>
        </>
      )
    }

    if (modal.type === 'affectation') {
      return (
        <>
          <Form.Group className="mb-3"><Form.Label>Chercheur</Form.Label><Form.Select value={data.chercheurId} onChange={(e) => updateModalField('chercheurId', e.target.value)} required><option value="">Sélectionner</option>{chercheurs.map((item) => <option key={item.id} value={item.id}>{item.prenom} {item.nom}</option>)}</Form.Select></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Projet</Form.Label><Form.Select value={data.projetId} onChange={(e) => updateModalField('projetId', e.target.value)} required><option value="">Sélectionner</option>{projets.map((item) => <option key={item.id} value={item.id}>{item.intitule}</option>)}</Form.Select></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Date d'affectation</Form.Label><Form.Control type="date" value={data.dateAffectation} onChange={(e) => updateModalField('dateAffectation', e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Rôle projet</Form.Label><Form.Control value={data.roleProjet} onChange={(e) => updateModalField('roleProjet', e.target.value)} /></Form.Group>
        </>
      )
    }

    return (
      <>
        <Form.Group className="mb-3"><Form.Label>Équipement</Form.Label><Form.Select value={data.equipementId} onChange={(e) => updateModalField('equipementId', e.target.value)} required><option value="">Sélectionner</option>{equipements.map((item) => <option key={item.id} value={item.id}>{item.designation} - {item.etat}</option>)}</Form.Select></Form.Group>
        <Form.Group className="mb-3"><Form.Label>Projet</Form.Label><Form.Select value={data.projetId} onChange={(e) => updateModalField('projetId', e.target.value)} required><option value="">Sélectionner</option>{projets.map((item) => <option key={item.id} value={item.id}>{item.intitule}</option>)}</Form.Select></Form.Group>
        <Row>
          <Col md={6}><Form.Group className="mb-3"><Form.Label>Date de réservation</Form.Label><Form.Control type="date" value={data.dateReservation} onChange={(e) => updateModalField('dateReservation', e.target.value)} /></Form.Group></Col>
          <Col md={6}><Form.Group className="mb-3"><Form.Label>Retour prévu</Form.Label><Form.Control type="date" value={data.dateRetourPrevue} onChange={(e) => updateModalField('dateRetourPrevue', e.target.value)} /></Form.Group></Col>
        </Row>
        <Form.Group><Form.Label>Statut de réservation</Form.Label><Form.Select value={data.statutReservation} onChange={(e) => updateModalField('statutReservation', e.target.value)}><option value="confirmée">confirmée</option><option value="en attente">en attente</option><option value="annulée">annulée</option></Form.Select></Form.Group>
      </>
    )
  }

  return (
    <AdminLayout title={sectionTitle} menuItems={sections} activeItem={activeSection} onSelectItem={setActiveSection}>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : renderCurrentSection()}

      <Modal show={modal.show} onHide={closeModal} size="lg" centered>
        <Form onSubmit={handleModalSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{modal.mode === 'edit' ? 'Modifier' : 'Ajouter'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{renderModalFields()}</Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={closeModal}>Annuler</Button>
            <Button type="submit" variant="primary">Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </AdminLayout>
  )
}

export default DirectorPage
