import swaggerJSDoc from "swagger-jsdoc";

import swaggerDefinition from "./swagger.definition.js";

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,

  apis: [
    "./src/modules/**/*.ts",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;