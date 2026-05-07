import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TrendingFeed from './pages/TrendingFeed';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { playUiClick, playTyping, playNavSound, playWarningSound } from './utils/audio';
import { Toaster } from "sonner"; 

function App() {
  
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const buttonOrLink = target.closest('button') || target.closest('a');
      
      if (buttonOrLink) {
        const text = buttonOrLink.textContent?.toLowerCase() || '';

        if (text.includes('disconnect') || text.includes('delete')) {
          playWarningSound(); 
        } 
        else if (text.includes('profile') || text.includes('back to feed')) {
          playNavSound(); 
        } 
        else if (text.includes('transmit')) {
        } 
        else {
          playUiClick(); 
        }
      }
      else if (target.closest('input') || target.tagName === 'TEXTAREA') {
         playUiClick(); 
      }
    };

    const handleGlobalKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key !== 'Enter') {
          playTyping();
        }
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('keydown', handleGlobalKeydown);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('keydown', handleGlobalKeydown);
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          classNames: {
            toast: 'font-mono font-bold uppercase border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex items-center gap-3 w-full text-black',
            success: 'bg-retro-green',
            error: 'bg-retro-pink text-black', 
            warning: 'bg-retro-yellow',
            info: 'bg-retro-blue',
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/feed" element={<TrendingFeed />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;