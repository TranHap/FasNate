import { DirectListingV3, NFT} from "@thirdweb-dev/sdk"
import Link from "next/link";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../constants/addresses";
import NFTComponent from "./NFTComponent";
import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react";

type Props = {
    isLoading: boolean;
    data:  NFT[]| undefined;
    overrideOnclickBehavior?: (nft: NFT) => void;
    emptyText?: string;
};

export default function NFTGrid({
    isLoading,
    data,
    overrideOnclickBehavior,
    emptyText = "No NFTs found",
}: Props) {
    return (
        <SimpleGrid columns={4} spacing={6} w={"100%"} padding={2.5} my={5}>
            {isLoading ? (
		             [...Array(20)].map((_, index) => (
                        <Skeleton key={index} height={"312px"} width={"100%"} />
                    ))
            ) : data && data.length > 0 ? (
                data.map((nft) => 
                    !overrideOnclickBehavior ? (
                        <Link
                            href={`/NFTdetail/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
                            key={nft.metadata.id}
                        >
	                        <NFTComponent nft={nft} />
                        </Link>
                    ) : (
                        <div
                            key={nft.metadata.id}
                            onClick={() => overrideOnclickBehavior(nft)}
                        >
                            <NFTComponent nft={nft} />
                        </div>
                    ))
            ) : (
                <Text>{emptyText}</Text>
            )}
        </SimpleGrid>
        
    )
}