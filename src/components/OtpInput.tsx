import { useRef, type KeyboardEvent, type ClipboardEvent } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export const OtpInput = ({ value, onChange, length = 6 }: OtpInputProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const updateDigit = (index: number, digit: string) => {
    const newDigits = [...digits];
    newDigits[index] = digit;
    onChange(newDigits.join(''));
  };

  const handleChange = (index: number, rawValue: string) => {
    const digit = rawValue.replace(/\D/g, '').slice(-1);
    updateDigit(index, digit);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    const nextIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="h-14 w-12 rounded-2xl border-2 border-ink/10 text-center text-2xl font-bold text-ink transition-colors focus:border-coral focus:outline-none"
        />
      ))}
    </div>
  );
};