import "../styles/globals.css";
import type { AppProps } from "next/app";
import initAuth from "../utils/initAuth"; // the module you created above

initAuth();

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
