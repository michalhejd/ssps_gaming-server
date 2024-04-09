import mongoose from "mongoose";

export const services = {
    steam: "steam",
}

const connectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    service: {
        type: String,
        required: true,
        enum: Object.values(services)
    },
    serviceId: {
        type: String
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: '5m'
    }
}, { timestamps: true });

export default mongoose.model('Connection', connectionSchema, 'connections');

