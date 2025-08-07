interface Props {
  params: Promise<{
    parametros?: string[];
  }>;
}

export default async function Imoveis({ params }: Props) {
  const filtros = await params.then((p) => p.parametros) ?? [];

  return (
    <div className="h-dvh w-dvw bg-amber-300 text-black">
      <h1>Filtros aplicados:</h1>
      <ul>
        {filtros.map((filtro, index) => (
          <li key={index} className="text-black">
            {filtro}
          </li>
        ))}
      </ul>
    </div>
  );
}
