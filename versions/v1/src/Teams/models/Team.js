import mongoose from "mongoose";
const { Schema } = mongoose;

const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 32
    },
    // array of players -> user ids
    players: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    maxPlayers: {
        type: Number,
        required: true,
        default: 5
    },
    capitan: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matches: {
        type: [Schema.Types.ObjectId],
        ref: 'Match',
    },
    invitations: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema, 'teams');