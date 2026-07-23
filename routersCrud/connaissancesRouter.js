const express = require("express");
const connaissanceController = require('../controllersCrud/connaissancesController');
const router = express.Router();



router.post('/alimentation', connaissanceController.alimentationConnaissance);
router.get('/connaissance', connaissanceController.rechercheConnaissance);
router.get('/allConnaissances', connaissanceController.getAllConnaissances);
router.get('/alltags', connaissanceController.getAlltags);
router.put('/updatedoc/:id',connaissanceController.modifDocument);

module.exports = router;

module.exports = router