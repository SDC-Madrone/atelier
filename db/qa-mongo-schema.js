const mongoose = require('mongoose');

// User schema
const userSchema = mongoose.schema({
  // By default, Mongoose adds an _id property to schema
  name: String,
  email: String,
});

// Question schema
const questionSchema = mongoose.schema({
  // By default, Mongoose adds an _id property to schema
  questionBody: String,
  questionDate: { type: Date, default: Date.now },
  askerName: String,
  helpfulness: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  answers: [
    {
      answerId: mongoose.Schema.Types.ObjectId,
      body: String,
      date: { type: Date, default: Date.now },
      answererName: String,
      helpfulness: { type: Number, default: 0 },
      reported: { type: Boolean, default: false },
      photos: [
        {
          photoId: mongoose.Schema.Types.ObjectId,
          url: String,
        },
      ],
    },
  ],
});

// Answer schema
const answerSchema = mongoose.schema({
  // By default, Mongoose adds an _id property to schema
  body: String,
  date: { type: Date, default: Date.now },
  answererName: String,
  helpfulness: { type: Number, default: 0 },
  photos: [{ photoId: mongoose.Schema.Types.ObjectId, url: String }],
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Question: mongoose.model('Question', questionSchema),
  Answer: mongoose.model('Answer', answerSchema),
};
