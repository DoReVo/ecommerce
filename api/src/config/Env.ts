import { JSONSchemaType } from "ajv";

export interface Env {
  PORT?: number;
  POSTGRES_URL: string;
}

export const EnvSchema: JSONSchemaType<Env> = {
  type: "object",
  required: ["POSTGRES_URL"],
  properties: {
    PORT: {
      type: "integer",
      default: 4000,
      nullable: true,
    },
    POSTGRES_URL: {
      type: "string",
    },
  },
  additionalProperties: true,
};
