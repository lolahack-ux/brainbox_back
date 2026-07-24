const express = require("express");
const connaissanceController = require('../controllersCrud/connaissancesController');
const router = express.Router();



router.post('/alimentation', connaissanceController.alimentationConnaissance);
router.get('/connaissance', connaissanceController.rechercheConnaissance);
router.get('/allConnaissances', connaissanceController.getAllConnaissances);
router.get('/findByTag', connaissanceController.findByTag_);
router.put('/updatedoc/:id',connaissanceController.modifDocument);

router.post('/assistant', connaissanceController.getAssistant);


router.get('/getAllTags', connaissanceController.getAllTags_);

module.exports = router;