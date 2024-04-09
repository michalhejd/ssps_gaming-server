/**
 * @swagger
 * /users:
 *  get:
 *      summary: Get all users
 *      tags: [Users]
 *      parameters:
 *          - name: page
 *            in: query
 *            description: Page number
 *            required: false
 *            schema:
 *              type: Number
 *          - name: sort
 *            in: query
 *            description: Sort by
 *            required: false
 *            schema:
 *              type: String
 *      responses:
 *          200:
 *              description: Users were returned.
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
 *                                          example: Users found
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      users:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  _id:
 *                                                      type: String
 *                                                      example: 5f9f1b9b0b9b9b9b9b9b9b9b9
 *                                                  email:
 *                                                      type: String
 *                                                      example: novak.ja.2020@skola.ssps.cz
 *                                                  nickname:
 *                                                      type: String
 *                                                      example: Janecek1
 *                                                  name:
 *                                                      type: String
 *                                                      example: Jan Novák
 *                                                  birthdate:
 *                                                      type: Date
 *                                                      example: 2004-01-01T00:00:00.000Z
 *                                                  role:
 *                                                      type: Number
 *                                                      example: 0
 *                                                  verified:
 *                                                      type: Boolean
 *                                                      example: true
 *                                      maxPages:
 *                                          type: Number
 *                                          example: 2
 *                                      currentPage:
 *                                          type: Number
 *                                          example: 1
 *          401:
 *              description: Unauthorized.
 *          403:
 *              description: Forbidden.
 *          500:
 *              description: Internal server error.
 * 
 */

/**
 * @swagger
 * /users/@self:
 *  get:
 *      summary: Get self user data
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Found user.
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
 *                                          example: User found
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
 *                                          example: 642ad0a05938a24b3c8a501e
 *                                      email:
 *                                          type: String
 *                                          example: novak.ja.2020@skola.ssps.cz
 *                                      nickname:
 *                                          type: String
 *                                          example: Janecek1
 *                                      name: 
 *                                          type: String
 *                                          example: Jan Novák
 *                                      birthdate:
 *                                          type: Date
 *                                          example: 2004-01-01T00:00:00.000Z
 *                                      role: 
 *                                          type: Number
 *                                          example: 0
 *                                      verified:
 *                                          type: Boolean
 *                                          example: true
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Internal server error.
 */

/**
 * @swagger
 * /users/{id}:
 *  get:
 *      summary: Get user data by id
 *      tags: [Users]
 *      operationId: getUserById
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID of user to return
 *          required: true
 *          schema:
 *             type: string
 *      responses:
 *          200:
 *              description: Found user.
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
 *                                          example: User found
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
 *                                          example: 642ad0a05938a24b3c8a501e
 *                                      email:
 *                                          type: String
 *                                          example: novak.ja.2020@skola.ssps.cz
 *                                      nickname:
 *                                          type: String
 *                                          example: Janecek1
 *                                      name:
 *                                          type: String
 *                                          example: Jan Novák
 *                                      birthdate:
 *                                          type: Date
 *                                          example: 2004-01-01T00:00:00.000Z
 *                                      role:
 *                                          type: Number
 *                                          example: 0
 *                                      verified:
 *                                          type: Boolean
 *                                          example: true
 *          401:
 *              description: Unauthorized.
 *          403:
 *              description: Forbidden.
 *          404:
 *              description: User not found.
 *          500:
 *              description: Internal server error.
 */ 

/**
 * @swagger
 * /users/login:
 *  post:
 *      summary: Login a user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: String
 *                              example: novak.ja.2023@skola.ssps.cz
 *                          password:
 *                              type: String
 *                              example: Novacekjan123
 *      responses:
 *          200:
 *              description: Login successful
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
 *                                          example: Login successful
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *                                          
 *          400:
 *             description: Bad request
 *          409:
 *             description: User already logged in
 *          500:
 *             description: Internal server error
 * 
 * 
 */

/**
* @swagger
* /users/register:
*  post:
*      summary: Create a new user
*      tags: [Users]
*      requestBody:
*          required: true
*          content: 
*              application/json:
*                  schema:
*                      type: object
*                      properties: 
*                          email:
*                              type: String
*                              example: novak.ja.2023@skola.ssps.cz
*                          nickname:
*                              type: String
*                              example: Janecek1
*                          name:
*                              type: String
*                              example: Jan Novák
*                          password:
*                              type: String
*                              example: Novacekjan123
*                          birthdate:
*                              type: String
*                              example: 2021-02-01
*      responses:
*          200: 
*              description: User was created.
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          properties:
*                               meta:
*                                   type: object
*                                   properties:
*                                       message:
*                                           type: String
*                                           example: User successfully created
*                                       date:
*                                           type: Date
*                                           example: 1680895221293
*                                       status:
*                                           type: Number
*                                           example: 201
*          400:
*              description: Bad format.
*          409:
*              description: User already exists.
*          500:
*              description: Internal server error.
*/

