/*eslint-disable no-undef */
import React, { Component } from 'react';
import { createMemoryHistory } from 'react-router';
import { connect } from 'react-redux';
import _ from 'underscore';

import style from './style.css';
import FilterSelector from './filterSelector/filterSelector';
import SearchBreadcrumbs from './searchBreadcrumbs';
import SearchControls from './searchControls';
import ResultsList from './resultsList';
import ResultsTable from './resultsTable';
import { SMALL_COL_CLASS, LARGE_COL_CLASS, SEARCH_API_ERROR_MESSAGE } from '../../constants';
import { receiveResponse, setError, setPending } from './searchActions';

import {
  selectActiveCategory,
  selectErrorMessage,
  selectIsError,
  selectQueryParams,
  selectResults,
  selectPageSize,
} from '../../selectors/searchSelectors';

const BASE_SEARCH_URL = '/api/search';

class SearchComponent extends Component {
  // fetch data at start
  componentDidMount() {
    this.fetchData();
  }

  // fetch data whenever URL changes within /search
  componentDidUpdate (prevProps) {
    if (prevProps.queryParams !== this.props.queryParams) {
      this.fetchData();
    }
  }

  fetchData() {
    // edit for pagination
    let size = this.props.pageSize;
    let _limit = size;
    let _offset = (this.props.currentPage - 1) * size;
    let qp = _.clone(this.props.queryParams);
    qp.limit = _limit;
    qp.offset = _offset;
    let tempHistory = createMemoryHistory('/');
    let searchUrl = tempHistory.createPath({ pathname: BASE_SEARCH_URL, query: qp });
    // cancel request if exists
    if (this._xhr) this._xhr.abort();
    // depends on global $
    this.props.dispatch(setPending(true));
    this._xhr = $.ajax({
      url : searchUrl,
      type : 'GET',
      dataType:'json',
      success: data => {              
        this.props.dispatch(receiveResponse(data, this.props.queryParams));
        this.props.dispatch(setError(false));
        this.props.dispatch(setPending(false));
      },
      error: (request, e) => {
        this.props.dispatch(setPending(false));
        if (process.env.NODE_ENV === 'production') {
          this.props.dispatch(setError(SEARCH_API_ERROR_MESSAGE));
        } else {
          throw(e);
        }
      }
    });
  }

  renderResultsNode() {
    if (this.props.isTable) {
      return <ResultsTable activeCategory={this.props.activeCategory} entries={this.props.results} />;
    }
    return <ResultsList entries={this.props.results} />;
  }

  renderErrorNode() {
    if (!this.props.isError) {
      return null;
    }
    return (
      <div className='alert alert-warning'>
        <h3>Oops, Error</h3>
        <p>{this.props.errorMessage}</p>
      </div>
    );
  }

  render() {
    return (
      <div className={style.root}>
        {this.renderErrorNode()}
        <div className='row'>
          <div className={SMALL_COL_CLASS}>
            <FilterSelector />
          </div>
          <div className={LARGE_COL_CLASS}>
            <SearchBreadcrumbs />
            <SearchControls />
            {this.renderResultsNode()}
          </div>
        </div>
      </div>
    );
  }
}

SearchComponent.propTypes = {
  activeCategory: React.PropTypes.string,
  currentPage: React.PropTypes.number,
  dispatch: React.PropTypes.func,
  errorMessage: React.PropTypes.string,
  history: React.PropTypes.object,
  isError: React.PropTypes.bool,
  isTable: React.PropTypes.bool,
  pageSize: React.PropTypes.number,
  queryParams: React.PropTypes.object,
  results: React.PropTypes.array,
};

function mapStateToProps(state) {
  let _queryParams = selectQueryParams(state);
  let _isTable = (_queryParams.mode === 'table');
  let _currentPage = parseInt(_queryParams.page) || 1;
  return {
    activeCategory:  selectActiveCategory(state),
    currentPage: _currentPage,
    errorMessage: selectErrorMessage(state),
    isError: selectIsError(state),
    isTable: _isTable,
    pageSize: selectPageSize(state),
    queryParams: _queryParams,
    results: selectResults(state)
  };
}

export { SearchComponent as SearchComponent };
export default connect(mapStateToProps)(SearchComponent);
