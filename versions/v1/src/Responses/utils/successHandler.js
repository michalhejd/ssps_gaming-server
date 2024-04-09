import { responseSuccess } from "./responseTemplate.js";

export function handleSuccess(res, response, data) {
    switch (response) {
        case responseSuccess.success:
            res.status(200).json({ meta: { message: "Success", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.users_found:
            res.status(200).json({ meta: { message: "Users found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.user_found:
            res.status(200).json({ meta: { message: "User found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.user_updated:
            res.status(200).json({ meta: { message: "User updated", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.login_success:
            res.status(200).json({ meta: { message: "Login successful", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.logout_success:
            res.status(200).json({ meta: { message: "Logout successful", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.user_verified:
            res.status(200).json({ meta: { message: "User verified", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.verification_email_sent:
            res.status(200).json({ meta: { message: "Verification email sent", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.games_found:
            res.status(200).json({ meta: { message: "Games found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.game_found:
            res.status(200).json({ meta: { message: "Game found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.game_updated:
            res.status(200).json({ meta: { message: "Game updated", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.teams_found:
            res.status(200).json({ meta: { message: "Teams found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.team_found:
            res.status(200).json({ meta: { message: "Team found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.team_updated:
            res.status(200).json({ meta: { message: "Team updated", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.team_deleted:
            res.status(200).json({ meta: { message: "Team deleted", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.team_players_found:
            res.status(200).json({ meta: { message: "Team players found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.team_player_removed:
            res.status(200).json({ meta: { message: "Team player removed", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.team_left:
            res.status(200).json({ meta: { message: "Team left", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.invitation_sent:
            res.status(200).json({ meta: { message: "Invitation sent", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.request_sent:
            res.status(200).json({ meta: { message: "Request sent", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.invitation_deleted:
            res.status(200).json({ meta: { message: "Invitation deleted", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.invitations_found:
            res.status(200).json({ meta: { message: "Invitations found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.requests_found:
            res.status(200).json({ meta: { message: "Requests found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.invitation_declined:
            res.status(200).json({ meta: { message: "Invitation declined", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.invitation_accepted:
            res.status(200).json({ meta: { message: "Invitation accepted", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.tournaments_found:
            res.status(200).json({ meta: { message: "Tournaments found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.tournament_found:
            res.status(200).json({ meta: { message: "Tournament found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.tournament_updated:
            res.status(200).json({ meta: { message: "Tournament updated", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.tournament_deleted:
            res.status(200).json({ meta: { message: "Tournament deleted", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.tournament_joined:
            res.status(200).json({ meta: { message: "Tournament joined", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.steam_connection:
            res.status(200).json({ meta: { message: "Sending link", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.tournament_left:
            res.status(200).json({ meta: { message: "Tournament left", date: Date.now(), status: 200 } });
            return
        case responseSuccess.options_found:
            res.status(200).json({ meta: { message: "Options found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.user_created:
            res.status(201).json({ meta: { message: "User successfully created", date: Date.now(), status: 201 } });
            return;
        case responseSuccess.game_created:
            res.status(201).json({ meta: { message: "Game successfully created", date: Date.now(), status: 201 } });
            return;
        case responseSuccess.team_created:
            res.status(201).json({ meta: { message: "Team successfully created", date: Date.now(), status: 201 } });
            return;
        case responseSuccess.tournament_created:
            res.status(201).json({ meta: { message: "Tournament successfully created", date: Date.now(), status: 201 } });
            return;
        default:
            res.status(500).json({ meta: { message: "Internal server error", date: Date.now(), status: 500 } });
            return;
    }
}