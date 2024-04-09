import express, { response } from "express"
import Team from "../models/Team.js";
import Invitation, { invType } from "../models/Invitation.js";
import { responseErrors, responseSuccess } from "../../Responses/utils/responseTemplate.js";
import { handleSuccess } from "../../Responses/utils/successHandler.js";
import { checkUser } from "../../Users/services/checkUser.js";
import User, { roles } from "../../Users/models/User.js";
import Tournament from "../../Tournaments/models/Tournament.js";
import { VerifyTeam } from "../utils/verifyTeam.js";

const router = express.Router();

// get teams
router.get("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    await checkUser(req.user)
    const teams = await Team.find().select("-__v -createdAt -updatedAt")
    handleSuccess(res, responseSuccess.teams_found, {teams})
});

// get team I'm in
router.get("/@me", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    const user = await checkUser(req.user)
    const team = await Team.findOne({ players: user._id }).select("-__v -createdAt -updatedAt")
    if (!team) throw new Error(responseErrors.team_not_found)
    handleSuccess(res, responseSuccess.team_found, team)
});

// get all requests from user to teams (inbox for requests) - only reciever can get
router.get("/@me/requests/sent", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const requests = await Invitation.find({ fromUser: user.id, type: invType.request }).select("-__v -createdAt -updatedAt");
    handleSuccess(res, responseSuccess.requests_found, {requests});
});

// get all invitations for user (inbox for invitations) - only receiver can get
router.get("/@me/invitations/received", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const invitations = await Invitation.find({ toUser: user.id, type: invType.invitation }).select("-__v -createdAt -updatedAt");
    handleSuccess(res, responseSuccess.invitations_found, {invitations});
});

router.get("/@me/invitations/sent", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const invitations = await Invitation.find({ fromUser: user.id, type: invType.invitation }).select("-__v -createdAt -updatedAt");
    handleSuccess(res, responseSuccess.invitations_found, {invitations});
});

// get all requests from team to user (inbox for requests) - only reciever can get
router.get("/@me/requests/received", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const requests = await Invitation.find({ toUser: user.id, type: invType.request }).select("-__v -createdAt -updatedAt");
    handleSuccess(res, responseSuccess.requests_found, {requests});
});


// get team by id
router.get("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    await checkUser(req.user)
    const params = req.params
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format)
    const team = await Team.findById(params.id).select("-__v -createdAt -updatedAt")
    if (!team) throw new Error(responseErrors.team_not_found)
    handleSuccess(res, responseSuccess.team_found, team)
});


// get team members - everyone can see
router.get("/:id/members", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if user is verified
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const team = await Team.findById(params.id);
    if (!team) throw new Error(responseErrors.team_not_found);
    const members = await User.find({ _id: { $in: team.players } }).lean().select('-password -__v -expiresAt -createdAt -updatedAt');
    handleSuccess(res, responseSuccess.team_players_found, {members});
});

// create team
router.post("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if user is verified
    const user = await checkUser(req.user);
    // user can only be in one team
    const existingTeam = await Team.findOne({ capitan: user._id });
    if (existingTeam) throw new Error(responseErrors.already_has_team);
    // user can only be in one team
    const playerInTeam = await Team.findOne({ players: user._id });
    if (playerInTeam) throw new Error(responseErrors.already_in_team);
    const body = req.body;
    // name must be unique
    if (await Team.findOne({ name: body.name })) throw new Error(responseErrors.name_already_exists);
    if (!VerifyTeam.name(body.name) || !VerifyTeam.invitations(body.invitations)) throw new Error(responseErrors.bad_format);
    const team = new Team({
        name: body.name,
        capitan: user._id,
        players: [user._id],
        invitations: body.invitations
    });
    await team.save();
    handleSuccess(res, responseSuccess.team_created);
});


// invite player to team - only capitan can invite
router.post("/invite/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if user is verified
    const user = await checkUser(req.user);
    const team = await Team.findOne({players: user.id});

    // check if im in a team
    if (!team) throw new Error(responseErrors.not_in_team);

    // check if im capitan or invitations are enabled
    if (team.invitations !== true && team.capitan !== user.id) throw new Error(responseErrors.invitations_disabled);

    const params = req.params;
    // id of user to invite
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const userToInvite = await User.findById(params.id);
    if (!userToInvite) throw new Error(responseErrors.user_not_found);
    if (team.players.includes(params.id)) throw new Error(responseErrors.already_in_team);
    if (await Invitation.findOne({ toUser: params.id, team: team.id, type: invType.invitation })) throw new Error(responseErrors.already_invited);
    const invitation = new Invitation({
        fromUser: user.id,
        toUser: params.id,
        team: team.id,
        type: invType.invitation
    });
    await invitation.save();
    handleSuccess(res, responseSuccess.invitation_sent);
});

// request to join team - everyone can request
router.post("/:id/request", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    if (await Team.findOne({ players: user._id })) throw new Error(responseErrors.already_in_team);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const team = await Team.findById(params.id);
    if (!team) throw new Error(responseErrors.team_not_found);
    if (team.players.includes(user._id)) throw new Error(responseErrors.already_in_team);
    if (team.players.length >= team.maxPlayers) throw new Error(responseErrors.team_full);
    if (await Invitation.findOne({ fromUser: user._id, team: params.id, type: invType.request })) throw new Error(responseErrors.already_requested);
    const invitation = new Invitation({
        fromUser: user._id,
        toUser: team.capitan,
        team: params.id,
        type: invType.request
    });
    await invitation.save();
    handleSuccess(res, responseSuccess.request_sent);
});

