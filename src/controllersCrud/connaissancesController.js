const {
  nouvelleConnaissance,
  recuperationConnaissanceById,
  findAllConnaissances,
  findByTag,
  updateConnaissance,
  findAllTags,
  findByTags
} = require("../modelsCrud/connaissancesModel");
const { ObjectId } = require("mongodb");
const axios = require("axios");

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
    return res.status(500).json({ message: "erreur", erreur: err });
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
    return res.status(500).json({ message: "erreur", erreur: err });
  }
};

findByTag_ = async (req, res) => {
  const { tag } = req.body;

  try {
    const recupByTag = await findByTag(tag);
    if (recupByTag) {
      return res.status(200).json(recupByTag);
    } else {
      return res.status(404).json({ message: "Non trouvé" });
    }
  } catch (err) {
    return res.status(500).json({ message: "erreur", erreur: err });
  }
};

const modifDocument = async (req, res) => {
  const { id } = req.params;

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
      contenu,
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
  try {  
	const questionInitiale = question ; 
	question = new Set (question.split(' ')); 

	const tagList = await findAllTags(); 
	const tagsPertinents = question.intersection(tagList)
	console.log(tagsPertinents)

    if (tagsPertinents) { 
	
      const recupByTag = await findByTags(Array.from(tagsPertinents));

      if (!recupByTag || recupByTag.length === 0) {
        return res.status(404).json({
          message: "Aucune connaissance trouvée avec ce tag",
        });
      }
      const prompt = `Voici des informations techniques trouvées dans ma base :
              ${JSON.stringify(recupByTag, null, 2)}
              Peux-tu répondre à cette question :  "${questionInitiale}" ?
              Mais avec cette contrainte ABSOLUE : tu ne me réponds qu'en utilisant des connaissances fournies dans ce prompt
              uniquement ces connaissances, et aucunes autres ;  VRAIMENT AUCUNE
              S'il n'y a pas assez d'informations dans le contenu que je viens de t'envoyer, tu me le signales clairement et immédiatement
              tu n'inventes rien, tu ne déduis rien, tu ne réponds qu'avec ce que je viens de t'envoyer
              pour rappel, ma question est "${questionInitiale}"
              `;

      console.log(prompt);

      const reponseOllama = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3.2",
          prompt: prompt,
          stream: false,
        },
      );

      return res.status(200).json({
        tags: tagsPertinents,
        connaissances: recupByTag,
        reponse_ia: reponseOllama.data.response,
      });
    }
  } catch (err) {
    console.error("Erreur assistant :", err.response?.data || err.message);

    return res.status(500).json({
      message: "Erreur lors de l'appel à l'assistant",
      erreur: err.response?.data || err.message,
    });
  }
};

getAllTags_ = async (req, res) => {

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
  findByTag_,
  modifDocument,
  getAssistant,
  getAllTags_
};
