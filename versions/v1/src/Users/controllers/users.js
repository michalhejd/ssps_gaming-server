import express from "express";
import User from "../models/User.js";
import { roles } from "../models/User.js";
import { responseSuccess } from "../../Responses/utils/responseTemplate.js";
import { handleSuccess } from "../../Responses/utils/successHandler.js";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
import { verifyRegisterBody } from "../utils/verifyRegisterParams.js";
import { signToken } from "../../Token/utils/signToken.js";
import { checkUser } from "../services/checkUser.js";
import { Password } from "../services/Password.js";
import { VerifyUser } from "../utils/verifyUser.js";
import { generateVerificationCode } from "../services/generateToken.js";
import Code from "../models/Code.js";
import { sendEmail } from "../../Email/services/sendEmailWithCode.js";
import { emailLimiter } from "../../RateLimit/services/ratelimit.js";
import Steam from "../../Steam/controllers/connection.js"

const router = express.Router();

router.use("/steam", Steam)

router.get("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //pass to function which will check if user exists and if user is verified
    const user = await checkUser(req.user)
    if (user.role < roles.admin) throw new Error(responseErrors.forbidden);
    //get of query params
    const query = req.query;
    //maximum users per page
    const maxUsersPerPage = 20;
    // calc of max pages (from total User documents in db)
    const maxPages = Math.ceil(await User.countDocuments() / maxUsersPerPage);
    // check if page can be returned (if page number is not greater than maxPages and if page is not less than 1) otherwise return first page
    const page = query.page ? ((parseInt(query.page) > 0) ? ((parseInt(query.page) <= maxPages) ? parseInt(query.page) : 1) : 1) : 1;
    // check if sort is string
    if (typeof query.sort == "string") {
        //check which value of sort is requested otherwise not to sort
        if (query.sort == "newest") {
            query.sort = { _id: -1 };
        }
        if (query.sort == "oldest") {
            query.sort = { _id: 1 };
        }
    }
    if (typeof query.whispering == "string") {
        // trimming input from frontend
        query.whispering = query.whispering.trim();
    }
    else {
        query.whispering = "";
    }

    // create users const and then call func which will format users(it will return users without their password and __v)
    const users = await User.find({
        $or: [
            { name: { $regex: query.whispering, $options: 'i' } }, // Search in Name field
            { nickname: { $regex: query.whispering, $options: 'i' } }, // Search in Nickname field
            { email: { $regex: query.whispering, $options: 'i' } } // Search in Email field
        ]
    }).select("-password -__v -expiresAt").lean().sort(query.sort || { _id: -1 }).skip((page - 1) * maxUsersPerPage).limit(maxUsersPerPage)
    // return param which will tell user on which page he is
    const currentPage = page;
    handleSuccess(res, responseSuccess.users_found, { users, maxPages, currentPage });
});


router.get("/@self", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // pass to function which will check if user exists and if user is verified
    const user = await checkUser(req.user);
    // return user without his password and __v
    handleSuccess(res, responseSuccess.user_found, user);
});

router.get("/options", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // pass to function which will check if user exists and if user is verified
    const user = await checkUser(req.user);
    // check if user is at least admin
    if (user.role < roles.admin) throw new Error(responseErrors.forbidden);
    // return roles and verified options
    handleSuccess(res, responseSuccess.options_found, { roles: roles, verified: [true, false] });
});


router.get("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // pass to function which will check if user exists and if user is verified
    const user = await checkUser(req.user);
    if (user.role < roles.admin) throw new Error(responseErrors.forbidden);
    // get id from params
    const id = req.params.id;
    // check if id is in correct format
    if (!VerifyUser.id(id)) throw new Error(responseErrors.bad_format);
    // check if user exists
    const userFound = await User.findById(id).select("-password -__v -expiresAt");
    if (!userFound) throw new Error(responseErrors.user_not_found);
    // return user without his password and __v
    handleSuccess(res, responseSuccess.user_found, userFound);
});




router.post("/login", async (req, res) => {
    // already logged in
    if (req.user) throw new Error(responseErrors.already_logged_in);
    const body = req.body;
    // checking if email and password are in correct format
    if (!body.email || !body.password) throw new Error(responseErrors.bad_format);
    const user = await User.findOne({ email: body.email })
    // checking if user exists
    if (!user) throw new Error(responseErrors.user_not_found);
    // checking if password is correct
    if (!await Password.verify(body.password, user.password)) throw new Error(responseErrors.bad_credentials);
    //checking if user is verified
    await checkUser(user._id)
    handleSuccess(res, responseSuccess.login_success, { token: signToken({ _id: user._id }) });
});


