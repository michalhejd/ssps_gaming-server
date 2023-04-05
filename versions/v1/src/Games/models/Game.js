import mongoose from "mongoose";
const { Schema } = mongoose;

const gameSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 64
    },
    shortName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 8
    },
    description: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 256
    }
});

export default moggose.model('Game', gameSchema, 'games');