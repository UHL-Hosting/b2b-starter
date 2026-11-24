import {
  MiddlewareRoute,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { authenticate } from "@medusajs/medusa";
import { ensureCompanyMember } from "../../middlewares/ensure-company-member";
import {
  storeCompanyQueryConfig,
  storeEmployeeQueryConfig,
} from "./query-config";
import {
  StoreCreateCompany,
  StoreCreateEmployee,
  StoreGetCompanyParams,
  StoreGetEmployeeParams,
  StoreUpdateApprovalSettings,
  StoreUpdateEmployee,
} from "./validators";

export const storeCompaniesMiddlewares: MiddlewareRoute[] = [
  /* Company middlewares */
  {
    method: "ALL",
    matcher: "/store/companies*",
    middlewares: [authenticate("customer", ["session", "bearer"])],
  },
  {
    method: ["GET"],
    matcher: "/store/companies",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCompanyParams,
        storeCompanyQueryConfig.list
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/companies",
    middlewares: [
      validateAndTransformBody(StoreCreateCompany),
      validateAndTransformQuery(
        StoreGetCompanyParams,
        storeCompanyQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/companies/:id",
    middlewares: [
      ensureCompanyMember(),
      validateAndTransformQuery(
        StoreGetCompanyParams,
        storeCompanyQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/companies/:id",
    middlewares: [
      ensureCompanyMember({ requireAdmin: true }),
      validateAndTransformQuery(
        StoreGetCompanyParams,
        storeCompanyQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/store/companies/:id",
    middlewares: [ensureCompanyMember({ requireAdmin: true })],
  },

  /* Employee middlewares */
  {
    method: ["GET"],
    matcher: "/store/companies/:id/employees",
    middlewares: [
      ensureCompanyMember(),
      validateAndTransformQuery(
        StoreGetEmployeeParams,
        storeEmployeeQueryConfig.list
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/companies/:id/employees",
    middlewares: [
      ensureCompanyMember({ requireAdmin: true }),
      validateAndTransformBody(StoreCreateEmployee),
      validateAndTransformQuery(
        StoreGetEmployeeParams,
        storeEmployeeQueryConfig.list
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/companies/:id/employees/:employee_id",
    middlewares: [
      ensureCompanyMember(),
      validateAndTransformQuery(
        StoreGetEmployeeParams,
        storeEmployeeQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/store/companies/:id/employees/:employee_id",
    middlewares: [
      ensureCompanyMember({ requireAdmin: true }),
      validateAndTransformBody(StoreUpdateEmployee),
      validateAndTransformQuery(
        StoreGetEmployeeParams,
        storeEmployeeQueryConfig.retrieve
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/store/companies/:id/employees/:employee_id",
    middlewares: [ensureCompanyMember({ requireAdmin: true })],
  },
  {
    method: ["POST"],
    matcher: "/store/companies/:id/approval-settings",
    middlewares: [
      ensureCompanyMember({ requireAdmin: true }),
      validateAndTransformBody(StoreUpdateApprovalSettings),
    ],
  },
];
