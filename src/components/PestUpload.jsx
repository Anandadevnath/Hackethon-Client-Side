import React, { useRef, useState } from "react";
import { usePestIdentification } from "../hooks/usePestIdentification";
import { Button } from "./common/Button";

export default function PestUpload({ division = null, district = null }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { loading, result, error, identifyPest, setResult, setError } = usePestIdentification();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    identifyPest(file, division, district);
  };

  const clearAll = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-[600px] mx-auto my-5 text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-green-900 mb-4">পোকা / ক্ষতি চিহ্নিতকরণ</h2>

      <div className="mb-4">
        <Button onClick={() => fileInputRef.current?.click()}>ছবি আপলোড করুন</Button>
        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      </div>

      {imagePreview && (
        <img src={imagePreview} alt="Preview" className="mx-auto max-w-[260px] rounded-xl mb-4 border" />
      )}

      {loading && <div className="mb-4 p-2 rounded-full bg-yellow-100 text-yellow-800 inline-block">⏳ লোড হচ্ছে...</div>}
      {error && <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700">⚠️ {error}</div>}

      {result && (
        <div className="mt-4 text-left rounded-xl bg-green-50 p-4 text-green-900">
          <h3 className="font-bold mb-2">ফলাফল:</h3>
          <p className="whitespace-pre-wrap">{result.answer}</p>
        </div>
      )}

      {(imagePreview || result) && (
        <Button variant="outline" size="sm" onClick={clearAll} className="mt-4">🔄 পুনরায় চেষ্টা করুন</Button>
      )}
    </div>
  );
}
