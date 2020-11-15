declare module "pagexray";

export interface Browser {
  name: string;
  version: string;
}

export interface Meta {
  browser: Browser;
  startedDateTime: Date;
  connectivity: string;
  title: string;
}

export interface Html {
  transferSize: number;
  contentSize: number;
  headerSize: number;
  requests: number;
}

export interface Css {
  transferSize: number;
  contentSize: number;
  headerSize: number;
  requests: number;
}

export interface Javascript {
  transferSize: number;
  contentSize: number;
  headerSize: number;
  requests: number;
}

export interface Image {
  transferSize: number;
  contentSize: number;
  headerSize: number;
  requests: number;
}

export interface Font {
  transferSize: number;
  contentSize: number;
  headerSize: number;
  requests: number;
}

export interface Favicon {
  transferSize: number;
  contentSize: number;
  headerSize: number;
  requests: number;
}

export interface ContentTypes {
  html: Html;
  css: Css;
  javascript: Javascript;
  image: Image;
  font: Font;
  favicon: Favicon;
}

export interface ResponseCodes {
  200: number;
}

export interface FirstParty {
  [key: string]: any;
}

export interface ThirdParty {
  [key: string]: any;
}

export interface Timings {
  blocked: number;
  dns: number;
  connect: number;
  send: number;
  wait: number;
  receive: number;
}

export interface Domain {
  transferSize: number;
  contentSize: number;
  headerSize: number;
  requests: number;
  timings: Timings;
}

export interface Domains {
  [key: string]: Domain;
}

export interface ExpireStats {
  min: number;
  median: number;
  max: number;
  total: number;
  values: number;
}

export interface LastModifiedStats {
  min: number;
  median: number;
  max: number;
  total: number;
  values: number;
}

export interface CookieStats {
  min: number;
  median: number;
  max: number;
  total: number;
  values: number;
}

export interface VisualProgress {
  [key: number]: number;
}

export interface VisualMetrics {
  FirstVisualChange: number;
  SpeedIndex: number;
  VisualComplete85: number;
  LastVisualChange: number;
  VisualProgress: VisualProgress;
}

export interface PageXRayResult {
  firstPartyRegEx: any;
  url: string;
  meta: Meta;
  finalUrl: string;
  baseDomain: string;
  documentRedirects: number;
  redirectChain: any[];
  transferSize: number;
  contentSize: number;
  headerSize: number;
  requests: number;
  missingCompression: number;
  httpType: string;
  httpVersion: string;
  contentTypes: ContentTypes;
  assets: any[];
  responseCodes: ResponseCodes;
  firstParty: FirstParty;
  thirdParty: ThirdParty;
  domains: Domains;
  expireStats: ExpireStats;
  lastModifiedStats: LastModifiedStats;
  cookieStats: CookieStats;
  totalDomains: number;
  visualMetrics: VisualMetrics;
}
