let settings = require('../settings')
let Db = require('mongodb').Db
let Connection = require('mongodb').Connection
let Server = require('mongodb').Server
module.exports = new Db(settings.db, new Server(settings.host, 27017, {}), {safe: true})
