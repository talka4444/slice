import { StepStatus } from "../engine/workflowEngine";
import { Step } from "../models/step.interface";

export const sendEmailStep: Step = {
  id: "sendEmail",
  name: "Send Email",
  status: StepStatus.Pending,
  dependencies: [],
  run: async () => {
    console.log("sending email...");
    await new Promise((response) => setTimeout(response, 100));
  },
};
