import mongoose from "mongoose";
const { Schema } = mongoose;

const verificationCodeSchema = new Schema({
    code: {
        type: String,
        length: 6,
        required: true
    },
    sentToUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // token should expire after 10 minutes
    // note: mongoDB runs checker every minute, so WORST-CASE scenario is - token will expire after 11 minutes
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '10m'
    }
});

export default mongoose.model("Code", verificationCodeSchema, "codes");