import { Step } from "../models/step.interface";

export const updateGrantStep: Step = {
  id: "updateGrant",
  name: "Update Grant",
  dependencies: ["sendEmail"],
  run: async () => {
    console.log("updating grant...");
    await new Promise((response) => setTimeout(response, 100));
  },
};
