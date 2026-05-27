export type ZoneId = 'void' | 'core' | 'labs' | 'logs' | 'signal'

export type ZoneConfig = {
  id: ZoneId
  name: string
  biomeRef: string
  background: string
  accent1: string
  accent2: string
  text: string
  particleType: 'soul' | 'rain' | 'crystal' | 'spirits' | 'spores'
  particleDescription: string
  zoneDescription: string
}

export type DiscoveryEvent = {
  id: ZoneId
  name: string
  accent: string
}

