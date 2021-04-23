import "../styles/globals.css";
import Layout from "../components/Layout";
import { StateProvider } from "../context/StateProvider";
import reducer, { initialState } from "../context/reducer";
import { AnimatePresence } from "framer-motion";

function MyApp({ Component, pageProps, router }) {
  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <Layout>
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
    </StateProvider>
  );
}

export default MyApp;
