import React, {ReactNode, useState, useEffect} from "react";
import styles from "@/styles/Home.module.css";
import {ConnectWallet, useAddress, useContractRead, useContractWrite} from "@thirdweb-dev/react";
import CardLink from "@/components/CardLink";
import {getContract} from "@/util/getContract";
import AdminControls from "@/components/AdminControls";
import WinnerCard from "@/components/WinnerCard";
import WinnerBanner from "@/components/WinnerBanner";
import BuyTicket from "@/components/BuyTicket";
import NextDraw from "@/components/NextDraw";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    const address = useAddress();

    const { contract, isLoading: contractIsLoading } = getContract();



    const { data: winnings } = useContractRead(contract, "getWinningsForAddress", [address]);

    const { data: isLotteryOperator } = useContractRead(contract, "lotteryOperator");


    return (
        <div className={styles.center}>
        <main className={styles.main}>

            <div>{children}</div>

            <WinnerBanner />

            <ConnectWallet btnTitle="Connect Wallet for See Options" modalTitle="Crypto Lottery" theme="dark" modalSize="wide"/>

            {
                /*
                <div className={"mt-3 " + styles.grid}>
                    <CardLink
                        href="/wallet"
                        title="Wallet"
                        description="See your wallet"
                    />
                    <CardLink
                        href="/info"
                        title="Contract Info"
                        description="See details about the contracts"
                    />
                </div>
                */
            }
            {
                address &&
                    <>
                        {
                            winnings > 0 &&
                            <WinnerCard winnings={winnings}/>
                        }

                        {
                            isLotteryOperator === address &&
                            <AdminControls />
                        }

                        <div className="space-y-5 md:space-y-4 m-5 md:flex md:flex-row items-start justify-center md:space-x-5 max-w-6xl">
                            <NextDraw />
                            <BuyTicket />
                        </div>
                    </>
            }
        </main>
    </div>
    );
};

export default Layout;
