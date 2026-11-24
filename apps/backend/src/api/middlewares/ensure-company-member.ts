import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const ensureCompanyMember = ({
  requireAdmin = false,
}: {
  requireAdmin?: boolean;
} = {}) => {
  return async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const {
      data: [customer],
    } = await query.graph({
      entity: "customer",
      fields: ["employee.id", "employee.is_admin", "employee.company.id"],
      filters: { id: req.auth_context.actor_id },
    });

    const employee = customer?.employee;

    if (!employee?.id || employee.company?.id !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (requireAdmin && !employee.is_admin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
