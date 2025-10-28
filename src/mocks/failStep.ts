import { Step } from "../models/step.interface";

export const failStep: Step = {
  id: "failStep",
  name: "Fail Step",
  dependencies: ["sendEmail"],
  run: async () => {
    console.log("failing step...");
    await new Promise((response) => setTimeout(response, 100));
    throw new Error("Step failed intentionally");
  },
};
