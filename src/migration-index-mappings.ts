export const migrationIndexMapping = {
  properties: {
    name: {
      type: 'keyword'
    },
    id: {
      type: 'integer'
    },
    time: {
      type: 'date'
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