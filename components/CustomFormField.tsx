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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FormFieldType } from "./forms/PatientForm";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

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
	const {
		fieldType,
		iconSrc,
		iconAlt,
		placeholder,
		showTimeSelect,
		dateFormat,
		disabled,
		renderSkeleton,
	} = props;

	switch (fieldType) {
		case FormFieldType.INPUT:
			return (
				<div className="flex rounded-md border border-dark-500 bg-dark-400">
					{iconSrc && (
						<Image
							src={iconSrc}
							width={24}
							height={24}
							sizes="10px"
							alt={iconAlt || "icon"}
							className="ml-2 w-auto h-auto"
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

		case FormFieldType.TEXTAREA:
			return (
				<FormControl>
					<Textarea
						placeholder={placeholder}
						{...field}
						className="shad-textArea"
						disabled={disabled}
					></Textarea>
				</FormControl>
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

		case FormFieldType.DATE_PICKER:
			return (
				<div className="flex rounded-md border border-dark-500 bg-dark-400">
					<Image
						src="/assets/icons/calendar.svg"
						width={24}
						height={24}
						alt="calendar"
						className="ml-2"
					/>
					<FormControl>
						<DatePicker
							selected={field.value}
							onChange={(date) => field.onChange(date)}
							dateFormat={dateFormat ?? "MM/dd/yyyy"}
							showTimeSelect={showTimeSelect ?? false}
							timeInputLabel="Time:"
							wrapperClassName="date-picker"
						></DatePicker>
					</FormControl>
				</div>
			);

		case FormFieldType.SELECT:
			return (
				<FormControl>
					<Select onValueChange={field.onChange} defaultValue={field.value}>
						<FormControl>
							<SelectTrigger className="shad-select-trigger">
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent className="shad-select-content">
							{props.children}
						</SelectContent>
					</Select>
				</FormControl>
			);

		case FormFieldType.CHECKBOX:
			return (
				<FormControl>
					<div className="flex items-center gap-4">
						<Checkbox
							id={props.name}
							checked={field.value}
							onCheckedChange={field.onChange}
						/>
						<label htmlFor={props.name} className="checkbox-label">
							{props.label}
						</label>
					</div>
				</FormControl>
			);

		case FormFieldType.SKELETON:
			return renderSkeleton ? renderSkeleton(field) : <></>;
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
