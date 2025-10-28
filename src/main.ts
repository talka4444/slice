import { mockWorkflow } from "./mocks/workflowMock";

(async () => {
  console.log("running workflow engine...");
  await mockWorkflow();
})();
