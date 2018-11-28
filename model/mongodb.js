const mongodbClient = require('mongodb');
const ObjectId = mongodbClient.ObjectId;
const {dbUrl,dbName} = require('./mongoConfig');
const promisify = require('../commonJs/util').promisify;
const mongodbConnect = promisify(mongodbClient.connect);

//单库
class mongodb {

    static getInstance(){
       if (!mongodb.instance) {
           mongodb.instance = new mongodb();
       }
       return mongodb.instance;
    }
    constructor(){
      this.dbClient = '';
      this.connect();
    }

    async connect(){
      try {
        if (!this.dbClient) {
          const client = await mongodbConnect(dbUrl, { useNewUrlParser: true });
          let db = client.db(dbName);
          this.dbClient = db;
          return this.dbClient;
        }else {
            return this.dbClient;
        }
      }
      catch (e) {
        console.log(e);
      }
    }

    async find(collectionName,json){
        try {
          const db = await this.connect();
          const result = db.collection(collectionName).find(json);
          let ds = await result.toArray();
          return ds;
        } catch (e) {
          console.log(e);
        }
    }

    async update(collectionName,json1,json2){
        try {
          const db = await this.connect();
          const result = db.collection(collectionName).updateOne(json1,{
            $set:json2
          },true);
          return result;
        } catch (e) {
          console.log(e);
        }
    }

    async insert(collectionName,json){
        try {
          const db = await this.connect();
          const result = db.collection(collectionName).insertOne(json);
          return result;
        } catch (e) {
          console.log(e);
        }
    }
    async remove(collectionName,json)
    {
      try {
        const db = await this.connect();
        const result = db.collection(collectionName).removeOne(json);
        return result;
      } catch (e) {
        console.log(e);
      }
    }
     getObjectID(id)
    {
      return new ObjectId(id);
    }
}

//自选库
class mongodbs {


  static getInstance(){
     if (!mongodb.instance) {
         mongodb.instance = new mongodb();
     }
     return mongodb.instance;
  }

    constructor(){
      this.dbClient = '';
       this.connect();
    }

    async connect(){
      try {
        if (!this.dbClient) {
          const client = await mongodbConnect(dbUrl, { useNewUrlParser: true });
          // let db = client.db(dbName);
          this.dbClient = client;
          return this.dbClient;
        }
        else
        {
          return this.dbClient;
        }
      }
      catch (e) {
        console.log(e);
      }
    }

    async find(dbName,collectionName,json){
        try {
          const clients = await this.connect();
          const db = clients.db(dbName);
          const result = db.collection(collectionName).find(json);
          let ds = await result.toArray();
          return ds;
        } catch (e) {
          console.log(e);
        }
    }

    async update(dbName,collectionName,json1,json2){
        try {
          const clients = await this.connect();
          const db = clients.db(dbName);
          const result = db.collection(collectionName).updateOne(json1,{
            $set:json2
          },true);
          return result;
        } catch (e) {
          console.log(e);
        }
    }

    async insert(dbName,collectionName,json){
        try {
          const clients = await this.connect();
          const db = clients.db(dbName);
          const result = db.collection(collectionName).insertOne(json);
          return result;
        } catch (e) {
          console.log(e);
        }
    }
    async remove(dbName,collectionName,json)
    {
      try {
        const clients = await this.connect();
        const db = clients.db(dbName);
        const result = db.collection(collectionName).removeOne(json);
        return result;
      } catch (e) {
        console.log(e);
      }
    }
}



module.exports = mongodb;
