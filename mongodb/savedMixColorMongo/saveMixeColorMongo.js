const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    permanentId: {
        type: String,
        ref: 'Signup', // Reference to the Signup schema
    },
    name: { // Explicitly store Name from the Excel file
        type: String,
        required: true,
    },
    colors: [
        {
            hex: String,
            shade: String,
            intensity: Number,
        },
    ],
    mixedColorHex: String,
    fetched: {
        type: Boolean,
        default: false,
    },
    userName: {
        type: String,
        required: true,
    },
    userPhone: {
        type: String,
        required: true,
    },
    colorNumber: { type: Number, required: true },
});

const Color = mongoose.model('saveMixedColor', colorSchema);

module.exports = Color;
