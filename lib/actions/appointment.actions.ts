"use server";
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
