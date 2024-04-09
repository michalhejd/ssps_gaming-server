/**
 * @swagger
 * /games:
 *  get:
 *     summary: Get all games
 *     description: Get all games
 *     tags: [Games]
 *     responses:
 *          200:
 *              description: Games were returned
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
 *                                          example: Games found
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      games:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  _id:
 *                                                      type: String
 *                                                      example: 5f9f1b9b0b9b9b9b9b9b9b9b9
 *                                                  name:
 *                                                      type: String
 *                                                      example: "Counter-Strike: Global Offensive"
 *                                                  shortName:
 *                                                      type: String
 *                                                      example: "CS:GO"
 *                                                  description:
 *                                                      type: String
 *                                                      example: "Counter-Strike: Global Offensive je multiplayerová střílečka z pohledu první osoby, která byla vydána v roce 2012. Jedná se o čtvrtý díl série Counter-Strike, který byl vydán v roce 1999 jako modifikace pro hru Half-Life. Hra je dostupná pro platformy Microsoft Windows, macOS, Linux, Xbox 360 a PlayStation 3."
 *                                                  slug:
 *                                                      type: String
 *                                                      example: "csgo"
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Server error
 * 
 */

/**
 * @swagger
 * /games/{id}:
 *  get:
 *      summary: Get a game
 *      description: Get a game
 *      tags: [Games]
 *      operationId: getGame
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID of the game
 *            required: true
 *            schema:
 *            type: string
 *      responses:
 *          200:
 *              description: Game was returned
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
 *                                          example: Game found
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      _id:
 *                                          type: String
 *                                          example: 5f9f1b9b0b9b9b9b9b9b9b9b9
 *                                      name:
 *                                          type: String
 *                                          example: "Counter-Strike: Global Offensive"
 *                                      shortName:
 *                                          type: String
 *                                          example: "CS:GO"
 *                                      description:
 *                                          type: String
 *                                          example: "Counter-Strike: Global Offensive je multiplayerová střílečka z pohledu první osoby, která byla vydána v roce 2012. Jedná se o čtvrtý díl série Counter-Strike, který byl vydán v roce 1999 jako modifikace pro hru Half-Life. Hra je dostupná pro platformy Microsoft Windows, macOS, Linux, Xbox 360 a PlayStation 3."
 *                                      slug:
 *                                          type: String
 *                                          example: "csgo"
 *          400:
 *              description: Bad format
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Game not found
 *          500:
 *              description: Server error
 */

/**
 * @swagger
 * /games:
 *  post:
 *      summary: Create a game
 *      description: Create a game
 *      tags: [Games]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: String
 *                              example: "Counter-Strike: Global Offensive"
 *                          shortName:
 *                              type: String
 *                              example: "CS:GO"
 *                          description:
 *                              type: String
 *                              example: "Counter-Strike: Global Offensive je multiplayerová střílečka z pohledu první osoby, která byla vydána v roce 2012. Jedná se o čtvrtý díl série Counter-Strike, který byl vydán v roce 1999 jako modifikace pro hru Half-Life. Hra je dostupná pro platformy Microsoft Windows, macOS, Linux, Xbox 360 a PlayStation 3."
 *                          slug:
 *                              type: String
 *                              example: "csgo"
 *      responses:
 *          200:
 *              description: Game was created
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
 *                                          example: Game successfully created
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
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
 *              description: Slug already taken
 *          500:
 *              description: Server error
 */

/**
 * @swagger
 * /games/{id}:
 *  put:
 *      summary: Update a game
 *      description: Update a game
 *      tags: [Games]
 *      operationId: updateGame
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID of the game
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: String
 *                              example: "Counter-Strike: Global Offensive"
 *                          shortName:
 *                              type: String
 *                              example: "CS:GO"
 *                          description:
 *                              type: String
 *                              example: "Counter-Strike: Global Offensive je multiplayerová střílečka z pohledu první osoby, která byla vydána v roce 2012. Jedná se o čtvrtý díl série Counter-Strike, který byl vydán v roce 1999 jako modifikace pro hru Half-Life. Hra je dostupná pro platformy Microsoft Windows, macOS, Linux, Xbox 360 a PlayStation 3."
 *                          slug:
 *                              type: String
 *                              example: "csgo"
 *      responses:
 *          200:
 *              description: Game was updated
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
 *                                          example: Game successfully updated
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
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
 *              description: Game not found
 *          409:
 *              description: Slug already taken
 *          500:
 *              description: Server error
 */