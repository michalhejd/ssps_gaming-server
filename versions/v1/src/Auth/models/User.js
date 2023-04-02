import mongoose from 'mongoose';

export const roles = {
    player: 0,
    admin: 1,
    organizer: 2
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 64
    },
    nickname: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 32
    },
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 64
    },
    password: {
        type: String,
        required: true,
    },
    birthdate: {
        type: Date,
        required: true
    },
    role: {
        type: Number,
        required: true,
        default: roles.player,
        enum: Object.values(roles)
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
});

export default mongoose.model('User', userSchema, 'users');