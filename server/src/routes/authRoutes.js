const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.post("/auth/signup",(req, res) => controller.signup(req, res));

router.post("/auth/login", (req, res) => controller.login(req, res));

module.exports = router;