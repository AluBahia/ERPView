import { http, HttpResponse } from 'msw';

export const handlers = [
  // Exemplo de handler para interceptar requisições durante testes
  http.get('*/api/exemplo', () => {
    return HttpResponse.json({ mensagem: 'Olá do MSW' });
  }),
];
