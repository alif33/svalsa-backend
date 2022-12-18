const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    _time: {
        type: String,
        required: true
    },
    _date: {
        type: String,
        required: true
    },
    _note: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum : ['OPEN', 'BOOK', 'CANCELLED', 'COMPLETED'],
        default: 'OPEN'
    },
    engaged: {
        type: Boolean,
        default: false
    },
    join: {
        type: Boolean,
        default: false
    },
    comment: {
        type: String,
        default: "No comment!"
    },
    rating: {
        type: Number
    },
    expires: {
        type: String
    },
    agora: {
        type: Object
    },
    _owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    _participator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
