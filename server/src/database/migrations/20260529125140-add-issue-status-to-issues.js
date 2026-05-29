'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create the ENUM type in Postgres
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_issues_issue_status" AS ENUM ('BORROWED', 'RETURNED', 'OVERDUE');
    `);

    // 2. Add the column to the table
    await queryInterface.addColumn('issues', 'issue_status', {
      type: "enum_issues_issue_status",
      defaultValue: 'BORROWED',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Remove the column
    await queryInterface.removeColumn('issues', 'issue_status');
    
    // 2. Drop the ENUM type
    await queryInterface.sequelize.query('DROP TYPE "enum_issues_issue_status";');
  }
};