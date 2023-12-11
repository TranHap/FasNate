import { ThirdwebNftMedia, MediaRenderer, useContract,useNFT, useValidDirectListings, useValidEnglishAuctions, useDirectListings } from "@thirdweb-dev/react";
import { DirectListingV3, NFT, ThirdwebSDK } from "@thirdweb-dev/sdk"
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../constants/addresses";
import { useEffect, useState } from "react";
import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";

type Props = {
    nft: NFT;
}
export default function NFTComponent ({ nft }: Props) {
    const [_nft, setNft] = useState<NFT | null>(null);
    
    const  {contract: marketplace, isLoading: loadingMarketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3")

    const { data: directListing, isLoading: loadingDirectListing } = useValidDirectListings(marketplace, {
        tokenContract: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
    })

    useEffect(() => {
        const init = async() => {
            const sdk = new ThirdwebSDK("mumbai");
            const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
            const _nft = await contract.erc721.get(nft.metadata.id);
            setNft(_nft)
        }
        init()
    }, [])

    return (
        <Flex m={2} gap={2} direction={"column"} backgroundColor={"#070707"} justifyContent={"center"} padding={"2.5"} borderRadius={"6px"} borderColor={"lightgray"} borderWidth={1}>
            <Box borderRadius={"4px"} overflow={"hidden"}>
            <Flex justifyContent={"center"}>
                <MediaRenderer
                    src={_nft?.metadata.image}
                    height="200px"
                    width="200px"
                />   
            </Flex>      
            </Box>
            <Text fontSize={"small"} color="white" >Token ID #{nft.metadata.id}</Text>
            <Text fontSize={"small"} color="white">{nft.metadata.name}</Text>
            <Box>
                {loadingMarketplace || loadingDirectListing ? (
                    <Skeleton></Skeleton>
                ) : directListing && directListing[0] ? (
                    <Box>
                        <Flex direction={"column"}>
                            <Text fontSize={"small"} color="white">Price</Text>
                            <Text fontSize={"small"} color={"purple"}>{`${directListing[0]?.currencyValuePerToken.displayValue} ${directListing[0]?.currencyValuePerToken.symbol}`}</Text>
                        </Flex>
                    </Box>
                ) : (
                    <Box>
                        <Flex direction={"column"}>
                            <Text fontSize={"small"} color="white">Price</Text>
                            <Text fontSize={"small"} color="white">Not Listed</Text>
                        </Flex>
                    </Box>
                )}
            </Box>
        </Flex>
    )
}