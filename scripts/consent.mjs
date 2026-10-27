// Consent Mode v2: согласие по умолчанию — до загрузки GTM, иначе теги на первом событии
// страницы увидят «не задано» (= разрешено). Здесь же восстанавливается сохранённый выбор.
// Баннер и кнопки — в GTM (gtm/consent-banner.html); KEY и POLICY должны совпадать с ним.
export const CONSENT_KEY = "janastart_consent";
export const CONSENT_POLICY = "2026-10-27";
const TTL_MS = 365 * 24 * 60 * 60 * 1000;

const types = (v) =>
  `{ad_storage:'${v}',ad_user_data:'${v}',ad_personalization:'${v}',analytics_storage:'${v}'}`;

/** Встроенный <script> для <head>: default denied, затем granted, если выбор сохранён и действует. */
export const consentHead = () =>
  `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',${types("denied")});
try{var c=JSON.parse(localStorage.getItem('${CONSENT_KEY}'));if(c&&c.policy==='${CONSENT_POLICY}'&&Date.now()-c.date<${TTL_MS}&&c.choice==='granted')gtag('consent','update',${types("granted")});}catch(e){}</script>`;
