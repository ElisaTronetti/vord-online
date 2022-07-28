const express = require('express');
const router = express.Router();
const controller = require('../controllers/shaDocController');
const clearance = require('../middleware/clearance')

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
router.post("/sharedDocuments/shareLocalDocument",  (req, res) => controller.shareLocalDocument(req, res));

//body param: same as before
router.post("/sharedDocuments/shareSharedDocument", clearance(2), (req, res) => controller.shareSharedDocument(req, res));

module.exports = router;