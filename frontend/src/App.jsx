import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ArrowRight, Moon, Sun } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [isDark, setIsDark] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  const GOOGLE_FORM_ID = '1FAIpQLSffr3eaxDH5u0wuzDmQT_2lS7H_r6ctxsY3QKmbDc-mrlrrxw';
  const GOOGLE_FORM_FIELD_ID = '1924648042';
  const BACKEND_API_URL = '/api/waitlist';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter an email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const backendResponse = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!backendResponse.ok) throw new Error('Backend failed');

      const googleFormUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
      const formData = new URLSearchParams();
      formData.append(`entry.${GOOGLE_FORM_FIELD_ID}`, email);

      await fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Waitlist submission error:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className={`relative h-screen w-full flex flex-col items-center justify-center bg-grain overflow-hidden selection:bg-black/5 bg-center bg-cover bg-no-repeat transition-all duration-1000 ${isDark ? 'site-invert' : ''}`} style={{
      backgroundImage: 'url("/bg.png")',
      backgroundAttachment: 'fixed'
    }}>

      {/* Sexy Theme Toggle (Circular but animated) */}
      <div className="fixed top-8 right-8 z-50 animate-fade-up no-invert">
        <button
          onClick={() => setIsDark(!isDark)}
          className="relative p-4 rounded-full border border-black/5 bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-700 group overflow-hidden shadow-lg shadow-black/[0.02] hover:shadow-black/5 active:scale-95"
        >
          {/* Sexy Glass Shine - More reactive */}
          <div className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent z-0" />

          <div className="relative z-10 w-5 h-5 flex items-center justify-center">
            {/* Sun Icon - Spun in/out */}
            <Sun
              className={`absolute w-4 h-4 text-black transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) ${isDark
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 -rotate-90 scale-50'
                } group-hover:rotate-45`}
              strokeWidth={1.5}
            />
            {/* Moon Icon - Spun in/out */}
            <Moon
              className={`absolute w-4 h-4 text-black transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) ${!isDark
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 rotate-90 scale-50'
                } group-hover:-rotate-12`}
              strokeWidth={1.5}
            />
          </div>

          {/* Magnetic Glow Effect */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-700 blur-md" />
        </button>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 flex-1 py-8 md:py-12">

        {/* Brand Title Area */}
        <div className="flex flex-col items-center w-full relative z-40 mb-4 md:mb-6">
          <div className={`mb-2 md:mb-3 flex items-center gap-3 transition-opacity duration-700 ${status === 'success' ? 'opacity-0' : 'opacity-100 animate-fade-up'}`}>
            <span className="w-1 h-1 rounded-full bg-black/20" />
            <span className="text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-black/40 font-light">Early Access v1.0</span>
            <span className="w-1 h-1 rounded-full bg-black/20" />
          </div>

          <h1 className="font-serif-premium italic font-light text-[clamp(4rem,14vw,7.5rem)] text-black tracking-[-0.04em] leading-[0.9] text-center select-none animate-fade-up">
            Rewine
          </h1>
        </div>

        {/* Descriptors Area */}
        <div className={`max-w-xl flex flex-col items-center transition-all duration-700 w-full mb-6 md:mb-8 ${status === 'success' ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <h2 className="text-[clamp(0.6rem,1.8vw,0.85rem)] tracking-[0.3em] md:tracking-[0.5em] uppercase text-black/80 font-medium text-center px-4 leading-relaxed" style={{ fontVariant: 'small-caps' }}>
              World's first data layer which acts as an interview helper
            </h2>
            
            <p className="text-[clamp(0.85rem,2vw,1rem)] text-black/40 font-light text-center px-6 leading-relaxed max-w-lg">
              Get perfect real time answers to ace your next B2B call before the interviewer finishes the question.
            </p>
          </div>
        </div>

        {/* The Card - Slot architecture - Perfected mobile rhythm */}
        <div className="w-full max-w-[420px] px-2 h-[130px] md:h-[64px] relative z-30">
          <div className={`absolute bottom-0 left-0 right-0 transition-all duration-[1000ms] ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${
            status === 'success' 
              ? 'h-[380px] md:h-[365px]' 
              : 'h-full'
          }`}>
            {/* The Morphing Container Wrapper - Consistent radius prevents 'oval' morphing */}
            <div className={`relative overflow-hidden p-[1px] transition-all duration-[1000ms] ease-[cubic-bezier(0.16, 1, 0.3, 1)] mx-auto h-full rounded-[2rem] ${
              status === 'success'
                ? 'bg-gradient-to-br from-black/[0.05] via-transparent to-black/[0.05]'
                : 'bg-gradient-to-b from-black/[0.08] to-transparent'
            }`}>

              {/* The Inner Morphing Card - Consistent 2rem radius */}
              <div className={`relative overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.16, 1, 0.3, 1)] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/[0.03] flex flex-col justify-center h-full rounded-[2rem] ${
                status === 'success'
                  ? 'p-8 md:p-10 pt-16 md:pt-12'
                  : 'p-1 md:p-1'
              }`}>
                {/* Sexy Shimmer Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent transition-opacity duration-1000 ${status === 'success' ? 'opacity-100 animate-[shimmer_8s_infinite]' : 'opacity-0'}`} />

                {/* Form Content Wrapper */}
                <div className={`transition-all duration-700 ${status === 'success' ? 'opacity-0 scale-95 pointer-events-none hidden' : 'opacity-100 scale-100 h-full'}`}>
                  <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2 w-full h-full p-2 md:p-0 pb-6 md:pb-0">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Drop your email here..."
                      className="flex-1 bg-transparent text-black font-light px-6 py-4 md:py-3 focus:outline-none placeholder:text-black/20 text-[14px] w-full text-center md:text-left"
                      disabled={status === 'loading'}
                      required
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className={`w-full md:w-auto whitespace-nowrap px-10 py-5 md:py-4 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-700 flex items-center justify-center gap-3 group/btn relative overflow-hidden shadow-lg shadow-black/5 hover:shadow-black/10 active:scale-[0.96] ${
                        status === 'loading' ? 'bg-black/80 text-white/50' : 'bg-black text-white hover:bg-black/90'
                      }`}
                    >
                      <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
                      <span className="relative z-10 grid items-center justify-items-center">
                        <span className={`col-start-1 row-start-1 flex items-center gap-1.5 transition-all duration-500 ${status === 'loading' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                          <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1 h-1 rounded-full bg-white animate-bounce" />
                        </span>
                        <span className={`col-start-1 row-start-1 flex items-center gap-3 transition-all duration-500 ${status !== 'loading' ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
                          Join the list
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-700 ease-out group-hover/btn:translate-x-1.5 group-hover/btn:scale-110" />
                        </span>
                      </span>
                    </button>
                  </form>
                </div>

                {/* Success Content Wrapper */}
                <div className={`transition-all duration-1000 delay-300 ${status === 'success' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute inset-0 pointer-events-none flex items-center justify-center'}`}>
                  <div className="flex flex-col items-center text-center w-full pt-20 md:pt-24 px-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/[0.03] flex items-center justify-center mb-6 bg-white/40 shadow-inner group/check">
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-black/40 transition-transform duration-1000 group-hover/check:scale-110" strokeWidth={1} />
                    </div>
                    <h2 className="font-serif-premium italic text-2xl md:text-3xl text-black tracking-tight mb-4 px-2">You're on the list.</h2>
                    <p className="text-[11px] md:text-[13px] text-black/50 leading-relaxed max-w-[280px] md:max-w-[320px] mb-8 font-light tracking-wide">
                      Will notify you as soon as <span className="font-medium text-black/70 italic">Rewine</span> is ready for early access.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('idle');
                        setEmail('');
                      }}
                      className="text-[9px] text-black/30 hover:text-black tracking-[0.2em] uppercase transition-all duration-500 underline underline-offset-8 decoration-black/10 hover:decoration-black/40"
                    >
                      Submit another
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-rose-500/80 animate-fade-up w-full justify-center">
                <AlertCircle className="w-3 h-3 shrink-0" strokeWidth={1.5} />
                <span className="text-[10px] font-medium tracking-wide">{errorMessage}</span>
              </div>
            )}
          </div>
        </div>


      </main>


      {/* Bottom Tagline - Fixed to bottom */}
      <div className="fixed bottom-6 left-0 right-0 z-20 animate-fade-up delay-4 flex justify-center px-4">
        <p className="text-[11px] md:text-[12px] text-black font-light text-center leading-relaxed">
          Join now to claim your free tier on launch and enjoy 1 month of premium as an early adopter.
        </p>
      </div>

      {/* Floating Badge (Hidden on very small screens to avoid clutter) */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 hidden sm:flex flex-col items-end gap-2 animate-fade-up delay-5 opacity-40 hover:opacity-100 transition-opacity z-20">
        <div className="px-3 py-1.5 rounded-full border border-black/10 bg-white/20 backdrop-blur-md text-[8px] tracking-widest uppercase text-black font-medium">
          Limited Beta
        </div>
      </div>
    </div>
  );
}

export default App;
