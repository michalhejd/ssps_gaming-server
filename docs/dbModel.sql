// Use DBML to define your database structure
// Docs: https://www.dbml.org/docs

Table users {
  _id ObjectId [primary key]
  email String
  nickname String
  name String
  password String
  birthdate Date
  role String
}

Table tournaments {
  _id ObjectId [primary key]
  name String
  organizer ObjectId
  game ObjectId
  start Date
  end Date
  startRegistration Date
  endRegistration Date
  teams Array
  maxTeams Int32
  gameMode String
}


Table games {
  _id ObjectId [primary key]
  name String
  shortName String
  slug String
  description String
}

Table errors {
  _id ObjectId [primary key]
  error String
  dateOfError Date
}


Table teams {
  _id ObjectId [primary key]
  name String
  shortName String
  players Array
  owner ObjectId
  invitations Boolean
}

Table matches {
  _id ObjectId [primary key]
  matchDate Date
  team1 ObjectId
  team2 ObjectId
  winner ObjectId
  scoreTeam1 Int32
  scoreTeam2 Int32
}

Table brackets {
  _id ObjectId [primary key]
}

Table groups {
  _id ObjectId [primary key]
}

Table teamInvitations {
  _id ObjectId [primary key]
  team ObejctId
  from ObjectId
  to ObjectId
}

Table teamRequests {
  _id ObjectId [primary key]
  team ObjectId
  from ObjectId
}

Table token {
  _id ObjectId [primary key]
  code String
  user ObjectId
}

Ref: teams.players > users._id
Ref: tournaments.teams > teams._id
Ref: tournaments.organizer - users._id
Ref: tournaments.game - games._id
Ref: teams.owner - users._id
Ref: teamInvitations.team - teams._id
Ref: teamInvitations.from - users._id
Ref: teamInvitations.to - users._id
Ref: teamRequests.team - teams._id
Ref: teamRequests.from - users._id
Ref: matches.team1 - teams._id
Ref: matches.team2 - teams._id
Ref: matches.winner - teams._id
Ref: token.user - users._id