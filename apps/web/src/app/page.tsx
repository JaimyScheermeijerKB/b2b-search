import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart3, Building2, Eye, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl">
            B2B Visitor
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/login">
              <Button>Inloggen</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Zie welke bedrijven je website bezoeken
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              B2B visitor identification voor je website. Installeer een snippet,
              verzamel bezoekers en ontdek welke bedrijven mogelijk interesse
              hebben.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Start gratis
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Demo bekijken
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-12">
              Hoe het werkt
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Eye className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>1. Installeer de snippet</CardTitle>
                  <CardDescription>
                    Voeg een klein script toe aan je website. Geen zware
                    dependencies, geen impact op laadtijd.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Building2 className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>2. Bedrijven worden herkend</CardTitle>
                  <CardDescription>
                    We matchen IP-adressen met bedrijfsgegevens. Residential,
                    cloud en mobile worden gescheiden.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>3. Bekijk in je dashboard</CardTitle>
                  <CardDescription>
                    Zie bezoeken, sessies, top pagina&apos;s en welke bedrijven
                    je site mogelijk hebben bezocht.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          B2B Visitor &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
