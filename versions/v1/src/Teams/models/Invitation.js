import mongoose from 'mongoose';
const { Schema } = mongoose;

export const invType = {
    invitation: 'invitation',
    request: 'request'
}

const invitationSchema = new Schema({
    team: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Team'
    },
    // who sent the invitation
    fromUser: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // who received the invitation
    toUser: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(invType)
    },
}, { timestamps: true });

export default mongoose.model('Invitation', invitationSchema, 'invitations');