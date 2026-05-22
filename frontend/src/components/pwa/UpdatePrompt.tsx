import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

export function UpdatePrompt() {
  const [needUpdate, setNeedUpdate] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setNeedUpdate(true);
            }
          });
        });
      });
    }
  }, []);

  function handleUpdate() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      });
    }
  }

  if (!needUpdate) return null;

  return (
    <div className="fixed top-4 right-4 z-50 rounded-xl border border-border bg-bg-secondary p-4 shadow-lg">
      <p className="text-sm text-text-primary mb-3">Nova versão disponível</p>
      <div className="flex gap-2">
        <Button onClick={handleUpdate} size="sm">Atualizar</Button>
        <Button onClick={() => setNeedUpdate(false)} variant="ghost" size="sm">Depois</Button>
      </div>
    </div>
  );
}
