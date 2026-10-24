import avatar256 from "./avatar-256.webp";
import avatar500 from "./avatar.webp";

/**
 * The avatar is drawn at 32-100px in the nav and at most 208px in the intro hero,
 * so the 500px file is several times larger than any slot but the hero's on a
 * retina screen. Call sites pass `sizes` describing their own slot and let the
 * browser pick.
 */
export const avatarSrc = avatar500;
export const avatarSrcSet = `${avatar256} 256w, ${avatar500} 500w`;

/** The nav and the mobile header never exceed 100px, i.e. 200px at 2x. */
export const AVATAR_NAV_SIZES = "100px";
