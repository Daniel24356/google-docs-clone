import { Id } from "../../../../convex/_generated/dataModel";
import { Document } from "@/app/documents/[documentId]/document";

import { preloadQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";

import { api } from "../../../../convex/_generated/api";

interface DocumentIdPageProps {
  params: { documentId: Id<"documents"> }; // Removed Promise<>
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = params; // Directly destructuring

  const { getToken } = await auth();
  const token = (await getToken({ template: "convex" })) ?? undefined;

  if (!token) {
    console.error("Unauthorized access attempt");
    throw Error("Unauthorized");
  }

  console.log("Loading Document ... ");
  console.log("Document ID:", documentId);
  console.log("Token:", token);

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: documentId },
    { token }
  );

  if (!preloadedDocument) {
    console.error("Document not found:", documentId);
    return <div>Document not found</div>; // Return UI instead of crashing
  }

  return <Document preloadedDocument={preloadedDocument} />;
};

export default DocumentIdPage;
