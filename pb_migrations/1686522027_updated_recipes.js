migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gtl8lk39i1qzyan")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hftwrohn",
    "name": "rawData",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gtl8lk39i1qzyan")

  // remove
  collection.schema.removeField("hftwrohn")

  return dao.saveCollection(collection)
})
