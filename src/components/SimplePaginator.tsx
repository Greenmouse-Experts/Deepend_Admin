interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  incrementPage: () => void;
  decrementPage: () => void;
  hasMore?: boolean;
}

export default function SimplePaginator({
  page,
  setPage,
  incrementPage,
  decrementPage,
  hasMore = true,
}: PaginationProps) {
  return (
    <div className="join grid grid-cols-3">
      <button
        className="join-item btn btn-accent"
        onClick={decrementPage}
        disabled={page === 1}
      >
        Previous
      </button>
      <button className="join-item btn btn-outline" disabled>
        Page {page}
      </button>
      <button
        className="join-item btn btn-accent"
        onClick={incrementPage}
        disabled={!hasMore}
      >
        Next
      </button>
    </div>
  );
}
