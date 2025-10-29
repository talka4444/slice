import { Step } from "../models/step.interface";

enum StepStatus {
  Pending = "pending",
  Running = "running",
  Success = "success",
  Failed = "failed",
  Skipped = "skipped",
}

interface WorkflowStep extends Step {
  status: StepStatus;
}

export class WorkflowEngine {
  private steps: Map<string, WorkflowStep>;

  constructor(steps: Step[]) {
    this.steps = new Map(
      steps.map((step) => [step.id, { ...step, status: StepStatus.Pending }])
    );
  }

  async run() {
    let pendingSteps: WorkflowStep[] = Array.from(this.steps.values());

    while (pendingSteps.length > 0) {
      this.setStepsAsSkipped(pendingSteps);

      const stepsToRun: WorkflowStep[] = this.getStepsToRun(pendingSteps);

      if (stepsToRun.length === 0) {
        console.log("no more steps to run, ending workflow.");
        break;
      }

      await Promise.all(stepsToRun.map((step) => this.runStep(step)));

      pendingSteps = pendingSteps.filter(
        (step) => step.status === StepStatus.Pending
      );
    }

    this.printResults();
  }

  private async runStep(step: WorkflowStep) {
    step.status = StepStatus.Running;
    console.log(`step ${step.name} is running...`);

    try {
      await step.run();
      step.status = StepStatus.Success;
      console.log(`step ${step.name} succeeded!`);
    } catch (e) {
      step.status = StepStatus.Failed;
      console.log(`step ${step.name} has failed: ${(e as Error).message}`);
    }
  }

  private getStepsToRun(pendingSteps: WorkflowStep[]): WorkflowStep[] {
    return pendingSteps.filter(
      (step) =>
        step.status === StepStatus.Pending &&
        step.dependencies.every(
          (depId) => this.steps.get(depId)?.status === StepStatus.Success
        )
    );
  }

  private setStepsAsSkipped(pendingSteps: WorkflowStep[]) {
    let anyStepsSkippedThisRound = true;

    while (anyStepsSkippedThisRound) {
      anyStepsSkippedThisRound = false;

      for (const step of pendingSteps) {
        if (step.status !== StepStatus.Pending) continue;

        const stepStatus = step.dependencies.some((depId) => {
          const status = this.steps.get(depId)?.status;
          return status === StepStatus.Failed || status === StepStatus.Skipped;
        });

        if (stepStatus) {
          step.status = StepStatus.Skipped;
          console.log(`step ${step.name} skipped due to failed dependencies`);
          anyStepsSkippedThisRound = true;
        }
      }
    }
  }

  private printResults() {
    console.log("workflow results:");
    for (let step of this.steps.values()) {
      console.log(`${step.name}: ${step.status}`);
    }
  }
}
