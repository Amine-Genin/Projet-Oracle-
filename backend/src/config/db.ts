import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || ''

export const connectDb = async () => {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in environment')
    process.exit(1)
  }
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  }
}

export default connectDb
