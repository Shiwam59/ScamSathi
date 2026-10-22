'use client';

import React, { useState, useRef } from 'react';
import { X, AlertCircle, FileImage, Lock, Check } from 'lucide-react';

export interface SubmitPayload {
  text?: string;
  image?: File;
  save: boolean;
}

interface InputFormProps {
  onSubmit: (payload: SubmitPayload) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

const MAX_CHARS = 5000;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const SAMPLES = [
  {
    id: 'kyc',
    title: 'Bank KYC SMS',
    text: 'Dear customer, your bank KYC expires today. Your account will be blocked tonight. Update now at https://kyc-review.example/verify. Enter your OTP to avoid suspension.',
    isFictional: true,
  },
  {
    id: 'wfh',
    title: 'WFH Job Offer',
    text: 'Congratulations! You have been selected for Amazon WFH Data Entry Executive. Salary ₹45,000/month. To confirm your joining kit and laptop courier, transfer a refundable registration fee of ₹5,000 to hr@example.bank.',
    isFictional: true,
  },
  {
    id: 'courier',
    title: 'Courier Delivery Issue',
    text: 'SpeedPost: Parcel #IN-90812 cannot be dispatched due to missing house number. Kindly confirm your full delivery address within 12 hours at https://indiapost-update.example/track to avoid package return.',
    isFictional: true,
  },
];

export function InputForm({ onSubmit, isLoading, errorMessage }: InputFormProps) {
  const [text, setText] = useState('');
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saveReport, setSaveReport] = useState(true);
  const [clientError, setClientError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setSelectedSample(null);
    if (val.length > MAX_CHARS) {
      setClientError(`Text is ${val.length.toLocaleString()} characters. Please keep it under ${MAX_CHARS.toLocaleString()} characters.`);
    } else if (clientError && !imageFile) {
      setClientError(null);
    }
  };

  const handleFile = (file: File) => {
    setClientError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setClientError('Unsupported file type. Please upload a PNG, JPG, or WebP screenshot.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setClientError(`Image is ${sizeMb} MB. Please upload an image under 5 MB.`);
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSampleClick = (sample: (typeof SAMPLES)[0]) => {
    setText(sample.text);
    setSelectedSample(sample.id);
    setClientError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed && !imageFile) {
      setClientError('Please paste message text or upload a screenshot.');
      return;
    }

    if (trimmed.length > MAX_CHARS) {
      setClientError(`Text exceeds ${MAX_CHARS.toLocaleString()} characters limit.`);
      return;
    }

    onSubmit({
      text: trimmed || undefined,
      image: imageFile || undefined,
      save: saveReport,
    });
  };

  const activeError = errorMessage || clientError;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 sm:p-7 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C201E]">
            What did you receive?
          </h2>
          <p className="text-xs sm:text-sm text-[#555C57] leading-relaxed">
            Paste the exact message. Remove names, account details and other personal information first.
          </p>
        </div>
        {selectedSample && (
          <span className="shrink-0 px-2.5 py-1 rounded-md bg-[#E8F3EE] text-[#154D40] text-[11px] font-bold border border-[#C5DFD4]">
            Demo loaded
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Sample Selector */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#737873]">
            TRY A FICTIONAL EXAMPLE
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLES.map((sample) => {
              const isSelected = selectedSample === sample.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSampleClick(sample)}
                  className={`text-center py-2.5 px-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                    isSelected
                      ? 'border-[#154D40] bg-[#E8F3EE] text-[#154D40] font-bold shadow-2xs'
                      : 'border-[#E5E5DF] bg-[#FAF9F6] hover:bg-[#F2F1EC] text-[#333835]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#154D40]" />}
                    <span>{sample.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#555C57] font-medium px-0.5">
            <label htmlFor="message-input" className="font-bold text-[#333835]">
              Message text
            </label>
            <span className="text-[11px] text-[#737873]">
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} character limit
            </span>
          </div>

          <textarea
            id="message-input"
            value={text}
            onChange={handleTextChange}
            disabled={isLoading}
            rows={4}
            placeholder="Dear customer, your bank KYC expires today..."
            className="w-full px-4 py-3 text-sm text-[#1C201E] bg-[#FAF9F6] border border-[#DCDCD5] rounded-xl focus:border-[#154D40] focus:ring-1 focus:ring-[#154D40] focus:bg-white transition resize-y font-normal placeholder-[#8C918C]"
          />

          {selectedSample && (
            <p className="text-[11px] text-[#737873] italic">
              Fictional demo. The .example address is not a real bank link.
            </p>
          )}
        </div>

        {/* Screenshot Upload Dropzone */}
        {!imagePreview ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-[#C5C5BD] bg-[#FAF9F6] hover:bg-[#F3F2EB] rounded-xl p-5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-full bg-white border border-[#DCDCD5] flex items-center justify-center text-[#555C57] group-hover:text-[#154D40]">
              <FileImage className="w-4.5 h-4.5" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#154D40]">
                Drop a screenshot here, or browse files
              </span>
              <p className="text-[11px] text-[#737873]">
                JPG or PNG • max 5 MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#DCDCD5] rounded-xl text-xs">
            <div className="flex items-center gap-2.5 truncate">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Screenshot preview"
                className="w-9 h-9 object-cover rounded-lg border border-[#D5D4CC]"
              />
              <div className="truncate">
                <span className="font-bold text-[#1C201E] block truncate">
                  {imageFile?.name}
                </span>
                <span className="text-[11px] text-[#737873]">
                  {imageFile ? `${(imageFile.size / 1024).toFixed(0)} KB` : ''}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-1 rounded-lg text-[#737873] hover:text-[#991B1B] hover:bg-red-50 transition"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error notification */}
        {activeError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2.5 text-xs text-red-900 font-medium">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
            <p>{activeError}</p>
          </div>
        )}

        {/* Save History Toggle */}
        <div className="pt-2 border-t border-[#E5E5DF]">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={saveReport}
              onChange={(e) => setSaveReport(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#154D40] accent-[#154D40] cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#1C201E] block">
                Save anonymized report to session history
              </span>
              <p className="text-[11px] text-[#555C57] leading-relaxed">
                Opt-in saves only category, verdict and timestamp during this session. No original messages, screenshots or personal data are saved.
              </p>
            </div>
          </label>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-[#154D40] hover:bg-[#0F3B31] text-white font-bold text-sm tracking-wide shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
        >
          {isLoading ? (
            <span>Analyzing message...</span>
          ) : (
            <>
              <span>Investigate Message</span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#737873]">
          <Lock className="w-3.5 h-3.5 text-[#737873]" />
          <span>Input is used for this analysis only, not saved to history.</span>
        </div>
      </form>
    </div>
  );
}

export default InputForm;
