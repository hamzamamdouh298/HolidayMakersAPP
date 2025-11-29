const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  bulkDeleteUsers
} = require('../controllers/userController');
const { protect, checkPermission } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(checkPermission('viewUsers'), getUsers)
  .post(checkPermission('createUsers'), createUser);

router.post('/bulk-delete', checkPermission('deleteUsers'), bulkDeleteUsers);

router
  .route('/:id')
  .get(checkPermission('viewUsers'), getUser)
  .put(checkPermission('editUsers'), updateUser)
  .delete(checkPermission('deleteUsers'), deleteUser);

module.exports = router;

