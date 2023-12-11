import { ConnectWallet, useDisconnect, useAddress, useContractWrite,useSigner } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import {useState} from "react"
import { Avatar, Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import NextLink from 'next/link'

export default function Navbar() {
    const address = useAddress();
    return (
        <Box maxW={"1200px"} m={"auto"} py={"10px"}px={"40px"}>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Link as={NextLink} href='/'>
                    <Flex direction={"row"} gap='4'>
                        <Image src='logo.png' alt='Dan Abramov' boxSize='50px'/>
                        <Flex direction={"column"}>
                            <Text as='b' fontSize='md' color="White">FasNate</Text>
                            <Text fontSize='sm' color="White">Digital-Sustainable</Text>
                        </Flex>
                    </Flex>
                </Link>
                <Flex direction={"row"}>
                    <Link as={NextLink} href='/buy' mx={2.5}>
                        <Text color="White">SHOP</Text>
                    </Link>
                    <Link as={NextLink} href='/sell' mx={2.5}>
                        <Text color="White">SELL</Text>
                    </Link>
                </Flex>
                <Flex direction={"row"} alignItems={"center"}>
                    <ConnectWallet/>
                    {address && (
                        <Link as={NextLink} href={`/profile/${address}`}>
                            <Avatar src='https://bit.ly/broken-link' ml={"20px"}/>
                        </Link>
                    )}
                </Flex>
            </Flex>
       
        </Box>
    )
};