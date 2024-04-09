import mongoose from "mongoose";
export class VerifyGame {
    static name(name){
        if(typeof name !== 'string') return false;
        if(name.length < 1 || name.length > 64) return false;
        return true;
    }

    static shortName(shortName){
        if(typeof shortName !== 'string') return false;
        if(shortName.length < 1 || shortName.length > 8) return false;
        return true;
    }

    static description(description){
        if(typeof description !== 'string') return false;
        if(description.length < 1 || description.length > 256) return false;
        return true;
    }

    static slug(slug){
        if(typeof slug !== 'string') return false;
        if(slug.length < 3 || slug.length > 32) return false;
        return true;
    }
    static id(id){
        if(!mongoose.isValidObjectId(id)) return false;
        return true;
    }
}