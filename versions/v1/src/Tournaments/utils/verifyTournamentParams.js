import mongoose from "mongoose";
import { VerifyTournament } from "./verifyTournament.js";

export function verifyTournamentBody(name, game, startDate, startRegistration, endRegistration, maxTeams, gameMode) {
    if(!VerifyTournament.name(name)) return false;

    if(!VerifyTournament.id(game)) return false;

    if(!VerifyTournament.date(startDate)) return false;

    if(!VerifyTournament.date(startRegistration)) return false;

    if(!VerifyTournament.date(endRegistration)) return false;

    if(new Date(startRegistration) >= new Date(endRegistration)) return false;

    if(new Date(startDate) <= new Date(endRegistration)) return false;

    if(!VerifyTournament.maxTeams(maxTeams)) return false;

    if(!VerifyTournament.gameMode(gameMode)) return false;

    return true;
}