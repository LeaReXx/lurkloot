// First-party platform hosts outside *.twitch.tv / *.kick.com. Declared as
// required host_permissions so a later farming path that needs them does not
// force another install-time privilege escalation (#786 did the same for HLS).

/** Twitch static CDN (campaign art, emotes, box art, thumbnails). */
export const TWITCH_STATIC_CDN_ORIGIN = "https://*.jtvnw.net/*";

/**
 * Amazon IVS. Kick delivers livestream playlists on nested
 * `*.playback.live-video.net` hosts; Twitch's web player also contacts
 * `*.live-video.net` for IVS device configuration.
 */
export const PLATFORM_IVS_ORIGIN = "https://*.live-video.net/*";

/** Twitch Extensions CDN and supervisor (`*.ext-twitch.tv`). */
export const TWITCH_EXTENSION_HOST_ORIGIN = "https://*.ext-twitch.tv/*";
