import { failStep } from "../steps/failStep";
import { sendEmailStep } from "../steps/sendEmail";
import { updateGrantStep } from "../steps/updateGrant";
import { WorkflowEngine } from "../workflow/workflowEngine";

export const mockWorkflow = async () => {
  const engine = new WorkflowEngine([sendEmailStep, updateGrantStep, failStep]);
  await engine.run();
};
