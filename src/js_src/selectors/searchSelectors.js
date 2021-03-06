import { createSelector } from 'reselect';

// See https://github.com/reactjs/reselect
// for details on using selectors.

/**
 * Direct selector to the search state.
 */
const selectSearchDomain = (state) => state.search;
const selectRoutingDomain = (state) => state.routing;

const selectSearch = createSelector(
  [selectSearchDomain],
  (searchDomain) => searchDomain.toJS()
);

const selectErrorMessage = createSelector(
  [selectSearchDomain],
  (search) => search.get('errorMessage')
);

const selectIsError = createSelector(
  [selectSearchDomain],
  (search) => search.get('isError')
);

const selectIsPending = createSelector(
  [selectSearchDomain],
  (search) => search.get('isPending')
);

const selectQueryParams = createSelector(
  [selectRoutingDomain],
  (routing) => {
    let location = routing.locationBeforeTransitions;
    let queryParams = location ? routing.locationBeforeTransitions.query : {};
    return queryParams;
  }
);

const selectResults = createSelector(
  [selectSearchDomain],
  (search) => search.get('results').toJS()
);

const selectTotal = createSelector(
  [selectSearchDomain],
  (search) => search.get('total')
);

const selectPageSize = createSelector(
  [selectSearchDomain],
  (search) => search.get('pageSize')
);

const selectTotalPages = createSelector(
  [selectTotal,selectPageSize],
  (total, pageSize) => Math.floor(total / pageSize) + ((total % pageSize === 0) ? 0 : 1)
);

const selectActiveCategory = createSelector(
  [selectSearchDomain],
  (search) => search.get('activeCategory')
);
const selectAggregations = createSelector(
  [selectSearchDomain],
  (search) => search.get('aggregations').toJS()
);

export {
  selectSearchDomain,
  selectSearch,
  selectErrorMessage,
  selectIsError,
  selectIsPending,
  selectQueryParams,
  selectResults,
  selectTotal,
  selectPageSize,
  selectTotalPages,
  selectActiveCategory,
  selectAggregations
};
