import { validateEventSchema } from "./schema.validator.js";

import {
  validateBusinessRules
} from "./business-rules.validator.js";

export function validateEvent(event) {
  const schemaIssues = validateEventSchema(event);

  const businessIssues = validateBusinessRules(event);

  return [
    ...schemaIssues,
    ...businessIssues
  ];
}