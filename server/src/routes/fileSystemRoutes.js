const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileSystemController');
const auth = require("../middleware/auth");

//body param: _id (user id)
router.get("/fileSystem/getUserFileSystem", auth, (req, res) => controller.getUserFileSystem(req, res));

//body param: _id (user id), fileMap (the updated fileSystem structure)
router.post("/fileSystem/updateUserFileSystem", auth, (req, res) => controller.updateUserFileSystem(req, res));

//body param: _id (user id), title, time, parent (the id of the folder in fileMap in wich the file will be positioned)
router.post("/fileSystem/createNewDocument", auth, (req, res) => controller.createNewDocument(req, res));

module.exports = router;