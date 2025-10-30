import { StepType } from "../models/step-type.interface";

export const sendEmailStep: StepType = {
  name: "Send Email",
  async execute(params?: { recipient: string; subject: string }) {
    console.log(
      `sending email to ${params?.recipient} with subject ${params?.subject}`
    );
    await new Promise((response) => setTimeout(response, 500000));
  },
};
