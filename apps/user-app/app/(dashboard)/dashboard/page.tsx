import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import prisma from "@repo/db/client";
import { BalanceCard } from "../../components/BalanceCard";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where:{
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getNumber() {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findFirst({
        where:{
            id: Number(session?.user?.id)
        }
    })
    return user?.number
}

export default async function() {
    const number = await getNumber();
    const balance = await getBalance();

    return <div className="w-screen">
        <div  className="text-4xl text-[#6a51a6] pt-8 mb-8 ml-4 font-bold">
            Hello {number}
        </div>
        <div className="ml-4 grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <BalanceCard amount={balance.amount} locked={balance.locked} />
        </div>
        
    </div>
}