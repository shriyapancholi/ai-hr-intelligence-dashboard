import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;
env.useBrowserCache = true;

let transcriber = null;

async function loadModel() {
  transcriber = await pipeline(
    "automatic-speech-recognition",
    "Xenova/whisper-tiny.en",
    {
      progress_callback: (p) => {
        // v2.x uses status:"progress" with a 0-100 `progress` field
        if (p.status === "progress") {
          self.postMessage({ type: "progress", pct: Math.round(p.progress ?? 0) });
        }
        if (p.status === "done") {
          self.postMessage({ type: "progress", pct: 100 });
        }
      },
    }
  );
}

self.onmessage = async ({ data }) => {
  if (data.type === "load") {
    try {
      self.postMessage({ type: "loading" });
      await loadModel();
      self.postMessage({ type: "ready" });
    } catch (e) {
      self.postMessage({ type: "error", message: e.message });
    }
    return;
  }

  if (data.type === "transcribe") {
    try {
      if (!transcriber) await loadModel();
      const result = await transcriber(data.audio, {
        language: "english",
        task: "transcribe",
      });
      const text = result.text?.trim();
      self.postMessage({ type: "result", text: text || "" });
    } catch (e) {
      self.postMessage({ type: "error", message: e.message });
    }
  }
};
