import express from "express"
import Connection, { services } from "../models/Connection.js";
import { responseErrors, responseSuccess } from "../../Responses/utils/responseTemplate.js";
import { handleSuccess } from "../../Responses/utils/successHandler.js";
import { checkUser } from "../../Users/services/checkUser.js";
import { params } from "../utils/params.js";
import { config } from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
config()
const router = express.Router();


router.get("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user)

    const steamConnection = await Connection.findOne({userId: user.id, service: services.steam})
    if(steamConnection) throw new Error(responseErrors.already_connected)

    const connection = new Connection({
        userId: user.id,
        service: services.steam
    })
    await connection.save()

    const redirectUrl = `http://localhost:3000/api/v1/users/steam/return?${new URLSearchParams({state: connection.id})}`

    const urlParams = params("B9807E1A613B984878673800989C032F", redirectUrl, connection.id)
    const url = `https://steamcommunity.com/openid/login?${new URLSearchParams(urlParams)}`
    handleSuccess(res, responseSuccess.steam_connection, {url})
})

//returns steam id and state and assign it to connection and then redirect to client where it will verify if user is correct else it will delete connection
router.get('/return', async (req, res) => {
    //print out params on every line
    const parametry = req.query
    const param = JSON.parse(JSON.stringify(parametry))
    if(!mongoose.Types.ObjectId.isValid(param.state)) throw new Error(responseErrors.bad_format)
    
    const connection = await Connection.findById(param.state)
    if(!connection) throw new Error(responseErrors.something_went_wrong)

    const paramsToSend = new URLSearchParams({
    "openid.assoc_handle": param["openid.assoc_handle"],
    "openid.signed": param["openid.signed"],
    "openid.sig": param["openid.sig"],
    "openid.ns": param["openid.ns"],
    "openid.mode": "check_authentication",
    "openid.op_endpoint": param["openid.op_endpoint"],
    "openid.claimed_id": param["openid.claimed_id"],
    "openid.identity": param["openid.identity"],
    "openid.return_to": param["openid.return_to"],
    "openid.response_nonce": param["openid.response_nonce"]
    })
    
    const headers = {
        'Accept-language': 'en',
        'Content-type': 'application/x-www-form-urlencoded'
    };

    const steamTest = await axios.post('https://steamcommunity.com/openid/login', paramsToSend, {headers: headers})
    let smth = steamTest.data.split("\n")
    if(smth !== "is_valid:true") throw new Error(responseErrors.something_went_wrong)

    //print them in json on every line
    return res.status(200).json({params: param, steamTest: steamTest.data})
})

function checkSteamId(params){

}

export default router