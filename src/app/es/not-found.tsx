import { NaoEncontrada, metadataNaoEncontrada } from "@/components/NaoEncontrada";

export const metadata = metadataNaoEncontrada("es");

export default function NotFound() {
  return <NaoEncontrada idioma="es" />;
}
