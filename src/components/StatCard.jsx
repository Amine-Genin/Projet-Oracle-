import React from 'react'
import { Card } from 'react-bootstrap'

const StatCard = ({ title, value, label, color = 'primary' }) => {
  return (
    <Card className={`admin-stat-card admin-stat-${color} h-100`}>
      <Card.Body>
        <div className="admin-stat-title">{title}</div>
        <div className="admin-stat-value">{value}</div>
        {label && <div className="text-muted small">{label}</div>}
      </Card.Body>
    </Card>
  )
}

export default StatCard
