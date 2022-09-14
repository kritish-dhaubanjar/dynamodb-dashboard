import EditItem from "@/views/items/EditItem.vue";
import HomeTable from "@/views/items/HomeTable.vue";
import CreateItem from "@/views/items/CreateItem.vue";
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
      component: CreateItem,
      meta: {
        name: "Table",
      },
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
  ],
});

export default router;
