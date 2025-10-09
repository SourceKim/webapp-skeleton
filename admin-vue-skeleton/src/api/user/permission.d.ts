import { BaseModel } from "../types/common";

export interface Permission extends BaseModel {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface CreateAndUpdatePermissionQueryDto {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

