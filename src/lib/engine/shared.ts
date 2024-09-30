export const isWasmSupported = () =>
  typeof WebAssembly === "object" &&
  WebAssembly.validate(
    Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
  );

export const isMultiThreadSupported = () => SharedArrayBuffer !== undefined;
