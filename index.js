const express = require("express");


// ------------------------------------------------------------------------------------------
// Configuration MongoDB
// ------------------------------------------------------------------------------------------

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

// const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;

const app = express();
app.use(express.json());

const uri =
  "mongodb+srv://erhartlola_db_user:0vhR79Kr1psnHtF7@brainbox.vkxqlyz.mongodb.net/";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


// Création de la fonction qui lance la lecture de MongoDB
async function run() {
  try {
    global.connexion = await client.connect();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (err) {
    console.error(err);
  }
}
run();

// ------------------------------------------------------------------------------------------
// Création des routes
// ------------------------------------------------------------------------------------------

const connaissancesRoutes = require ('./routersCrud/connaissancesRouter');
app.use(connaissancesRoutes);


// app.post("/alimentation", async (req, res) => {
//   const {
//     titre,
//     type,
//     technologies,
//     contenu,
//     description,
//     projet,
//     fichier,
//     tags
//   } = req.body;

//   if (!titre || !type || !contenu) {
//     return res.status(400).json({
//       message: "Les champs titre, type et contenu sont obligatoires"
//     });
//   }

//   try {
//     const nouvelleConnaissance = {
//       titre,
//       type,
//       technologies: technologies || [],
//       contenu,
//       description: description || "",
//       projet: projet || "",
//       fichier: fichier || null,
//       tags: tags || [],
//       date_ajout: new Date(),
//       date_modification: new Date()
//     };

//     const result = await global.connexion
//       .db("brainboxlola")
//       .collection("connaissances_techniques")
//       .insertOne(nouvelleConnaissance);

//     return res.status(201).json({
//       message: "Connaissance technique ajoutée avec succès",
//       id: result.insertedId,
//       connaissance: {
//         _id: result.insertedId,
//         ...nouvelleConnaissance
//       }
//     });
//   } catch (err) {
//     console.error("Erreur MongoDB :", err);

//     return res.status(500).json({
//       message: "Erreur lors de l'ajout dans MongoDB",
//       erreur: err.message
//     });
//   }
// });

// port de lancement du serveur
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
