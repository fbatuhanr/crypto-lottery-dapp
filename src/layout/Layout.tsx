import React, { ReactNode } from "react";
import styles from "@/styles/Home.module.css";
import {ConnectWallet, useAddress} from "@thirdweb-dev/react";
import CardLink from "@/components/CardLink";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    const address = useAddress()

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
                        <div className="space-y-5 md:space-y-4 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
                            <div className="stats-container">
                                <h1 className="text-4xl text-white font-semibold text-center">
                                    The Next Draw
                                </h1>
                                <div className="flex justify-between p-2 space-x-2">
                                    <div className="stats">
                                        <h2 className="text-sm">Total Pool</h2>
                                        <p className="text-xl">0.1 CHZ</p>
                                    </div>
                                    <div className="stats">
                                        <h2 className="text-sm">Tickets Remaining</h2>
                                        <p className="text-xl">100</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="stats-container space-y-2">
                            <div className="stats-container">
                                <div className="flex justify-between items-center text-white pb-2">
                                    <h2>Price per ticket</h2>
                                    <p>0.01 MATIC</p>
                                </div>

                                <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4">
                                    <p>TICKETS</p>
                                    <input
                                        className="flex w-full bg-transparent text-right outline-none"
                                        type="number"
                                        min={1}
                                        max={10}
                                        defaultValue={1}
                                    />
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
