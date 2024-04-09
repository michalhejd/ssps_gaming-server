import express from 'express';
//express async errors must be imported near after express import and must have single quotes
import { config } from 'dotenv';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import cors from "cors";
import morgan from "morgan";
import mongoose from 'mongoose';
import swagger from './docs/swagger/swagger.js';
import v1 from "./versions/v1/router.js";
import { checkEnvironments } from './config/utils/checkEnvironments.js';
import { defaultRoot } from './config/utils/createDefaultRootUser.js';
import { globalLimiter } from './versions/v1/src/RateLimit/services/ratelimit.js';
import { checkVerisons } from './config/utils/checkVersions.js';
import { checkConnection } from './config/utils/checkConnection.js';

config();

checkVerisons()
checkEnvironments()
checkConnection()

mongoose.connect(process.env.DB || "mongodb://localhost:27017/ssps", {
}).then(() => {
    console.log("Connected to db");
}).catch((err) => {
    console.log(err);
});

await defaultRoot()

const app = express();
app.use(cors({
    origin: process.env.ORIGIN || "http://127.0.0.1:5173",
    credentials: true
}));
app.use(express.json())
app.use(cookieParser());
app.use(morgan('dev'));

app.use(globalLimiter)

app.use(swagger)

app.use("/api/v1", v1);

app.listen(process.env.PORT || 3000, () => {
    if (process.env.NODE_ENV == 'development')
        console.log(`Server running on port ${process.env.PORT || 3000}`);
    else
        console.log(`Server is running`);
});