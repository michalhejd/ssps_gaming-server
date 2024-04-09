import express, { response } from 'express';
import { roles } from '../../Users/models/User.js';
import { checkUser } from '../../Users/services/checkUser.js';
import { responseErrors, responseSuccess } from '../../Responses/utils/responseTemplate.js';
import { handleSuccess } from '../../Responses/utils/successHandler.js';
import { verifyTournamentBody } from '../utils/verifyTournamentParams.js';
import Tournament from '../models/Tournament.js';
import Game from '../../Games/models/Game.js';
import Team from '../../Teams/models/Team.js';
import { VerifyTournament } from '../utils/verifyTournament.js';
import { params } from '../../Steam/utils/params.js';

const router = express.Router();

// get all tournaments
router.get("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    await checkUser(req.user);
    const tournaments = await Tournament.find().select("-__v -createdAt -updatedAt -organizer");
    handleSuccess(res, responseSuccess.tournaments_found, tournaments);
});

// get tournament by id
router.get("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    await checkUser(req.user);
    const params = req.params;
    if (!VerifyTournament.id(params.id)) throw new Error(responseErrors.bad_format);
    const tournament = await Tournament.findById(params.id).select("-__v -createdAt -updatedAt -organizer");
    if (!tournament) throw new Error(responseErrors.tournament_not_found);
    handleSuccess(res, responseSuccess.tournament_found, tournament);
});

// create tournament
router.post('/', async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // pass to function which will check if user exists and if user is verified
    const user = await checkUser(req.user)
    if (user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);

    const body = req.body;
    // date format: yyyy-mm-ddThh:mm:ss

    if (!verifyTournamentBody(body.name, body.game, body.startDate, body.startRegistration, body.endRegistration, body.maxTeams, body.gameMode)) throw new Error(responseErrors.bad_format);

    if (!await Game.findById(body.game)) throw new Error(responseErrors.game_not_found);

    if (await Tournament.findOne({ name: body.name })) throw new Error(responseErrors.name_already_exists);
    if (await Tournament.findOne({ organizer: body.organizer })) throw new Error(responseErrors.cant_have_more_than_one_tournament);

    const tournament = new Tournament({
        name: body.name,
        organizer: user.id,
        game: body.game,
        startDate: body.startDate,
        startRegistration: body.startRegistration,
        endRegistration: body.endRegistration,
        maxTeams: body.maxTeams,
        gameMode: body.gameMode,
    });
    await tournament.save();

    handleSuccess(res, responseSuccess.tournament_created);
});

// update tournament
router.put("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //verify user params
    const user = await checkUser(req.user);
    if(user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);
    const params = req.params;
    if (!VerifyTournament.id(params.id)) throw new Error(responseErrors.bad_format);
    const tournament = await Tournament.findById(params.id);
    const body = req.body;
    if (new Date() >= new Date(body.startDate)) throw new Error(responseErrors.forbidden);

    if (body.name) {
        if(!VerifyTournament.name(body.name)) throw new Error(responseErrors.bad_format);
        tournament.name = body.name;
    }
    if (body.startDate) {
        if(!VerifyTournament.date(body.startDate)) throw new Error(responseErrors.bad_format);
        if(new Date(body.startDate) <= new Date(tournament.endRegistration) || new Date(body.startDate) <= new Date(body.endRegistration)) throw new Error(responseErrors.bad_format);
        tournament.startDate = body.startDate;
    }
    if (body.startRegistration) {
        if(!VerifyTournament.date(body.startRegistration)) throw new Error(responseErrors.bad_format);
        if(new Date(body.startRegistration) >= new Date(tournament.endRegistration) || new Date(body.startRegistration) >= new Date(body.endRegistration)) throw new Error(responseErrors.bad_format);
        tournament.startRegistration = body.startRegistration;
    }
    if (body.endRegistration) {
        if(!VerifyTournament.date(body.endRegistration)) throw new Error(responseErrors.bad_format);
        if(new Date(body.endRegistration) <= new Date(tournament.startRegistration) || new Date(body.endRegistration) <= new Date(body.startRegistration)) throw new Error(responseErrors.bad_format);
        tournament.endRegistration = body.endRegistration;
    }
    if (body.maxTeams) {
        if(!VerifyTournament.maxTeams(body.maxTeams)) throw new Error(responseErrors.bad_format);
        tournament.maxTeams = body.maxTeams;
    }
    await tournament.save();
    handleSuccess(res, responseSuccess.tournament_updated);
    
});

// delete tournament
router.delete("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);

    if(user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);

    const params = req.params;
    if (!VerifyTournament.id(params.id)) throw new Error(responseErrors.bad_format);
    const tournament = await Tournament.findById(params.id);
    if (!tournament) throw new Error(responseErrors.tournament_not_found);
    await Tournament.findByIdAndDelete(params.id);
    handleSuccess(res, responseSuccess.tournament_deleted);
})

router.patch("/:id/join", async (req, res) => {
    if(!req.user) throw new Error(responseErrors.unauthorized)
    const user = await checkUser(req.user)

    const team = await Team.findOne({ capitan: user.id})
    if(!team) throw new Error(responseErrors.team_not_found)

    const joinedTournament = await Tournament.findOne({ teams: team.id, finished: false})
    if(joinedTournament) throw new Error(responseErrors.can_join_only_one_team)
    
    if(team.players.length < 5) throw new Error(responseErrors.not_enough_players)

    const params = req.params

    if(!VerifyTournament.id(params.id)) throw new Error(responseErrors.bad_format)
    const tournament = await Tournament.findById(params.id)
    console.log(tournament)
    if(!tournament) throw new Error(responseErrors.tournament_not_found)
    if(tournament.teams.includes(team.id)) throw new Error(responseErrors.already_joined)
    if(tournament.startRegistration > new Date()) throw new Error(responseErrors.forbidden)
    if(tournament.endRegistration < new Date()) throw new Error(responseErrors.forbidden)
    if(tournament.teams.length >= tournament.maxTeams) throw new Error(responseErrors.reached_max_teams)

    tournament.teams.push(team.id)

    await tournament.save()

    handleSuccess(res, responseSuccess.tournament_joined)
})

router.patch("/leave", async (req, res) => {
    if(!req.user) throw new Error(responseErrors.unauthorized)
    const user = await checkUser(req.user)

    const team = await Team.findOne({ capitan: user.id})
    if(!team) throw new Error(responseErrors.team_not_found)

    const tournament = await Tournament.findOne({ teams: team.id, finished: false})
    console.log(tournament)
    if(!tournament) throw new Error(responseErrors.not_in_tournament)

    //delete team from tournament
    tournament.teams = tournament.teams.filter(t => t != team.id)
    await tournament.save()

    handleSuccess(res, responseSuccess.tournament_left)
})

export default router;
