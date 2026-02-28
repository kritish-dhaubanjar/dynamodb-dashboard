import EditItem from "@/views/items/EditItem.vue";
import HomeTable from "@/views/items/HomeTable.vue";
import CreateItem from "@/views/items/CreateItem.vue";

import EditTable from "@/views/table/EditTable.vue";
import TableSchema from "@/views/table/TableSchema.vue";
import CreateTable from "@/views/table/CreateTable.vue";
import RestoreTables from "@/views/table/RestoreTables.vue";
import TableTTL from "@/views/table/TableTTL.vue";
import TableStreams from "@/views/table/TableStreams.vue";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeTable,
      meta: {
        name: "Item",
      },
    },
    {
      path: "/:tableName/edit-item",
      name: "edit-item",
      component: EditItem,
      meta: {
        name: "Item",
      },
    },
    {
      path: "/:tableName/create-item",
      name: "create-item",
      component: CreateItem,
      meta: {
        name: "Item",
      },
    },
    {
      path: "/table/create-table",
      name: "create-table",
      component: CreateTable,
      meta: {
        name: "Tables",
      },
    },
    {
      path: "/table/:tableName/edit-table",
      name: "edit-table",
      component: EditTable,
      meta: {
        name: "Tables",
      },
    },
    {
      path: "/table/:tableName/table-schema",
      name: "table-schema",
      component: TableSchema,
      meta: {
        name: "Tables",
      },
    },
    {
      path: "/table/:tableName/ttl",
      name: "table-ttl",
      component: TableTTL,
      meta: {
        name: "Tables",
      },
    },
    {
      path: "/table/:tableName/streams",
      name: "table-streams",
      component: TableStreams,
      meta: {
        name: "Tables",
      },
    },
    {
      path: "/table/restore-tables",
      name: "restore-tables",
      component: RestoreTables,
      meta: {
        name: "Tables",
      },
    },
    {
      path: "/:catchAll(.*)",
      component: HomeTable,
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
  ],
});

export default router;
