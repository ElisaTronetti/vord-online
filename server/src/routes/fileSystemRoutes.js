const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileSystemController');
const auth = require("../middleware/auth");

//body param: _id (user id), token
router.get("/fileSystem/getUserFileSystem", auth, (req, res) => controller.getUserFileSystem(req, res));

//body param: _id (user id), token, fileSystem (the updated fileSystem structure)
router.post("/fileSystem/updateUserFileSystem", auth, (req, res) => controller.updateUserFileSystem(req, res));

//body param: _id (user id), token, title
router.post("/fileSystem/createNewDocument", auth, (req, res) => controller.createNewDocument(req, res));

//body param: userId, documentId
router.post("/fileSystem/deleteDocument", auth, (req, res) => controller.deleteDocument(req, res));

router.get("/fileSystem/getDocument", auth, (req, res) => controller.getDocument(req,res));

router.post("/fileSystem/saveDocument", auth, (req, res) => controller.saveDocument(req, res));

module.exports = router;