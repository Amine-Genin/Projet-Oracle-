import React, { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MentorLayout from '../components/MentorLayout'

const LoginPage = () => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'chercheur'
  })
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // L'utilisateur connecte reste disponible dans toute l'application via localStorage.
    const user = {
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      email: form.email.trim(),
      role: form.role
    }

    localStorage.setItem('rl_user', JSON.stringify(user))
    navigate(user.role === 'chercheur' ? '/chercheur' : '/directeur')
  }

  return (
    <MentorLayout title="Connexion" subtitle="Renseignez vos informations pour accéder à votre espace.">
      <Card className="login-card mx-auto">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control name="nom" value={form.nom} onChange={handleChange} autoFocus required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control name="prenom" value={form.prenom} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Rôle</Form.Label>
              <Form.Select name="role" value={form.role} onChange={handleChange}>
                <option value="directeur">Directeur de labo</option>
                <option value="chercheur">Chercheur</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" className="w-100">
              Se connecter
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </MentorLayout>
  )
}

export default LoginPage
