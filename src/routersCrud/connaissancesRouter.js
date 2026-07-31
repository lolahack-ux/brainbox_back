const express = require("express");
const connaissanceController = require('../controllersCrud/connaissancesController');
const router = express.Router();


// Route pour ajouter de nouvelles connaissances
router.post('/alimentation', connaissanceController.alimentationConnaissance);
// Route pour rechercher des connaissances par id
router.get('/connaissance', connaissanceController.rechercheConnaissance);
// Route pour voir toutes les connaissances
router.get('/allConnaissances', connaissanceController.getAllConnaissances);
// Route pour modifier les connaissances grace à l'id
router.put('/updatedoc/:id',connaissanceController.modifDocument);
// Routes pour interroger l'assistant
router.post('/assistant', connaissanceController.getAssistant);

router.get('/getAllTags', connaissanceController.getAllTags_);
// Route pour 
// router.get('/findByTag', connaissanceController.findByTag_);

module.exports = router; 