import { useUser } from "@clerk/clerk-react" 
import { FinancialForm } from "./Financialform";
export const Index=()=>{
    const {user} =useUser();
    return <div className="dashboard-container">
        <h1>Welcome {user?.firstName}! Here are your finances: </h1>
        <FinancialForm />


    </div>
}