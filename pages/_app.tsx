import '../styles/globals.css';
import type { AppProps } from 'next/app';
import DotMatrixBackground from '../components/DotMatrixBackground';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DotMatrixBackground />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
