import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProc(request="all") {
    let query = {}
    if(request==="all"){
        query={}
    }
    if(request==="sale"){
        query={vendorId:null}
    }
    if(request==="booked"){
        query={NOT:{bookedAt:null},approveAt:null}
    }
    if(request==="approved"){
        query={NOT:{approveAt:null},startAt:null}
    }
    if(request==="ongoing"){
        query={NOT:{progress:null},finishAt:null}
    }
    if(request==="finish"){
        query={NOT:{finishAt:null},paymentAt:null}
    }
    if(request==="success"){
        query={NOT:{paymentAt:null},finishAt:null}
    }
    if(typeof(request)==="number"){
        query={vendorId:request}
    }
    const result = await prisma.procurement.findMany({include:{createdBy:true,vendorBy:true},where:query});
    return result;
}

export async function createProc(data){
    const result = await prisma.procurement.create({ data });
    return result
}

export async function updateProc(data){
    const result = await prisma.procurement.update({ where: {id:data.id}, data });
    return result
}

export async function updateProcBooked(data){
    // by vendor
    // data : {id,vendorId}
    const result = await prisma.procurement.update({ where: {id:data.id}, data:{vendorId:data.vendorId,bookedAt:new Date(),status:"booked"} });
    return result
}

export async function updateProcApprove(data){
    // by pt
    // data : {id}
    const result = await prisma.procurement.update({ where: {id:data.id}, data:{approveAt:new Date(),status:"approved"} });
    return result
}

export async function updateProcStart(data){
    // by vendor
    // data : {id}
    const result = await prisma.procurement.update({ where: {id:data.id}, data:{startAt:new Date(),status:"ongoing",progress:0} });
    return result
}

export async function updateProcProgress(data){
    // by vendor
    // data : {id,progress}
    const result = await prisma.procurement.update({ where: {id:data.id}, data:{progress:data.progress} });
    return result
}

export async function updateProcFinish(data){ 
    // by vendor
    // data : {id}
    const result = await prisma.procurement.update({ where: {id:data.id}, data:{progress:100,finishAt:new Date()} });
    return result
}

export async function updateProcPayment(data){ 
    // by pt
    // data : {id,}
    const result = await prisma.procurement.update({ where: {id:data.id}, data:{progress:100,payment:"success",paymentAt:new Date()} });
    return result
}

// new Date()