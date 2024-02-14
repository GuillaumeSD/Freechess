import { AppProps } from "next/app";
import Head from "next/head";
import "../../styles/global.css";
import "../../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Free Chess</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
