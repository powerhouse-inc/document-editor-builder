import { useDrives } from "@powerhousedao/reactor-browser";

export function useAllDocumentModels(): { id: string; name: string }[] {
  const drives = useDrives();

  return (
    drives?.reduce(
      (acc, drive) => {
        return [
          ...acc,
          ...drive.state.global.nodes
            .filter(
              (d) =>
                "documentType" in d &&
                d.documentType === "powerhouse/document-model"
            )
            .map((d) => ({ id: d.id, name: d.name })),
        ];
      },
      [] as { id: string; name: string }[]
    ) || []
  );
}

export default useAllDocumentModels;
