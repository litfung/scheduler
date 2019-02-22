const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StepSchema = new Schema({
  title: String,
  _event: { type: Schema.Types.ObjectId, ref: 'Event' },
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
  _rank: { type: Number },
  _isDone: { type: Boolean, default: false },
  _isDeleted: { type: Boolean, default: false },
});

const Step = mongoose.model('Step', StepSchema);

module.exports = { Step };