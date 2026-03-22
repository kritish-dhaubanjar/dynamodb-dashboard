import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/items/HomeTable.vue"),
    meta: {
      name: "Item",
    },
  },
  {
    path: "/:tableName/edit-item",
    name: "edit-item",
    component: () => import("@/views/table/EditTable.vue"),
    meta: {
      name: "Item",
    },
  },
  {
    path: "/:tableName/create-item",
    name: "create-item",
    component: () => import("@/views/items/CreateItem.vue"),
    meta: {
      name: "Item",
    },
  },
  {
    path: "/table/create-table",
    name: "create-table",
    component: () => import("@/views/table/CreateTable.vue"),
    meta: {
      name: "Tables",
    },
  },
  {
    path: "/table/:tableName/edit-table",
    name: "edit-table",
    component: () => import("@/views/table/EditTable.vue"),
    meta: {
      name: "Tables",
    },
  },
  {
    path: "/table/:tableName/table-schema",
    name: "table-schema",
    component: () => import("@/views/table/TableSchema.vue"),
    meta: {
      name: "Tables",
    },
  },
  {
    path: "/table/:tableName/ttl",
    name: "table-ttl",
    component: () => import("@/views/table/TableTTL.vue"),
    meta: {
      name: "Tables",
    },
  },
  {
    path: "/table/:tableName/streams",
    name: "table-streams",
    component: () => import("@/views/table/TableStreams.vue"),
    meta: {
      name: "Tables",
    },
  },
  {
    path: "/table/restore-tables",
    name: "restore-tables",
    component: () => import("@/views/table/RestoreTables.vue"),
    meta: {
      name: "Tables",
    },
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("@/views/items/HomeTable.vue"),
    meta: {
      name: "Items",
    },
  },
  /*{
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/AboutView.vue"),
  },*/
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
