import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'privacy' | 'terms'

export function LegalScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('privacy')

  return (
    <div className="tactical-grid-bg flex min-h-full flex-col px-6 pb-8 pt-10">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 font-display text-[10px] tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={2.5} />
          VOLVER
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {(
          [
            ['privacy', 'PRIVACIDAD'],
            ['terms', 'TÉRMINOS'],
          ] as [Tab, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              'rounded-md px-4 py-2 font-display text-[10px] tracking-wider transition-colors',
              tab === value
                ? 'bg-[color:var(--correct)] text-[color:var(--primary-foreground)]'
                : 'border border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        {tab === 'privacy' ? <Privacy /> : <Terms />}
      </div>
    </div>
  )
}

function Privacy() {
  return (
    <div className="flex flex-col gap-4 font-sans text-sm leading-relaxed text-foreground">
      <Section title="Qué datos tratamos">
        <p>
          Este es un proyecto fan sin registro de usuarios. No recopilamos
          nombres, correos ni datos de cuenta. El servidor puede almacenar
          temporalmente datos técnicos (IP, agente de usuario) en sus registros
          para seguridad y diagnóstico. No vendemos estos datos; se comparten
          con terceros solo en la medida necesaria para servir los anuncios.
        </p>
      </Section>

      <Section title="Anuncios y cookies">
        <p>
          Mostramos publicidad facilitada por Google AdSense. Google puede usar
          cookies o tecnologías similares para ofrecer anuncios más relevantes
          y medir su rendimiento. Puedes aceptar o rechazar las cookies de
          publicidad desde el aviso que aparece al entrar, y gestionarlas en
          cualquier momento desde{' '}
          <ExternalLink href="https://adssettings.google.com">
            la configuración de anuncios de Google
          </ExternalLink>
          .
        </p>
      </Section>

      <Section title="Categorías de datos de consentimiento">
        <p>
          Al aceptar, damos tu consentimiento para que Google trate datos con
          fines de publicidad personalizada (ad_storage, ad_user_data,
          ad_personalization). Si rechazas, no cargaremos anuncios
          personalizados. No utilizamos trackers de redes sociales ni análisis
          de terceros.
        </p>
      </Section>
    </div>
  )
}

function Terms() {
  return (
    <div className="flex flex-col gap-4 font-sans text-sm leading-relaxed text-foreground">
      <Section title="Proyecto fan independiente">
        <p>
          VALO TIC TAC TOE es un proyecto fan independiente, creado por fans y
          sin afiliación, patrocinio ni respaldo de Riot Games. No reclamamos
          derechos sobre los nombres, marcas, personajes ni estadísticas de
          Valorant, que pertenecen a sus respectivos dueños.
        </p>
      </Section>

      <Section title="Uso del juego">
        <p>
          El juego es gratuito y puede consultarse y jugarse en cualquier
          dispositivo. Queda prohibido revender el contenido, suplantar al
          proyecto o usarlo para fines distintos del entretenimiento personal.
        </p>
      </Section>

      <Section title="Datos y precisión">
        <p>
          Las estadísticas provienen de fuentes públicas de la comunidad y
          pueden contener errores o estar desactualizadas. El proyecto se
          ofrece "tal cual", sin garantías de disponibilidad ni precisión.
        </p>
      </Section>

      <Section title="Exención de responsabilidad">
        <p>
          No somos responsables del contenido mostrado por los bloques
          publicitarios ni de los terceros que los sirven. Esta página no está
          afiliada a Riot Games ni a las marcas de los equipos y organizaciones
          mencionadas.
        </p>
      </Section>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-display text-[11px] tracking-[0.18em] text-[color:var(--correct)]">
        {title}
      </h3>
      {children}
    </div>
  )
}

function ExternalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[color:var(--correct)] underline underline-offset-2"
    >
      {children}
    </a>
  )
}