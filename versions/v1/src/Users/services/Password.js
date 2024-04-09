import bcrypt from 'bcrypt';

export class Password {
    static async hash(password) {
        // generate salt
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        // hash password and return hashed password
        return bcrypt.hash(password, salt);
    }
    static async verify(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}