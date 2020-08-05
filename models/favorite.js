const mongoose = require('mongoose');
const schema = mongoose.Schema;


var favoriteSchema = new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
    }]
},{
    timestamps: true
});

module.exports = mongoose.model('Favorite', favoriteSchema);