const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    }
}, { timestamps: true });

favoriteSchema.index({ user: 1, hostel: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
