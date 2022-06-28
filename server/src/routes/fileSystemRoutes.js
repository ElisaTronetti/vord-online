const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileSystemController');

router.get("/fileSystem/getUserFileSystem",(req, res) => controller.getUserFileSystem(req, res));
router.post("/fileSystem/updateUserFileSystem",(req, res) => controller.updateUserFileSystem(req, res));


module.exports = router;