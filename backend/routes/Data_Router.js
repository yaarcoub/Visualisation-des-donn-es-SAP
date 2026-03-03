

const express = require('express');
const router = express.Router();
const {NombreCommande
    ,Avancement_Projct,projects_info,ChifferAffaire
    ,ChiffreAffaireAnnuel,Delai} = require('../controllers/Data/SAP_Data');



router.route('/DataProvider/Projects').get(projects_info)
router.route('/DataProvider/Commande').get(NombreCommande)
router.route('/DataProvider/ChifferAffaire/:id').get(ChifferAffaire)
router.route('/DataProvider/ChiffreAffaireAnne').get(ChiffreAffaireAnnuel)
router.route('/DataProvider/DelaiLivraison').get(Delai)
router.route('/DataProvider/Avancement').get(Avancement_Projct)








module.exports = router ;