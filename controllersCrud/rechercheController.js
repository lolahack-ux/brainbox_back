const { recuperationConnaissanceById } = require('../modelsCrud/rechercheModel');

rechercheConnaissance = async (req, res) => {
  const { id } = req.body;
  try {
   const recupConnaissance = await recuperationConnaissanceById(id);
    if (recupConnaissance) {
      return res.status(200).json(recupConnaissance);
    } else {
      return res.status(404).json({ message: "Non trouvé" });
    }
  } catch (err) {
    return res.status(500).json({ message: "erreur" , erreur: err });
  }
};

module.exports = {rechercheConnaissance};
