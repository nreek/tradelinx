import React from 'react';

// PAGINATOR NEEDS:
// * the current page
// * a function to set a new current page
// * the total number of items in the list to be paginated
// * the preferred number of items per page

const Paginator = ({
  currentPage, setPage, numItems, itemsPerPage,
}) => {
  const maxPages = Math.ceil(numItems / itemsPerPage);
  const start = (currentPage - 2 > 1) ? currentPage - 2 : 1;
  const showLeftExtreme = start !== 1;
  const end = (currentPage + 2 < maxPages) ? currentPage + 2 : maxPages;
  const showRightExtreme = end !== maxPages;
  const pageButtons = [];

  for (let i = start; i <= end; i++) {
    pageButtons.push(
      <span
        key={i}
        className={`paginator-num pos-${i - currentPage} ${currentPage === i ? 'active' : null}`}
        onClick={() => setPage(i)}
      >
        {i}
      </span>,
    );
  }

  return (
    <div className="paginator">
      {showLeftExtreme
        && (
        <span className="paginator-left-ext" onClick={() => setPage(1)}>
          <i className="fas fa-chevron-double-left" />
        </span>
        )
      }
      {pageButtons}
      {showRightExtreme
        && (
        <span className="paginator-right-ext" onClick={() => setPage(maxPages)}>
          <i className="fas fa-chevron-double-right" />
        </span>
        )
      }
    </div>
  );
};

export default Paginator;
