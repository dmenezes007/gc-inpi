import { FormInput } from '@/components/FormInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FormularioPage() {
  return (
    <main className="min-h-screen py-6 px-4">
      <div className="container-lg mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Preencha os campos abaixo. Após envio com sucesso, você será redirecionado para o dashboard.
            </p>
          </CardContent>
        </Card>

        <FormInput formId="gc-inpi-feedback" />
      </div>
    </main>
  );
}
