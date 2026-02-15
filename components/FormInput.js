'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { hasValidSupabaseEnv } from '@/lib/supabaseClient';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createPseudoUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function getFallbackFormUuid(formId) {
  const formKey = typeof formId === 'string' && formId.trim() ? formId.trim() : 'default-form';
  const storageKey = `gc-form-uuid:${formKey}`;

  try {
    const storedUuid = window.localStorage.getItem(storageKey);

    if (storedUuid && UUID_REGEX.test(storedUuid)) {
      return storedUuid;
    }

    const generatedUuid = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : createPseudoUuid();

    window.localStorage.setItem(storageKey, generatedUuid);
    return generatedUuid;
  } catch {
    return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : createPseudoUuid();
  }
}

async function resolveFormUuid(supabase, formId) {
  if (typeof formId !== 'string' || !formId.trim()) {
    return null;
  }

  if (UUID_REGEX.test(formId)) {
    return formId;
  }

  const normalizedFormId = formId.trim();
  const candidateColumns = ['slug', 'key', 'code', 'name'];

  for (const column of candidateColumns) {
    const { data, error } = await supabase
      .from('forms')
      .select('id')
      .eq(column, normalizedFormId)
      .maybeSingle();

    if (!error && data?.id && UUID_REGEX.test(data.id)) {
      return data.id;
    }
  }

  const { data: latestResponse, error: latestError } = await supabase
    .from('responses')
    .select('form_id')
    .not('form_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestError && latestResponse?.form_id && UUID_REGEX.test(latestResponse.form_id)) {
    return latestResponse.form_id;
  }

  return getFallbackFormUuid(normalizedFormId);
}

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

      const resolvedFormId = await resolveFormUuid(supabase, formId);

      const responsePayload = {
        form_id: resolvedFormId,
        user_id: user.id,
        payload: {
          feedback,
          nivel_satisfacao: score,
          form_key: formId,
        },
      };

      const { error } = await supabase.from('responses').insert([
        responsePayload,
      ]);

      if (error) {
        if (error.message?.toLowerCase().includes('foreign key constraint')) {
          throw new Error('Formulário inválido para a relação responses.form_id. Verifique se existe um registro correspondente na tabela forms.');
        }
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