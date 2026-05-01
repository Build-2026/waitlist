import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ArrowRight, Moon, Sun } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [isDark, setIsDark] = useState(false);

  const GOOGLE_FORM_ID = '1FAIpQLSffr3eaxDH5u0wuzDmQT_2lS7H_r6ctxsY3QKmbDc-mrlrrxw';
  const GOOGLE_FORM_FIELD_ID = '1924648042';
  const BACKEND_API_URL = 'http://localhost:5000/api/waitlist';

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
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center bg-grain overflow-hidden selection:bg-black/5 bg-center bg-cover bg-no-repeat transition-all duration-1000 ${isDark ? 'site-invert' : ''}`} style={{
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
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 py-8 min-h-screen">

        {/* Decorative Top Label */}
        <div className="mb-4 md:mb-6 flex items-center gap-3 animate-fade-up">
          <span className="w-1 h-1 rounded-full bg-black/20" />
          <span className="text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-black/40 font-light">Early Access v1.0</span>
          <span className="w-1 h-1 rounded-full bg-black/20" />
        </div>

        {/* Brand Title */}
        <div className="flex flex-col items-center mb-8 md:mb-10 w-full">
          <h1 className="animate-fade-up delay-1 font-serif-premium italic font-light text-[clamp(3.5rem,15vw,8rem)] text-black tracking-[-0.04em] leading-[0.9] mb-4 text-center">
            Rewine
          </h1>
          <p className="animate-fade-up delay-2 text-[clamp(8px,2vw,10px)] tracking-[0.4em] md:tracking-[0.8em] uppercase text-black/40 font-light text-center px-4">
            Your Interview Companion
          </p>
        </div>

        {/* Form Area */}
        <div className="animate-fade-up delay-3 w-full max-w-[420px] px-2 flex justify-center items-center min-h-[220px]">
          <div className="w-full relative">
            {/* The Morphing Container Wrapper */}
            <div className={`relative overflow-hidden p-[1px] transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] bg-gradient-to-b from-black/[0.08] to-transparent mx-auto ${
              status === 'success'
                ? 'w-full rounded-[2rem]'
                : 'w-full rounded-[2rem] md:rounded-full'
            }`}>
              
              {/* The Inner Morphing Card */}
              <div className={`relative overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] bg-white/40 backdrop-blur-2xl border border-white/40 shadow-xl shadow-black/[0.02] flex flex-col justify-center ${
                status === 'success' 
                  ? 'w-full rounded-[2rem] p-8 md:p-10' 
                  : 'w-full rounded-[2rem] md:rounded-full p-2'
              }`}>
                
                {/* Form Content Wrapper */}
                <div 
                  className={`grid transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    status === 'success' ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
                  }`}
                >
                  <div className="overflow-hidden">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2 w-full">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Drop your email here..."
                        className="flex-1 bg-transparent text-black font-light px-4 md:px-6 py-4 md:py-3 focus:outline-none placeholder:text-black/20 text-[13px] md:text-[14px] w-full text-center md:text-left"
                        disabled={status === 'loading' || status === 'success'}
                        required
                      />
                      <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`w-full md:w-auto whitespace-nowrap px-10 py-4 rounded-[1.5rem] md:rounded-full text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-700 flex items-center justify-center gap-3 group/btn relative overflow-hidden shadow-lg shadow-black/5 hover:shadow-black/10 active:scale-[0.96] ${status === 'loading'
                            ? 'bg-black/80 text-white/50'
                            : 'bg-black text-white hover:bg-black/90'
                          }`}
                      >
                        {/* Sexy Hover Shimmer */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

                        <span className="relative z-10 grid items-center justify-items-center">
                          <span
                            className={`col-start-1 row-start-1 flex items-center gap-1.5 transition-all duration-500 ${status === 'loading' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
                              }`}
                          >
                            <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1 h-1 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1 h-1 rounded-full bg-white animate-bounce" />
                          </span>
                          <span
                            className={`col-start-1 row-start-1 flex items-center gap-3 transition-all duration-500 ${status !== 'loading' ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
                              }`}
                          >
                            Join the list
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-700 ease-out group-hover/btn:translate-x-1.5 group-hover/btn:scale-110" />
                          </span>
                        </span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Success Content Wrapper */}
                <div 
                  className={`grid transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    status === 'success' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col items-center text-center w-full pt-2">
                      <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center mb-4 bg-white/50">
                        <CheckCircle className="w-5 h-5 text-black/40" strokeWidth={1} />
                      </div>
                      <h2 className="font-serif-premium italic text-2xl md:text-3xl text-black mb-2 px-2">You're on the list</h2>
                      <p className="text-[10px] md:text-[11px] text-black/40 tracking-wider mb-6">We'll reach out as soon as we're ready.</p>
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

        {/* Bottom Tagline */}
        <div className="mt-12 md:mt-16 animate-fade-up delay-4 flex flex-col items-center gap-4 w-full">
          <div className="w-px h-8 bg-gradient-to-b from-black/20 to-transparent" />
          <p className="text-[9px] md:text-[10px] text-black/30 tracking-[0.3em] md:tracking-[0.4em] uppercase font-light text-center px-4">
            Refining the art of conversation
          </p>
        </div>

      </main>

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
