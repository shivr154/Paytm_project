
import { getServerSession } from "next-auth";
import { SendCard } from "../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2PTransaction } from "../../components/P2PTransactions";


type Transaction = {
    id: number;
    time: Date;
    amount: number;
    type: "DEBIT" | "CREDIT";
    userId: number;
  };

async function getP2PTransaction(): Promise<Transaction[]> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return [];
      }
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
    
    return txns.reduce<Transaction[]>((acc, t) => {
        if (t.fromUserId === Number(session.user.id)) {
          acc.push({
            id: t.id,
            time: new Date(t.timestamp),
            amount: t.amount,
            type: "DEBIT",
            userId: t.toUserId,
          });
        } else if (t.toUserId === Number(session.user.id)) {
          acc.push({
            id: t.id,
            time: new Date(t.timestamp),
            amount: t.amount,
            type: "CREDIT",
            userId: t.fromUserId,
          });
        }
        return acc;
      }, []);
 }
    


export default async function() {
   
    const transactions = await getP2PTransaction();

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 ml-4 font-bold">
            P2P Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
       <div>
           <SendCard />
       </div>
       <div>
           <P2PTransaction transactions={transactions} />
       </div>
        </div>
    </div>
}
