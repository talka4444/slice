import { StepType } from "../models/step-type.interface";

export const failStep: StepType = {
  name: "Fail step",
  async execute() {
    console.log(`Failing step...`);
    await new Promise((response) => setTimeout(response, 100));
    throw new Error("Step failed intentionally");
  },
};
