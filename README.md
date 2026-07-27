# brainbox_back
## Contexte
Depuis le début de votre formation, vous accumulez chaque semaine de nouvelles connaissances : extraits de code, commandes terminal, procédures Docker, notes de cours, solutions à des bugs, liens vers des documentations ou encore bonnes pratiques découvertes pendant les TP.

Ces informations finissent rapidement dispersées entre différents outils : fichiers texte, blocs-notes, favoris du navigateur, captures d'écran ou applications de prise de notes, rendus des différents (et nombreux) briefs passés. Retrouver une information déjà rencontrée devient alors de plus en plus difficile.

Afin de vous accompagner tout au long de votre parcours, vous allez créer un second cerveau, BrainBox, votre propre espace de connaissances, dans lequel vous pourrez enregistrer, organiser et retrouver facilement toutes les informations que vous jugerez utiles. Cet espace devra être interrogeable en langage naturel grâce à une intelligence artificielle exécutée localement.

Contrairement aux assistants IA classiques, BrainBox ne devra jamais s'appuyer sur ses connaissances générales pour répondre. L'assistant devra construire chacune de ses réponses uniquement à partir des informations enregistrées par son utilisateur. Si les connaissances disponibles sont insuffisantes, il devra l'indiquer explicitement plutôt que d'inventer une réponse.


---
## Orchestration

### Git

- Clonage du repo GitHub brainbox_back
```bash
https://github.com/lolahack-ux/brainbox_back.git
```
- création d'un fichier **.gitignore**

### Docker

- Docker
- Docker Compose

1. Vérifier les installations :

```bash
docker --version
docker compose version
```

2. Construction des images

Pour construire les images Docker :

```bash
docker compose build
```

3. Lancement des conteneurs

Pour démarrer l'application :

```bash
docker compose up
```

4. Arrêt de l'application

Pour arrêter les conteneurs :

```bash
docker compose down
```

Pour arrêter les conteneurs et supprimer les volumes associés :

```bash
docker compose down -v
```

5. Ports utilisés

| Service | Port hôte | Port conteneur |
|----------|----------:|---------------:|
| frontend | 4200 | 4200 |
| backend  | 3000 | 3001 |


6. Services disponibles

L'application est composée des services suivants :

- **frontend** : l'application Angular.
- **backend** : API en express et ETL en python.



---
## Création base de données sur MongoDB
- Téléchargement de **MongoDB Compass**
  - Connexion à Atlas MongoDB : https://www.mongodb.com/products/platform
- Connexion du backend à MongoDB

```bash
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;

const uri =
  "mongodb+srv://erhartlola_db_user:0vhR79Kr1psnHtF7@brainbox.vkxqlyz.mongodb.net/";

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
```
- Définir un port d'écoute
```bash
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
```


---
## Intialisation du back

- Installation express
```bash
npm install express
```

- Installation node
```bash
npm init -y
```

- Création du fichier **index.js**
- Initialisation de Docker sur le dossier
  - création fichier **.dockerignore**
  - création d'un premier **Dockerfile**
  - création dans le dossier parent de back le fichier **compose.yaml**
  - Création d'un fichier **.env** sur le dossier parent du back 
  
---
## Création des routes

- Route de récupération d'information sur la base de donnée MongoDB
Pour que la route se connecte à la bas il faut rajouter le *try* pour la connexion.

```bash
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
```
## Création des conteners du back
- Dans le fichier compose.yaml pour le contener backend
```bash
backend:
    build : ./back
    image: back_requete_api
    environment:
      MONGODB_URI: ${MONGODB_URI}
      MONGODB_DATABASE: ${MONGODB_DATABASE}

    ports:
      - "3001:3001"
```
puis dans le volume des services :
```bash
volumes:
  mongodb_data:
  ollama_data:
```

### Insertion IA Ollama
- Création du contener d'Ollama dans le compose.yaml
```bash
langage:
    image: ollama/ollama:latest
    container_name: brainbox_ollama

    ports:
      - "11434:11434"

    volumes:
      - ollama_data:/root/.ollama
      
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

```
Il vaut mieux prendre cette conféigation pour faire tourner Ollama sur le gpu, pour éviter qu'il soit trop lent.
- Créer les images avec les commandes ci-dessus dans la rubrique Docker
- Une fois les conteners créer mettre dans le terminal du dossier du compose.yaml, pour télécharger le modèle d'Ollama utilisé. Ici modele : llama3.2
```bash
docker compose exec langage ollama pull llama3.2
```
Pour éviter des problèmes entre Angular et Express de port, car ils n'utilisent pas le même faire dans le terminal du back:
```bash
npm install cors
```
Puis dans index.js
```bash
const cors = require("cors");
```