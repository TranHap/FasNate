import { DirectListingV3, NFT, ThirdwebSDK } from "@thirdweb-dev/sdk"
import { Web3Button, useAddress, useContract, useContractRead, useContractWrite, useCreateDirectListing } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../constants/addresses";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Box, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";

type Props = {
    nft: NFT
}

type DirectFormData = {
    nftContractAddress: string;
    tokenId: string;
    price: string;
};

export default function SaleInfo ({nft}: Props) {
    const router = useRouter();
    const address = useAddress()
    const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

    const { mutateAsync: createDirectListing } = useCreateDirectListing(marketplace);
  
    const { data: hasApproved } = useContractRead(nftCollection, "isApprovedForAll", [nft.owner, address])
    const { mutateAsync: setApprovalForAll, isLoading } = useContractWrite(nftCollection, "setApprovalForAll")

    async function checkAndProvideApproval() {
        if (!hasApproved) { 
            const call = async () => {
                try {
                  const data = await setApprovalForAll({ args: [address, true] });
                  console.info("contract call successs", data);
                } catch (err) {
                  console.error("contract call failure", err);
                }
              }
            console.log("Check Approval")
            console.log(call)
        }
        return true
    }
    const { register: registerDirect, handleSubmit: handleSubmitDirect } = useForm<DirectFormData>({
        defaultValues: {
            nftContractAddress: NFT_COLLECTION_ADDRESS,
            tokenId: nft.metadata.id,
            price: "0",
        },
    });
    async function handleSubmissionDirect(data: DirectFormData) {
        await checkAndProvideApproval();
        console.log("Submit!")
        const txResult = await createDirectListing({
            assetContractAddress: data.nftContractAddress,
            tokenId: data.tokenId,
            pricePerToken: data.price,
        });
        console.log(txResult)
        return txResult;
    }
   
    return(
        <Stack spacing={8}>
            <Box>
                <Text fontWeight={"bold"} color="white">Price:</Text>
                <Input
                    placeholder="0"
                    size="md"
                    type="number"
                    {...registerDirect("price")}
                    color="white"
                            />
            </Box>
            <Web3Button
                contractAddress={MARKETPLACE_ADDRESS}
                action={async () => {
                    await handleSubmitDirect(handleSubmissionDirect)();
                }}
                onSuccess={(txResult) => {
                    router.push(`/NFTdetail/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`);
                }}
            >Sell the item</Web3Button>
        </Stack>
    )
}