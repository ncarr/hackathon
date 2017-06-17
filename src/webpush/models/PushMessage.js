const mongoose = require('mongoose');
const uuid = require('uuid');
var messageSchema = mongoose.Schema({
    _id: {type: String, default: uuid.v4},
    data: mongoose.Schema.Types.Mixed,
    recipients: [{ type: String, ref: 'PushSubscription' }],
    failedRecipients: [{ type: String, ref: 'PushSubscription' }]
});
module.exports = mongoose.model('PushMessage', messageSchema)
