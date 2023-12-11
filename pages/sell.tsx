import {useContract, useAddress, useOwnedNFTs, MediaRenderer, ThirdwebNftMedia} from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../constants/addresses";
import NFTGrid from "../components/NFTGrid";
import { DirectListingV3, ThirdwebSDK, NFT} from "@thirdweb-dev/sdk"
import { useState, useEffect } from "react";
import SaleInfo from "../components/SaleInfo";
import { Box, Button, Card, Container, Flex, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";

export default function Sell() {
    const [_nft, setNft] = useState<NFT | null>(null);
    const onClick = async (nft: {metadata: any}) => {
        const init = async() => {
            const sdk = new ThirdwebSDK("mumbai");
            const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
            const _nft = await contract.erc721.get(nft.metadata.id);
            setSelectedNFT(_nft)
        }
        init()
    }
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const address = useAddress();
    const { data, isLoading } = useOwnedNFTs(contract, address);
    const [selectedNFT, setSelectedNFT] = useState<NFT>();

    return(
        <Container maxW={"1200px"} p={5}>
            <Heading color="purple">Sell NFTs</Heading>
            
            {!selectedNFT ? (
                <>
                 <Text color="white">Select which NFT to sell below.</Text>
                <NFTGrid
                    data={data}
                    isLoading={isLoading}
                    overrideOnclickBehavior={(nft) => onClick(nft)}
                    emptyText={"You don't own any NFTs yet from this collection."}
                />
                </>
               
            ) : (
                <Flex justifyContent={"center"} my={10}>
                    <Card w={"75%"}>
                    <SimpleGrid columns={2} spacing={10} p={5} backgroundColor={"#070707"}>
                        <Flex justifyContent={"center"}>
                            <MediaRenderer
                                src={selectedNFT.metadata.image}
                                height="250px"
                                width="250px"
                            />
                        </Flex>
                        <Stack>
                            <Flex justifyContent={"right"}>
                                <Button
                                    onClick={() => {
                                    setSelectedNFT(undefined);
                                    }}
                                >X</Button>
                            </Flex>
                            <Heading color={"white"}>{selectedNFT.metadata.name}</Heading>
                            <SaleInfo 
                                nft={selectedNFT}
                            />
                        </Stack>
                    </SimpleGrid>
                   </Card>
                </Flex>
    
            )}
        </Container>
    )
}