export const migrationIndexMapping = {
  properties: {
    name: {
      type: 'keyword'
    },
    time: {
      type: 'date'
    },
    index: {
      type: 'integer'
    }
  }
};

export const migrationLockIndexMapping = {
  properties: {
    isLocked: {
      type: 'boolean'
    }
  }
};