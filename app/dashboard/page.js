import {
  BarChart3,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { DashboardChart } from '@/components/DashboardChart';
import { FormInput } from '@/components/FormInput';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    label: 'Respostas coletadas',
    value: '1.284',
    trend: '+12,5%',
    positive: true,
    icon: FileText,
  },
  {
    label: 'Usuários ativos',
    value: '326',
    trend: '+4,2%',
    positive: true,
    icon: Users,
  },
  {
    label: 'Taxa de abandono',
    value: '8,1%',
    trend: '-1,7%',
    positive: true,
    icon: ShieldCheck,
  },
  {
    label: 'SLA em atraso',
    value: '14',
    trend: '+2,3%',
    positive: false,
    icon: BarChart3,
  },
];

const statusItems = [
  { name: 'Formulário A', status: 'Em dia' },
  { name: 'Formulário B', status: 'Atenção' },
  { name: 'Formulário C', status: 'Crítico' },
];

const badgeByStatus = {
  'Em dia': 'bg-green-100 text-green-900',
  Atenção: 'bg-amber-100 text-amber-900',
  Crítico: 'bg-rose-100 text-rose-900',
};

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4 md:px-6">
        <LayoutDashboard className="h-6 w-6 text-indigo-600" />
        <span className="hidden md:inline text-sm font-semibold text-slate-900">GC Client</span>
      </div>
      <nav className="p-2 md:p-4 space-y-2">
        <button className="w-full flex items-center justify-center md:justify-start gap-3 rounded-xl bg-indigo-600 px-3 py-2 text-white">
          <LayoutDashboard className="h-5 w-5" />
          <span className="hidden md:inline text-sm font-medium">Dashboard</span>
        </button>
        <button className="w-full flex items-center justify-center md:justify-start gap-3 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100">
          <FileText className="h-5 w-5" />
          <span className="hidden md:inline text-sm font-medium">Respostas</span>
        </button>
      </nav>
    </aside>
  );
}

function StatCard({ item }) {
  const TrendIcon = item.positive ? TrendingUp : TrendingDown;
  const trendClass = item.positive ? 'text-green-600' : 'text-rose-600';
  const Icon = item.icon;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
          {item.label}
          <Icon className="h-4 w-4 text-slate-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-extrabold text-slate-900">{item.value}</p>
          <span className={`inline-flex items-center gap-1 text-sm font-semibold ${trendClass}`}>
            <TrendIcon className="h-4 w-4" />
            {item.trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <Sidebar />

      <div className="ml-20 md:ml-64 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Painel de Governança</h1>
          <p className="text-slate-600 mt-1">Visão consolidada de KPIs, status e evolução de respostas.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {stats.map((item) => (
            <div key={item.label} className="md:col-span-3">
              <StatCard item={item} />
            </div>
          ))}

          <div className="md:col-span-8">
            <DashboardChart />
          </div>

          <div className="md:col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Status dos formulários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statusItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    <Badge className={badgeByStatus[item.status]}>{item.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-6">
            <FormInput formId="gc-inpi-feedback" />
          </div>

          <div className="md:col-span-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Resumo operacional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>• Tendência de crescimento sustentável na coleta de respostas.</p>
                <p>• Queda da taxa de abandono no período atual.</p>
                <p>• Itens críticos identificados para ação priorizada.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}