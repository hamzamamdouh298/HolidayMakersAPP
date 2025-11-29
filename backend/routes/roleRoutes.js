const express = require('express');
const router = express.Router();
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/roleController');
const { protect, checkPermission } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(checkPermission('viewRoles'), getRoles)
  .post(checkPermission('createRoles'), createRole);

router
  .route('/:id')
  .get(checkPermission('viewRoles'), getRole)
  .put(checkPermission('editRoles'), updateRole)
  .delete(checkPermission('deleteRoles'), deleteRole);

module.exports = router;

