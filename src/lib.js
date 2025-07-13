export const isServer =
  typeof process !== "undefined" && !!process.versions?.node;

export const isDevelopment = process.env.NODE_ENV === "development";

export const log = (...args) => {
  console.log("[Dropzone SDK]", ...args);
};
export const warn = (...args) => {
  console.warn("[Dropzone SDK]", ...args);
};
export const error = (...args) => {
  console.error("[Dropzone SDK]", ...args);
};
export const info = (...args) => {
  console.info("[Dropzone SDK]", ...args);
};
