import { WorkflowEngine } from "./engine/workflowEngine";
import { failWorkflow, successWorkflow } from "./steps/workflow-mock";

(async () => {
  console.log("running success workflow engine...");
  const successEngine = new WorkflowEngine(successWorkflow);
  await successEngine.run();

  console.log("running fail workflow engine...");
  const failEngine = new WorkflowEngine(failWorkflow);
  await failEngine.run();
})();
