# EXPORT & IMPORT 

This is used to easily export and import mongoDB documents with help from mongoose.  
For now this is used with Express. If anyone want to use this outside express, shout out and I will change the typing of req. ( You can use req as any to overwrite this )  
Will work fine.

## Export
```
mongooseExportOrganization.export(req)
```
Export function just needs the express object.
  
## Import
```
const json = req.file.buffer.toString();
mongooseExportOrganization.import(req, json, req.body);
```
req.body will overwrite any value in first step. Helpfull when importing to change name of imported document.  
These functions are recursive. So you can add as many remote connections you want in remote connections.

Object example setup

```
const mongooseExportOrganization = new MongooseExport<
  OrganizationDoc,
  OrganizationModel,
  IRequest
>({
  model: 'Organization',
  field: 'organization',
  exclude: [
    'members',
    'invitations',
    'hasAccess'
  ],
  exportQuery: (req) => ({
    _id: req.organization._id
  }),
  importQuery: (req) => ({
    members: [{
      user: req.user._id,
      permissions: Permissions.Admin
    }]
  }),
  afterImport: async (req) => {
    // Or solve the importQuery with this 
    await Organization.findByIdAndUpdate(req.organization._id, {
      $push: {
        members: {
          user: req.user._id,
          permissions: Permissions.Admin
        }
      }
  }),
  remote: [{
    model: 'Book',
    field: 'books',
    baseQuery: (req) => {
     return {
       organization: req.organization._id
     };
    },
    exportQuery: () => ({
      archived: false
    }),
    exclude: [
      'archived'
      'invitations',
      'sharedBooks',
      'hasAccess',
      'sharedChapters'
    ]
  }]
})
```

#### Result from Organization export:

```
{
  "__id": "5c0648c533f81bbf35216d8b",
  "logo": {
    "src": "w08dnlewvsonghu5nj2k",
    "mime": "image/png",
    "alt": "Software_logo-09-2.png"
  },
  "name": "Inwise",
  "overviewName": "Inwise testområde",
  "books": [
    {
      "__id": "5d597afe1165090017c922c3",
      "_order": 2245134024441863,
      "icon": "Chapter",
      "name": "En enkel innføring i e-læring",
      "organization": "5c0648c533f81bbf35216d8b"
    }
  ]
}
```

##Export

##### Model

The model to query

##### Field

"field" is used to save value to parent body.
Organization with be saved to req.organization and book will be saved to req.organization.books

##### baseQuery

Object used to query the correct model.  
Parent will only find 1 object.  
Remote objects will always be arrays.  
If need be you can go trough other path like 'organization' to filter query even more.

##### exportQuery

Extra query, only for export operation.

##### Remote

Exports models that are linked to the project with {project: project._id}
Will save queried models to the provided 'field'

##### Exclude

Exclude fields. Will delete them before exporting

##### ReplaceIds

Only used in Import. #Note: All objects with _id will now have a value called __id to be used in import.

##### Populate

Populate fields with mongoose. You should add these to children if you want to remove the special values as _id & created.


##Import

### API use

##### Model

The model to query

##### Field

Is used to save values to the req object to be used in later query functions. The req object is updated and passed in right before the query to mongoose.

##### Query

This is the objects that's passed into mongoose create.
This is spread out with the content from 'file'.

##### Remote

Remote models that are not linked directly to the model with populate.
You can use the parent 'field' key to get the newly created _id of the imported project to reference it in the newly created model.

##### Exclude

Not used in import

##### ReplaceIds

Import will first add _id to all objects in parallel with each other. And all object with a key that matches replaceIds will then search through req.ids and match the id with ids[i].oldId and replace it with ids[i].newId.

##### Populate

Not used in import

##### AfterImport ( req => void )

This can be used in special cases where other remotely models need other remote models.  
Or if you find any case that's not supported by import.  
Up to you and your imagination :D

