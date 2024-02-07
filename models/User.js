const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide your Full Name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your Email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide your Password'],
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WishList'
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    hasShipingAddress: {
        type: Boolean,
        default: false
    },
    shippingAddress: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        address: {
            type: String
        },
        city: {
            type: String
        },
        postalCode: {
            type: String
        },
        province: {
            type: String
        },
        country: {
            type: String
        },
        phone: {
            type: String
        },
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
