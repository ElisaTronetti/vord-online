const express = require('express');
const router = express.Router();
const controller = require('../controllers/shaDocController');

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
router.post("/sharedDocuments/shareLocalDocument",(req, res) => controller.shareLocalDocument(req, res));

//body param: documentId, email, role
router.post("/sharedDocuments/shareSharedDocument",(req, res) => controller.shareSharedDocument(req, res));

module.exports = router;