import express from "express"
import { handleSuccess } from "../../Responses/utils/successHandler.js"
import { responseSuccess } from "../../Responses/utils/responseTemplate.js"

const router = express.Router()

router.get("/", (req, res) => {
    handleSuccess(res, responseSuccess.success, { version: process.env.npm_package_version })
})

export default router