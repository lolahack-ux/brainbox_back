const express = require("express");

// configuration pour l'accès à MongoDB
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

let connexion;

// Création de la fonction qui lance la lecture de MongoDB
async function run() {
  try {
    connexion = await client.connect();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (err) {
    console.error(err);
  }
}

run();

// Route de récupération de donnée sur MongoDB

app.get("/connaissance", async (req, res) => {
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
});

// port de lancement du serveur
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
