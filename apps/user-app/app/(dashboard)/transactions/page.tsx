import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { BalanceCard } from "../../components/BalanceCard";
import { OnRampTransactions } from "../../components/OnRampTransactions";
import { P2PTransaction } from "../../components/P2PTransactions";

async function getBalance() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("User not authenticated");
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

async function getOnRampTransactions() {
    try {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where:{
            userId: Number(session?.user?.id)
        }
    });
    
    return txns.map(t => ({
        id:t.id,
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }));
   } catch (error) {
    console.error("Error fetching OnRamp transactions:", error);
    return [];
  }
}

async function getP2PTransaction() {
    try {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where:{
            OR:[
                {
                    fromUserId: Number(session?.user?.id)
                  },
                  {
                    toUserId: Number(session?.user?.id)
                  }
            ]
        }
    })
    
    return txns.map(t => {
        if(t.fromUserId == Number(session?.user?.id)){
            return ({
                id: t.id,
                time:new Date(t.timestamp),
                amount: t.amount,
                type:"DEBIT",
                userId: t.toUserId,
            })
        }
        else if(t.toUserId == Number(session?.user?.id)){
            return ({
                id: t.id,
                time: new Date(t.timestamp),
                amount: t.amount,
                type: "CREDIT",
                userId: t.fromUserId
            })
        }
        return null;
    }).filter(
        (transaction): transaction is {
          id: number;
          time: Date;
          amount: number;
          type: string;
          userId: number;
        } => transaction !== null
      );
  }
  catch (error) {
    console.error("Error fetching P2P transactions:", error);
    return [];
  }

}

export default async function() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();
    const p2ptransactions = await getP2PTransaction();


    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 ml-4 font-bold">
            Transactions
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
       <div>
          <P2PTransaction transactions={p2ptransactions} />
       </div>
       <div>
           <BalanceCard amount={balance.amount} locked={balance.locked} />
           <div className="pt-4">
               <OnRampTransactions transactions={transactions} />
           </div>
       </div>
   </div>
    </div>
}