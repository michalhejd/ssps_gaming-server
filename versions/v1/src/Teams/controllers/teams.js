import express from "express"
import Team from "../models/Team.js";
import Invitation, { invType } from "../models/Invitation.js";
import { responseErrors, responseSuccess } from "../../Responses/utils/responseTemplate.js";
import { handleSuccess } from "../../Responses/utils/successHandler.js";
import { checkUser } from "../../Users/services/checkUser.js";
import User, { roles } from "../../Users/models/User.js";
import { VerifyTeam } from "../utils/verifyTeam.js";
import { formatUsers } from "../../Users/utils/getFormatter.js";
const router = express.Router()

// get teams
router.get("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    await checkUser(req.user)
    const teams = await Team.find()
    handleSuccess(res, responseSuccess.teams_found, teams)
})

// get team I'm in
router.get("/@me", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    const user = await checkUser(req.user)
    const team = await Team.findOne({ players: user._id })
    if (!team) throw new Error(responseErrors.team_not_found)
    handleSuccess(res, responseSuccess.team_found, team)
})

// get team by id
router.get("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    await checkUser(req.user)
    const params = req.params
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format)
    const team = await Team.findById(params.id)
    if (!team) throw new Error(responseErrors.team_not_found)
    handleSuccess(res, responseSuccess.team_found, team)
})

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
    handleSuccess(res, responseSuccess.team_created, team);
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
    if (team.capitan != user.id) throw new Error(responseErrors.forbidden);
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
    handleSuccess(res, responseSuccess.team_updated, team);
});

// delete team
router.delete("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const team = await Team.findById(params.id);
    if (!team) throw new Error(responseErrors.team_not_found);
    // can`t delete team if team is joined in tournament
    if (team.capitan != user.id) throw new Error(responseErrors.forbidden);
    await Team.deleteOne({ _id: params.id });
    handleSuccess(res, responseSuccess.team_deleted);
});

// get team members
router.get("/:id/members", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if user is verified
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const team = await Team.findById(params.id);
    if (!team) throw new Error(responseErrors.team_not_found);
    const members = await User.find({ _id: { $in: team.players } }).lean();
    handleSuccess(res, responseSuccess.team_players_found, formatUsers(members));
});

// remove member from team
router.delete("/:id/members/:memberId", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if user is verified
    const user = await checkUser(req.user);
    // can't remove member if tournament is ongoing
    const params = req.params;
    if (!VerifyTeam.id(params.id) || !VerifyTeam.id(params.memberId)) throw new Error(responseErrors.bad_format);
    const team = await Team.findById(params.id);
    if (!team) throw new Error(responseErrors.team_not_found);
    if (team.capitan != user.id) throw new Error(responseErrors.forbidden);
    if (params.memberId == capitan) throw new Error(responseErrors.cant_remove_yourself);
    if (!team.players.includes(params.memberId)) throw new Error(responseErrors.player_not_found);
    team.players = team.players.filter(player => player != params.memberId);
    await team.save();
    handleSuccess(res, responseSuccess.team_player_removed);
});

router.delete("/:id/leave", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if user is verified
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const team = await Team.findById(params.id);
    if (!team) throw new Error(responseErrors.team_not_found);
    if (team.capitan == user.id) throw new Error(responseErrors.cant_leave_your_team);
    if (!team.players.includes(user._id)) throw new Error(responseErrors.cant_leave_team_not_in);
    team.players = team.players.filter(player => player != user._id);
    await team.save();
    handleSuccess(res, responseSuccess.team_left);
});

router.post("/:id/invite", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if user is verified
    const user = await checkUser(req.user);
    const params = req.params;
    // heck if params.id is in correct format
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    // check if team exists
    const team = await Team.findById(params.id);
    if (!team) throw new Error(responseErrors.team_not_found);
    if(team.players.length >= team.maxPlayers) throw new Error(responseErrors.team_full);
    if(team.invitations !== true && team.capitan !== user.id) throw new Error(responseErrors.invitations_disabled);
    const body = req.body;
    // id of user to invite
    if (!VerifyTeam.id(body.userId)) throw new Error(responseErrors.bad_format);
    const userToInvite = await User.findById(body.userId);
    if (!userToInvite) throw new Error(responseErrors.user_not_found);
    if (team.players.includes(body.userId)) throw new Error(responseErrors.already_in_team);
    if(await Invitation.find({toUser: body.userId, team: params.id})) throw new Error(responseErrors.already_invited);
    const invitation = new Invitation({
        fromUser: user._id,
        toUser: body.userId,
        team: params.id,
        type: invType.invitation
    });
    await invitation.save();
    handleSuccess(res, responseSuccess.invitation_sent);
});

router.post("/:id/request", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    if(await Team.find({ players: user._id })) throw new Error(responseErrors.already_in_team);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const team = await Team.findById(params.id);
    if (!team) throw new Error(responseErrors.team_not_found);
    if (team.players.includes(user._id)) throw new Error(responseErrors.already_in_team);
    if(team.players.length >= team.maxPlayers) throw new Error(responseErrors.team_full);
    if(await Invitation.find({toUser: user._id, team: params.id})) throw new Error(responseErrors.already_requested);
    const invitation = new Invitation({
        fromUser: user._id,
        toUser: team.capitan,
        team: params.id,
        type: invType.request
    });
    await invitation.save();
    handleSuccess(res, responseSuccess.request_sent);
});

router.delete("/players/invitation/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const invitation = await Invitation.findById(params.id);
    if (!invitation) throw new Error(responseErrors.invitation_not_found);
    if (invitation.toUser != user.id || invitation.fromUser != user.id) throw new Error(responseErrors.forbidden);
    await Invitation.findByIdAndDelete(params.id);
    handleSuccess(res, responseSuccess.invitation_deleted);
});

router.patch("/players/invitation/:id/accept", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const invitation = await Invitation.findById(params.id);
    if (!invitation) throw new Error(responseErrors.invitation_not_found);
    if (invitation.toUser != user.id) throw new Error(responseErrors.forbidden);
    const team = await Team.findById(invitation.team);
    if (!team) throw new Error(responseErrors.team_not_found);
    if (team.players.includes(user.id)) throw new Error(responseErrors.already_in_team);
    if(team.players.length >= team.maxPlayers) throw new Error(responseErrors.team_full);
    const usersTeam = await Team.find({ players: user._id });
    if (usersTeam.capitan == user.id) throw new Error(responseErrors.already_in_team);
});

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

router.get("/@me/invitations", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const invitations = await Invitation.find({toUser: user._id, type: invType.invitation});
    handleSuccess(res, responseSuccess.invitations_found, invitations);
});

router.get("/@me/requests", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);
    const params = req.params;
    if (!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format);
    const requests = await Invitation.find({toUser: user._id, type: invType.request});
    handleSuccess(res, responseSuccess.requests_found, requests);
});


export default router;