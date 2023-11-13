import React from 'react';
import Marquee from "react-fast-marquee";
import {useContractRead} from "@thirdweb-dev/react";
import {getContract} from "@/util/getContract";

const WinnerBanner = () => {

    const { contract } = getContract();

    const { data: lastWinner } = useContractRead(contract, "lastWinner");
    const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount");

    return (
        <Marquee className="bg-[#0A1F1C] p-5 mb-5" gradient={false} speed={100}>
            <div className="flex space-x-2 mx-10">
                {
                    lastWinner && lastWinner !== "0x0000000000000000000000000000000000000000"
                    ?
                        <>
                            <h4 className="text-white font-bold">Last Winner: {lastWinner?.toString()}</h4>
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <h4 className="text-white font-bold">Previous winnings: {lastWinnerAmount?.toString()}</h4>
                        </>
                    :
                        <h4 className="text-white font-bold">
                            Lottery has not started yet!
                        </h4>
                }
            </div>
        </Marquee>
    );
};

export default WinnerBanner;