import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const state = reactive({
  Limit: 50,
  IndexName: null,
  //
  FilterExpression: null,
  KeyConditionExpression: null,
  //
  ExclusiveStartKey: null,
  ExpressionAttributeNames: null,
  ExpressionAttributeValues: null,
});

const setters = {
  init: ({ LastEvaluatedKey = null }) => {
    state.IndexName = null;
    state.FilterExpression = null;
    state.KeyConditionExpression = null;
    state.ExpressionAttributeNames = null;
    state.ExpressionAttributeValues = null;
    state.ExclusiveStartKey = LastEvaluatedKey;
  },
  setLimit: (limit: number) => {
    state.Limit = limit;
  },
  setIndexName: (indexName: string) => {
    state.IndexName = indexName;
  },
  setExclusiveStartKey: (exclusiveStartKey: object) => {
    state.ExclusiveStartKey = exclusiveStartKey;
  },
};

export default {
  state,
  setters,
};
