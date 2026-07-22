const express = require("express");
const rechercheController = require('../controllersCrud/rechercheController');
const router = express.Router();

router.get('/connaissance', rechercheController.rechercheConnaissance);

module.exports = router