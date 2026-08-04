import { useState, useRef, useEffect } from 'react';

export const useBanglaVoice = (lang) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    // Setup for Web Speech API (English)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const r = new SpeechRecognition();
      r.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.onend = () => setListening(false);
      recognitionRef.current = r;
    }
  }, [lang]);

  const toggleListen = (onResult) => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    setTranscript('');
    setListening(true);

    recognitionRef.current.onresult = (ev) => {
      const text = ev.results[0][0].transcript.trim();
      setTranscript(text);
      onResult(text);
    };
    recognitionRef.current.start();
  };

  const startRecording = async (onResult) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = async () => {
        setProcessing(true);
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const txt = await sendAudioToServer(blob);
        setTranscript(txt);
        onResult(txt);
        setProcessing(false);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setTimeout(() => mr.state === 'recording' && mr.stop(), 6000);
    } catch (err) {
      console.error(err);
    }
  };

  const sendAudioToServer = async (blob) => {
    const dataUrl = await new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.readAsDataURL(blob);
    });
    const res = await fetch('/api/asr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64: dataUrl, contentType: blob.type }),
    });
    const j = await res.json();
    return j.result?.text || j.result || '';
  };

  return { listening, transcript, processing, toggleListen };
};
