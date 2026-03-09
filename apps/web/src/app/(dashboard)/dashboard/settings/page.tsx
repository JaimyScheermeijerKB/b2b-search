import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Instellingen</h1>
        <p className="text-muted-foreground">
          Beheer je account en workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Wijzig je profiel en wachtwoord. Auth komt in Fase 2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Nog niet beschikbaar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
