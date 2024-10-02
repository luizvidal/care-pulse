"use server";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAppointment = async (
	appointment: CreateAppointmentParams
) => {
	try {
		console.log(appointment);
		const newAppointment = await databases.createDocument(
			DATABASE_ID!,
			APPOINTMENT_COLLECTION_ID!,
			ID.unique(),
			appointment
		);

		return parseStringify(newAppointment);
	} catch (error) {
		console.log(error);
	}
};

export const getAppointment = async (appointmentId: string) => {
	try {
		const appointment = await databases.listDocuments(
			DATABASE_ID!,
			APPOINTMENT_COLLECTION_ID!,
			[Query.equal("$id", appointmentId)]
		);

		return parseStringify(appointment.documents[0]);
	} catch (error) {
		console.log(error);
	}
};

export const getRecentAppointmentList = async () => {
	try {
		const appointments = await databases.listDocuments(
			DATABASE_ID!,
			APPOINTMENT_COLLECTION_ID!,
			[Query.orderDesc("$createdAt")]
		);

		const counts = (appointments.documents as Appointment[]).reduce(
			(acc, appointment) => ({
				...acc,
				[appointment.status]: (acc[appointment.status] += 1),
			}),
			{
				scheduled: 0,
				pending: 0,
				cancelled: 0,
			}
		);

		const data = {
			totalCount: appointments.total,
			...counts,
			documents: appointments.documents,
		};

		return parseStringify(data);
	} catch (error) {
		console.log(error);
	}
};

export const updateAppointment = async ({
	appointmentId,
	userId,
	appointment,
	type,
}: UpdateAppointmentParams) => {
	try {
		const updatedAppointment = await databases.updateDocument(
			DATABASE_ID!,
			APPOINTMENT_COLLECTION_ID!,
			appointmentId,
			appointment
		);

		if (!updatedAppointment) {
			throw new Error("Appointment not found");
		}

		// TODO: SMS Notification

		revalidatePath("/admin");

		return parseStringify(updatedAppointment);
	} catch (error) {
		console.log(error);
	}
};
