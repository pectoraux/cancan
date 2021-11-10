import { useEffect, useState } from "react";
import { Optional } from "./canister";

export * from "./canister";
export * from "./updateHead";
export * from "./video";
// export * from "./auth";
export * from "./AuthContext";
export * from "./AuthProvider";
export * from "./firebase";

export const KEY_LOCALSTORAGE_USER = `ic-cancan-user`;

export const MAX_CHUNK_SIZE = 1024 * 500; // 500kb
export const REWARDS_CHECK_INTERVAL = 60000;
export const hashtagRegExp = /(?:\s|^)#[A-Za-z0-9\-._]+(?:\s|$)/gim;

export const encodeArrayBuffer = (file: ArrayBuffer): number[] =>
  Array.from(new Uint8Array(file));

export function unwrap<T>(val: Optional<T>): T | null {
  if (val[0] === undefined) {
    return null;
  } else {
    return val[0];
  }
}

export async function getUserNameByPrincipal() {
  const icUserName = "tepa";
  // unwrap<string>(
  //   await (await CanCan.actor).getUserNameByPrincipal(principal)
  // )!;
  return icUserName;
}

// Converts a word into a hex color for placeholder profile pic backgrounds
export function textToColor(text: string): string {
  const numStringFromString = text
    .split("")
    .map((char) => char.charCodeAt(0))
    .join("");
  let hexFromNumString = parseInt(numStringFromString, 10).toString(16);
  const hexLength = hexFromNumString.length;
  const trimAmount = hexLength - 6;

  if (trimAmount < 0) {
    for (let i = 0; i < Math.abs(trimAmount); i++) {
      hexFromNumString += "0";
    }
  }
  if (trimAmount > 1) {
    const startIndex = Math.ceil(trimAmount / 2);
    const hexArray = hexFromNumString.split("");
    const trimmedArray = hexArray.slice(startIndex, startIndex + 6);

    hexFromNumString = trimmedArray.join("");
  }

  return `#${hexFromNumString}`;
}

export function formatBigNumber(number: number): string {
  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(2)}B`;
  }
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(2)}M`;
  }
  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(1)}K`;
  }
  return `${number}`;
}

// Converts a file from a byteArray to a blob URL
// TODO: Detect mime-type, "fileToBlobUrl" https://stackoverflow.com/a/29672957
export function fileToImgSrc(picUrl: string, imgType = "jpeg"): string {
  // const byteArray = new Uint8Array(file[0]);
  // const picBlob = new Blob([byteArray], { type: `image/${imgType}` });
  // const picSrc = URL.createObjectURL(picBlob);
  // return picSrc;
  return picUrl ? picUrl : "https://jpeg.org/images/jpeg-home.jpg";
}

export function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);
  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting)
  );

  useEffect(() => {
    observer.observe(ref.current);
    // Remove observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}
