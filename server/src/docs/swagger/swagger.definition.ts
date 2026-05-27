const swaggerDefinition = {
  openapi: "3.0.0",

  info: {
    title: "Library Management System API",

    version: "1.0.0",

    description:
      "Production-grade Library Management System backend APIs",
  },

  servers: [
    {
      url: "http://localhost:5000/api/v1",

      description: "Development Server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",

        scheme: "bearer",

        bearerFormat: "JWT",
      },
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
};

export default swaggerDefinition;