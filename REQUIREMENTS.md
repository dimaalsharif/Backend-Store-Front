# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
 
#### Products
      Method     |     Endpoints        |         Functions       |      Arguments         |
-----------------+----------------------+-------------------------+------------------------+----
      get        |      /products       |          index          |                        |
      get        |/products?category=arg|      getByCategory      |     category name      |
      get        |  /products?top5=true |      get5MostPopular    |                        |
      get        |   /products/:id      |          show           |      product id        |
      post       |   /products          |  create, token required | object of type product |

#### Users
      Method    |     Endpoints     |         Functions       |      Arguments      |
----------------+-------------------+-------------------------+---------------------+-------
      get       |   /users          |   index, token required |                     |
      get       |   /users/:id      |    show, token required |  user id            |
      post      |   /users          |  create, token required | object of type user |
      post      |/users/authenticate|      authenticate       |  username, password |

#### Orders
      Method     |     Endpoints        |         Functions                  |      Arguments         |
-----------------+----------------------+------------------------------------+------------------------+----
      get        | /cart?completed=true | getCompletedOrders, token required |                        |
      get        |       /cart          |  currentOrder, token required      |                        |
     delete      |      /cart/:id       |  removeProduct, token required     |      product id        |
      post       |       /cart          |       create, token required       |  object of type cart   |
      put        |     /checkout        |    checkout, token required        |                        |

## Data Shapes
#### Product
   Column Name   |      Data Type       |
-----------------+----------------------+--
      id         |  serial primary key  |
      name       |       varchar        |
     price       |         int          |
    category     |       varchar        |

- Indexes:
    "products_pkey" PRIMARY KEY, btree (id)
- Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_productid_fkey" FOREIGN KEY (productid) REFERENCES products(id)

#### User
   Column Name        |      Data Type       |
----------------------+----------------------+--
      id              |  serial primary key  |
    firstname         |       varchar        |
    lastname          |       varchar        |
    username          |       varchar        |
  password_digest     |       varchar        |

- Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
- Referenced by:
    TABLE "orders" CONSTRAINT "orders_userid_fkey" FOREIGN KEY (userid) REFERENCES users(id)

#### Orders

   Column Name         |      Data Type       |
-----------------------+----------------------+--
        id             |  serial primary key  |
     userid            |  bigint foreign key  |
   order_status        |       varchar        |

- Indexes:
    "orders_pkey" PRIMARY KEY, btree (id)
- Foreign-key constraints:
    "orders_userid_fkey" FOREIGN KEY (userid) REFERENCES users(id)
- Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_orderid_fkey" FOREIGN KEY (orderid) REFERENCES orders(id)

#### Order Products 

   Column Name         |      Data Type        |
-----------------------+-----------------------+--
        id             |  serial primary key   |
     productid         |   bigint foreign key  |
     orderid           |   bigint foreign key  |
     quantity          |        int            |

- Indexes:
    "orders_pkey" PRIMARY KEY, btree (id)
- Foreign-key constraints:
    "orders_userid_fkey" FOREIGN KEY (userid) REFERENCES users(id)
- Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_orderid_fkey" FOREIGN KEY (orderid) REFERENCES orders(id)