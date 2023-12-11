import type { AppProps } from "next/app";
import { ThirdwebProvider, ChainId, ThirdwebSDKProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import  Navbar from "../components/Navbar";
import { ChakraProvider } from "@chakra-ui/react";
import styles from "../styles/Home.module.css";

const activeChain = ChainId.Mumbai

function MyApp({ Component, pageProps }: AppProps) {

 
  return (
    <ThirdwebProvider
      clientId="c656e4166f357d0c1529606153c63726"
      activeChain={activeChain}
      authConfig={{
        authUrl: "/api/auth",
        domain: "http://localhost:3000/",
      }}
      dAppMeta={{
        name:"FasNate",
        url:"logo.png"
      }}
    >
       <div className={styles.container}>

   
       <ChakraProvider>
        <Navbar />
        <Component {...pageProps} />
      </ChakraProvider>
      </div>
    </ThirdwebProvider>
  );
}

export default MyApp;
