'use client';

import dynamic from 'next/dynamic';

const DashboardChart = dynamic(
  () => import('@/components/DashboardChart').then((module) => module.DashboardChart),
  {
    ssr: false,
    loading: () => <div className="h-full min-h-72 w-full rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />,
  },
);

export function DashboardChartClient() {
  return <DashboardChart />;
}
