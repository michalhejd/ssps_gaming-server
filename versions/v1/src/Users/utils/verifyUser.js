import { roles } from "../models/User.js";
import mongoose from 'mongoose';
import { regexList, verifyRomanCzech } from "./regexParams.js";
export class VerifyUser {
    //https://jsdoc.app/about-getting-started.html
    /**
     * 
     * @param {String} nickname
     * @returns {boolean} true if nickname is valid otherwise false
     */
    static nickname(nickname) {
        if (typeof nickname !== 'string') return false;
        if (nickname.length < 3 || nickname.length > 32) return false;
        if (!verifyRomanCzech(nickname, regexList.nickname)) return false;
        return true;
    }

    /**
     * 
     * @param {String} name
     * @returns {boolean} true if name is valid otherwise false
     */
    static name(name) {
        if (typeof name !== 'string') return false;
        if (name.length < 5 || name.length > 64) return false;
        if (!verifyRomanCzech(name, regexList.name)) return false;
        return true;
    }

    /**
     * 
     * @param {String} password
     * @returns {boolean} true if password is valid otherwise false
     */
    static password(password) {
        if (typeof password !== 'string') return false;
        if (password.length < 6 || password.length > 64) return false;
        if (!regexList.password.test(password)) return false;
        return true;
    }

    /**
     * 
     * @param {String} email
     * @returns {boolean} true if email is valid otherwise false
     */
    static email(email) {
        if (typeof email !== 'string') return false;
        if (email.length < 6 || email.length > 64) return false;
        if(process.env.NODE_ENV == 'development') return true;
        return regexList.email.test(email);
    }

    /**
     * 
     * @param {String} birthdate
     * @returns {Boolean} true if birthdate is valid otherwise false
     */
    static birthdate(birthdate) {
        if (typeof birthdate !== 'string') return false;
        const date = new Date(birthdate);
        if (date == 'Invalid Date') return false;
        // birthdate must be in format yyyy-mm-dd => 10 characters
        if (birthdate.length !== 10) return false;
        // user must be older than 13 years (src: https://stackoverflow.com/questions/37002681/subtract-days-months-years-from-a-date-in-javascript)
        const dateNow = new Date();
        dateNow.setFullYear(dateNow.getFullYear() - 13);
        if (date > dateNow) return false;
        return true;
    }

    /**
     * 
     * @param {Number} role
     * @returns {Boolean} true if role is valid otherwise false
     */
    static role(role) {
        if (typeof role !== 'number') return false;
        if (!Object.values(roles).includes(role)) return false;
        return true;
    }

    /**
     * 
     * @param {Boolean} verified
     * @returns {Boolean} true if verified is valid otherwise false
     */
    static verified(verified) {
        if (typeof verified !== 'boolean') return false;
        return true;
    }

    /**
     *  
     * @param {String} id
     * @returns {Boolean} true if id is valid otherwise false
     */
    static id(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return false;
        return true;
    }
}
