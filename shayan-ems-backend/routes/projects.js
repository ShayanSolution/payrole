import express from 'express'
import Project from '../controllers/projects.js'
const router = express.Router()

// Projects Crud
router.get('/', Project.getProjects)

export default router
