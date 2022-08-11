const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileSystemController');
const auth = require("../middleware/auth");

//body param: _id (user id), token
router.get("/fileSystem/getUserFileSystem", auth, (req, res) => controller.getUserFileSystem(req, res));

//body param: _id (user id), token, fileSystem (the updated fileSystem structure)
router.post("/fileSystem/updateUserFileSystem", auth, (req, res) => controller.updateUserFileSystem(req, res));

//body param: userId, parentId, name, token
router.post("/fileSystem/createFolder", auth, (req, res) => controller.createFolder(req, res));

//body param: userId, folderId, token
router.post("/fileSystem/deleteFolder", auth, (req, res) => controller.deleteFolder(req, res));

//body param: userId, elementId, destinationId, token
router.post("/fileSystem/moveElement", auth, (req, res) => controller.moveElement(req, res));

module.exports = router;