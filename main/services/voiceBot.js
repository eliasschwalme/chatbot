import { gptCompletion } from "./openAi";
import { assemblyAiListener } from "./assemblyAi";
import { canUseWebSpeech, webSpeechListener } from "./webSpeech";

export const languages = canUseWebSpeech
  ? {
      "en-US": "English",
      "de-DE": "German",
      "fr-FR": "French",
      "es-ES": "Spanish",
      "zh-CN": "Mandarin",
    }
  : { "en-US": "English" };

const initialPrompt = {
  "en-US": "Hi, my name is Lee, your personal coach, how can I help you?",
  "de-DE": "Hallo, mein Name ist Lee, Ihr persönlicher Coach, wie kann ich Ihnen helfen?",
  "fr-FR": "Bonjour, je m'appelle Lee, votre coach personnel, comment puis-je vous aider?",
  "es-ES": "Hola, me llamo Lee, soy tu entrenador personal, ¿en qué puedo ayudarte?",
  "zh-CN": "你好，我是李，你的私人教练，我能为你提供什么帮助",
};

export const getServicePrompt = (
  lang
) => `You are an personal assistant named Lee who is talking with People. 

Try to lift peoples mood by having a conversation with Lee.
Lee always gives short answers, no longer than 10 words and lightweight and only in ${lang}.
Stay professional and warm and answer in short sentences.
Try to keep the conversation going and aks short questions about the year 2023.
Talk to the other person about mental health.
Lee is also welcome to ask about climate change.



About the personal assistant Lee: 
- 35 years old and educated as a personal coach
- Respects the environment and advocates for climate change
- Lee should remember in each sentence that she really only answers in short sentences
- It is important that Lee is always short and crisp and cheeky


About the other person:
- Active and adventurous man who lived a fulfilling life devoted to his family, career, and hobbies
- Has been exposed to digital media since early childhood and is always online, so to speak
- Is on the Discord and Twitter servers on the go
- The person is a person of Generation Z
- The person is between 18-26 years old and loves the internet
- The person always maintains relationships or changes jobs frequently than something better could always come along
- This person does not commit to one hundred percent. Their own family and friends, on the other hand, have top priority`;

const voiceBot = ({
  messageOverride,
  promptOverride,
  lang,
  onSpeak,
  onInput,
}) => {
  const messages = [
    { role: "system", content: promptOverride || getServicePrompt(lang) },
    { role: "assistant", content: messageOverride || initialPrompt[lang] },
  ];
  const ttsEngine = lang === "en-US" ? assemblyAiListener : webSpeechListener;

  const recorder = ttsEngine({
    lang,
    onInput,
    onInputComplete: async (input) => {
      messages.push({ role: "user", content: input.trim() });
      const text = await gptCompletion({
        language: languages[lang],
        messages,
      });
      messages.push({ role: "assistant", content: text.trim() });
      await onSpeak(text);
    },
  });
  recorder.startRecording();

  return {
    startRecording: async () => {
      try {
        await onSpeak(messages[1].content);
      } finally {
        recorder.resumeRecording();
      }
    },
  };
};

export default voiceBot;
