import settings from '../settings.mjs'
import { MongoClient } from 'mongodb'

const url = `mongodb://${settings.host}:27017`

export default new MongoClient(url)
