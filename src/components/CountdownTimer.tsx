import React from 'react';
import {useContractRead} from "@thirdweb-dev/react";
import {getContract} from "@/util/getContract";
import Countdown from "react-countdown";

type Props = {
    hours: number,
    minutes: number,
    seconds: number,
    completed: boolean
}

const CountdownTimer = () => {

    const { contract, isLoading: contractIsLoading } = getContract();
    const { data: expiration} = useContractRead(contract, "expiration")

    const renderer = ({ hours, minutes, seconds, completed }: Props) => {

        return (
            <>
                {
                    completed &&
                        <div>
                            <h2 className="text-white text-center text-xl animate-bounce">Ticket sales CLOSED for this draw</h2>
                        </div>
                }
            <div>
                {
                    !completed &&
                    <h3 className="text-white text-sm mb-2 italic">Time Remaining</h3>
                }
                <div className="flex space-x-6">
                    <div className="flex-1">
                        <div className={"countdown " + (completed ? "animated-pulse" : null)}>{hours}</div>
                        <div className="countdown-label">hours</div>
                    </div>
                    <div className="flex-1">
                        <div className={"countdown " + (completed ? "animated-pulse" : null)}>{minutes}</div>
                        <div className="countdown-label">minutes</div>
                    </div>
                    <div className="flex-1">
                        <div className={"countdown " + (completed ? "animated-pulse" : null)}>{seconds}</div>
                        <div className="countdown-label">seconds</div>
                    </div>
                </div>
            </div>
            </>
        )

    }

    return (
        <div>
            <Countdown date={new Date(expiration * 1000)} renderer={renderer} />
        </div>
    );
};

export default CountdownTimer;