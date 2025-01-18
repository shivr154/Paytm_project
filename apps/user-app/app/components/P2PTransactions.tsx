import { Card } from "@repo/ui/card"


export const P2PTransaction = ({ transactions} : {
   transactions:{
    id: number,
    time: Date,
    amount: number,
    userId: number,
    type: string
   }[]
}) => {

    if(!transactions.length){
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }

    return <Card title={"Recent Transactions"}>
        <div className="pt-2">
           {transactions.map(t => <div key={t.id} className="flex justify-between">
            <div>
               <div className="text-sm">
                  {t.type === "DEBIT" ? `Sent to ${t.userId}` : `Recieved from ${t.userId}`}
               </div>
               <div className="text-slate-600 text-xs">
                  {t.time.toDateString()}
               </div>
            </div>
            <div className="flex flex-row justify-center items-center">
                   {t.type === "DEBIT" ?
                   <div className="flex flex-col justify-center text-red-600">
                     - Rs {t.amount/100}
                   </div>: <div className="flex flex-col justify-center text-green-600">
                     + Rs {t.amount/100}
                   </div> }
                </div>
           </div>)}
        </div>

    </Card>
}