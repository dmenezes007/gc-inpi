'use client';

import { useEffect, useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { supabase, supabaseConfigured } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const mockData = [
  { data: '01/02', valor: 62 },
  { data: '02/02', valor: 69 },
  { data: '03/02', valor: 71 },
  { data: '04/02', valor: 67 },
  { data: '05/02', valor: 78 },
  { data: '06/02', valor: 82 },
  { data: '07/02', valor: 84 },
];

export function DashboardChart() {
  const [data, setData] = useState(mockData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchResponses = async () => {
      if (!supabaseConfigured || !supabase) {
        return;
      }

      const { data: rows, error } = await supabase
        .from('responses')
        .select('created_at, payload')
        .order('created_at', { ascending: true })
        .limit(30);

      if (error || !rows?.length) {
        return;
      }

      const chartData = rows.map((row) => ({
        data: new Date(row.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        }),
        valor: Number(row.payload?.nivel_satisfacao ?? 0),
      }));

      setData(chartData);
    };

    void fetchResponses();
  }, []);

  const avg = useMemo(() => {
    const total = data.reduce((acc, item) => acc + item.valor, 0);
    return data.length ? (total / data.length).toFixed(1) : '0.0';
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Evolução de desempenho</CardTitle>
        <span className="text-sm font-semibold text-slate-600">Média: {avg}</span>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full min-w-0" style={{ minHeight: 288 }}>
          {!isMounted ? (
            <div className="h-full w-full rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
              <LineChart data={data}>
                <XAxis dataKey="data" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: '#e2e8f0',
                    boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
                  }}
                />
                <Line type="monotone" dataKey="valor" stroke="#4f46e5" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}