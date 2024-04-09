import { VerifyUser } from "./verifyUser.js"

export function verifyRegisterBody(email, nickname, name, password, birthdate) {
    // verify email
    if (!VerifyUser.email(email)) { return false; }
    // verify nickname
    if (!VerifyUser.nickname(nickname)) { return false; }
    // verify name
    if (!VerifyUser.name(name)) { return false; }
    // verify password
    if (!VerifyUser.password(password)) { return false; }
    // verify birthdate
    if (!VerifyUser.birthdate(birthdate)) { return false; }
    return true;
}