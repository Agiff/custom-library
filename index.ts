import * as _analytics from "../libs/analytics";

export interface AccountSignIn {
  path: string
  country: string
  language: string
  sign_in_option: string
  metadata?: {
    utm_campaign?: string
    utm_medium?: string
    utm_source?: string
  }
}

export interface DashboardViewed {
  path: string
  country: string
  language: string
}

export interface PageProperties {
  'Dashboard Viewed': DashboardViewed
}

export interface TrackProperties {
  'Account Signed In': AccountSignIn
}

export interface UserProperties {
  id?: string | number
  email?: string
}

export type UserId = string
export type UserPropertiesOrId = UserId | UserProperties | undefined

export async function identify(userIdOrProperties: UserProperties, userProperties?: undefined): Promise<void>
export async function identify(userIdOrProperties: UserId, userProperties: UserProperties): Promise<void>
export async function identify(
  userIdOrProperties: UserProperties | UserId,
  userProperties: UserProperties | undefined
): Promise<void> {
  if (typeof userIdOrProperties === 'object') {
    _analytics.identify(userIdOrProperties)
  } else {
    _analytics.identify(userIdOrProperties, userProperties)
  }
}

export const getMetadata = () => {
  const params = new URLSearchParams(window.location.search);
  const utm_campaign = params.get('utm_campaign') || undefined;
  const utm_medium = params.get('utm_medium') || undefined;
  const utm_source = params.get('utm_source') || undefined;

  return {
    utm_campaign,
    utm_medium,
    utm_source
  }
}

export const analytics = {
  page: async <T extends keyof PageProperties>(
    ...args: undefined extends PageProperties[T]
      ? [eventName: T, properties?: PageProperties[T]]
      : [eventName: T, properties: PageProperties[T]]
  ): Promise<void> => {
    const metadata = getMetadata();
    const [eventName, eventProperties] = args

    if(Object.values(metadata).some(value => value)) {
      _analytics.page(eventName, { ...eventProperties, metadata })
     return
    }

    _analytics.page(eventName, eventProperties)
  },
  track: async <T extends keyof TrackProperties>(
    ...args: undefined extends TrackProperties[T]
      ? [eventName: T, properties?: TrackProperties[T]]
      : [eventName: T, properties: TrackProperties[T]]
  ): Promise<void> => {
    const metadata = getMetadata();
    const [eventName, eventProperties] = args

    if(Object.values(metadata).some(value => value)) {
      _analytics.track(eventName, { ...eventProperties, metadata })
     return
    }

    _analytics.track(eventName, eventProperties)
  },
  identify,
}