import "./index.css";
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  // const GA_MEASUREMENT_ID = 'G-H02NT3BGMW';
  return <>
    <Component {...pageProps} />;
    <Script src="https://www.WebRTC-Experiment.com/RecordRTC.js"></Script>
    {/* <Script src={"https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID)} /> */}
    {/* <Script id="google-analytics">
      {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)});
          `}
    </Script> */}
    {/* <Script type="text/javascript" charset="UTF-8" src="//cdn.cookie-script.com/s/4effb326cfdf1e428a3f48414a0fc415.js"></Script> */}
  </>
}
