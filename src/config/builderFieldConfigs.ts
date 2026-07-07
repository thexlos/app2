import { builderContracts } from "./builderContracts";

export type GuidedInputType =
  | "text"
  | "textarea"
  | "select"
  | "multiSelect"
  | "date"
  | "time"
  | "number"
  | "money"
  | "percent"
  | "upload"
  | "toggle"
  | "customerSelect"
  | "leadSelect"
  | "projectSelect"
  | "itemSelect"
  | "categorySelect"
  | "qrSelect"
  | "fileSelect"
  | "templateSelect";

export interface BuilderFieldConfig {
  builderId: string;
  fieldKey: string;
  label: string;
  friendlyQuestion: string;
  helperText?: string;
  inputType: GuidedInputType;
  required: boolean;
  defaultValue?: string;
  options?: string[];
  mapsTo: string;
  section: string;
  simpleMode: boolean;
  advanced: boolean;
  showInGuidedWizard: boolean;
  wizardOrder: number;
  validationMessage?: string;
}

const questionOverrides: Record<string, string> = {
  purpose: "What kind of result are you making?",
  destination: "Where will this be used or where should it send people?",
  headline: "What headline should people see?",
  message: "What is the main message?",
  phone: "What phone number should show?",
  website: "What website or link should show?",
  qrCode: "Would you like to add a saved QR code?",
  cta: "What should the call-to-action say?",
  qrType: "What is this QR code for?",
  qrName: "What should this QR code be called?",
  shortLabel: "Would you like a short label under the QR code?",
  cardType: "What type of business card do you need?",
  information: "What information should show?",
  sides: "Do you need a front only or front and back?",
};

const kindMap = {
  text: "text",
  url: "text",
  textarea: "textarea",
  select: "select",
  checkboxes: "multiSelect",
  date: "date",
  file: "upload",
} as const;

export const workshopBuilderFieldConfigs: BuilderFieldConfig[] =
  builderContracts.flatMap((contract) =>
    contract.simpleModeFields.map((field, index) => ({
      builderId: contract.builderId,
      fieldKey: field.id,
      label: field.label,
      friendlyQuestion: questionOverrides[field.id] ?? field.label,
      helperText: field.helperText ?? field.placeholder,
      inputType: kindMap[field.kind],
      required: contract.requiredFields.includes(field.id),
      defaultValue:
        typeof contract.sampleMockData[field.id] === "string"
          ? String(contract.sampleMockData[field.id])
          : undefined,
      options: field.options,
      mapsTo: field.id,
      section: "Simple Mode",
      simpleMode: true,
      advanced: false,
      showInGuidedWizard: true,
      wizardOrder: index + 1,
      validationMessage: contract.validationMessages[field.id],
    })),
  );

const money = (
  builderId: string,
  fields: Array<
    Pick<
      BuilderFieldConfig,
      "fieldKey" | "friendlyQuestion" | "inputType" | "options" | "required"
    >
  >,
): BuilderFieldConfig[] =>
  fields.map((field, index) => ({
    ...field,
    builderId,
    label: field.friendlyQuestion,
    mapsTo: field.fieldKey,
    section: "Simple Mode",
    simpleMode: true,
    advanced: false,
    showInGuidedWizard: true,
    wizardOrder: index + 1,
  }));

export const moneyBuilderFieldConfigs = [
  ...money("estimate-builder", [
    {
      fieldKey: "customerId",
      friendlyQuestion: "Who is this estimate for?",
      inputType: "customerSelect",
      required: true,
    },
    {
      fieldKey: "projectMode",
      friendlyQuestion: "Is this a new or existing project?",
      inputType: "select",
      options: ["Existing project", "Create new project"],
      required: true,
    },
    {
      fieldKey: "templateMode",
      friendlyQuestion: "How do you want to start?",
      inputType: "select",
      options: [
        "Start blank",
        "Use default template",
        "Use saved template",
        "Duplicate previous",
      ],
      required: true,
    },
    {
      fieldKey: "categories",
      friendlyQuestion: "What sections or categories should be included?",
      inputType: "categorySelect",
      required: false,
    },
    {
      fieldKey: "notes",
      friendlyQuestion: "What notes or terms should the customer see?",
      inputType: "textarea",
      required: false,
    },
  ]),
  ...money("invoice-builder", [
    {
      fieldKey: "sourceMode",
      friendlyQuestion: "Is this invoice from an accepted estimate?",
      inputType: "select",
      options: ["Yes", "No"],
      required: true,
    },
    {
      fieldKey: "billingMethod",
      friendlyQuestion: "What do you want to invoice?",
      inputType: "select",
      options: [
        "Full",
        "Deposit",
        "Percentage",
        "Selected items",
        "Custom amount",
        "Final balance",
      ],
      required: true,
    },
    {
      fieldKey: "customerId",
      friendlyQuestion: "Who is being billed?",
      inputType: "customerSelect",
      required: true,
    },
    {
      fieldKey: "paymentMethods",
      friendlyQuestion: "What payment methods should show?",
      inputType: "multiSelect",
      options: [
        "Cash",
        "Check",
        "Zelle",
        "Cash App",
        "Venmo",
        "PayPal",
        "Bank transfer",
      ],
      required: false,
    },
    {
      fieldKey: "paymentTerms",
      friendlyQuestion: "When is payment due?",
      inputType: "select",
      options: [
        "Due on receipt",
        "Due in 7 days",
        "Due in 14 days",
        "Due in 30 days",
        "Custom",
      ],
      required: true,
    },
  ]),
  ...money("progress-invoice-builder", [
    {
      fieldKey: "estimateId",
      friendlyQuestion: "Which accepted estimate are you billing?",
      inputType: "select",
      required: true,
    },
    {
      fieldKey: "billingMethod",
      friendlyQuestion: "How should this progress invoice be calculated?",
      inputType: "select",
      options: [
        "Deposit",
        "Percentage",
        "Section",
        "Selected items",
        "Custom amount",
        "Final balance",
      ],
      required: true,
    },
  ]),
  ...money("change-order-builder", [
    {
      fieldKey: "estimateId",
      friendlyQuestion: "Which accepted estimate needs a change?",
      inputType: "select",
      required: true,
    },
    {
      fieldKey: "reason",
      friendlyQuestion: "What changed?",
      inputType: "textarea",
      required: true,
    },
    {
      fieldKey: "amount",
      friendlyQuestion: "How much does this change add or remove?",
      inputType: "money",
      required: true,
    },
  ]),
];

export const builderFieldConfigs = [
  ...workshopBuilderFieldConfigs,
  ...moneyBuilderFieldConfigs,
];

export function getGuidedBuilderFields(builderId: string) {
  return builderFieldConfigs
    .filter(
      (field) => field.builderId === builderId && field.showInGuidedWizard,
    )
    .sort((a, b) => a.wizardOrder - b.wizardOrder);
}
