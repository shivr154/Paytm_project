import { Button } from "./button";
import { useRouter } from 'next/navigation';

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    // TODO: can u figure out what the type should be here?
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    const router = useRouter();
    return <div className="flex justify-between border-b border-gray-300 px-4 ">
        <div onClick={()=>{
            router.push("/");
        }} className="text-lg flex flex-col justify-center cursor-pointer">
            PayTM
        </div>
        <div className="flex flex-col justify-center pt-2">
            <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
        </div>
    </div>
}