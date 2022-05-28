const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = Schema({
  date: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    required: true
  },
  list: [
    {
      name: {
        Type: String,
      },
      quantity: {
        Type: Number,
      },
      cost: {
        Type: Number,
      }
    }
  ],
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

module.exports = mongoose.model('orders', orderSchema)
