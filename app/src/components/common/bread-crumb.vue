<template>
  <div class="row">
    <div class="col-12">
      <nav
        style="--bs-breadcrumb-divider: &quot;>&quot;"
        aria-label="breadcrumb"
        class="d-flex justify-content-between"
      >
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="/">DynamoDB</a></li>
          <li class="breadcrumb-item">
            <a
              href="#"
              @click.prevent="cancel"
            >
              {{ route.meta.name }}
            </a>
          </li>
          <li
            class="breadcrumb-item active"
            aria-current="page"
          >
            {{ store.table.state.Table.TableName }}
          </li>
        </ol>
        <div class="d-flex">
          <i class="bi bi-sun me-1"></i>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              @change="(e) => toggleDarkReader(e.target.checked)"
              :checked="initIsDarkReaderEnabled"
            />
            <i class="bi bi-moon"></i>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inject, onBeforeMount, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { setFetchMethod, enable as enableDarkReader, disable as disableDarkMode } from "darkreader";

  const route = useRoute();
  const router = useRouter();
  const store: any = inject("store");
  const initIsDarkReaderEnabled = ref(false);

  const cancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push({ name: "home" });
    }
  };

  onBeforeMount(() => {
    setFetchMethod(window.fetch);
    initIsDarkReaderEnabled.value = !!localStorage.getItem("darkreader");
    toggleDarkReader(initIsDarkReaderEnabled.value);
  });

  const toggleDarkReader = (value: boolean) => {
    if (value) {
      enableDarkReader({
        brightness: 90,
        contrast: 90,
      });
      localStorage.setItem("darkreader", value.toString());
    } else {
      disableDarkMode();
      localStorage.removeItem("darkreader");
    }
  };
</script>
