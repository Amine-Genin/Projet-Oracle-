import { Schema, model } from 'mongoose'

const ReportSchema = new Schema({
  titre: { type: String, required: true },
  objectif: { type: String },
  protocole: { type: String },
  observations: { type: String },
  conclusion: { type: String },
  projetId: { type: String, required: true },
  chercheurId: { type: String, required: true },
  dateExperience: { type: Date },
  statut: {
    type: String,
    enum: ['brouillon', 'soumis', 'validé'],
    default: 'brouillon'
  },
  resultats: { type: Schema.Types.Mixed }
}, { timestamps: true })

export const Report = model('Report', ReportSchema)
export default Report
