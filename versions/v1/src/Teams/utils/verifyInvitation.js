import mongoose from 'mongoose';
export class verifyInvitation {
    static id(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return false;
        return true;
    }
}