import {
  Activity,
  ArrowRight,
  Bell,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/ui/container'

const features = [
  {
    icon: Activity,
    title: 'Endpoint monitoring',
    description:
      'Scheduled HTTP/HTTPS checks with configurable intervals, timeouts, and expected status codes.',
  },
  {
    icon: LayoutDashboard,
    title: 'Real-time dashboard',
    description:
      'Live monitor status and incident updates streamed to your browser over Server-Sent Events.',
  },
  {
    icon: ShieldCheck,
    title: 'Incident engine',
    description:
      'Automatic open → acknowledge → resolve lifecycle backed by an explicit state machine.',
  },
  {
    icon: Bell,
    title: 'Alerting',
    description: 'Email and outbound webhook notifications the moment an endpoint goes down.',
  },
  {
    icon: Globe,
    title: 'Public status pages',
    description: 'Branded, shareable status pages that keep your users in the loop automatically.',
  },
  {
    icon: Users,
    title: 'Teams & roles',
    description: 'Multi-tenant organizations with role-based access control for your whole team.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Add your endpoints',
    description: 'Point Pulse at any URL and choose how often it should be checked.',
  },
  {
    step: '02',
    title: 'We watch around the clock',
    description: 'Pulse runs checks on schedule and detects incidents the instant they happen.',
  },
  {
    step: '03',
    title: 'Your team gets notified',
    description: 'Alerts reach the right people and your public status page updates in real time.',
  },
]

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Container className="py-24 sm:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="primary" className="mb-6">
                <span className="relative flex size-2">
                  <span className="bg-success absolute inline-flex size-full animate-ping rounded-full opacity-75" />
                  <span className="bg-success relative inline-flex size-2 rounded-full" />
                </span>
                All systems operational
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
                Know the moment your site goes down.
              </h1>
              <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-pretty">
                Pulse monitors your endpoints around the clock, detects incidents in real time, and
                keeps your team and your users informed — before they start asking.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/signup" className={buttonVariants({ size: 'lg' })}>
                  Start monitoring free
                  <ArrowRight />
                </Link>
                <Link
                  href="#features"
                  className={buttonVariants({ variant: 'outline', size: 'lg' })}
                >
                  See how it works
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Features */}
        <section id="features" className="border-border bg-muted/30 border-t">
          <Container className="py-20 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to stay online
              </h2>
              <p className="text-muted-foreground mt-4">
                A complete monitoring toolkit — from the first failed check to a resolved incident.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="bg-primary/10 text-primary mb-2 inline-flex size-10 items-center justify-center rounded-lg">
                      <feature.icon className="size-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* How it works */}
        <section id="how-it-works">
          <Container className="py-20 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Up and running in minutes
              </h2>
              <p className="text-muted-foreground mt-4">
                No agents to install. Add a URL and you&apos;re monitoring.
              </p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step}>
                  <span className="text-primary font-mono text-sm font-semibold">{item.step}</span>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section id="pricing" className="border-border border-t">
          <Container className="py-20 sm:py-28">
            <Card className="mx-auto max-w-4xl">
              <div className="flex flex-col items-center gap-6 p-10 text-center sm:p-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Start monitoring in under a minute
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  Free while you evaluate. Add your first monitor today and see Pulse in action.
                </p>
                <Link href="/signup" className={buttonVariants({ size: 'lg' })}>
                  Get started free
                  <ArrowRight />
                </Link>
              </div>
            </Card>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
