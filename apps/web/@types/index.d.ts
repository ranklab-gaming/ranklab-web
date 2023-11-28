interface IubendaCsPreferences {
  purposes: Record<IubendaConsentPurpose, boolean | undefined>
}

interface IubendaCsApi {
  getPreferences(): IubendaCsPreferences
  openPreferences(): void
}

interface IubendaCs {
  api: IubendaCsApi
}

interface Iubenda extends Array<never> {
  cs: IubendaCs
  csConfiguration: Record<string, any>
}

interface Gtag {
  push(args: any[]): void
}

interface Window {
  _iub: Iubenda
  dataLayer: Gtag
}
