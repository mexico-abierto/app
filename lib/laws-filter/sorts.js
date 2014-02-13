module.exports = {
  'closing-soon': {
    label: 'sorts.closing-soon',
    sort: function (a, b) {
      if (a.closingAt != null) {
        if (b.closingAt != null) {
          // If closingAt isn't defined in both, they're equal
          return 0;
        }
        // undefined closingAt always goes last
        // b goes first in this case
        return 1;
      }

      // Closest dates first
      return new Date(a.closingAt) - new Date(b.closingAt);
    }
  },
  'newest-first': {
    label: 'sorts.newest-first',
    sort: function (a, b) {
      // Newest dates first
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  },
  'oldest-first': {
    label: 'sorts.oldest-first',
    sort: function (a, b) {
      // Oldest dates first
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  },
  'recently-updated': {
    label: 'sorts.recently-updated',
    sort: function (a, b) {
      // Newest dates first
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  },
  'by-law': {
    label: 'sorts.by-law',
    sort: function (a, b) {
      return parseFloat(a.lawId.slice(0,2)) - parseFloat(b.lawId.slice(0,2));
    }
  }
}
