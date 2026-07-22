const { findUserByMailAndPassword } = require('../modelsCrud/rechercheModel');

rechercheConnaissance = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await connexion
      .db("brainboxlola")
      .collection("connaissances_techniques")
      .findOne({
        _id: new ObjectId(id),
      });

    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Non trouvé" });
    }
  } catch (err) {
    return res.status(500).json({ erreur: err });
  }
};