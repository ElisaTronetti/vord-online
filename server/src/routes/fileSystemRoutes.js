const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileSystemController');
const auth = require("../middleware/auth");

//body param: _id (user id), token
router.get("/fileSystem/getUserFileSystem", auth, (req, res) => controller.getUserFileSystem(req, res));

//body param: _id (user id), token, fileSystem (the updated fileSystem structure)
router.post("/fileSystem/updateUserFileSystem", auth, (req, res) => controller.updateUserFileSystem(req, res));

module.exports = router;