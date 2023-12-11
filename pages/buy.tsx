import {useContract, useValidDirectListings, useNFTs} from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../constants/addresses";
import NFTGrid from "../components/NFTGrid";
import { DirectListingV3, ThirdwebSDK } from "@thirdweb-dev/sdk"
import { Container, Heading, Text } from "@chakra-ui/react";
import { loadStripe } from '@stripe/stripe-js';

export default function Buy() {
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const { data, isLoading } = useNFTs(contract);
    const checkout = async () => {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
        });
        const session = await res.json();
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
          throw new Error("Stripe publishable key not set");
        }
    
        const stripe = await loadStripe(publishableKey as string, {
          apiVersion: "2020-08-27",
        });
        await stripe?.redirectToCheckout({
          sessionId: session.id,
        });
      };
    return (
        <Container maxW={"1200px"} p={5}>
            <Heading color="purple">Buy NFTs</Heading>
            <Text color="white">Browse and buy NFTs from this collection.</Text>
            <NFTGrid 
                isLoading={isLoading} 
                data={data} 
                emptyText={"No NFTs found"}
            />
            {/* <h2>Payments - Stripe</h2>

            <button onClick={checkout}>Subscribe</button> */}
        </Container>
    )
};