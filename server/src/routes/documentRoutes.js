const express = require('express');
const router = express.Router();
const controller = require('../controllers/documentController');
const auth = require("../middleware/auth");

//body param: _id (user id), token, title, time, originalDocumentId
router.post("/document/createNewDocument", auth, (req, res) => controller.createNewDocument(req, res));

//body param: userId, documentId
router.post("/document/deleteDocument", auth, (req, res) => controller.deleteDocument(req, res));

router.get("/document/getDocument", auth, (req, res) => controller.getDocument(req,res));

router.post("/document/saveDocument", auth, (req, res) => controller.saveDocument(req, res));

module.exports = router;