import { useCallback, useEffect, useRef, useState } from 'react';

// One audio channel: replays, navigation and unmount cancel pending playback.
// Phonemes always use recordings, never letter-name speech synthesis.
export function useAudio() {
  const player = useRef(null);
  const finish = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const stop = useCallback(() => {
    if (player.current) { player.current.pause(); player.current.onended = null; player.current.onerror = null; }
    finish.current?.(false); finish.current = null;
    setPlaying(false); setError(false);
  }, []);
  const play = useCallback((item) => {
    stop();
    if (!item?.audio) { setError(true); return Promise.resolve(false); }
    const element = player.current || (player.current = new Audio());
    element.src = item.audio;
    return new Promise(resolve => {
      finish.current = resolve;
      const end = (success) => {
        if (finish.current !== resolve) return;
        finish.current = null; setPlaying(false); setError(!success); resolve(success);
      };
      element.onended = () => end(true);
      element.onerror = () => end(false);
      setPlaying(true);
      element.play().catch(() => end(false));
    });
  }, [stop]);
  useEffect(() => { const hide = () => { if (document.hidden) stop(); }; document.addEventListener('visibilitychange', hide); return () => { document.removeEventListener('visibilitychange', hide); stop(); }; }, [stop]);
  return { play, stop, playing, error };
}
