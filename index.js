import express from "express";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2"
import * as dotenv from "dotenv";
import { createUser, getPT, getUser, getUserByEmail, getVendor } from "./models/user.js";
dotenv.config();

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
// app.use("/",router)
const prisma = new PrismaClient();

app.get("/register", async (req, res, next) => {
    res.render("register");
});
app.post("/register", async (req, res, next) => {
  let create = await createUser(req.body.data)
  if(create){
    res.redirect('/register')
  }
});
app.get("/login", async (req, res, next) => {
    res.render("login");
    return
});
app.post("/login", async (req, res, next) => {
  let create = await getUserByEmail(req.body.data)
  console.log(create)
  const verify = await argon2.verify(create.password, req.body.data.password);
  if(!verify){
    res.render('login',{alert:"password salah"})
    return
  }
  if(create){
    res.render('login',{info:"login success"})
    return
  }
});
app.get("/", async (req, res, next) => {
    const user = await getVendor();
    if (user) {
        console.log(user);
        res.render("index", { users: user });
    }
});
app.get("/test", async (req, res, next) => {
    let updateTime = new Date();
    const user = await prisma.procurement.update({
        where: { id: 1 },
        data: { progress: 100 },
    });
    if (user) {
        console.log(user);
        res.render("index", { users: user });
    }
});

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
// ongoing-project sedang dikerjakan
// cancel -- by vendor
// finish
// success

// -- payment
// pending
// processing
// success
