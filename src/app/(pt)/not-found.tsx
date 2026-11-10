import { NaoEncontrada, metadataNaoEncontrada } from "@/components/NaoEncontrada";

export const metadata = metadataNaoEncontrada("pt");

export default function NotFound() {
  return <NaoEncontrada idioma="pt" />;
}
