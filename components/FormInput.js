'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { hasValidSupabaseEnv } from '@/lib/supabaseClient';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function FormInput({ formId }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const supabaseConfigured = hasValidSupabaseEnv() && Boolean(supabase);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(5);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!supabaseConfigured || !supabase) {
        throw new Error('Supabase não configurado. Verifique as variáveis NEXT_PUBLIC_ no .env.local');
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Sessão inválida. Faça login novamente.');
      }

      const responsePayload = {
        user_id: user.id,
        payload: {
          feedback,
          nivel_satisfacao: score,
          form_key: formId,
        },
      };

      if (typeof formId === 'string' && UUID_REGEX.test(formId)) {
        responsePayload.form_id = formId;
      }

      const { error } = await supabase.from('responses').insert([
        responsePayload,
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setFeedback('');
      setScore(5);
      setMessage('Resposta registrada com sucesso.');
      router.push('/dashboard');
    } catch (error) {
      setMessage(`Falha ao registrar resposta: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Registrar feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="feedback" className="mb-2 block text-sm font-medium text-slate-700">
              Descrição
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Informe um resumo da ocorrência"
              required
            />
          </div>

          <div>
            <label htmlFor="score" className="mb-2 block text-sm font-medium text-slate-700">
              Nível de satisfação: <span className="font-bold">{score}</span>
            </label>
            <input
              id="score"
              type="range"
              min={1}
              max={10}
              value={score}
              onChange={(event) => setScore(Number(event.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {loading ? 'Salvando...' : 'Salvar resposta'}
          </Button>

          {message && <p className="text-sm text-slate-600">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}