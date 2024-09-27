import {
  DATABASE_ID,
  NEXT_PUBLIC_BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
} from "@/env";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { databases, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
	try {
		const newUser = await users.create(
			ID.unique(),
			user.email,
			user.phone,
			undefined,
			user.name
		);

		return parseStringify(newUser);
	} catch (error: any) {
		console.log(error);
		if (error && error?.code == 409) {
			const documents = await users.list([Query.equal("email", user.email)]);
			return documents.users[0];
		}
	}
};

export const getUser = async (userId: string) => {
	try {
		const user = await users.get(userId);

		return parseStringify(user);
	} catch (error) {
		console.log(error);
	}
};

export const registerPatient = async ({
	identificationDocument,
	...patient
}: RegisterUserParams) => {
	try {
		let file;

		if (identificationDocument) {
			const inputFile = InputFile.fromBuffer(
				identificationDocument.get("blobFile") as Blob,
				identificationDocument.get("fileName") as string
			);

			file = await storage.createFile(
				NEXT_PUBLIC_BUCKET_ID!,
				ID.unique(),
				inputFile
			);
		}

		const newPatient = await databases.createDocument(
			DATABASE_ID!,
			PATIENT_COLLECTION_ID!,
			ID.unique(),
			{
				identificationDocumentId: file?.$id || null,
				identificationDocumentUrl: `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID} `,
				...patient,
			}
		);

		return parseStringify(newPatient);
	} catch (error) {
		console.log(error);
	}
};
