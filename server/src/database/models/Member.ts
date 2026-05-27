import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
} from "sequelize";

import sequelize from "../connection/database.js";

class Member extends Model<
  InferAttributes<Member>,
  InferCreationAttributes<Member>
> {
  // Database-generated primary key is optional during creation
  declare member_id: CreationOptional<string>;

  declare user_id: string;

  declare membership_plan_id: string;

  // These can be Date objects in Sequelize, mapping perfectly from string inputs
  declare start_date: Date;

  declare expiry_date: Date;

  // Has a default value 'ACTIVE', making it optional on creation
  declare membership_status: CreationOptional<"ACTIVE" | "EXPIRED">;

  // Timestamps are managed automatically by Sequelize
  declare readonly created_at: CreationOptional<Date>;

  declare readonly updated_at: CreationOptional<Date>;
}

Member.init(
  {
    member_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    membership_plan_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    membership_status: {
      type: DataTypes.ENUM("ACTIVE", "EXPIRED"),
      defaultValue: "ACTIVE",
    },

    created_at: {
      type: DataTypes.DATE,
    },

    updated_at: {
      type: DataTypes.DATE,
    },
  },

  {
    sequelize,
    tableName: "members",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Member;