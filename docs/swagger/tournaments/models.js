/**
 * @swagger
 * components:
 *  schemas:
 *     Tournament:
 *      type: object
 *      required:
 *          - name
 *          - organizer
 *          - game
 *          - startDate
 *          - startRegistration
 *          - endRegistration
 *          - maxTeams
 *          - gameMode
 *      properties:
 *          name:
 *              type: String
 *              example: 'SSPS Gaming Tournament'
 *          organizer:
 *              type: String
 *              example: '5f9e9b1b9c0a9e2a3c9b1b9c'
 *          game:
 *              type: String
 *              example: '5f9e9b1b9c0a9e2a3c9b1b9c'
 *          startDate:
 *              type: String
 *              example: '2020-11-01T00:00:00.000Z'
 *          startRegistration:
 *              type: String
 *              example: '2020-10-01T00:00:00.000Z'
 *          endRegistration:
 *              type: String
 *              example: '2020-10-31T00:00:00.000Z'
 *          teams:
 *              type: [String]
 *              example: ['5f9e9b1b9c0a9e2a3c9b1b9c']
 *          maxTeams:
 *              type: Number
 *              example: 16
 *          gameMode:
 *              type: String
 *              example: 'normal'
 */