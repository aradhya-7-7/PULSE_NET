import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Heart, Zap, Activity } from 'lucide-react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import { generateUsername } from "../utils/nameGenerator";

export default function Profile() {
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const currentUserEmail = localStorage.getItem('email') || 'UNKNOWN_USER';

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await api.get('/api/posts/trending?page=0&size=50');
        const filteredPosts = response.data.content.filter(
          (post: any) => post.userEmail === currentUserEmail
        );
        setMyPosts(filteredPosts);
      } catch (error: any) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [currentUserEmail, navigate]);

  // --- DERIVED METRICS ---
  const totalTransmissions = myPosts.length;
  const totalReputation = myPosts.reduce((acc, post) => acc + post.likesCount, 0);
  
  // Dynamic Rank Generator
  let rank = "ROOKIE";
  if (totalTransmissions >= 5) rank = "OPERATOR";
  if (totalTransmissions >= 15) rank = "VETERAN";
  if (totalTransmissions >= 30) rank = "CYBER_NINJA";

  return (
    <div className="min-h-screen pb-20 pt-6 sm:pt-10 px-4 flex flex-col items-center">
      
      {/* Navigation Header */}
      <div className="w-full max-w-2xl mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-3">
        <button 
          onClick={() => navigate('/feed')} 
          className="w-full sm:w-auto bg-retro-yellow border-4 border-black px-4 py-2 font-mono font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all text-sm flex items-center justify-center gap-2"
        >
          <Terminal size={18} /> Back to Feed
        </button>
        <button 
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }} 
          className="w-full sm:w-auto bg-white border-4 border-black px-4 py-2 font-mono font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-retro-pink active:translate-y-1 active:shadow-none transition-all text-sm"
        >
          Disconnect
        </button>
      </div>

      {/* Identity Card */}
      <div className="w-full max-w-2xl bg-retro-blue border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative overflow-hidden">
        {/* Decorative background stripes */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-black opacity-10 rotate-45 pointer-events-none"></div>
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-black opacity-10 rotate-45 pointer-events-none"></div>

        <img 
          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentUserEmail}`} 
          alt="My Avatar" 
          className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative z-10"
        />
        <div className="flex flex-col text-center sm:text-left w-full relative z-10">
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-black uppercase tracking-tight break-all">
            User Profile
          </h1>
          <p className="font-mono text-xs sm:text-sm font-bold bg-black text-retro-green inline-block px-2 sm:px-3 py-1 border-2 border-black mt-2 self-center sm:self-start break-all">
            ALIAS: {generateUsername(currentUserEmail)}
          </p>
          <p className="font-mono text-[10px] sm:text-xs font-bold text-gray-800 mt-1 self-center sm:self-start break-all uppercase">
            SECURE_ID: {currentUserEmail.split('@')[0]}
          </p>
          
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 font-mono text-sm font-bold border-2 border-black bg-white px-3 py-1 w-max self-center sm:self-start shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Activity size={16} className="text-green-600 animate-pulse" />
            <span>Status: <span className="text-green-700">ONLINE</span></span>
          </div>
        </div>
      </div>

      {/* STATS MATRIX */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-10">
        <div className="bg-retro-pink border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center sm:items-start transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1 w-full justify-center sm:justify-start">
            <Terminal size={18} />
            <span className="font-mono font-bold text-xs uppercase">Transmissions</span>
          </div>
          <span className="font-mono font-black text-3xl">{loading ? '-' : totalTransmissions}</span>
        </div>

        <div className="bg-retro-yellow border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center sm:items-start transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1 w-full justify-center sm:justify-start">
            <Heart size={18} />
            <span className="font-mono font-bold text-xs uppercase">Reputation</span>
          </div>
          <span className="font-mono font-black text-3xl">{loading ? '-' : totalReputation}</span>
        </div>

        <div className="bg-retro-green border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center sm:items-start transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1 w-full justify-center sm:justify-start">
            <Zap size={18} />
            <span className="font-mono font-bold text-xs uppercase">Network Rank</span>
          </div>
          <span className="font-mono font-black text-xl sm:text-2xl pt-1 tracking-tighter">{loading ? '-' : rank}</span>
        </div>
      </div>

      {/* User's Post History */}
      <div className="w-full max-w-2xl flex flex-col gap-5 sm:gap-6">
        <h2 className="text-xl sm:text-2xl font-mono font-black border-b-4 border-black pb-2 mb-2 flex items-center gap-3" style={{ textShadow: '2px 2px 0 #FF00FF' }}>
          <Terminal size={24} className="animate-pulse" />
          MY TRANSMISSIONS
        </h2>
        
        {loading ? (
          <div className="text-center font-mono font-bold bg-black text-white p-4 animate-pulse text-sm sm:text-base border-4 border-black">
            LOADING_ARCHIVES...
          </div>
        ) : myPosts.length === 0 ? (
          <div className="bg-white border-4 border-black p-6 sm:p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-mono font-bold text-base sm:text-lg uppercase">No transmissions found.</p>
            <p className="font-mono text-xs sm:text-sm mt-2 text-gray-600">Go to the feed and broadcast your first signal!</p>
          </div>
        ) : (
          myPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUserEmail={currentUserEmail}
              onDelete={(id) => setMyPosts(myPosts.filter(p => p.id !== id))}
            />
          ))
        )}
      </div>
    </div>
  );
}