/**
* @swagger
* /users/resendVerification:
*  post:
*      summary: Resend verification email
*      tags: [Users]
*      requestBody:
*          required: true
*          content: 
*              application/json:
*                  schema:
*                      type: object
*                      properties:
*                          email:
*                              type: String
*                              example: novak.ja.2023@skola.ssps.cz
*      responses:
*          200: 
*              description: Email was sent.
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          properties:
*                               meta:
*                                   type: object
*                                   properties:
*                                       message:
*                                           type: String
*                                           example: Verification email sent
*                                       date:
*                                           type: Date
*                                           example: 1680895221293
*                                       status: 
*                                           type: Number
*                                           example: 200
*          400:
*              description: Bad format.
*          409:
*              description: User already exists.
*          500:
*              description: Internal server error.
*/

/**
 * @swagger
 * /users:
 *  post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                          email:
 *                              type: String
 *                              example: novak.ja.2023@skola.ssps.cz
 *                          nickname:
 *                              type: String
 *                              example: Janecek1
 *                          name:
 *                              type: String
 *                              example: Jan Novák
 *                          password:
 *                              type: String
 *                              example: Novacekjan123
 *                          birthdate:
 *                              type: String
 *                              example: 2021-02-01
 *      responses:
 *          200:
 *              description: User was created.
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
 *                                          example: User successfully created
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status: 
 *                                          type: Number
 *                                          example: 201
 *          400:
 *              description: Bad format.
 *          401:
 *              description: Unauthorized.
 *          403:
 *              description: Forbidden.
 *          409:
 *              description: Already exists.
 *          500:
 *              description: Internal server error.
 *                      
 */


/**
 * @swagger
 * /users/@self:
 *  put:
 *      summary: Update self user data
 *      tags: [Users]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nickname:
 *                              type: String
 *                              example: Janecek1
 *                          oldPassword:
 *                              type: String
 *                              example: JanecekNovak123
 *                          newPassword:
 *                              type: String
 *                              example: JanecekNovak1234
 *      responses:
 *          200:
 *              description: User updated.
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
 *                                          example: User updated
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 * 
 *          400:
 *              description: Bad request.
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Internal server error.
 */

/**
 * @swagger
 * /users/{id}:
 *  put:
 *      summary: Update user data by id
 *      tags: [Users]
 *      operationId: updateUserById
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID of user to update
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          description: User object that needs to be updated
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nickname:
 *                              type: String
 *                              example: Janecek1
 *                          name:
 *                              type: String
 *                              example: Jan Novák
 *                          birthdate:
 *                              type: Date
 *                              example: 1680895221293
 *                          role:
 *                              type: Number
 *                              example: 0
 *                          verified:
 *                              type: Boolean
 *                              example: true
 *                          email:
 *                              type: String
 *                              example: novak.ja.2020@skola.ssps.cz
 *      responses:
 *          200:
 *              description: User updated.
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
 *                                          example: User updated
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status: 
 *                                          type: Number
 *                                          example: 200
 *          401:
 *              description: Unauthorized.
 *          403:
 *              description: Forbidden.
 *          404:
 *              description: User not found.
 *          500:
 *              description: Internal server error.
 * 
 */ 

/**
 * @swagger
 * /users/verify:
 *  patch:
 *      summary: Verify user
 *      tags: [Users]
 *      operationId: verifyUser
 *      requestBody:
 *          description: User email and code
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: String
 *                              description: User email
 *                              example: novak.ja.2023@skola.ssps.cz
 *                          code:
 *                              type: String
 *                              description: Code sent to user
 *                              example: 123456
 *      responses:
 *          200:
 *              description: User verified
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
 *                                          description: Message
 *                                          example: User verified
 *                                      date: 
 *                                          type: Date
 *                                          description: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          description: Status
 *                                          example: 200
 *          400:
 *              description: Bad request
 *          404:
 *              description: User not found
 *          409:
 *              description: User already verified
 *          500:
 *              description: Internal server error
 * 
 */ 

/**
 * @swagger
 * /users/verify/{id}:
 *  patch:
 *      summary: Verify user
 *      tags: [Users]
 *      operationId: verifyUser
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User id
 *            required: true
 *            schema:
 *              type: string
 *              example: 60a6c5b0b0b0b0b0b0b0b0b0
 *      responses:
 *          200:
 *              description: User verified
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
 *                                          description: Message
 *                                          example: User verified
 *                                      date:
 *                                          type: Date
 *                                          description: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          description: Status
 *                                          example: 200
 *          400:
 *              description: Bad format.
 *          404:
 *              description: User not found
 *          409:
 *              description: User already verified
 *          500:
 *              description: Internal server error
 */ 

/**
 * @swagger
 * /users/logout:
 *  delete:
 *      summary: Create a new user
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Successfully logout.
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
 *                                          example: Logout successful
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status: 
 *                                          type: Number
 *                                          example: 200
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Internal server error.
 *                      
 */