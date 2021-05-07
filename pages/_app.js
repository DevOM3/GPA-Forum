import "regenerator-runtime/runtime";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { StateProvider } from "../context/StateProvider";
import reducer, { initialState } from "../context/reducer";
import { AnimatePresence } from "framer-motion";
import Head from "next/head";

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta property="og:site_name" content="GPAForum" />
        <meta property="og:type" content="A platform exclusively for 'GPA'" />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/images/logo-rounded.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/images/logo-rounded.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/images/logo-rounded.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <StateProvider reducer={reducer} initialState={initialState}>
        <Layout>
          <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </Layout>
      </StateProvider>
    </>
  );
}

export default MyApp;
