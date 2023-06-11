migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gtl8lk39i1qzyan")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "on44l4yw",
    "name": "ready",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sppeigda",
    "name": "ingredients",
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
  collection.schema.removeField("on44l4yw")

  // remove
  collection.schema.removeField("sppeigda")

  return dao.saveCollection(collection)
})
