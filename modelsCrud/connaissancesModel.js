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
    })
    .toArray();
  return result;
}

async function updateConnaissance(modifConnaissance) {
  const result = await global.connexion
    .db("brainboxlola")
    .collection("connaissances_techniques")
    .updateOne(filter(id),update(modifConnaissance));
  return result;
}


module.exports = {
  recuperationConnaissanceById,
  nouvelleConnaissance,
  findAllConnaissances,
  findByTag,
  updateConnaissance,
};
