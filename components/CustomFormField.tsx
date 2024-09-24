/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import React from "react";
import { Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FormFieldType } from "./forms/PatientForm";
import { Input } from "./ui/input";

interface CustomProps {
	control: Control<any>;
	fieldType: FormFieldType;
	name: string;
	label?: string;
	placeholder?: string;
	iconSrc?: string;
	iconAlt?: string;
	disabled?: boolean;
	dateFormat?: string;
	showTimeSelect?: boolean;
	children?: React.ReactNode;
	renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
	const { fieldType, iconSrc, iconAlt, placeholder } = props;

	switch (fieldType) {
		case FormFieldType.INPUT:
			return (
				<div className="flex rounded-md border border-dark-500 bg-dark-400">
					{iconSrc && (
						<Image
							src={iconSrc}
							width={24}
							height={24}
							alt={iconAlt || "icon"}
							className="ml-2"
						/>
					)}
					<FormControl>
						<Input
							placeholder={placeholder}
							{...field}
							className="shad-input border-0"
						></Input>
					</FormControl>
				</div>
			);

		case FormFieldType.PHONE_INPUT:
			return (
				<FormControl>
					<PhoneInput
						defaultCountry="US"
						placeholder={placeholder}
						international
						withCountryCallingCode
						value={field.value}
						onChange={field.onChange}
						className="input-phone"
					/>
				</FormControl>
			);
	}
};

const CustomFormField = (props: CustomProps) => {
	const { control, fieldType, name, label } = props;

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex-1">
					{fieldType != FormFieldType.CHECKBOX && label && (
						<FormLabel>{label}</FormLabel>
					)}

					<RenderInput field={field} props={props} />

					<FormMessage className="shad-error"></FormMessage>
				</FormItem>
			)}
		/>
	);
};

export default CustomFormField;
