import React, {useEffect, useState} from 'react';
import {ethers} from "ethers";
import {currency} from "@/util/constants";
import OwnedTickets from "@/components/OwnedTickets";
import {useAddress, useContractRead, useContractWrite} from "@thirdweb-dev/react";
import {getContract} from "@/util/getContract";
import toast from "react-hot-toast";

const BuyTicket = () => {

    const address = useAddress();
    const { contract } = getContract();

    const [userTickets, setUserTickets] = useState(0);
    const [quantity, setQuantity] = useState<number>(1);

    const { data: tickets } = useContractRead(contract, "getTickets");

    const { data: expiration} = useContractRead(contract, "expiration");
    const { data: remainingTickets } = useContractRead(contract, "RemainingTickets");
    const { data: ticketPrice} = useContractRead(contract, "ticketPrice");
    const { data: ticketCommission} = useContractRead(contract, "ticketCommission");

    const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");

    useEffect(() => {

        if(!tickets) return;

        const totalTickets: string[] = tickets;

        const noOfUserTickets = totalTickets.reduce(
            (total, ticketAddress) =>
                (ticketAddress === address ? total + 1 : total)
            , 0);

        setUserTickets(noOfUserTickets);

    },[tickets, address])

    const handleBuyTickets = async() => {

        if(!ticketPrice) return;

        const notification = toast.loading("Buying your tickets...");

        try {
            const data = await BuyTickets({
                overrides:
                    {
                        value: ethers.utils.parseEther((Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString())
                    }
            });

            toast.success("Tickets purchased successfully!", {
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
        <div className="stats-container space-y-2">
            <div className="stats-container">

                <div className="flex justify-between items-center text-white pb-2">
                    <h2>Price per ticket</h2>
                    <p>
                        {ticketPrice && ethers.utils.formatEther(ticketPrice.toString())}
                        &nbsp;
                        {currency}
                    </p>
                </div>

                <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4">
                    <p>TICKETS</p>
                    <input
                        className="flex w-full bg-transparent text-right outline-none border rounded"
                        type="number"
                        min={1}
                        max={10}
                        value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                    />
                </div>

                <div className="space-y-2 mt-5">
                    <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                        <p>Total cost of tickets</p>
                        &nbsp;
                        <p>
                            {ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity}
                            &nbsp;
                            {currency}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-emerald-300 text-sm italic">
                        <p>Service fees</p>
                        <p>
                            {ticketCommission && ethers.utils.formatEther(ticketCommission.toString())}
                            &nbsp;
                            {currency}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-emerald-300 text-sm italic">
                        <p>+ Network Fees</p>
                        <p>TBC</p>
                    </div>

                    <button
                        className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-600 disabled:cursor-not-allowed"
                        onClick={handleBuyTickets}
                        disabled={
                            expiration?.toString() < Date.now().toString() ||
                            remainingTickets?.toNumber() === 0
                        }
                    >
                        Buy {quantity} tickets for {ticketPrice && Number(ethers.utils.formatEther(ticketPrice)) * quantity}
                        &nbsp;
                        {currency}
                    </button>
                </div>

                {
                    userTickets > 0 &&
                    <OwnedTickets userTickets={userTickets}/>
                }

            </div>
        </div>
    );
};

export default BuyTicket;