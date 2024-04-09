import express from "express";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
import { checkUser } from "../../Users/services/checkUser.js";
import { roles } from "../../Users/models/User.js";
import { VerifyGame } from "../utils/verifyGameParams.js";
import Game from "../models/Game.js";
import { handleSuccess } from "../../Responses/utils/successHandler.js";
import { responseSuccess } from "../../Responses/utils/responseTemplate.js";

const router = express.Router();

router.get("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //verify user params
    await checkUser(req.user)
    //find all games in db
    const games = await Game.find().select("-__v");
    handleSuccess(res, responseSuccess.games_found, {games});
});

router.get("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //verify user params
    await checkUser(req.user)
    const params = req.params;
    //check if id is valid
    if(!VerifyGame.id(params.id)) throw new Error(responseErrors.bad_format);
    //find game in db
    const game = await Game.findById(params.id).select("-__v");
    if(!game) throw new Error(responseErrors.game_not_found);
    handleSuccess(res, responseSuccess.game_found, game);
});

router.post("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //pass to function which will check if user exists and if user is verified
    const user = await checkUser(req.user)
    //check if user is superAdmin
    if (user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);

    const body = req.body;

    //check if game with that slug already exists
    if(await Game.findOne({slug: body.slug})) throw new Error(responseErrors.slug_taken);

    //check if game params are valid
    if(!VerifyGame.name(body.name) || !VerifyGame.shortName(body.shortName) || !VerifyGame.description(body.description) || !VerifyGame.slug(body.slug)) throw new Error(responseErrors.bad_format);

    const game = new Game({
        name: body.name,
        shortName: body.shortName,
        description: body.description,
        slug: body.slug
    });

    await game.save();

    handleSuccess(res, responseSuccess.game_created);
});

router.put("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //pass to function which will check if user exists and if user is verified
    const user = await checkUser(req.user)
    if (user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);

    const params = req.params;
    //check if id is valid
    const game = await Game.findOne({_id: params.id});
    if(!game) throw new Error(responseErrors.game_not_found);

    const body = req.body;
    //checks if user passes something through body and then it checks if it is valid
    if(body.name){
        if(!VerifyGame.name(body.name)) throw new Error(responseErrors.bad_format);
        game.name = body.name;
    }
    if(body.shortName){
        if(!VerifyGame.shortName(body.shortName)) throw new Error(responseErrors.bad_format);
        game.shortName = body.shortName;
    }
    if(body.description){
        if(!VerifyGame.description(body.description)) throw new Error(responseErrors.bad_format);
        game.description = body.description;
    }
    if(body.slug){
        if(!VerifyGame.slug(body.slug)) throw new Error(responseErrors.bad_format);
        game.slug = body.slug;
    }

    await game.save();

    handleSuccess(res, responseSuccess.game_updated);
});

export default router;