// update team
router.put("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if user is verified
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const team = await Team.findById(params.id);
    if (!team) throw new Error(responseErrors.team_not_found);
    if (team.capitan != user.id || user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);
    const tournament = await Tournament.findOne({ teams: team.id, finished: false})
    if(tournament) throw new Error(responseErrors.cant_update_team_while_in_tournament)
    const body = req.body;
    // can't change password while tournament is ongoing
    if (body.name) {
        if (await Team.findOne({ name: body.name })) throw new Error(responseErrors.name_already_exists);
        if (!VerifyTeam.name(body.name)) throw new Error(responseErrors.bad_format);
        team.name = body.name;
    }
    if (body.invitations) {
        if (!VerifyTeam.invitations(body.invitations)) throw new Error(responseErrors.bad_format);
        team.invitations = body.invitations;
    }
    await team.save();
    handleSuccess(res, responseSuccess.team_updated);
});

// leave team - everyone can leave
router.delete("/leave", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if user is verified
    const user = await checkUser(req.user);
    const team = await Team.findOne({players: user.id});
    if (!team) throw new Error(responseErrors.team_not_found);
    const tournament = await Tournament.findOne({ teams: team.id, finished: false})
    if(tournament) throw new Error(responseErrors.cant_update_team_while_in_tournament)
    if (team.capitan == user.id) throw new Error(responseErrors.cant_leave_your_team);
    if (!team.players.includes(user.id)) throw new Error(responseErrors.cant_leave_team_not_in);
    // keep all users in team except user who left
    team.players = team.players.filter(player => player != user.id);
    await team.save();
    handleSuccess(res, responseSuccess.team_left);
});

// delete invitation - only sender can delete
router.delete("/players/invitation/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const invitation = await Invitation.findById(params.id);
    if (!invitation) throw new Error(responseErrors.invitation_not_found);
    if (invitation.fromUser != user.id) throw new Error(responseErrors.forbidden);
    await Invitation.findByIdAndDelete(params.id);
    handleSuccess(res, responseSuccess.invitation_deleted);
});

// delete team - only capitan can delete team
router.delete("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const team = await Team.findById(params.id);
    if (!team) throw new Error(responseErrors.team_not_found);
    const tournament = await Tournament.findOne({ teams: team.id, finished: false})
    if(tournament) throw new Error(responseErrors.cant_update_team_while_in_tournament)
    // can`t delete team if team is joined in tournament
    if (team.capitan != user.id) throw new Error(responseErrors.forbidden);
    await Team.deleteOne({ _id: params.id });
    handleSuccess(res, responseSuccess.team_deleted);
});


// remove member from team - only capitan can remove
router.delete("/members/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if user is verified
    const user = await checkUser(req.user);
    const team = await Team.findOne({players: user.id});
    const tournament = await Tournament.findOne({ teams: team.id, finished: false})
    if(tournament) throw new Error(responseErrors.cant_update_team_while_in_tournament)
    if(!team) throw new Error(responseErrors.team_not_found);
    if(team.capitan != user.id) throw new Error(responseErrors.forbidden);
    // can't remove member if tournament is ongoing
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    if (params.id == team.capitan) throw new Error(responseErrors.cant_remove_yourself);
    if (!team.players.includes(params.id)) throw new Error(responseErrors.player_not_found);
    team.players = team.players.filter(player => player != params.id);
    await team.save();
    handleSuccess(res, responseSuccess.team_player_removed);
});


// accept invitation - only receiver can accept
router.patch("/players/invitation/:id/accept", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const invitation = await Invitation.findById(params.id);
    if (!invitation) throw new Error(responseErrors.invitation_not_found);
    const team = await Team.findById(invitation.team);
    if (!team) {
        await Invitation.findByIdAndDelete(invitation.id)
        throw new Error(responseErrors.team_not_found);
    }
    const tournament = await Tournament.findOne({ teams: team.id, finished: false})
    if(tournament) throw new Error(responseErrors.cant_update_team_while_in_tournament)
    if (invitation.type == invType.invitation) {
        if (invitation.toUser != user.id) throw new Error(responseErrors.forbidden);
        if (team.players.includes(user.id)) {
            await Invitation.findByIdAndDelete(invitation.id)
            throw new Error(responseErrors.already_in_team);
        }
        if (team.players.length >= team.maxPlayers) {
            throw new Error(responseErrors.team_full);
        }
        team.players.push(user.id);
        await Invitation.findByIdAndDelete(invitation.id)
        await team.save();
        handleSuccess(res, responseSuccess.invitation_accepted);
    }
    else if (invitation.type == invType.request) {
        if (team.capitan != user.id) throw new Error(responseErrors.forbidden);
        if (team.players.includes(invitation.fromUser)) {
            await Invitation.findByIdAndDelete(invitation.id)
            throw new Error(responseErrors.already_in_team);
        }
        if (team.players.length >= team.maxPlayers) {
            throw new Error(responseErrors.team_full);
        }

        team.players.push(invitation.fromUser);
        await Invitation.findByIdAndDelete(invitation.id)
        await team.save();
        handleSuccess(res, responseSuccess.invitation_accepted);
    }
    else {
        Invitation.findByIdAndDelete(invitation.id)
        throw new Error(responseErrors.server_error);
    }
});

// decline invitation - only receiver can decline
router.patch("/players/invitation/:id/decline", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const invitation = await Invitation.findById(params.id);
    if (!invitation) throw new Error(responseErrors.invitation_not_found);
    if (invitation.toUser != user.id) throw new Error(responseErrors.forbidden);
    await Invitation.findByIdAndDelete(params.id);
    handleSuccess(res, responseSuccess.invitation_declined);
});



export default router;