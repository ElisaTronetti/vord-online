const express = require('express');
const router = express.Router();
const controller = require('../controllers/shaDocController');
const clearance = require('../middleware/clearance')
const verifyEmails = require('../middleware/verifyEmails')

/*
    body params: 
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
router.post("/sharedDocuments/shareLocalDocument", verifyEmails, (req, res) => controller.shareLocalDocument(req, res));

//body param: same as before
router.post("/sharedDocuments/shareSharedDocument", clearance(3), verifyEmails, (req, res) => controller.shareSharedDocument(req, res));

router.post("/sharedDocuments/manageSharedGroup", clearance(3), verifyEmails, (req, res) => controller.manageSharedGroup(req, res));

router.get("/sharedDocuments/getSharedGroup", clearance(1), (req, res) => controller.getSharedGroup(req, res));

module.exports = router;