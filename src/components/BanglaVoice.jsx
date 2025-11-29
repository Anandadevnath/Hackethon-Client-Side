import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
export default function BanglaVoice({ upazila = 'Bangladesh', weather = {}, advisory = '', tips = [], crops = [] }) {
  const [supported, setSupported] = useState(false);
  const { lang } = useLanguage();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [useText, setUseText] = useState(false);
  const [input, setInput] = useState('');
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const r = new SpeechRecognition();
    r.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev) => {
      const text = ev.results[0][0].transcript.trim();
      setTranscript(text);
      processQuery(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognitionRef.current = r;
  }, [lang]);

  const speak = (txt) => {
    try {
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
      const voices = window.speechSynthesis.getVoices() || [];
      const bn = voices.find(v => /bn|bengali|bangla/i.test(v.lang || v.name));
      if (bn) u.voice = bn;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {
    }
  };

  const processQuery = (q) => {
    if (!q) return;
    const lower = q.toLowerCase();

    // Common question patterns in Bangla
    if (lower.includes('আবহাও') || (lower.includes('কেমন') && lower.includes('আবহাও'))) {
      const txt = weather && weather.temp
        ? `এখানের আবহাওয়া ${weather.temp}, আর্দ্রতা ${weather.humidity || ''} এবং বৃষ্টির সম্ভাব্যতা ${weather.rainfall || ''}।` 
        : `আমি আপনার এলাকার সাম্প্রতিক আবহাওয়া তথ্য পাচ্ছি না, দয়া করে উপ-জেলার নামটি ঠিক আছে কিনা দেখুন।`;
      setResponse(txt);
      speak(txt);
      return;
    }

    if (lower.includes('আমার ধানে') || (lower.includes('ধানে') && lower.includes('কেমন'))) {
      const adv = advisory || '';
      const txt = adv ? `আপনার ফসল সম্পর্কে সাধারণ পরামর্শ: ${adv}` : 'আপনার ফসলের বিস্তারিত পাওয়া যায়নি — দয়া করে ফসলটি যুক্ত করুন বা টেক্সটে বলুন।';
      setResponse(txt);
      speak(txt);
      return;
    }

    if (lower.includes('গুদামে') || lower.includes('গুদাম')) {
      const t = (tips && tips.length > 0) ? `সংরক্ষণের পরামর্শ: ${tips.slice(0,3).join(' । ')}` : 'গুদাম সম্পর্কিত পরামর্শ পাওয়া যায়নি।';
      setResponse(t);
      speak(t);
      return;
    }

    if (lower.includes('কবে') && lower.includes('কাট')) {
      // try to find next harvest date from crops
      const item = (crops && crops.length > 0) ? crops[0] : null;
      if (item && item.harvestDate) {
        try {
          const then = new Date(item.harvestDate);
          const diff = Math.ceil((then - new Date()) / (1000 * 60 * 60 * 24));
          const txt = diff > 0 ? `প্রস্তাবিত কাটা: ${diff} দিনের মধ্যে (${item.harvestDate}) ।` : `আপনার প্রদানকৃত তারিখ ${item.harvestDate} হয়ত অতীত বা আজকের তারিখ।`;
          setResponse(txt);
          speak(txt);
          return;
        } catch (e) { }
      }
      const fallback = 'কোনো নির্দিষ্ট ফসলের তথ্য নেই — আপনি কোন ফসল কাটার সময় জানতে চান? টেক্সট বক্সে লিখে জানান।';
      setResponse(fallback);
      speak(fallback);
      return;
    }

    // fallback generic reply
    const fallback = 'দুঃখিত, আমি বুঝতে পারিনি। অনুগ্রহ করে পুনরায় বলেন অথবা নিচের টেক্সট বক্সে বাংলায় লিখুন।';
    setResponse(fallback);
    speak(fallback);
  };

  const toggleListen = () => {
    // If user selected Bangla, prefer server-side ASR (wav2vec2) using MediaRecorder
    if (lang === 'bn') {
      if (recording) {
        // stop recording
        try { mediaRecorderRef.current?.stop(); } catch (e) {}
        setRecording(false);
        setListening(false);
      } else {
        setTranscript('');
        setResponse('');
        startRecording();
      }
      return;
    }

    // For non-Bangla (English), use Web Speech API if available
    if (!recognitionRef.current) return setUseText(true);
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript('');
      setResponse('');
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (e) {
        setUseText(true);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        setProcessing(true);
        const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || 'audio/webm' });
        try {
          await sendAudioToServer(blob);
        } finally {
          setProcessing(false);
        }
        // stop all tracks
        try { stream.getTracks().forEach(t => t.stop()); } catch (e) {}
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
      setListening(true);
      // auto-stop after 6 seconds to keep things snappy
      setTimeout(() => {
        if (mr.state === 'recording') mr.stop();
      }, 6000);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      setUseText(true);
    }
  };

  const sendAudioToServer = async (blob) => {
    try {
      // convert to data URL
      const dataUrl = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
      });

      setProcessing(true);
      const body = { audioBase64: dataUrl, contentType: blob.type };
      const res = await fetch('/api/asr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (res.ok && j && j.ok && j.result) {
        // HF may return { text: '...' } or array
        let txt = '';
        if (j.result.text) txt = j.result.text;
        else if (Array.isArray(j.result) && j.result[0] && j.result[0].text) txt = j.result[0].text;
        else if (typeof j.result === 'string') txt = j.result;
        setTranscript(txt || '');
        if (txt) processQuery(txt);
      } else {
        console.error('ASR server error', j);
        setResponse(lang === 'bn' ? 'ট্রান্সক্রিপশন ব্যর্থ' : 'Transcription failed');
      }
    } catch (err) {
      console.error('Failed to send audio to server', err);
      setResponse(lang === 'bn' ? 'সার্ভারে পাঠাতে ব্যর্থ' : 'Failed to send to server');
    } finally {
      setProcessing(false);
    }
  };

  const submitText = (e) => {
    e?.preventDefault();
    const q = input.trim();
    if (!q) return;
    setTranscript(q);
    processQuery(q);
    setInput('');
  };

  const labels = {
    en: {
      title: 'Voice Assistant',
      subtitle: 'Speak in English (en-US). Fallback to text available.',
      toggleText: (useText) => (useText ? 'Speech' : 'Text'),
      placeholder: 'Type here...',
      send: 'Send',
      listeningStopped: 'Listening stopped.',
      response: 'Response',
      examples: 'Try: "What is the weather today?", "How is my paddy?", "How should I store grain?"'
    },
    bn: {
      title: 'ভয়েস সহকারী',
      subtitle: 'বাংলায় কথা বলুন (bn-BD)। ব্যাকআপ হিসেবে টেক্সট ব্যবহার করুন।',
      toggleText: (useText) => (useText ? 'স্পিচ' : 'টেক্সট'),
      placeholder: 'বাংলায় লিখুন...',
      send: 'পাঠান',
      listeningStopped: 'শুনা বন্ধ।',
      response: 'উত্তর',
      examples: 'উদাহরণ: "আজকে আবহাওয়া?", "আমার ধানে অবস্থা কেমন?", "গুদামে কী করব?"'
    }
  };

  const L = lang === 'bn' ? labels.bn : labels.en;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-[#f3f7f4]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-[#0b5f37]">{L.title}</h4>
          <div className="text-xs text-gray-500">{L.subtitle}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setUseText(v => !v)} className="text-sm px-3 py-1 rounded bg-gray-100">{L.toggleText(useText)}</button>
        </div>
      </div>

      <div className="space-y-3">
        {useText ? (
          <form onSubmit={submitText} className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={L.placeholder} className="flex-1 border p-2 rounded" />
            <button type="submit" className="px-3 bg-[#0f7a48] text-white rounded">{L.send}</button>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={toggleListen} className={`w-12 h-12 rounded-full ${listening ? 'bg-red-500' : 'bg-green-500'} text-white`}>{listening ? '●' : '🎤'}</button>
            <div className="flex-1">
              <div className="text-sm text-gray-600">{transcript || L.listeningStopped}</div>
            </div>
          </div>
        )}

        <div className="p-3 bg-gray-50 rounded text-sm text-gray-700">
          <div className="font-semibold mb-1">{L.response}</div>
          <div>{response || '—'}</div>
        </div>

        <div className="text-xs text-gray-400">{L.examples}</div>
      </div>
    </div>
  );
}
