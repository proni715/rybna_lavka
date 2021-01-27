import Promise from 'bluebird'
import mongoose from 'mongoose'
import { mongo } from '../../config'

if (mongo.options) {
  Object.keys(mongo.options).forEach((key) => {
    mongoose.set(key, mongo.options[key])
  })
}

mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)

mongoose.Promise = Promise
/* istanbul ignore next */
mongoose.Types.ObjectId.prototype.view = function() {
  return { id: this.toString() }
}

/* istanbul ignore next */
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error: ' + err)
  process.exit(-1)
})

export default mongoose