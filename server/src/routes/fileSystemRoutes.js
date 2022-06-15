const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileSystemController');

router.get("/fileSystem/getUserFileSystem",(req, res) => controller.getUserFileSystem(req, res));


module.exports = router;