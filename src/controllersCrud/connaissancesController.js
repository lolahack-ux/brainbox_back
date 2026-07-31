const {
  nouvelleConnaissance,
  recuperationConnaissanceById,
  findAllConnaissances,
  // findByTag,
  updateConnaissance,
  findAllTags,
  findByTags
} = require("../modelsCrud/connaissancesModel");
const { ObjectId } = require("mongodb");
const axios = require("axios");

// Controller pour ajouter des connaissances utiliser dans la route post alimentation
const alimentationConnaissance = async (req, res) => {
  const {
    titre,
    type,
    technologies,
    code,
    description,
    projet,
    fichier,
    tags,
  } = req.body;
  

  if (!titre || !type) {
    return res.status(400).json({
      message: "Les champs titre, type et contenu sont obligatoires",
    });
  }

  const nvConnaissance = {
    titre,
    type,
    technologies: technologies || [],
    code : code || null,
    description: description || "",
    projet: projet || "",
    fichier: fichier || null,
    tags: tags || [],
    date_ajout: new Date(),
    date_modification: new Date(),
  };

  try {
    // Attendre la réponse du Model nouvelleConnaissance
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

// Controller pour ajouter des connaissances utiliser dans la route get connaissance
const rechercheConnaissance = async (req, res) => {
  const { id } = req.query;
  try {
      if (!id) {
    return res.status(400).json({
      message: "L'identifiant est obligatoire",
    });
    }
    // Attendre la réponse du Model recuperationConnaissanceById
    const recupConnaissance = await recuperationConnaissanceById(id);
    if (recupConnaissance) {
      return res.status(200).json(recupConnaissance);
    } else {
      return res.status(404).json({ message: "Non trouvé" });
    }
  } catch (err) {
    return res.status(500).json({ message: "erreur", erreur: err });
  }
};

// Controller pour ajouter des connaissances utiliser dans la route get Allconnaissance
const getAllConnaissances = async (req, res) => {
  try {
    // Attendre la réponse du Model findAllConnaissances
    const recupConnaissance = await findAllConnaissances();
    if (recupConnaissance) {
      return res.status(200).json(recupConnaissance);
    } else {
      return res.status(404).json({ message: "Non trouvé" });
    }
  } catch (err) {
    return res.status(500).json({ message: "erreur", erreur: err });
  }
};

// Controller pour ajouter des connaissances utiliser dans la route get findbyTag
// findByTag_ = async (req, res) => {
//   const { tag } = req.body;

//   try {
//     // Attendre la réponse du Model findByTag
//     const recupByTag = await findByTag(tag);
//     if (recupByTag) {
//       return res.status(200).json(recupByTag);
//     } else {
//       return res.status(404).json({ message: "Non trouvé" });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: "erreur", erreur: err });
//   }
// };

const modifDocument = async (req, res) => {
  const { id } = req.params;

  const {
    titre,
    type,
    technologies,
    code,
    description,
    projet,
    fichier,
    tags,
  } = req.body;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Identifiant MongoDB invalide",
      });
    }

    const modifConnaissance = {
      titre,
      type,
      technologies,
      code,
      description,
      projet,
      fichier,
      tags,
      date_modification: new Date(),
    };

    // Supprime les champs qui valent undefined.
    Object.keys(modifConnaissance).forEach((champ) => {
      if (modifConnaissance[champ] === undefined) {
        delete modifConnaissance[champ];
      }
    });

    const resultatModif = await updateConnaissance(id, modifConnaissance);

    if (resultatModif.matchedCount === 0) {
      return res.status(404).json({
        message: "Aucune connaissance trouvée avec cet identifiant",
      });
    }

    if (resultatModif.modifiedCount === 0) {
      return res.status(200).json({
        message: "Document trouvé, mais aucune modification n'était nécessaire",
      });
    }

    return res.status(200).json({
      message: "Connaissance technique modifiée avec succès",
      resultat: {
        matchedCount: resultatModif.matchedCount,
        modifiedCount: resultatModif.modifiedCount,
      },
    });
  } catch (err) {
    console.error("Erreur MongoDB :", err);

    return res.status(500).json({
      message: "Erreur lors de la modification dans MongoDB",
      erreur: err.message,
    });
  }
};

const getAssistant = async (req, res) => {
  let { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({
      message: "Le champ question est obligatoire",
    });
  }

  try {
    const questionInitiale = question;

    question = new Set(
      question
        .toLowerCase()
        .replace(/[?!.,;:]/g, "")
        .split(" ")
        .filter((mot) => mot !== "")
    );

    const tagList = await findAllTags();

    const tagsPertinents = question.intersection(tagList);

    console.log("Mots de la question :", question);
    console.log("Tags de la base :", tagList);
    console.log("Intersection :", tagsPertinents);

    if (tagsPertinents.size === 0) {
      return res.status(404).json({
        message: "Aucun tag pertinent trouvé dans la question",
      });
    }

    const recupByTag = await findByTags(
      Array.from(tagsPertinents)
    );

    if (!recupByTag || recupByTag.length === 0) {
      return res.status(404).json({
        message: "Aucune connaissance trouvée avec ce tag",
      });
    }

    const prompt = `
Tu es l'assistant de BrainBox.

Voici les seules connaissances que tu peux utiliser :
${JSON.stringify(recupByTag, null, 2)}

Question de l'utilisateur :
"${questionInitiale}"

Réponds directement et simplement à la question.

Règles :
- utilise uniquement les informations fournies ci-dessus ;
- lorsqu'une commande pertinente existe dans le champ "code", donne cette commande ;
- n'ajoute aucune information extérieure ;
- si aucune connaissance ne permet réellement de répondre, indique :
  "Je n'ai pas assez d'informations dans BrainBox pour répondre."
`;

    console.log(prompt);

    const reponseOllama = await axios.post(
  "http://langage:11434/api/generate",
  {
    model: "llama3.2",
    prompt: prompt,
    stream: false,
  }
);

    return res.status(200).json({
      tags: Array.from(tagsPertinents),
      connaissances: recupByTag,
      reponse_ia: reponseOllama.data.response,
    });
  } catch (err) {
    console.error(
      "Erreur assistant :",
      err.response?.data || err.message
    );

    return res.status(500).json({
      message: "Erreur lors de l'appel à l'assistant",
      erreur: err.response?.data || err.message,
    });
  }
};

const getAllTags_ = async (req, res) => {

  try {
    const tags = await findAllTags();
    if (tags) {
      return res.status(200).json(tags);
    } else {
      return res.status(404).json({ message: "Non trouvé" });
    }
  } catch (err) {
    return res.status(500).json({ message: "erreur", erreur: err });
  }
};
 
module.exports = {
  rechercheConnaissance,
  alimentationConnaissance,
  getAllConnaissances,
  // findByTag_,
  modifDocument,
  getAssistant,
  getAllTags_
};
