import { PrismaClient } from '@prisma/client'
import argon2 from "argon2"

const prisma = new PrismaClient()

export async function getUser(){
	const user = await prisma.user.findMany({})
	return user
}
export async function getVendor(){
	const user = await prisma.user.findMany({where:{isVendor:false}})
	return user
}
export async function getPT(){
	const user = await prisma.user.findMany({where:{isVendor:true}})
	return user
}
export async function createUser(data){
	console.log("data input")
	console.log(data)
	data.isVendor = data.isVendor=="true"? true:false
	data.password = await argon2.hash(data.password);
	console.log(data)
	const user = await prisma.user.create({ data });
    return user
}
export async function getUserByEmail(data){
	console.log("data input")
	console.log(data)
	const user = await prisma.user.findMany({where:{email:data.email}})
	return user[0]
}
