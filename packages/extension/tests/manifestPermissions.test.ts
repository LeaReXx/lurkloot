import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { KASADA_COOKIE_ORIGIN } from "../src/core/cliCredentialExport";
import {
  PLATFORM_IVS_ORIGIN,
  TWITCH_EXTENSION_HOST_ORIGIN,
  TWITCH_STATIC_CDN_ORIGIN,
} from "../src/core/platformHosts";
import { TWITCH_HLS_HOST_ORIGIN } from "../src/core/twitchHlsPermission";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(here, "../wxt.config.ts"), "utf8");

describe("extension host permissions", () => {
  it("requires Twitch, Kick and platform CDN hosts, keeping the Kasada cookie host optional", () => {
    const required = source.match(/(?<!optional_)host_permissions:\s*\[([\s\S]*?)\]/)?.[1] ?? "";

    expect(required).toContain('"https://*.twitch.tv/*"');
    expect(required).toContain('"https://*.kick.com/*"');
    expect(required).toContain("TWITCH_HLS_HOST_ORIGIN");
    expect(required).toContain("TWITCH_STATIC_CDN_ORIGIN");
    expect(required).toContain("PLATFORM_IVS_ORIGIN");
    expect(required).toContain("TWITCH_EXTENSION_HOST_ORIGIN");
    expect(required).not.toContain("twitchcdn");
    for (const origin of [
      "https://www.twitch.tv/*",
      "https://gql.twitch.tv/*",
      "https://kick.com/*",
      "https://web.kick.com/*",
      "https://websockets.kick.com/*",
      "https://assets.twitch.tv/*",
      "https://spade.twitch.tv/*",
      "https://beacon.twitch.tv/*",
    ]) {
      expect(required).not.toContain(`"${origin}"`);
    }
    const optional = source.match(/optional_host_permissions:\s*\[([\s\S]*?)\]/)?.[1] ?? "";
    expect(optional).toContain("KASADA_COOKIE_ORIGIN");
    expect(optional).not.toContain("TWITCH_HLS_HOST_ORIGIN");
    expect(source).not.toContain("optional_permissions:");
  });

  it("names only the exact Kasada cookie host", () => {
    expect(KASADA_COOKIE_ORIGIN).toBe("https://k.twitchcdn.net/*");
  });

  it("names the Twitch video CDN as one host pattern", () => {
    expect(TWITCH_HLS_HOST_ORIGIN).toBe("https://*.ttvnw.net/*");
  });

  it("names the proactive platform hosts outside twitch.tv and kick.com", () => {
    expect(TWITCH_STATIC_CDN_ORIGIN).toBe("https://*.jtvnw.net/*");
    expect(PLATFORM_IVS_ORIGIN).toBe("https://*.live-video.net/*");
    expect(TWITCH_EXTENSION_HOST_ORIGIN).toBe("https://*.ext-twitch.tv/*");
  });
});
