export const APP_ROUTES = {
  dashboard: "/dashboard",
  devices: {
    map: "/user-devices/map",
    list: "/user-devices",
    view: (id: number | string) => `/user-devices/${id}`,
  },
  orders: {
    list: "/orders",
    new: "/orders/new",
    edit: (id: number | string) => `/orders/${id}/edit`,
    view: (id: number | string) => `/orders/${id}`,
  },
  logs: {
    list: "/logs",
    view: (id: number | string) => `/logs/${id}`,
  },
  products: {
    list: "/products",
    new: "/products/new",
    edit: (id: number | string) => `/products/${id}/edit`,
    view: (id: number | string) => `/products/${id}`,
  },
  clients: {
    list: "/clients",
    new: "/clients/new",
    edit: (id: number | string) => `/clients/${id}/edit`,
    view: (id: number | string) => `/clients/${id}`,
  },
} as const;
