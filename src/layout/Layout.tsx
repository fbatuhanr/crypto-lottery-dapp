import React, {ReactNode, useState, useEffect} from "react";
import styles from "@/styles/Home.module.css";
import {ConnectWallet, useAddress, useContractRead, useContractWrite} from "@thirdweb-dev/react";
import CardLink from "@/components/CardLink";
import {getContract} from "@/util/getContract";
import {currency} from "@/util/constants";


import { ethers } from "ethers";
import CountdownTimer from "@/components/CountdownTimer";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    const address = useAddress();

    const [userTickets, setUserTickets] = useState(0);

    const [quantity, setQuantity] = useState<number>(1);

    const { contract, isLoading: contractIsLoading } = getContract();


    const { data: expiration} = useContractRead(contract, "expiration")

    const { data: remainingTickets } = useContractRead(contract, "RemainingTickets")
    const { data: currentWinningReward} = useContractRead(contract, "CurrentWinningReward")
    const { data: ticketPrice} = useContractRead(contract, "ticketPrice")
    const { data: ticketCommission} = useContractRead(contract, "ticketCommission")

    const { data: tickets } = useContractRead(contract, "getTickets")
    const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets")

    const { data: winnings } = useContractRead(contract, "getWinningsForAddress", [address])
    const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings");

    const { data: lastWinner } = useContractRead(contract, "lastWinner")
    const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount")

    useEffect(() => {

        if(!tickets) return;

        const totalTickets: string[] = tickets;

        const noOfUserTickets = totalTickets.reduce(
            (total, ticketAddress) =>
                (ticketAddress === address ? total + 1 : total)
            , 0);

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
        <main className={styles.main}>

            <ConnectWallet
                btnTitle="Connect Wallet for Lottery!"
                modalTitle="Crypto Lottery"
                theme="dark"
                modalSize="wide"
            />
            {
                address ?
                    <>
                        <Marquee className="bg-[O#0A1F1C] p-5 mb-5" gradient={false} speed={100}>
                            <div className="flex space-x-2 mx-10">
                                <h4 className="text-white font-bold">Last Winner: {lastWinner?.toString()}</h4>
                                <h4 className="text-white font-bold">Previous winnings: </h4>
                            </div>
                        </Marquee>

                        {winnings > 0 &&
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
                        }

                        <div className="space-y-5 md:space-y-4 m-5 md:flex md:flex-row items-start justify-center md:space-x-5 max-w-6xl">

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
                                        <div className="stats">
                                            <p>You have {userTickets} Tickets in this draw</p>
                                            <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                                                {
                                                    Array(userTickets).fill("").map((_,index) =>
                                                        <p key={index}
                                                           className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                                                        >
                                                            {index + 1}
                                                        </p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>


                        { /*
                    <div className={styles.grid}>
                        <CardLink
                            href="/wallet"
                            title="Wallet"
                            description="See NFTs you own"
                        />
                        <CardLink
                            href="/info"
                            title="Contract Info"
                            description="See details about the contracts"
                        />
                        <CardLink
                            href="/mint"
                            title="Mint"
                            description="Mint a new NFT"
                        />
                        <CardLink
                            href="/"
                            title="Market"
                            description="See all valid Listings"
                        />
                    </div>
                    */ }

                        <div className={styles.center}>
                            <div>{children}</div>
                        </div>
                    </>
                    : null
            }
        </main>
    );
};

export default Layout;
