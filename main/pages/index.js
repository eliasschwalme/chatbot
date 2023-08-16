import voiceBot, { languages } from "@/services/voiceBot";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

import Scene from "../components/Scene";
import { useRouter } from "next/router";
import playAudioData from "../services/playAudioData";
import { makeSpeech } from "../services/makeSpeech";

export default function Home() {
  const [subtitle, setSubtitle] = useState("");
  const [userInput, setUserInput] = useState("");
  const [blendData, setBlendData] = useState();

  const [started, setStarted] = useState(false);
  const router = useRouter();

  const start = async (lang) => {
    window.gtag('event', 'start_conversation', {
      lang
    });

    setStarted(true);

    const recorder = voiceBot({
      messageOverride: router.query.message,
      promptOverride: router.query.prompt,
      lang,
      onInput: (msg) => {
        setUserInput(msg);
      },
      onSpeak: async (msg) => {
        if (msg === subtitle) return;
        setUserInput("");
        setSubtitle(msg);

        if (msg) {
          await new Promise(async (resolve) => {
            const response = await makeSpeech(lang, msg);
            const { blendData, audioData } = response.data;

            if (blendData.length) {
              setBlendData(blendData);
            }

            if (audioData) {
              await playAudioData(audioData, resolve);
            } else {
              resolve();
            }
          });
        }
      },
    });
    recorder.startRecording();
  };

  useEffect(() => {
    if (router.query.lang) {
      start(router.query.lang);
    }
  }, [router.query.lang]);

  const { progress } = useProgress();

  return (
    <>
      <Head>
        <title>New Bets</title>
      </Head>
      <main>
        <Scene blendData={blendData} />

        {!!subtitle && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              textAlign: "center",
              fontSize: 20,
              color: userInput ? "blue" : "black",
              backgroundColor: "#fffa",
              padding: 10,
            }}
          >
            {userInput || subtitle}
          </div>
        )}
        {!started && progress === 100 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000d",
              color: "white",
              fontSize: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: 10,
                  cursor: "pointer",
                  backgroundColor: "#fff3",
                  marginLeft: 5,
                  marginRight: 5,
                  marginBottom: 10,
                }}
                onClick={() => start("en-US")}
              >
                Start
              </div>
            </div>
            <p style={{ fontSize: 16, marginTop: 5 }}>
              Avatar iOS animations are only supported in English.
              <br />
              To get the full  experience in other languages, please contact the host.
              <br />
              <br />
              Non-commercial use only.
              <br />
              <br />
              Information on data protection is given at lee-ai.com - privacy-policy. 
              <br />
              <br />
              hosted by{" "}
              <a href="https://www.linkedin.com/in/elias-schwalme-723b04205/" style={{ color: "white" }}>
                Elias Schwalme
              </a>
            </p>
          </div>
        )}
      </main>
    </>
  );
}
