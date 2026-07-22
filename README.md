# brainbox_back
## Contexte
Depuis le début de votre formation, vous accumulez chaque semaine de nouvelles connaissances : extraits de code, commandes terminal, procédures Docker, notes de cours, solutions à des bugs, liens vers des documentations ou encore bonnes pratiques découvertes pendant les TP.

Ces informations finissent rapidement dispersées entre différents outils : fichiers texte, blocs-notes, favoris du navigateur, captures d'écran ou applications de prise de notes, rendus des différents (et nombreux) briefs passés. Retrouver une information déjà rencontrée devient alors de plus en plus difficile.

Afin de vous accompagner tout au long de votre parcours, vous allez créer un second cerveau, BrainBox, votre propre espace de connaissances, dans lequel vous pourrez enregistrer, organiser et retrouver facilement toutes les informations que vous jugerez utiles. Cet espace devra être interrogeable en langage naturel grâce à une intelligence artificielle exécutée localement.

Contrairement aux assistants IA classiques, BrainBox ne devra jamais s'appuyer sur ses connaissances générales pour répondre. L'assistant devra construire chacune de ses réponses uniquement à partir des informations enregistrées par son utilisateur. Si les connaissances disponibles sont insuffisantes, il devra l'indiquer explicitement plutôt que d'inventer une réponse.

## Intialisation du back

- Clonage du repo GitHub brainbox_back
```bash
https://github.com/lolahack-ux/brainbox_back.git
```
- création d'un fichier **.gitignore**

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

