const { getShows, createShow, deleteShow } = require('../controllers/shows');
const protectRoute = require('../middleware/protectRoute');
const router = require('express').Router();

router.get('/', protectRoute, getShows);
router.post('/', protectRoute, createShow);
router.delete('/delete/:title', protectRoute, deleteShow);

module.exports = router;