<template>
  <div>
    <i class="bi bi-clipboard2 me-2" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Copy to clipboard"
      @click="copy" />
    <span v-for="section of sections">
      <RouterLink v-if="section.reference" :to="{
        name: 'edit-item',
        params: { tableName: section.reference.TableName },
        query: {
          [section.reference.AttributeName]: section.value,
        }
      }" class="card-link text-decoration-none">
        {{ section.value + section.separator }}
      </RouterLink>
      <span v-else>
        {{ section.value + section.separator }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';

const props = defineProps({
  column: String,
  value: String,
  foreignKeys: Array
});

const copy = () => {
  navigator.clipboard.writeText(props.value);
};

const extractValues = (pattern, inputString) => {
  const regex = new RegExp(pattern.replace(/<([^>]+)>/g, '([^_]+)'), 'g');
  const matches = inputString.match(regex);
  const extractedValues = matches.map(match => match.substring(1));

  return extractedValues;
}

const handleItem = () => {
  return {}
}

const sections = computed(() => {
  const { AttributeValue, References } = props.foreignKeys.find(({ AttributeName }) => AttributeName === props.column);

  const tagRegex = /<([^>]+)>/g;
  const untagRegex = />([^>]+)</g;

  const tags = AttributeValue.match(tagRegex).map(match => match.substring(1, match.length - 1));

  const separators = AttributeValue.match(untagRegex)?.map(match => match.substring(1, match.length - 1)) ?? [];
  const separatorRegex = new RegExp(`[${separators.join('')}]`, 'g');

  const values = props.value?.split(separatorRegex) ?? {}


  const map = tags.map((key, index) => ({
    key,
    value: values[index] || "",
    separator: values[index + 1] ? separators[index] || "" : "",
    reference: References[key],
  }))

  console.log(map);

  return map;
});
</script>

<style scoped lang="scss">
i:hover {
  cursor: pointer;
}
</style>
