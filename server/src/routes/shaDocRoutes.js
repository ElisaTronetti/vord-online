const express = require('express');
const router = express.Router();
const controller = require('../controllers/shaDocController');

/*
    body params: 
        user:{          //the creator of the local file
            _id,
            email,
        },

        sharedWith: {
            _id,
            email,
            role
        },

        documentId

*/
router.post("/auth/shareLocalDocument",(req, res) => controller.shareLocalDocument(req, res));

module.exports = router;