import {
  setAudios,
  setFormats,
  setLanguages,
  setVoices,
} from "@/store/reducers/ttsConfig";
import { dispatch } from "@/store/store";
import { sleep } from "@/utils/helpers";
import { POLLY_VOICES } from "@/utils/pollyVoices";

const SYNTHESIZE_URL =
  "https://42u4bmvy3k.execute-api.us-east-1.amazonaws.com/prod/synthesize";

export const synthesizeAudio = async ({
  text,
  voiceId,
  engine,
  languageCode,
  format,
  speedMultiplier,
  pitchMultiplier,
}) => {
  const payload = {
    text,
    voiceId,
    languageCode,
    engine,
    format,
    speedMultiplier,
    pitchMultiplier,
  };
  // const payload = { text, voiceId, engine, languageCode, format, speedMultiplier, pitchMultiplier };
  console.log("TTS Payload:", JSON.stringify(payload, null, 2));
  const response = await fetch(SYNTHESIZE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Synthesis failed");
  return response.json();
};

const formatter = async (formats) => {
  return formats.map((format) => ({
    value: format.value,
    label: format.label,
  }));
};

const audioFormatter = (audios) => {
  return audios.map((audio) => ({
    id: audio.id,
    title: audio.title,
    text: audio.text,
    voice: audio.voice,
    duration: audio.duration,
    format: audio.format,
    date: audio.date,
  }));
};

export const getVoices = async () => {
  await sleep(800);
  try {
    const formatted = POLLY_VOICES.map(({ voiceId, language }) => ({
      value: voiceId,
      label: `${voiceId} - ${language}`,
    }));
    dispatch(setVoices(formatted));
  } catch (error) {
    console.error("Error fetching voices:", error);
  }
};

export const getLanguages = async () => {
  await sleep(400);
  try {
    const seen = new Set();
    const formatted = POLLY_VOICES.reduce((acc, { languageCode, language }) => {
      if (!seen.has(languageCode)) {
        seen.add(languageCode);
        acc.push({ value: languageCode, label: language });
      }
      return acc;
    }, []);
    dispatch(setLanguages(formatted));
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
};

export const getVoiceFormats = async () => {
  await sleep(200);
  try {
    const response = [
      { value: "mp3", label: "MP3 - Standard Quality" },
      { value: "ogg_opus", label: "Ogg Opus - High Quality Streaming" },
      { value: "ogg_vorbis", label: "OGG Vorbis - Compressed" },
      { value: "json", label: "JSON - Speech Marks (Animation)" },
    ];

    const formatted = await formatter(response);
    dispatch(setFormats(formatted));
  } catch (error) {
    console.error("Error fetching formats:", error);
  }
};

export const getAudios = async () => {
  await sleep(200);
  try {
    const response = [
      {
        id: 1,
        title: "Sample Audio 1",
        text: "This is the first sample audio text.",
        voice: "Alloy",
        duration: "1m",
        format: "mp3",
        date: "2025-10-03 12:00:00",
      },
      {
        id: 2,
        title: "Sample Audio 2",
        text: "This is the second sample audio text.",
        voice: "Echo",
        duration: "2m",
        format: "mp3",
        date: "2025-10-03 12:05:00",
      },
      {
        id: 3,
        title: "Sample Audio 3",
        text: "This is the third sample audio text.",
        voice: "Fable",
        duration: "3m",
        format: "mp3",
        date: "2025-10-03 12:10:00",
      },
    ];

    const formatted = await audioFormatter(response);
    dispatch(setAudios(formatted));
  } catch (error) {
    console.error("Error fetching formats:", error);
  }
};
