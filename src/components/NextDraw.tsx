import React from 'react';
import {ethers} from "ethers";
import {currency} from "@/util/constants";
import CountdownTimer from "@/components/CountdownTimer";
import {useContractRead} from "@thirdweb-dev/react";
import {getContract} from "@/util/getContract";

const NextDraw = () => {

    const { contract } = getContract();
    const { data: currentWinningReward} = useContractRead(contract, "CurrentWinningReward");
    const { data: remainingTickets } = useContractRead(contract, "RemainingTickets");

    return (

        <div className="stats-container">
            <h1 className="text-4xl text-white font-semibold text-center">
                The Next Draw
            </h1>
            <div className="flex justify-between p-2 space-x-2">
                <div className="stats">
                    <h2 className="text-sm">Total Pool</h2>
                    <p className="text-xl">
                        {currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString())}
                        &nbsp;
                        {currency}
                    </p>
                </div>
                <div className="stats">
                    <h2 className="text-sm">Tickets Remaining</h2>
                    <p className="text-xl">{remainingTickets?.toNumber()}</p>
                </div>
            </div>
            <div className="mt-5 mb-3">
                <CountdownTimer />
            </div>
        </div>
    );
};

export default NextDraw;