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
router.post("/sharedDocuments/shareSharedDocument", clearance(2), verifyEmails, (req, res) => controller.shareSharedDocument(req, res));

module.exports = router;