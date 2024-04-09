import User from '../../versions/v1/src/Users/models/User.js';
import { roles } from '../../versions/v1/src/Users/models/User.js';
import { Password } from '../../versions/v1/src/Users/services/Password.js';

export async function defaultRoot() {
    if (!process.env.ADMIN_EMAIL) {
        console.log("ADMIN_EMAIL is not set in .env file")
        process.exit(0)
    }
    const email = process.env.ADMIN_EMAIL
    const checkUser = await User.findOne({ role: roles.root })
    if (checkUser) return
    //create random password for root
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await Password.hash(password)
    try {
        const user = new User({
            email: email,
            password: hashedPassword,
            nickname: "root",
            name: "Root Root",
            birthdate: new Date(),
            // setting to highest role -> root, this role can only be reached by this User
            role: roles.root,
            verified: true,
            expiresAt: null
        })
        await user.save()
        console.log("Default root user created with \nEmail: " + process.env.ADMIN_EMAIL + "\nPassword: " + password)
    } catch (err) {
        console.log(err)
        process.exit(0)
    }
    return
}
