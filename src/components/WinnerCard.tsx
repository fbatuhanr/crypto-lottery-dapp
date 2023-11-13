import React from 'react';
import {ethers} from "ethers";
import {currency} from "@/util/constants";
import toast from "react-hot-toast";
import {useContractWrite} from "@thirdweb-dev/react";
import {getContract} from "@/util/getContract";


const WinnerCard = ({winnings}:any) => {

    const { contract } = getContract();

    const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings");

    const handleWithdrawWinnings = async () => {

        const notification = toast.loading("Withdraw winnings...");

        try {

            const data = await WithdrawWinnings({});

            toast.success("Winnings withdraw successfully!", {
                id: notification
            })
            console.info("contract write success")
        }
        catch (e) {

            toast.error("Something went wrong!", {
                id: notification
            });

            console.log("contract write failure ", e);
        }
    }

    return (
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
            <button
                className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full"
                onClick={handleWithdrawWinnings}
            >
                <p className="font-bold">Winner Winner Chicken Dinner!</p>
                <p>
                    Total Winnings: {ethers.utils.formatEther(winnings.toString())}
                    &nbsp;
                    {currency}
                </p>
                <br />
                <p className="font-semibold">Click here to withdraw</p>
            </button>
        </div>
    );
};

export default WinnerCard;