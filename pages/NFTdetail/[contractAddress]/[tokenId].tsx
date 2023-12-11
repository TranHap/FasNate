import { DirectListingV3, ThirdwebSDK, NFT} from "@thirdweb-dev/sdk"
import {useContract, useListing, useValidDirectListings, MediaRenderer, Web3Button} from "@thirdweb-dev/react";
import {MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS} from '../../../constants/addresses'
import { GetStaticPaths, GetStaticProps } from "next";
import { Avatar, Box, Container, Flex, Input, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
import { darkTheme, lightTheme } from "@thirdweb-dev/react";
import Link from "next/link";
type Props = {
    nft: NFT,
    contractMetaData: any
}
export default function Detail ({nft, contractMetaData}: Props) {
    const  {contract: marketplace, isLoading: loadingMarketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3")
    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

    const { data: directListing, isLoading: loadingDirectListing } = 
        useValidDirectListings(marketplace, {
            tokenContract: NFT_COLLECTION_ADDRESS, 
            tokenId: nft.metadata.id,
        });
    async function buyListing() {
      let txResult;
      if (directListing?.[0]){
            txResult = await marketplace?.directListings.buyFromListing(
                directListing[0].id,
                1
            );
        } else {
            throw new Error("No listing found");
        }

        return txResult;
    }
    return (
      <Container maxW={"1200px"} p={5} my={5}>
          <SimpleGrid columns={2} spacing={6}>
            <Stack spacing={"20px"}>
              <Box borderRadius={"6px"} overflow={"hidden"}>
                  <Skeleton isLoaded={!loadingMarketplace && !loadingDirectListing}>
                    <MediaRenderer
                        src={nft.metadata.image}
                        height="400px"
                        width="400px"
                      />
                    </Skeleton>
              </Box>
              <Box>
                  <Text fontWeight={"bold"} color="purple">Description:</Text>
                  <Text fontWeight={"small"} color="white">{nft.metadata.description}</Text>
              </Box>   
            </Stack>

            <Stack spacing={"20px"}>
                  {contractMetaData && (
                      <Flex alignItems={"center"}>
                        <Box borderRadius={"4px"} overflow={"hidden"} mr={"10px"}>
                            <MediaRenderer
                                src={contractMetaData.image}
                                height="32px"
                                width="32px"
                            />
                        </Box>
                        <Text fontWeight={"bold"} color="white">{contractMetaData.name}</Text>
                      </Flex>
                  )}
                  <Box mx={2.5}>
                      <Text fontSize={"4xl"} fontWeight={"bold"} color="white">{nft.metadata.name}</Text>
                  </Box>
                  <Stack backgroundColor={"#EEE"} p={2.5} borderRadius={"6px"}>
                      <Text color={"darkgray"}>Price:</Text>
                      <Skeleton isLoaded={!loadingMarketplace && !loadingDirectListing}>
                        {directListing && directListing[0] && (
                          <Text fontSize={"3xl"} fontWeight={"bold"}>
                              {directListing[0]?.currencyValuePerToken.displayValue}
                              {" " + directListing[0]?.currencyValuePerToken.symbol}
                          </Text>
                        )}
                      </Skeleton>
                  </Stack>
                  <Skeleton isLoaded={!loadingMarketplace || !loadingDirectListing }>
                      <Stack spacing={5}>
                        <Web3Button
                          contractAddress={MARKETPLACE_ADDRESS}
                          action={async () => buyListing()}
                          isDisabled={(!directListing || !directListing[0])}
                          onError={(error) => alert("Something went wrong!")}
                        >Buy the item</Web3Button>
                      </Stack>
                  </Skeleton>
            </Stack>
          </SimpleGrid>
        
        </Container>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const tokenId = context.params?.tokenId as string;
  
    const sdk = new ThirdwebSDK("mumbai");
  
    const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
  
    const nft = await contract.erc721.get(tokenId);
  
    let contractMetadata;
  
    try {
      contractMetadata = await contract.metadata.get();
    } catch (e) {}
  
    return {
      props: {
        nft,
        contractMetadata: contractMetadata || null,
      },
      revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
    };
  };

  export const getStaticPaths: GetStaticPaths = async () => {
    const sdk = new ThirdwebSDK("mumbai");
  
    const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
  
    const nfts = await contract.erc721.getAll();
  
    const paths = nfts.map((nft) => {
      return {
        params: {
          contractAddress: NFT_COLLECTION_ADDRESS,
          tokenId: nft.metadata.id,
        },
      };
    });
  
    return {
      paths,
      fallback: "blocking", // can also be true or 'blocking'
    };
  };