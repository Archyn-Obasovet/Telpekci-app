const mongoose = require('mongoose');
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    text:{
        type: String,
        required: true
    },
    theme:{
        type: String,
        required: true
    },
    CreatedAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Message",MessageSchema)