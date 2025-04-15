import { Id } from "../../../../convex/_generated/dataModel";
import { Document } from "@/app/documents/[documentId]/document";
import { preloadQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

interface DocumentIdPageProps {
  params: { documentId: Id<"documents"> };
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = params;

  const { getToken } = await auth();
  const token = (await getToken({ template: "convex" })) ?? undefined;

  if (!token) {
    console.error("Unauthorized access attempt");
    throw Error("Unauthorized");
  }

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: documentId },
    { token }
  );

  if (!preloadedDocument) {
    console.error("Document not found:", documentId);
    return <div>Document not found</div>;
  }

  return <Document preloadedDocument={preloadedDocument} />;
};

export default DocumentIdPage;
