// frontend/src/components/auth/OtpVerifyCard.jsx
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";

const OtpVerifyCard = ({ email, purpose, mode, onSubmitOtp, onResend }) => {
    const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
    const [secondsLeft, setSecondsLeft] = useState(60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputsRef = useRef([]);

    const currentCode = codeDigits.join("");

    // reset on email change
    useEffect(() => {
        setSecondsLeft(60);
        setCodeDigits(["", "", "", "", "", ""]);
        setIsSubmitting(false);
    }, [email]);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [secondsLeft]);

    const submitOtp = async (code) => {
        if (code.length !== 6) {
            toast.error("Enter 6‑digit code");
            return;
        }
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
            await onSubmitOtp(code);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitOtp(codeDigits.join(""));
    };


    const handleResend = async () => {
        if (secondsLeft > 0 || isSubmitting) return;
        await onResend();
        toast.success("New code sent");
        setSecondsLeft(60);
        setCodeDigits(["", "", "", "", "", ""]);
        if (inputsRef.current[0]) {
            inputsRef.current[0].focus();
        }
    };

    const handleChangeDigit = (index, value) => {
        const digit = value.replace(/\D/g, "").slice(0, 1);
        const updated = [...codeDigits];
        updated[index] = digit;
        setCodeDigits(updated);

        if (digit && index < 5 && inputsRef.current[index + 1]) {
            inputsRef.current[index + 1].focus();
        }

        const joined = updated.join("");
        if (joined.length === 6) {
            submitOtp(joined);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        const arr = pasted.split("");
        const updated = ["", "", "", "", "", ""].map((_, i) => arr[i] || "");
        setCodeDigits(updated);

        const joined = updated.join("");
        if (joined.length === 6) {
            submitOtp(joined);
        }
    };


    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
        if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };



    return (
        <div className="w-full max-w-md bg-white/95 border border-slate-200 rounded-2xl shadow-xl backdrop-blur-xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
                <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-2 rounded-2xl shadow-[0_8px_24px_rgba(79,70,229,0.45)]">
                    <ShieldCheck className="text-white w-4 h-4" />
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">
                    PayNidhi Security
                </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1">
                Verify your email
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
                We sent a {purpose === "login" ? "login" : "signup"} code to{" "}
                <span className="font-semibold text-slate-800">{email}</span>. Enter the
                6‑digit code below to continue as a {mode}.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Verification code
                    </label>
                    <div
                        className="flex justify-between gap-2"
                        onPaste={handlePaste}
                    >
                        {codeDigits.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => (inputsRef.current[idx] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChangeDigit(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-slate-200 bg-white text-center text-base sm:text-lg font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70"
                            />
                        ))}
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400">
                        You can also paste the full 6‑digit code.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center items-center rounded-xl bg-slate-900 text-white text-sm font-semibold py-2.5 shadow-[0_10px_25px_rgba(15,23,42,0.6)] hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    Verify & continue
                </button>
            </form>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                    Didn&apos;t get the code?{" "}
                    <button
                        disabled={secondsLeft > 0 || isSubmitting}
                        onClick={handleResend}
                        className={`font-semibold ${secondsLeft > 0 || isSubmitting
                            ? "text-slate-400 cursor-not-allowed"
                            : "text-indigo-600 hover:text-indigo-700"
                            }`}
                    >
                        Resend
                    </button>
                </span>
                <span>
                    {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "You can resend now"}
                </span>
            </div>
        </div>
    );
};

export default OtpVerifyCard;
