import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { playBeep, playWarningSound } from '../utils/audio';
import { toast } from "sonner";
import RetroLoader from '../components/RetroLoader';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Lock the UI and show the loader
    
    try {
      if (isLogin) {
        const response = await api.post('api/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
        
        playBeep(800, 'sine', 0.1);
        toast.success("CONNECTION ESTABLISHED."); 
        navigate('/feed');
      } else {
        await api.post('api/auth/register', { email, password });
        
        playBeep(800, 'sine', 0.1);
        toast.success("IDENTITY FORGED. AWAITING LOGIN."); 
        setIsLogin(true);
      }
    } catch (error: any) {
      playWarningSound();
      
      const errorMessage = error.response?.data?.message || error.response?.data || "";
      
      if (!isLogin && (error.response?.status === 409 || errorMessage.includes("already exists") || errorMessage.includes("exist"))) {
         toast.error("IDENTITY COMPROMISED: Email already in the matrix.");
      } else if (isLogin && error.response?.status === 401) {
         toast.error("ACCESS DENIED: Invalid credentials.");
      } else {
         toast.error("SYSTEM MALFUNCTION: Please try again.");
      }
    } finally {
      setIsLoading(false); // Restore the UI regardless of success or failure
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-retro-blue px-4">
      
      {/* ENDLESS PANNING GRID BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(black 2px, transparent 2px)',
          backgroundSize: '30px 30px',
          animation: 'panGrid 20s linear infinite',
        }}
      />

      {/* CRT SCANLINE OVERLAY */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 opacity-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))',
          backgroundSize: '100% 4px',
        }}
      />

      {/* SYSTEM MARQUEE (TOP) */}
      <div className="absolute top-0 w-full border-b-4 border-black bg-retro-yellow text-black font-mono font-bold py-1 z-10 overflow-hidden whitespace-nowrap text-xs sm:text-sm">
        <div className="inline-block animate-[marquee_15s_linear_infinite]">
          /// PULSE_NET v1.0 /// SECURE CONNECTION ESTABLISHED /// ALL SYSTEMS NOMINAL /// UNAUTHORIZED ACCESS WILL BE LOGGED ///
        </div>
      </div>

      {/* MAIN LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300 animate-[float_6s_ease-in-out_infinite]">
        
        {/* Decorative Hardware Tabs */}
        <div className="absolute -top-4 left-4 bg-black text-white font-mono text-[10px] sm:text-xs px-2 py-1 font-bold tracking-widest">
          PORT: 8080
        </div>
        <div className="absolute -top-4 right-4 bg-retro-pink border-4 border-black text-black font-mono text-[10px] sm:text-xs px-2 py-1 font-bold animate-pulse">
          REC
        </div>

        <h1 className="text-3xl sm:text-4xl font-mono font-black text-center mb-2 tracking-tighter">
          {isLogin ? 'SYSTEM_LOGIN' : 'NEW_USER_INIT'}
        </h1>
        <p className="text-center font-mono text-xs sm:text-sm font-bold bg-black text-retro-green inline-block px-2 py-1 mb-6 mx-auto block w-fit">
          {isLogin ? 'ENTER CREDENTIALS' : 'CREATE IDENTITY'}
        </p>
        
        {isLoading ? (
          <div className="py-8 sm:py-12 border-4 border-black shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)] bg-gray-50">
            <RetroLoader text={isLogin ? "AUTHENTICATING_USER..." : "FORGING_IDENTITY..."} />
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
              <div className="relative">
                <span className="absolute left-3 top-3.5 font-mono font-bold text-gray-400">&gt;</span>
                <input 
                  type="email" 
                  placeholder="EMAIL_ADDRESS" 
                  required 
                  className="w-full border-4 border-black p-3 pl-8 text-sm sm:text-base font-mono placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-retro-pink shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all bg-gray-50 focus:bg-white" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3.5 font-mono font-bold text-gray-400">*</span>
                <input 
                  type="password" 
                  placeholder="PASSWORD" 
                  required 
                  className="w-full border-4 border-black p-3 pl-8 text-sm sm:text-base font-mono placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-retro-pink shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all bg-gray-50 focus:bg-white" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              <button 
                type="submit" 
                className="group relative bg-retro-green border-4 border-black p-3 sm:p-4 text-sm sm:text-base font-mono font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-1 active:shadow-none mt-2 overflow-hidden"
              >
                <span className="relative z-10 group-hover:text-white transition-colors">
                  {isLogin ? 'Access Mainframe' : 'Establish Connection'}
                </span>
                <div className="absolute inset-0 bg-black w-0 group-hover:w-full transition-all duration-300 ease-out z-0"></div>
              </button>
            </form>

            <div className="relative mt-6 sm:mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-black border-dashed"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="bg-white px-2 font-mono font-bold text-gray-500">OR</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)} 
              className="mt-5 sm:mt-6 w-full bg-white border-4 border-black p-2 text-sm sm:text-base font-mono font-bold uppercase hover:bg-retro-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-1 active:shadow-none"
            >
              {isLogin ? 'Register Instead' : 'Login Instead'}
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes panGrid {
          0% { background-position: 0 0; }
          100% { background-position: -60px -60px; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes marquee {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}