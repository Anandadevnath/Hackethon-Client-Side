import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBanglaVoice } from '../hooks/useBanglaVoice';

export default function BanglaVoice({ weather = {}, advisory = '', tips = [], crops = [] }) {
  const { lang } = useLanguage();
  const [response, setResponse] = useState('');
  const [useText, setUseText] = useState(false);
  const [input, setInput] = useState('');

  const { listening, transcript, processing, toggleListen } = useBanglaVoice(lang);

  const speak = (txt) => {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const processQuery = (q) => {
    if (!q) return;
    const lower = q.toLowerCase();

    // Logic remains mostly the same, but simplified for brevity
    let txt = 'দুঃখিত, আমি বুঝতে পারিনি।';
    if (lower.includes('আবহাও')) {
      txt = weather.temp ? `এখানের আবহাওয়া ${weather.temp}।` : 'আবহাওয়ার তথ্য নেই।';
    } else if (lower.includes('ধানে')) {
      txt = advisory || 'কোনো পরামর্শ নেই।';
    }
    setResponse(txt);
    speak(txt);
  };

  const submitText = (e) => {
    e?.preventDefault();
    processQuery(input);
    setInput('');
  };

  const L = lang === 'bn' ? { title: 'ভয়েস সহকারী', placeholder: 'লিখুন...', send: 'পাঠান', response: 'উত্তর' } : { title: 'Voice Assistant', placeholder: 'Type...', send: 'Send', response: 'Response' };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-[#f3f7f4]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-[#0b5f37]">{L.title}</h4>
        <button onClick={() => setUseText(v => !v)} className="text-sm px-3 py-1 rounded bg-gray-100">{useText ? 'Speech' : 'Text'}</button>
      </div>

      <div className="space-y-3">
        {useText ? (
          <form onSubmit={submitText} className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={L.placeholder} className="flex-1 border p-2 rounded" />
            <button type="submit" className="px-3 bg-[#0f7a48] text-white rounded">{L.send}</button>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => toggleListen(processQuery)} className={`w-12 h-12 rounded-full ${listening ? 'bg-red-500' : 'bg-green-500'} text-white`}>{listening ? '●' : '🎤'}</button>
            <div className="text-sm text-gray-600">{transcript || (listening ? '...' : 'Stopped')}</div>
          </div>
        )}
        <div className="p-3 bg-gray-50 rounded text-sm text-gray-700">
          <div className="font-semibold">{L.response}</div>
          <div>{processing ? 'Processing...' : (response || '—')}</div>
        </div>
      </div>
    </div>
  );
}