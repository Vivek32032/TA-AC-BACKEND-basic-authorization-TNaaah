let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let podcastSchema = new Schema(
  {
    name: { type: String, require: true },
    image: { type: String, require: true },
    video: { type: String, require: true },
    forUserType: { type: String, require: true },
    likes: { type: Number, default: 0 },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

let Podcast = mongoose.model('Podcast', podcastSchema);
module.exports = Podcast;