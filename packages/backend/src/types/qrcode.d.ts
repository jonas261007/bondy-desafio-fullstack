declare module "qrcode" {
  export function toDataURL(
    text: string,
    options?: {
      errorCorrectionLevel?: "L" | "M" | "Q" | "H";
      type?: string;
      width?: number;
      margin?: number;
    }
  ): Promise<string>;

  export function toFile(
    path: string,
    text: string,
    options?: {
      errorCorrectionLevel?: "L" | "M" | "Q" | "H";
      type?: string;
      width?: number;
      margin?: number;
    }
  ): Promise<void>;
}
