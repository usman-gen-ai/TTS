import { useState } from "react";
import { FileText, Volume2, Wand2, Zap } from "lucide-react";
import StatsCard from "./StatsCard";
import TextAreaWithStats from "./TextAreaWithStats";
import ActionButtons from "./ActionButtons";
import { synthesizeAudio } from "@/api/HomeApiCalls";

const TextEditorArea = ({ setAudioHistory }) => {
  const [text, setText] = useState(() => {
    return localStorage.getItem("textLogs") || "";
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedTime = Math.ceil(wordCount / 150);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsPlaying(true);
    try {
      const result = await synthesizeAudio({
        text,
        voiceId: localStorage.getItem("preferredVoice") || "Joanna",
        engine: "standard",
        languageCode: localStorage.getItem("preferredLanguage") || "en-US",
        format: localStorage.getItem("preferredFormat") || "mp3",
        speedMultiplier: parseFloat(localStorage.getItem("preferredSpeed")) || 1.0,
        pitchMultiplier: parseFloat(localStorage.getItem("preferredPitch")) || 1.0,
      });

      const newAudio = {
        id: Date.now(),
        title: text.substring(0, 20) + (text.length > 20 ? "..." : ""),
        text,
        voice: result.voice,
        duration: `${estimatedTime}m`,
        format: localStorage.getItem("preferredFormat") || "mp3",
        date: new Date().toLocaleString(),
        audioUrl: result.url,
      };

      setAudioHistory((prev) => [...prev, newAudio]);
    } catch (error) {
      console.error("Audio generation failed:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setText(newValue);
    localStorage.setItem("textLogs", newValue);
  };

  const clearText = () => setText("");

  return (
    <div className="lg:col-span-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          icon={FileText}
          label="Characters"
          value={charCount.toLocaleString()}
        />
        <StatsCard
          icon={Wand2}
          label="Words"
          value={wordCount.toLocaleString()}
        />
        <StatsCard icon={Zap} label="Est. Time" value={`${estimatedTime}m`} />
        <StatsCard
          icon={Volume2}
          label="Status"
          value={isPlaying ? "Playing" : "Ready"}
        />
      </div>

      <TextAreaWithStats
        text={text}
        onChange={handleChange}
        charCount={charCount}
        wordCount={wordCount}
        clearText={clearText}
      />

      <ActionButtons
        onGenerate={handleGenerate}
        disabled={!text.trim()}
        isPlaying={isPlaying}
      />
    </div>
  );
};
export default TextEditorArea;
