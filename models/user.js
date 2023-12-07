import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

export async function getUser() {
    const result = await prisma.user.findMany({});
    return result;
}
export async function getVendor() {
    const result = await prisma.user.findMany({ where: { isVendor: false } });
    return result;
}
export async function getPT() {
    const result = await prisma.user.findMany({ where: { isVendor: true } });
    return result;
}
export async function createUser(data) {
    console.log("data input");
    console.log(data);
    data.isVendor = data.isVendor == "true" ? true : false;
    data.password = await argon2.hash(data.password);
    console.log(data);
    const result = await prisma.user.create({ data });
    return result;
}
export async function getUserByEmail(data) {
	console.log("data input");
    console.log(data);
    const result = await prisma.user.findMany({ where: { email: data.email } });
    return result[0];
}

export async function deleteUserByEmail(data) {
    const result = await prisma.user.delete({
        where: {
            email: data,
        },
    });
    return result;
}

export async function editUser(data) {
	const userdata = await getUserByEmail(data)
	console.log("data input");
	console.log(data);
	let newdata = {
		name: data.name || userdata.name,
		companyName: data.companyName || userdata.companyName,
		name: data.name || userdata.name,
	}

	const result = prisma.user.update({where:{email:data.email},data:newdata})
	console.log(result);
	return result;
}

export async function changePassword(data){
	let newpassword = await argon2.hash(data.new_password);
	const result = prisma.user.update({where:{email:data.email},data:{password:newpassword}})
	return result
}