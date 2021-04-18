import "../styles/globals.css";
import Layout from "../components/Layout";
import { StateProvider } from "../context/StateProvider";
import reducer, { initialState } from "../context/reducer";
import { AnimatePresence } from "framer-motion";

function MyApp({ Component, pageProps, router }) {
  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <AnimatePresence exitBeforeEnter>
        <Layout key={router.route}>
          <Component {...pageProps} />
        </Layout>
      </AnimatePresence>
    </StateProvider>
  );
}

export default MyApp;
