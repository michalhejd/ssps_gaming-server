import mongoose from "mongoose";

export const roles = {
    player: 0,
    admin: 1,
    superAdmin: 2,
    root: 3
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
    },
    // user must confirm within 24 hours
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: '24h'
    },
    lastActivity: {
        type: Date
    },
}, {timestamps: true});

export default mongoose.model('User', userSchema, 'users');