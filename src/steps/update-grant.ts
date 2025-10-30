import { StepType } from "../models/step-type.interface";

export const updateGrantStep: StepType = {
  name: "Update Grant",
  async execute(params?: { grantId: number }) {
    console.log(`Updating grant with id ${params?.grantId}`);
    await new Promise((response) => setTimeout(response, 100));
  },
};
