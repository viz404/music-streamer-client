import { FormEvent, HTMLInputTypeAttribute } from "react";

export interface props {
  type: HTMLInputTypeAttribute;
  name: string;
  id: string;
  placeHolder: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  buttonText?: string;
}
