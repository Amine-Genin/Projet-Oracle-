import React, { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MentorLayout from '../components/MentorLayout'

const LoginPage = () => {
  const [name, setName] = useState('')
  const [role, setRole] = useState('chercheur')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const user = { name: name.trim() || 'Utilisateur', role }
    localStorage.setItem('rl_user', JSON.stringify(user))
    navigate(role === 'chercheur' ? '/chercheur' : '/directeur')
  }

  return (
    <MentorLayout title="Connexion" subtitle="Choisissez un rôle pour accéder à votre espace.">
      <Card className="login-card mx-auto">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control value={name} onChange={(event) => setName(event.target.value)} autoFocus />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Rôle</Form.Label>
              <Form.Select value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="chercheur">Chercheur</option>
                <option value="directeur">Directeur de laboratoire</option>
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
