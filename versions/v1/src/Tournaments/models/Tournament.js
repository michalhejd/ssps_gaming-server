import mongoose from "mongoose";
const { Schema } = mongoose;

export const gamemodes = {
    normal: 'normal',
}

const tournamentSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 64,
        unique: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // id of game that this tournament is for
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    // before the startDate, the tournament is in registration phase
    startRegistration: {
        type: Date,
        required: true
    },
    // only after the endDate, the tournament is in finished phase -> it can start
    endRegistration: {
        type: Date,
        required: true
    },
    // teams in match (they get added here after completing the registration phase)
    teams: {
        type: [Schema.Types.ObjectId],
        ref: 'Team',
        required: false,
        default: []
    },
    maxTeams: {
        type: Number,
        required: true,
        max: 16,
    },
    gameMode: {
        type: String,
        required: true,
        enum: Object.values(gamemodes)
    },
    finished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Tournament', tournamentSchema, 'tournaments');
