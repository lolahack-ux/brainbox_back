const { ObjectId } = require("mongodb");

async function nouvelleConnaissance(nvConnaissance) {
  const result = await global.connexion
    .db("brainboxlola")
    .collection("connaissances_techniques")
    .insertOne(nvConnaissance);
  return result;
}

async function recuperationConnaissanceById(id) {
  const result = await global.connexion
    .db("brainboxlola")
    .collection("connaissances_techniques")
    .findOne({
      _id: new ObjectId(id),
    });
  return result;
}

async function findAllConnaissances() {
  const result = await global.connexion
    .db("brainboxlola")
    .collection("connaissances_techniques")
    .find({})
    .toArray();
  return result;
}

async function findByTag(tag) {
  const result = await global.connexion
    .db("brainboxlola")
    .collection("connaissances_techniques")
    .find({
      tags: tag
    },
    )
    .toArray();
  return result;
}

async function findAllTags() { 
  const result = await global.connexion
    .db("brainboxlola")
    .collection("connaissances_techniques")
    .find()
    .toArray();
     

  const tagList = new Set();
  
  for (let connaissance of result) {
    if (connaissance.tags) {
      for (let tag of connaissance.tags) {
        tagList.add(tag);
        }
      }
  } 

  return tagList;
}

async function findByTags(tags) {
  const result = await global.connexion
    .db("brainboxlola")
    .collection("connaissances_techniques")
    .find(
      {
        tags: {
          $in: tags
        }
      },
      {
        projection: {
          _id: 0,
          date_ajout: 0,
          date_modification: 0
        }
      }
    )
    .toArray();

  console.log(result);

  return result;
}

async function updateConnaissance(id, modifConnaissance) {
  const result = await global.connexion
    .db("brainboxlola")
    .collection("connaissances_techniques")
    .updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: modifConnaissance,
      },
    );

  return result;
}

module.exports = {
  recuperationConnaissanceById,
  nouvelleConnaissance,
  findAllConnaissances,
  findByTag,
  updateConnaissance,
  findAllTags,
  findByTags,
};
