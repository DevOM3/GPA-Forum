import "../styles/globals.css";
import { StateProvider } from "../context/StateProvider";
import reducer, { initialState } from "../context/reducer";

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <Component {...pageProps} />
    </StateProvider>
  );
}

export default MyApp;
