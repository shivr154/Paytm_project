"use server"

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";


export async function createOnRampTransaction(provider:string,amount:number) {
    const session = await getServerSession(authOptions); 
    if(!session?.user || !session.user?.id){
        return{
            message : "Unauthenticated request"
        }
    }

    const token = (Math.random()*1000).toString();

    await prisma.onRampTransaction.create({
        data:{
            status: "Processing",
            provider: provider||"",
            startTime:new Date(),
            amount:amount*100,
            userId: Number(session?.user?.id),
            token: token
        }
    });
    return {
        message: "Done"
    }
}