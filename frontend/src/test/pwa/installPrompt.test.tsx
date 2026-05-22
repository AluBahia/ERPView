import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { InstallPrompt } from '../../components/pwa/InstallPrompt';

describe('InstallPrompt', () => {
  test('InstallPrompt exibe banner quando evento PWA disponível', async () => {
    render(<InstallPrompt />);

    const event = new Event('beforeinstallprompt') as any;
    event.prompt = vi.fn().mockResolvedValue(undefined);
    event.userChoice = Promise.resolve({ outcome: 'accepted' as const });

    act(() => {
      window.dispatchEvent(event);
    });

    await waitFor(() => {
      expect(screen.getByText('Instale o ERPView para acesso rápido e offline')).toBeInTheDocument();
    });
  });
});
