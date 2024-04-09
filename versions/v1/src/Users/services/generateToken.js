import mongoose from "mongoose";

export function generateVerificationCode() {
    // generate verification code with 6 digits
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    
    return String(verificationCode);
}
