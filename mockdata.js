import { procurementdata, userdata } from "./seed.js";

async function main() {
    let user = JSON.parse(JSON.stringify(userdata));
    const resultuser = await prisma.user.createMany({ user });
    console.log(resultuser);
    let data = JSON.parse(JSON.stringify(procurementdata));
    const resultdata = await prisma.procurement.createMany({ data });
    console.log(resultdata);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
