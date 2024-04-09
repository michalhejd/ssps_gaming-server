/**
 * @swagger
 * /tournaments:
 *  get:
 *      summary: Get all tournaments
 *      tags: [Tournaments]
 *      responses:
 *          200:
 *              description: All tournaments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: Tournaments found
 *                                      date:
 *                                          type: string
 *                                          example: 2021-04-24T15:39:00.000Z
 *                                      status:
 *                                          type: number
 *                                          example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      tournaments:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  _id:
 *                                                      type: String
 *                                                      example: 6083b1a0c9b7c3b3b4f3b2a1
 *                                                  name:
 *                                                      type: String
 *                                                      example: Turnaj 1
 *                                                  game:
 *                                                      type: String
 *                                                      example: 6083b1a0c9b7c3b3b4f3b2a1
 *                                                  organizer:
 *                                                      type: String
 *                                                      example: 6083b1a0c9b7c3b3b4f3b2a1
 *                                                  startDate:
 *                                                      type: String
 *                                                      example: 2021-04-24T15:39:00.000Z
 *                                                  startRegistration:
 *                                                      type: String
 *                                                      example: 2021-04-24T15:39:00.000Z
 *                                                  endRegistration:
 *                                                      type: String
 *                                                      example: 2021-04-24T15:39:00.000Z
 *                                                  maxTeams:
 *                                                      type: number
 *                                                      example: 16
 *                                                  gameMode:
 *                                                      type: String
 *                                                      example: normal
 *
 *          401:
 *              description: Unauthorized
 * 
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /tournaments/{id}:
 *  get:
 *      summary: Get tournament by id
 *      tags: [Tournaments]
 *      parameters:
 *         - name: id
 *           in: path
 *           description: Tournament id
 *           required: true
 *           schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Tournament
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: Tournament found
 *                                      date:
 *                                          type: String
 *                                          example: 2021-04-24T15:39:00.000Z
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      _id:
 *                                          type: String
 *                                          example: 6083b1a0c9b7c3b3b4f3b2a1
 *                                      name:
 *                                          type: String
 *                                          example: Turnaj 1
 *                                      game:
 *                                          type: String
 *                                          example: 6083b1a0c9b7c3b3b4f3b2a1
 *                                      organizer:
 *                                          type: String
 *                                          example: 6083b1a0c9b7c3b3b4f3b2a1
 *                                      startDate:
 *                                          type: String
 *                                          example: 2021-04-24T15:39:00.000Z
 *                                      startRegistration:
 *                                          type: String
 *                                          example: 2021-04-24T15:39:00.000Z
 *                                      endRegistration:
 *                                          type: String
 *                                          example: 2021-04-24T15:39:00.000Z
 *                                      maxTeams:
 *                                          type: Number
 *                                          example: 16
 *                                      gameMode:
 *                                          type: String
 *                                          example: normal
 *          400:
 *              description: Bad format
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Tournament not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /tournaments:
 *  post:
 *      summary: Create tournament
 *      tags: [Tournaments]
 *      requestBody:
 *          description: Tournament object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: String
 *                              example: Turnaj 1
 *                          game:
 *                              type: String
 *                              example: 6083b1a0c9b7c3b3b4f3b2a1
 *                          startDate:
 *                              type: String
 *                              example: 2021-04-24T15:39:00.000Z
 *                          startRegistration:
 *                              type: String
 *                              example: 2021-04-24T15:39:00.000Z
 *                          endRegistration:
 *                              type: String
 *                              example: 2021-04-24T15:39:00.000Z
 *                          maxTeams:
 *                              type: number
 *                              example: 16
 *                          gameMode:
 *                              type: String
 *                              example: normal
 *      responses:
 *          201:
 *              description: Tournament created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: Tournament successfully created
 *                                      date:
 *                                          type: String
 *                                          example: 2021-04-24T15:39:00.000Z
 *                                      status:
 *                                          type: Number
 *                                          example: 201
 *          400:
 *              description: Bad format
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          409:
 *              description: Name already exists
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /tournaments/{id}:
 *  put:
 *      summary: Update tournament
 *      tags: [Tournaments]
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Tournament id
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          description: Tournament object
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: String
 *                              example: Turnaj 1
 *                          game:
 *                              type: String
 *                              example: 6083b1a0c9b7c3b3b4f3b2a1
 *                          startDate:
 *                              type: String
 *                              example: 2021-04-24T15:39:00.000Z
 *                          startRegistration:
 *                              type: String
 *                              example: 2021-04-24T15:39:00.000Z
 *                          endRegistration:
 *                              type: String
 *                              example: 2021-04-24T15:39:00.000Z
 *                          maxTeams:
 *                              type: number
 *                              example: 16
 *                          gameMode:
 *                              type: String
 *                              example: normal
 *      responses:
 *          200:
 *              description: Tournament updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: Tournament updated
 *                                      date:
 *                                          type: String
 *                                          example: 2021-04-24T15:39:00.000Z
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *          400:
 *              description: Bad format
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Tournament not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /tournaments/{id}:
 *  delete:
 *      summary: Delete tournament
 *      tags: [Tournaments]
 *      parameters:
 *          - name: id
 *            in: path
 *            description: Tournament id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Tournament deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: Tournament deleted
 *                                      date:
 *                                          type: String
 *                                          example: 2021-04-24T15:39:00.000Z
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *          400:
 *              description: Bad format
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Tournament not found
 *          500:
 *              description: Internal server error
 */