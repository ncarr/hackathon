const mongoose = require('mongoose');
const uuid = require('uuid');
var subSchema = mongoose.Schema({
    _id: { type: String, default: uuid.v4 },
    data: {
        data: {
            endpoint: { type: String, unique: true, required: true },
            keys: { type: mongoose.Schema.Types.Mixed, required: true }
        }
    }
});
module.exports = mongoose.model('PushSubscription', subSchema)
