import { NaoEncontrada, metadataNaoEncontrada } from "@/components/NaoEncontrada";

export const metadata = metadataNaoEncontrada("en");

export default function NotFound() {
  return <NaoEncontrada idioma="en" />;
}
