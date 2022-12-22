const { getUser, createUser, authenticateUser, deleteUser } = require('../controllers/users');
const protectRoute = require('../middleware/protectRoute');
const router = require('express').Router();

router.get('/', protectRoute, getUser);
router.post('/register', createUser);
router.post('/login', authenticateUser);
router.delete('/delete', protectRoute, deleteUser);

module.exports = router;