import { regexList } from '../../Users/utils/regexParams.js';
import { verifyRomanCzech } from '../../Users/utils/regexParams.js'
import mongoose from 'mongoose';
export class VerifyTeam{

    static name(name) {
        if (typeof name !== 'string') return false;
        if (name.length < 5 || name.length > 64) return false;
        return true;
    }

    static invitations(invitations) {
        if(typeof invitations !== 'boolean') return false;
        return true;
    }

    static id(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return false;
        return true;
    }
}