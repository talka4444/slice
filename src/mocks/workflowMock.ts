import { failStep } from "./failStep";
import { sendEmailStep } from "./sendEmail";
import { updateGrantStep } from "./updateGrant";
import { WorkflowEngine } from "../engine/workflowEngine";

export const mockWorkflow = async () => {
  const engine = new WorkflowEngine([sendEmailStep, updateGrantStep, failStep]);
  await engine.run();
};
