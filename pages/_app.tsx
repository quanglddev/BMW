import "../styles/globals.css";
import type { AppProps } from "next/app";
import initAuth from "../utils/initAuth"; // the module you created above
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

initAuth();

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
