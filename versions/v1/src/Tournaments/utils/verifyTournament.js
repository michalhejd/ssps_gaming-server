import mongoose from "mongoose";
import { gamemodes } from "../models/Tournament.js";
export class VerifyTournament{
    static id(id){
        if(!mongoose.Types.ObjectId.isValid(id)) return false;
        return true;
    }
    static name(name){
        if(typeof name !== 'string') return false;
        if(name.length < 3 || name.length > 64) return false;
        return true;
    }
    static date(date){
        if(typeof date !== 'string') return false;
        const dateObj = new Date(date);
        if(dateObj == 'Invalid Date') return false;
        return true;
    }
    static gameMode(gameMode){
        if(typeof gameMode !== 'string') return false;
        if(!Object.values(gamemodes).includes(gameMode)) return false;
        return true;
    }
    static maxTeams(maxTeams){
        if(typeof maxTeams !== 'number') return false;
        if(maxTeams < 2 || maxTeams > 16) return false;
        return true;
    }
}