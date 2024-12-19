import { reactive } from "vue";

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
  //
  ScanIndexForward: null,
});

const setters = {
  init: ({
    IndexName = null,
    FilterExpression = null,
    LastEvaluatedKey = null,
    KeyConditionExpression = null,
    ExpressionAttributeNames = null,
    ExpressionAttributeValues = null,
    ScanIndexForward = null,
  }) => {
    state.IndexName = IndexName;
    state.FilterExpression = FilterExpression;
    state.ExclusiveStartKey = LastEvaluatedKey;
    state.KeyConditionExpression = KeyConditionExpression;
    state.ExpressionAttributeNames = ExpressionAttributeNames;
    state.ExpressionAttributeValues = ExpressionAttributeValues;
    state.ScanIndexForward = ScanIndexForward;
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

  reset: () => {
    // state.IndexName = null;
    state.FilterExpression = null;
    // state.ExclusiveStartKey = null;
    state.KeyConditionExpression = null;
    state.ExpressionAttributeNames = null;
    state.ExpressionAttributeValues = null;
    state.ScanIndexForward = null;
  },
};

export default {
  state,
  setters,
};
