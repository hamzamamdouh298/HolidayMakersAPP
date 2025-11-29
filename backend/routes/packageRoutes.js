const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.post('/', packageController.createPackage);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

module.exports = router;

