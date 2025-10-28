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
    while (this.hasPendingSteps()) {
      const stepsToRun: WorkflowStep[] = this.getStepsToRun();
      const stepsWithFailedDependencies: WorkflowStep[] =
        this.getStepsWithFailedDependencies();

      if (stepsWithFailedDependencies) {
        this.setStepsAsSkipped(stepsWithFailedDependencies);
      }

      if (stepsToRun.length === 0) {
        console.log("no more steps to run, ending workflow.");
        break;
      }

      await Promise.all(stepsToRun.map((step) => this.runStep(step)));
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

  private getStepsToRun(): WorkflowStep[] {
    return Array.from(this.steps.values()).filter(
      (step) =>
        step.status === StepStatus.Pending &&
        step.dependencies.every(
          (depId) => this.steps.get(depId)?.status === StepStatus.Success
        )
    );
  }

  private getStepsWithFailedDependencies(): WorkflowStep[] {
    return Array.from(this.steps.values()).filter(
      (step) =>
        step.status === StepStatus.Pending &&
        step.dependencies.some(
          (depId) =>
            this.steps.get(depId)?.status ===
            (StepStatus.Failed || StepStatus.Skipped)
        )
    );
  }

  private setStepsAsSkipped(stepsToSkip: WorkflowStep[]) {
    stepsToSkip.forEach((step) => {
      step.status = StepStatus.Skipped;
      console.log(`step ${step.name} skipped due to failed dependencies`);
    });
  }

  private hasPendingSteps(): boolean {
    return Array.from(this.steps.values()).some(
      (step) => step.status === StepStatus.Pending
    );
  }

  private printResults() {
    console.log("workflow results:");
    for (let step of this.steps.values()) {
      console.log(`${step.name}: ${step.status}`);
    }
  }
}
