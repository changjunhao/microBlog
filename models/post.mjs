import mongoClient from './db.mjs'
import settings from '../settings.mjs'

function Post(username, post, time) {
  this.user = username
  this.post = post
  if (time) {
    this.time = time
  } else {
    this.time = new Date()
  }
}

Post.prototype.save = function save(callback) {
  let post = {
    user: this.user,
    post: this.post,
    time: this.time
  }
  mongoClient.connect(function(err, client) {
    if (err) {
      return callback(err)
    }
    const db = client.db(settings.db)
    const collection = db.collection('posts')
    collection.createIndex('user', function(err, post) {})
    collection.insertOne(post, function(err, post) {
      client.close()
      callback(err, post)
    })
  })
}
Post.get = function get(username, callback) {
  let query = {}
  if (username) {
    query.user = username
  }
  mongoClient.connect(function(err, client) {
    if (err) {
      return callback(err)
    }
    const db = client.db(settings.db)
    const collection = db.collection('posts')
    let query = {}
    if (username) {
      query.user = username
    }
    collection.find(query).sort({time: -1}).toArray(function(err, docs) {
      client.close()
      if (err) {
        callback(err)
      }
      let posts = []
      docs.forEach(function(doc, index) {
        let post = new Post(doc.user, doc.post, doc.time)
        posts.push(post)
      })
      console.log(posts)
      callback(null, posts)
    })
  })
}

export default Post
