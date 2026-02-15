# GC Client (Dashboard INPI)

Dashboard operacional em Next.js com Tailwind CSS, componentes baseados em shadcn/ui, ícones Lucide e gráficos Recharts.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Lucide React
- Recharts
- Supabase JS

## Requisitos atendidos

- Layout com fundo cinza claro `#F3F4F6`
- Cards brancos com cantos arredondados e sombra leve
- Bento Grid para KPIs e widgets
- Stat Cards com valor principal e indicador de tendência verde/vermelho
- Badges em tons pastéis para status
- Sidebar fixa à esquerda com item ativo destacado

## Rodar localmente

1. Instale dependências:

```bash
npm install
```

2. Configure variáveis de ambiente:

```bash
cp .env.example .env.local
```

3. Atualize `.env.local` com suas credenciais Supabase.

4. Execute:

```bash
npm run dev
```

Acesse: `http://localhost:3000/dashboard`

## Build e validação

```bash
npm run lint
npm run build
```

## Publicar no GitHub

```bash
git init
git add .
git commit -m "feat: dashboard funcional com bento grid e deploy pronto"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gc-client.git
git push -u origin main
```

## Publicar na Vercel

1. Importe o repositório no painel da Vercel.
2. Framework detectado: **Next.js**.
3. Configure as variáveis no projeto (Settings > Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Faça deploy.

## Estrutura principal

- `app/dashboard/page.js`: tela principal com Bento Grid e Sidebar
- `components/DashboardChart.js`: widget de gráfico com Recharts
- `components/FormInput.js`: formulário de feedback com persistência no Supabase
- `components/ui/*`: base de componentes no padrão shadcn/ui
- `lib/supabaseClient.js`: cliente Supabase com fallback seguro
