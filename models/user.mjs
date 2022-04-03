import mongoClient from './db.mjs'
import settings from '../settings.mjs'

function User(user) {
  this.name = user.name
  this.password = user.password
}

User.prototype.save = function save(callback) {
  let user = {
    name: this.name,
    password: this.password
  }
  mongoClient.connect(function(err, client) {
    if (err) {
      return callback(err)
    }
    const db = client.db(settings.db)
    const collection = db.collection('users')
    collection.createIndex('name', {unique: true}, function(err, user) {})
    collection.insertOne(user, function(err, user) {
      client.close()
      callback(err, user)
    })
  })
}
User.get = function get(username, callback) {
  mongoClient.connect(function(err, client) {
    if (err) {
      return callback(err)
    }
    const db = client.db(settings.db)
    const collection = db.collection('users')
    collection.findOne({name: username}, function(err, doc) {
      client.close()
      if (doc) {
        let user = new User(doc)
        callback(err, user)
      } else {
        callback(err, null)
      }
    })
  })
}

export default User
