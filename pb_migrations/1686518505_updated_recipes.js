migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gtl8lk39i1qzyan")

  // remove
  collection.schema.removeField("pbeteggh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dcy7tzbv",
    "name": "data",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gtl8lk39i1qzyan")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pbeteggh",
    "name": "content",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("dcy7tzbv")

  return dao.saveCollection(collection)
})
