import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import moment from "moment";
import router from "./router/index.js";
dotenv.config();

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("public"));
// app.use("/static", express.static("public",{
//     maxAge: 1000 * 60 * 60 * 24 
//   }));
app.use(
    session({
        name: "mysecretKeySandbox",
        secret: "secretKeySandbox",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);
app.use(cookieParser());
app.use(function (req, res, next) {
    moment.locale("id")
    res.locals.profile = req.session.profile;
    res.locals.moment = moment;
    next();
});
app.use(morgan("dev"));
app.use("/", router);

app.listen(process.env.PORT, () =>
    console.log(`⚡️[server]: Server is running at http://localhost:3000`)
);

// status
// create eproc by pt
// see and take project eproc by vendor
// see all project & vendor by pt
// approve/takeover to vendor projects by pt
// ---vendor project estimate
// if 100% or success vendor claim to payment
// project payment by pt

// --- sale / dilelang / belum dibooking
// --- terbooking
// --- dikerjakan vendor / start project
// --- progress procurement
// --- project selesai Belum dibayar
//  --- project selesai sudah dibayar

// sale-lelang project
// booked-project sudah dibooking oleh pt-zzz
// diapprove
// ongoing-project sedang dikerjakan
// cancel -- by vendor
// finish
// success

// -- payment
// pending
// success
