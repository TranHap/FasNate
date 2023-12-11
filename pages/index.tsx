import { ConnectWallet, useMetamask, useUser, useAddress, useDisconnect, useLogout,useLogin } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { SimpleGrid, Box,Image, Flex, Link, Text, Heading } from "@chakra-ui/react";
const Home: NextPage = () => {
  const address = useAddress();
  const disconnect = useDisconnect();
  const connect = useMetamask();
  const { login } = useLogin();
  const { logout } = useLogout();
  const { user, isLoggedIn } = useUser();
  const [secret, setSecret] = useState();

  const getSecret = async () => {
    const res = await fetch("/api/secret");
    const data = await res.json();
    setSecret(data.message);
  };

  return (
    <Box m={1}>
       <SimpleGrid columns={2} spacing={10} p={10}>
          <Flex justifyContent={"center"} direction="column" gap={5}>
            <Heading size='lg' fontSize='50px' color="white">
              Sustainable Fashion Is Coming In Digitalized Form
            </Heading>
            <Text color="white">
              Applying blockchain technology, we hope to unlock the power of decentralized network
              application. As the society enters the new era, in which digital presence and online
              platforms have became the second identity of ourselves, the idea of real world objects
              is only limited by humans' imagination. As we envision a future where real-world objects 
              are seamlessly connected to the digital space, fashion items haven't escaped our notice.
            </Text>
          </Flex>
          <Image src="background.png" alt="background" />
        </SimpleGrid>
  </Box>
  );
};

export default Home;
