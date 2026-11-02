const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['viewed_hostel', 'searched_hostels', 'opened_contact', 'saved_hostel', 'removed_favorite', 'login'],
        required: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },
    searchTerm: {
        type: String,
        maxlength: 100
    }
}, { timestamps: true });

activitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
