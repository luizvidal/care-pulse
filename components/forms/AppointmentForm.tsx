"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import { getAppointmentSchema } from "@/lib/validation";

import "react-datepicker/dist/react-datepicker.css";

import { createAppointment } from "@/lib/actions/appointment.actions";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { FormFieldType } from "./PatientForm";

export const AppointmentForm = ({
	type,
	userId,
	patientId,
}: {
	type: "create" | "cancel" | "schedule";
	userId: string;
	patientId: string;
}) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const AppointmentFormValidation = getAppointmentSchema(type);

	const form = useForm<z.infer<typeof AppointmentFormValidation>>({
		resolver: zodResolver(AppointmentFormValidation),
		defaultValues: {
			primaryPhysician: "",
			schedule: new Date(),
			reason: "",
			note: "",
			cancellationReason: "",
		},
	});

	async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
		setIsLoading(true);

		let status = "";

		switch (type) {
			case "schedule":
				status = "scheduled";
				break;
			case "cancel":
				status = "canceled";
				break;
			default:
				status = "pending";
		}

		try {
			if (type == "create" && patientId) {
				const appointmentData = {
					userId,
					patient: patientId,
					primaryPhysician: values.primaryPhysician,
					reason: values.reason!,
					schedule: new Date(values.schedule),
					status: status as Status,
					note: values.note,
				};

				const appointment = await createAppointment(appointmentData);

				if (appointment) {
					form.reset();
					router.push(
						`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
					);
				}
			}
		} catch (error) {
			console.log(error);
		}

		setIsLoading(false);
	}

	let buttonLabel = "";

	if (type == "cancel") buttonLabel = "Cancel Appointment";
	else if (type == "create") buttonLabel = "Create Appointment";
	else buttonLabel = "Schedule Appointment";

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
				{type === "create" && (
					<section className="mb-12 space-y-4">
						<h1 className="header">New Appointment</h1>
						<p className="text-dark-700">
							Request a new appointment in 10 seconds.
						</p>
					</section>
				)}

				{type !== "cancel" && (
					<>
						<CustomFormField
							fieldType={FormFieldType.SELECT}
							control={form.control}
							name="primaryPhysician"
							label="Doctor"
							placeholder="Select a doctor"
						>
							{Doctors.map((doctor, i) => (
								<SelectItem key={doctor.name + i} value={doctor.name}>
									<div className="flex cursor-pointer items-center gap-2">
										<Image
											src={doctor.image}
											width={32}
											height={32}
											alt="doctor"
											className="rounded-full border border-dark-500"
										/>
										<p>{doctor.name}</p>
									</div>
								</SelectItem>
							))}
						</CustomFormField>

						<CustomFormField
							fieldType={FormFieldType.DATE_PICKER}
							control={form.control}
							name="schedule"
							label="Expected appointment date"
							showTimeSelect
							dateFormat="MM/dd/yyyy  -  h:mm aa"
						/>

						<div
							className={`flex flex-col gap-6  ${
								type === "create" && "xl:flex-row"
							}`}
						>
							<CustomFormField
								fieldType={FormFieldType.TEXTAREA}
								control={form.control}
								name="reason"
								label="Appointment reason"
								placeholder="Annual montly check-up"
								disabled={type === "schedule"}
							/>

							<CustomFormField
								fieldType={FormFieldType.TEXTAREA}
								control={form.control}
								name="note"
								label="Comments/notes"
								placeholder="Prefer afternoon appointments, if possible"
								disabled={type === "schedule"}
							/>
						</div>
					</>
				)}

				{type === "cancel" && (
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name="cancellationReason"
						label="Reason for cancellation"
						placeholder="Urgent meeting came up"
					/>
				)}

				<SubmitButton
					isLoading={isLoading}
					className={`${
						type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
					} w-full`}
				>
					{buttonLabel}
				</SubmitButton>
			</form>
		</Form>
	);
};