router.post("/register", emailLimiter, async (req, res) => {
    if (req.user) throw new Error(responseErrors.already_logged_in);
    const body = req.body;
    // verify if all params are in correct format => if they are string, number, date, their length etc.
    // function returns true if all params are in correct format, otherwise returns false

    if (!verifyRegisterBody(body.email, body.nickname, body.name, body.password, body.birthdate)) throw new Error(responseErrors.bad_format);

    // verify if email and nickname are not already in use
    if (await User.findOne({ email: body.email })) throw new Error(responseErrors.email_already_exists);
    if (await User.findOne({ nickname: body.nickname })) throw new Error(responseErrors.nickname_already_exists);

    // hash user password
    const hashedPassword = await Password.hash(body.password);


    // create user instance
    const user = new User({
        email: body.email,
        nickname: body.nickname,
        name: body.name,
        password: hashedPassword,
        birthdate: body.birthdate
    });

    // generate verification code
    const code = generateVerificationCode();

    const verificationCode = new Code({
        code: code,
        sentToUser: user._id
    });

    // save code to db
    await verificationCode.save();

    // save user to db
    await user.save();

    // sending verification email with code and link to verification page
    sendEmail(user, code, process.env.EMAIL_VERIFICATION_URL + `/${verificationCode._id}`)

    // sending response

    handleSuccess(res, responseSuccess.user_created);
});

router.post("/resendVerification", emailLimiter, async (req, res) => {
    if (req.user) throw new Error(responseErrors.already_logged_in);
    const body = req.body;
    if (typeof body.email !== 'string') throw new Error(responseErrors.bad_format);

    const user = await User.findOne({ email: body.email });
    if (!user) throw new Error(responseErrors.user_not_found);
    if (user.verified) throw new Error(responseErrors.already_verified);

    const code = await Code.findOne({ sentToUser: user._id });
    if (code) throw new Error(responseErrors.verification_code_already_sent);

    const newCode = generateVerificationCode();

    const verificationCode = new Code({
        code: newCode,
        sentToUser: user._id
    });

    await verificationCode.save();

    sendEmail(user, newCode, process.env.EMAIL_VERIFICATION_URL + `/${verificationCode._id}`)
    handleSuccess(res, responseSuccess.verification_email_sent);
});

router.post("/", emailLimiter, async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if his account is verified
    const user = await checkUser(req.user)
    // check if user is at least admin
    if (user.role < roles.admin) throw new Error(responseErrors.forbidden);

    const body = req.body;

    // verify if all params are in correct format => if they are string, number, date, their length etc.
    if (!verifyRegisterBody(body.email, body.nickname, body.name, body.password, body.birthdate)) throw new Error(responseErrors.bad_format);

    // if body contains role param, check if user is superAdmin and verify if role is in correct format
    if (body.role) {
        if (!VerifyUser.role(body.role)) throw new Error(responseErrors.bad_format);
        if (body.role >= user.role) throw new Error(responseErrors.forbidden);
    }
    // if body contains verified param, check if user is superAdmin and verify if verified is in correct format
    if (body.verified) {
        if (user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);
        if (!VerifyUser.verified(body.verified)) throw new Error(responseErrors.bad_format);
    }

    // verify if email and nickname are not already in use
    if (await User.findOne({ email: body.email })) throw new Error(responseErrors.email_already_exists);
    if (await User.findOne({ nickname: body.nickname })) throw new Error(responseErrors.nickname_already_exists);

    // hash user password
    const hashedPassword = await Password.hash(body.password);

    const newUser = new User({
        email: body.email,
        nickname: body.nickname,
        name: body.name,
        birthdate: body.birthdate,
        password: hashedPassword,
        role: body.role || roles.player,
        verified: body.verified || false
    });


    // save user to db
    await newUser.save();

    if (!newUser.verified) {
        const code = generateVerificationCode();

        const verificationCode = new Code({
            code: code,
            sentToUser: newUser._id
        });

        // save code to db
        await verificationCode.save();
        // send email with code if user is not verified
        sendEmail(newUser, code, process.env.EMAIL_VERIFICATION_URL + `/${verificationCode._id}`)
    }

    handleSuccess(res, responseSuccess.user_created);
});

router.put("/@self", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);

    // func that verifies if user exists and if user is verified
    const user = await checkUser(req.user);

    // keep track if user was updated
    let userUpdated = false;

    const body = req.body;
    // get user password from database
    const findUserPass = await User.findById(user.id);

    // if body contains oldPassword and newPassword then it checks if oldPassword is correct and if newPassword is in correct format
    if (body.oldPassword && body.newPassword) {
        if (!await Password.verify(body.oldPassword, findUserPass.password)) throw new Error(responseErrors.bad_credentials);
        if (!Verify.password(body.newPassword)) throw new Error(responseErrors.bad_format);
        // hashes new password
        user.password = await Password.hash(body.newPassword);
        userUpdated = true;
    }

    // check if body contains nickname, if it does, check if nickname is in correct format and if it is not already in use
    if (body.nickname) {
        // allow user to keep his nickname
        if (!(body.nickname === user.nickname)) {
            if (await User.findOne({ nickname: body.nickname })) throw new Error(responseErrors.nickname_already_exists);
        }
        if (!VerifyUser.nickname(body.nickname)) throw new Error(responseErrors.bad_format);
        user.nickname = body.nickname;
        userUpdated = true;
    }

    // if user was not updated, throw error
    if (!userUpdated) {
        throw new Error(responseErrors.update_password_or_nickname);
    }

    // save user
    await user.save();
    handleSuccess(res, responseSuccess.user_updated);
});


