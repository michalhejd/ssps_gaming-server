/**
 * @swagger
 * components:
 *  schemas:
 *     User:
 *      type: object
 *      required:
 *          - email
 *          - nickname
 *          - name
 *          - password
 *          - birthdate
 *      properties:
 *           email:
 *              type: String
 *              example: novak.ja.2023@skola.ssps.cz
 *           nickname:
 *              type: String
 *              example: janecek1
 *           name:
 *              type: String
 *              example: Jan Novák
 *           password:
 *              type: String
 *              example: Novakjan01223
 *           birthdate:
 *              type: String
 *              example: 2000-01-01
 *           role:
 *              type: Number
 *              default: 0
 *           verified:
 *              type: Boolean
 *              default: false
 *              
 */