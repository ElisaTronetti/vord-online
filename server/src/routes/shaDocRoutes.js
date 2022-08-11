const express = require('express');
const router = express.Router();
const controller = require('../controllers/shaDocController');
const clearance = require('../middleware/clearance')
const verifyEmails = require('../middleware/verifyEmails')

/*
    structures: 
        user:{          //the creator of the local file
            _id,
            email
        },

        sharedWith: [{  //array of users to which share the file
            email,
            role
        }],

        documentId

*/

//user, sharedWith, documentId (body)
router.post("/sharedDocuments/shareLocalDocument", verifyEmails, (req, res) => controller.shareLocalDocument(req, res));

//user, sharedWith, documentId (body)
router.post("/sharedDocuments/shareSharedDocument", clearance(3), verifyEmails, (req, res) => controller.shareSharedDocument(req, res));

//user, sharedWith, documentId (body)
router.post("/sharedDocuments/manageSharedGroup", clearance(3), verifyEmails, (req, res) => controller.manageSharedGroup(req, res));

//userid, documentid (simple header param)
router.get("/sharedDocuments/getSharedGroup", clearance(1), (req, res) => controller.getSharedGroup(req, res));

//userid, documentid (simple header param)
router.get("/sharedDocuments/getSharedDocument", clearance(1), (req, res) => controller.getSharedDocument(req, res));

//user, documentId, blocks (body)
router.post("/sharedDocuments/saveSharedDocument", clearance(2), (req, res) => controller.saveSharedDocument(req, res));

//user, documentId (body)
router.post("/sharedDocuments/deleteForMe", clearance(1), (req, res) => controller.deleteForMe(req, res));

//user, documentId (body)
router.post("/sharedDocuments/deleteForAll", clearance(3), (req, res) => controller.deleteForAll(req, res));

//user, folderId (body)
router.post("/sharedDocuments/deleteFolder", (req, res) => controller.deleteFolder(req, res));

module.exports = router;