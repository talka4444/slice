# Workflow Engine

This project implements a simple Workflow Engine that runs steps with dependencies.
The engine executes steps according to their dependencies while supporting parallel execution, marking steps as Skipped if dependencies fail, and printing the status of all the steps and the workflow at the end.

## Requirements

- Node.js
- TypeScript

### Running the project

To run the project, use the following command:

```bash
npx ts-node src/main.ts
```
