const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book E-commerce API',
      version: '1.0.0',
      description: 'API documentation for Book E-commerce application',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
              example: '60d21b4667d0d8992e610c85'
            },
            fullName: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'john@example.com'
            },
            phoneNumber: {
              type: 'string',
              description: 'User phone number',
              example: '0123456789'
            },
            status: {
              type: 'string',
              description: 'User status',
              example: 'active'
            },
            role: {
              type: 'string',
              description: 'User role',
              example: 'user'
            },
            address: {
              type: 'string',
              description: 'User address',
              example: '123 Main St, City'
            }
          }
        },
        UserWithOrders: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
              example: '60d21b4667d0d8992e610c85'
            },
            fullName: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'john@example.com'
            },
            phoneNumber: {
              type: 'string',
              description: 'User phone number',
              example: '0123456789'
            },
            status: {
              type: 'string',
              description: 'User status',
              example: 'active'
            },
            role: {
              type: 'string',
              description: 'User role',
              example: 'user'
            },
            address: {
              type: 'string',
              description: 'User address',
              example: '123 Main St, City'
            },
            totalOrders: {
              type: 'integer',
              description: 'Total number of orders',
              example: 5
            },
            totalSpent: {
              type: 'number',
              description: 'Total amount spent',
              example: 299.95
            },
            orders: {
              type: 'array',
              description: 'List of user orders',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Order ID',
                    example: '60d21b4667d0d8992e610c85'
                  },
                  totalAmount: {
                    type: 'number',
                    description: 'Order total amount',
                    example: 59.99
                  },
                  status: {
                    type: 'string',
                    description: 'Order status',
                    enum: ['pending', 'processing', 'shipped', 'delivered'],
                    example: 'delivered'
                  },
                  createdAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Order creation date',
                    example: '2024-03-15T10:30:00Z'
                  },
                  items: {
                    type: 'array',
                    description: 'Order items',
                    items: {
                      type: 'object',
                      properties: {
                        bookId: {
                          type: 'string',
                          description: 'Book ID',
                          example: '60d21b4667d0d8992e610c85'
                        },
                        quantity: {
                          type: 'integer',
                          description: 'Quantity ordered',
                          example: 2
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        Admin: {
          type: 'object',
          properties: {
            adminName: {
              type: 'string',
              description: 'Admin username'
            },
            password: {
              type: 'string',
              description: 'Admin password'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Product name'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            price: {
              type: 'number',
              description: 'Product price'
            },
            stock: {
              type: 'number',
              description: 'Product stock quantity'
            },
            catalogId: {
              type: 'string',
              description: 'Catalog ID'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            customerId: {
              type: 'string',
              description: 'Customer ID'
            },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: {
                    type: 'string'
                  },
                  quantity: {
                    type: 'number'
                  }
                }
              }
            },
            totalAmount: {
              type: 'number',
              description: 'Total order amount'
            },
            status: {
              type: 'string',
              description: 'Order status'
            }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Customer username'
            },
            email: {
              type: 'string',
              description: 'Customer email'
            },
            password: {
              type: 'string',
              description: 'Customer password'
            }
          }
        },
        Catalog: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Catalog name'
            },
            description: {
              type: 'string',
              description: 'Catalog description'
            }
          }
        },
        Review: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description: 'Product ID'
            },
            customerId: {
              type: 'string',
              description: 'Customer ID'
            },
            rating: {
              type: 'number',
              description: 'Rating (1-5)'
            },
            comment: {
              type: 'string',
              description: 'Review comment'
            }
          }
        },
        Coupon: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Coupon code'
            },
            discount: {
              type: 'number',
              description: 'Discount amount'
            },
            validUntil: {
              type: 'string',
              format: 'date-time',
              description: 'Coupon validity date'
            }
          }
        },
        Invoice: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              description: 'Order ID'
            },
            amount: {
              type: 'number',
              description: 'Invoice amount'
            },
            status: {
              type: 'string',
              description: 'Invoice status'
            }
          }
        },
        OrderList: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Order ID',
              example: '60d21b4667d0d8992e610c85'
            },
            customerName: {
              type: 'string',
              description: 'Customer full name',
              example: 'John Doe'
            },
            customerEmail: {
              type: 'string',
              format: 'email',
              description: 'Customer email',
              example: 'john@example.com'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation date',
              example: '2024-03-15T10:30:00Z'
            },
            totalAmount: {
              type: 'number',
              description: 'Total order amount',
              example: 299.95
            },
            status: {
              type: 'string',
              description: 'Order status',
              enum: ['pending', 'processing', 'shipped', 'delivered'],
              example: 'delivered'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Path to the API routes and controllers
};

const specs = swaggerJsdoc(options);

module.exports = specs; 