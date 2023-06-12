migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gtl8lk39i1qzyan")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wuyu0d7y",
    "name": "imageUrl",
    "type": "url",
    "required": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gtl8lk39i1qzyan")

  // remove
  collection.schema.removeField("wuyu0d7y")

  return dao.saveCollection(collection)
})
