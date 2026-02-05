import "./[...404].css"
import { Title } from "@solidjs/meta"
import { HttpStatusCode } from "@solidjs/start"
import { Logo } from "@neocode-ai/ui/logo"
import { A } from "@solidjs/router"

export default function NotFound() {
  return (
    <main data-page="not-found">
      <Title>Not Found | neocode</Title>
      <HttpStatusCode code={404} />
      <div data-component="content">
        <section data-component="top">
          <A href="/" data-slot="logo-link">
            <Logo class="header-logo" />
          </A>
          <h1 data-slot="title">404 - Page Not Found</h1>
        </section>

        <section data-component="actions">
          <div data-slot="action">
            <A href="/">Home</A>
          </div>
          <div data-slot="action">
            <A href="/docs">Docs</A>
          </div>
          <div data-slot="action">
            <a href="https://github.com/neopilot-ai/neocode" target="_blank" rel="noopener">
              GitHub
            </a>
          </div>
          <div data-slot="action">
            <A href="/discord">Discord</A>
          </div>
        </section>
      </div>
    </main>
  )
}
