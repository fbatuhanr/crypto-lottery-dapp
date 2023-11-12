import { useContract } from "@thirdweb-dev/react";
import { getContractAddress } from "./getContractAddress";
export const getContract = () => {

    const { contract, isLoading } = useContract( getContractAddress() );
    return { contract, isLoading };
};
