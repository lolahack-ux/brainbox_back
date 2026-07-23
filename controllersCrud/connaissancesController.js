const { nouvelleConnaissance, recuperationConnaissanceById, findAllConnaissances, findByTag } = require("../modelsCrud/connaissancesModel");

alimentationConnaissance = async (req, res) => {
  const {
    titre,
    type,
    technologies,
    contenu,
    description,
    projet,
    fichier,
    tags,
  } = req.body;

  if (!titre || !type || !contenu) {
    return res.status(400).json({
      message: "Les champs titre, type et contenu sont obligatoires",
    });
  }

  const nvConnaissance = {
    titre,
    type,
    technologies: technologies || [],
    contenu,
    description: description || "",
    projet: projet || "",
    fichier: fichier || null,
    tags: tags || [],
    date_ajout: new Date(),
    date_modification: new Date(),
  };

  try {
    const resultatAjout = await nouvelleConnaissance(nvConnaissance);

    return res.status(201).json({
      message: "Connaissance technique ajoutée avec succès",
      id: resultatAjout.insertedId,
      resultatAjout,
    });
  } catch (err) {
    console.error("Erreur MongoDB :", err);

    return res.status(500).json({
      message: "Erreur lors de l'ajout dans MongoDB",
      erreur: err.message,
    });
  }
};

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


getAllConnaissances = async (req, res) => {
  try {
   const recupConnaissance = await findAllConnaissances();
    if (recupConnaissance) {
      return res.status(200).json(recupConnaissance);
    } else {
      return res.status(404).json({ message: "Non trouvé" });
    }
  } catch (err) {
    return res.status(500).json({ message: "erreur" , erreur: err });
  }
};

getAlltags = async (req, res) => {
const { tag } = req.body;

  try {
   const recupByTag = await findByTag(tag);
    if (recupByTag) {
      return res.status(200).json(recupByTag);
    } else {
      return res.status(404).json({ message: "Non trouvé" });
    }
  } catch (err) {
    return res.status(500).json({ message: "erreur" , erreur: err });
  }
};

modifDocument = async (req, res) => {
  const {
    titre,
    type,
    technologies,
    contenu,
    description,
    projet,
    fichier,
    tags,
  } = req.body;

  const modifConnaissance = {
    titre,
    type,
    technologies: technologies || [],
    contenu,
    description: description || "",
    projet: projet || "",
    fichier: fichier || null,
    tags: tags || [],
    date_ajout: new Date(),
    date_modification: new Date(),
  };

  try {
    const resultatModif = await updateConnaissance(modifConnaissance);

    return res.status(201).json({
      message: "Connaissance technique modifié avec succès",
      id: resultatModif.insertedId,
      resultatModif,
    });
  } catch (err) {
    console.error("Erreur MongoDB :", err);

    return res.status(500).json({
      message: "Erreur lors de la modification dans MongoDB",
      erreur: err.message,
    });
  }
};

module.exports = { rechercheConnaissance, alimentationConnaissance, getAllConnaissances,getAlltags, modifDocument};

