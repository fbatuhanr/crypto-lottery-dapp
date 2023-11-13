import React from 'react';

import {ConnectWallet, useAddress, useContractRead, useContractWrite} from "@thirdweb-dev/react";
import { ethers } from "ethers";

import toast from "react-hot-toast";

import { AiFillStar, AiFillDollarCircle } from 'react-icons/ai';
import { MdRestartAlt } from 'react-icons/md';
import { HiArrowUturnDown } from 'react-icons/hi2';
import {getContract} from "@/util/getContract";
import {currency} from "@/util/constants";

const AdminControls = () => {

    const { contract, isLoading: contractIsLoading } = getContract();

    const { data: totalCommission } = useContractRead(contract, "operatorTotalCommission");

    const { mutateAsync: DrawWinnerTicket } = useContractWrite(contract, "DrawWinnerTicket");
    const { mutateAsync: WithdrawCommission } = useContractWrite(contract, "WithdrawCommission");
    const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw");
    const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll");

    const handleDrawWinner = async () => {
        const notification = toast.loading("Picking a Lucky Winner...");

        try {
            const data = await DrawWinnerTicket({});

            toast.success("A Winner has been selected!", {
                id: notification,
                position: "top-right",
                duration: 3000,
            });

            console.info("contract call success", data);

        } catch (err) {

            toast.error("Whoops something went wrong!", {
                id: notification,
                position: "top-right",
                duration: 3000,
            });

            console.error("contract call failure", err);
        }
    }

    const handleWithdrawCommission = async () => {
        const notification = toast.loading("Withdrawing commission...");

        try {
            const data = await WithdrawCommission({});

            toast.success("Your Commission has been withdrawn successfully!", {
                id: notification,
                duration: 2000
            });

            console.info("contract call success", data);

        } catch (err) {

            toast.error("Whoops something went wrong!", {
                id: notification,
                duration: 2000
            });

            console.error("contract call failure", err);
        }
    };

    const handleRestartDraw = async () => {

        const notification = toast.loading("Restarting draw...");

        try {

            const data = await restartDraw({});

            toast.success("Draw restarted successfully!", {
                id: notification,
            });
            console.info("contract call success", data);
        } catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification,
            });
            console.error("contract call failure", err);
        }
    };


    const handleRefundAll = async () => {
        const notification = toast.loading("Refunding all...");

        try {
            const data = await RefundAll({});

            toast.success("All refunded successfully!", {
                id: notification,
            });

            console.info("contract call success", data);
        } catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification,
            });

            console.error("contract call failure", err);
        }
    }

    return (
        <div className="mt-4 text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border stats">
            <h2>Admin Controls</h2>
            <p className="mb-5">
                Total commission to be withdrawn: &nbsp;
                { totalCommission && ethers.utils.formatEther(totalCommission?.toString()) }
                &nbsp;
                { currency }
            </p>

            <div className="flex flex-col space-y-2 md:flex-row md:space-y-2 md:space-x-2">
                <button onClick={handleDrawWinner} className="admin-button">
                    <AiFillStar className="h-6 mx-auto mb-2" />
                    Draw Winner
                </button>
                <button onClick={handleWithdrawCommission} className="admin-button">
                    <AiFillDollarCircle className="h-6 mx-auto mb-2" />
                    Withdraw Commission
                </button>
                <button onClick={handleRestartDraw} className="admin-button">
                    <MdRestartAlt className="h-6 mx-auto mb-2" />
                    Restart Draw
                </button>
                <button onClick={handleRefundAll} className="admin-button">
                    <HiArrowUturnDown className="h-6 mx-auto mb-2" />
                    Refund All
                </button>
            </div>
        </div>
    );
};

export default AdminControls;