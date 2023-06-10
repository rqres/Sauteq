migrate((db) => {
  const collection = new Collection({
    "id": "gtl8lk39i1qzyan",
    "created": "2023-06-10 17:42:22.096Z",
    "updated": "2023-06-10 17:42:22.096Z",
    "name": "recipes",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("gtl8lk39i1qzyan");

  return dao.deleteCollection(collection);
})
