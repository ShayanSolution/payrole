import express from 'express'
import Suggestion from '../controllers/suggestion.js'
const router = express.Router()

// Suggestion Crud
router.post('/', Suggestion.getallSuggestions)
router.get('/:id', Suggestion.getSuggestions)
router.post('/create-suggestion/:id', Suggestion.createSuggestions)
router.delete('/:suggestionId', Suggestion.deleteSuggestion)
router.put('/:suggestionId', Suggestion.updateSuggestion)

export default router
