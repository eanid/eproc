import express from "express";
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import {
    changePassword,
    createUser,
    getPT,
    getUser,
    getUserByEmail,
    getVendor,
} from "../models/user.js";
import { auth } from "../helpers/cookies.js";
import { createProc, getProc, updateProcBooked } from "../models/procurement.js";
import { render } from "ejs";

const app = express();
const prisma = new PrismaClient();

app.get("/logout", async (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
    return;
});
app.get("/register", async (req, res, next) => {
    res.render("register");
});
app.post("/register", async (req, res, next) => {
    let userdata = await getUserByEmail(req.body.data);
    if (userdata) {
        res.cookie("alert", "akun sudah terdaftar silakan login", {
            httpOnly: true,
        });
        return res.redirect("/login");
    }
    let create = await createUser(req.body.data);
    if (create) {
        res.cookie("info", "daftar berhasil silakan login", { httpOnly: true });
        return res.redirect("/login");
    }
});
app.get("/login", async (req, res, next) => {
    if (req.session.profile) {
        return res.redirect("/");
    }
    let info = req.cookies["info"];
    let alert = req.cookies["alert"];
    res.clearCookie("info", { httpOnly: true });
    res.clearCookie("alert", { httpOnly: true });
    return res.render("login", { info, alert });
});
app.post("/login", async (req, res, next) => {
    let userdata = await getUserByEmail(req.body.data);
    console.log(userdata);
    const verify = await argon2.verify(
        userdata.password,
        req.body.data.password
    );
    if (!verify) {
        res.render("login", { alert: "password salah" });
        return;
    }
    delete userdata.password;
    if (userdata) {
        req.session.profile = userdata;
        // res.render("login", { info: "login success" });
        return res.redirect("/");
    }
});
app.post("/auth/change-password", auth.check, async (req, res, next) => {
    let newpassword = changePassword(req.body.data);
    return res.send({ success: "true", data: newpassword });
});
app.get("/", auth.check, async (req, res, next) => {
    let profile = req.session.profile;
    let dashboard = await getDashboard(profile.id)
    res.render("index", {...dashboard });
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

app.post("/proc", async (req, res, next) => {
    let profile = req.session.profile;
    let data = req.body.data;

    data.status = "sale";
    data.payment = "pending";
    data.price = parseFloat(data.price);

    if (profile) {
        data.userId = profile.id;
        const result = await createProc(data);
        console.log(result);
        console.log(data);
        console.log(profile);
        let dashboard = await getDashboard(profile.id)
        result && res.render("index", { ...dashboard, info: "data berhasil diinput" });
        return 
    } else{
        let dashboard = await getDashboard(profile.id)
        return res.render("index", { ...dashboard, error: "data gagal diinput" });
    }
});

app.get("/booked/:id", auth.check, async (req, res, next) => {
    let eprocId = req.params.id
    let profile = req.session.profile;
    console.log(eprocId)
    let data = {
        id:parseInt(eprocId),
        vendorId: profile.id
    }
    const booked = await updateProcBooked(data)
    booked && res.redirect("/");
});

const getDashboard = async(id) => {
    const eproc = await getProc();
    const eprocSale = await getProc("sale");
    const eprocBooked = await getProc("booked");
    const myEproc = await getProc(id);
    return {eproc,eprocSale,eprocBooked,myEproc}
}

export default app;
