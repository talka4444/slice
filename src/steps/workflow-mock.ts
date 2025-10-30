import { failStep } from "./fail-step";
import { sendEmailStep } from "./send-email";
import { updateGrantStep } from "./update-grant";

export const successWorkflow = [
  {
    id: "1",
    name: "Send email to employee",
    type: sendEmailStep,
    params: { recipient: "name@slice.com", subject: "New Assignment" },
    dependencies: [],
  },
  {
    id: "2",
    name: "Send email to finance",
    type: sendEmailStep,
    params: {
      recipient: "finance@gmail.com",
      subject: "New transaction approved",
    },
    dependencies: [],
  },
  {
    id: "3",
    name: "Update grant with id 5",
    type: updateGrantStep,
    params: { grantId: 5 },
    dependencies: ["1", "2"],
  },
];

export const failWorkflow = [
  {
    id: "1",
    name: "Send email to employee",
    type: sendEmailStep,
    params: { recipient: "name@slice.com", subject: "New Assignment" },
    dependencies: [],
  },
  {
    id: "2",
    name: "Fail step",
    type: failStep,
    params: {},
    dependencies: [],
  },
  {
    id: "3",
    name: "Update grant with id 8",
    type: updateGrantStep,
    params: { grantId: 8 },
    dependencies: ["1, 2"],
  },
];