router.put("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    const user = await checkUser(req.user)
    //check if user isn't player
    if (user.role < roles.admin) throw new Error(responseErrors.forbidden);

    const params = req.params;

    const updatedUser = await User.findOne({ _id: params.id });

    //check if user exists
    if (!updatedUser) throw new Error(responseErrors.user_not_found);
    if (updatedUser.role >= user.role) throw new Error(responseErrors.forbidden);

    const body = req.body;

    //check if body contains role and if role is in correct format
    if (body.role) {
        if (!VerifyUser.role(body.role)) throw new Error(responseErrors.bad_format);
        if (body.role >= user.role) throw new Error(responseErrors.forbidden);

        updatedUser.role = body.role;
    }

    //check if body contains verified and if verified is in correct format
    if (body.verified) {
        if (user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);
        if (!VerifyUser.verified(body.verified)) throw new Error(responseErrors.bad_format);
    }

    //check if body contains name and if name is in correct format
    if (body.name) {
        if (!VerifyUser.name(body.name)) throw new Error(responseErrors.bad_format);
        updatedUser.name = body.name;
    }

    //check if body contains nickname, if nickname doesnt exist and if nickname is in correct format
    if (body.nickname) {
        if (await User.findOne({ nickname: body.nickname })) throw new Error(responseErrors.nickname_already_exists);
        if (!VerifyUser.nickname(body.nickname)) throw new Error(responseErrors.bad_format);
        updatedUser.nickname = body.nickname;
    }

    //check if body contains email, if email doesnt exist and if email is in correct format
    if (body.email) {
        if (await User.findOne({ email: body.email })) throw new Error(responseErrors.email_already_exists);
        if (!VerifyUser.email(body.email)) throw new Error(responseErrors.bad_format);
        updatedUser.email = body.email;
    }

    //check if body contains birthdate and if birthdate is in correct format
    if (body.birthdate) {
        if (!VerifyUser.birthdate(body.birthdate)) throw new Error(responseErrors.bad_format);
        updatedUser.birthdate = body.birthdate;
    }

    //save user
    await updatedUser.save();
    handleSuccess(res, responseSuccess.user_updated);
});

// this endpoint will be used to verify user using link from email
router.patch("/verify", emailLimiter, async (req, res) => {
    if (req.user) throw new Error(responseErrors.already_logged_in);
    const body = req.body;
    // check if body contains email and if email is in correct format

    if (typeof body.email !== "string") throw new Error(responseErrors.bad_format);
    if (typeof body.code !== "string") throw new Error(responseErrors.bad_format);
    const user = await User.findOne({ email: body.email });
    if (!user) throw new Error(responseErrors.user_not_found);
    // check if user is verified
    if (user.verified) throw new Error(responseErrors.already_verified);

    const code = await Code.findOne({ sentToUser: user._id });
    if (!code) throw new Error(responseErrors.code_not_found);
    if (code.code !== body.code) throw new Error(responseErrors.bad_code);

    user.verified = true;
    user.expiresAt = null;

    // remove code from database
    try {
        await Code.deleteOne({ _id: code._id });
    } catch (err) {
        throw new Error(responseErrors.code_not_found);
    }
    // save user with verified status
    await user.save();

    handleSuccess(res, responseSuccess.user_verified);
});

router.patch("/verify/:id", emailLimiter, async (req, res) => {
    if (req.user) throw new Error(responseErrors.already_logged_in);
    const params = req.params;
    if (typeof params.id !== "string") throw new Error(responseErrors.bad_format);
    if (!VerifyUser.id(params.id)) throw new Error(responseErrors.bad_format);
    const code = await Code.findOne({ _id: params.id });
    if (!code) throw new Error(responseErrors.code_not_found);

    const user = await User.findOne({ _id: params.id });
    if (!user) throw new Error(responseErrors.user_not_found);
    // check if user is verified
    if (user.verified) throw new Error(responseErrors.already_verified);

    //delete code
    await Code.deleteOne({ _id: params.id });

    user.verified = true;
    user.expiresAt = null;

    await user.save();

    handleSuccess(res, responseSuccess.user_verified);
});

router.delete("/logout", async (req, res) => {
    //check if user is logged in
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await User.findById(req.user);
    //check if user exists
    if (!user) throw new Error(responseErrors.token_unauthorized);
    //sending response
    handleSuccess(res, responseSuccess.logout_success);
});

export default router;
