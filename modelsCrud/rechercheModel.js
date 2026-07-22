
const { ObjectId } = require("mongodb");

async function recuperationConnaissanceById(id) {
  const result = await global.connexion
    .db("brainboxlola")
    .collection("connaissances_techniques")
    .findOne({
      _id: new ObjectId(id),
    });
  return result;
}


module.exports = {recuperationConnaissanceById }