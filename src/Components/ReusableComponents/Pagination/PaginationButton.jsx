"use client"
import "./PaginationButton.css"
import { useLocation } from "react-router-dom"

const PaginationButtons = ({
  filteredQuestions,
  rowsPerPage,
  currentPage,
  loadMore,
  fullView,
  fullViewMode
}) => {
  const location = useLocation()
  const totalItems = filteredQuestions?.length || 0
  const hasMoreData = rowsPerPage < totalItems

  if (totalItems === 0) return null

  // Only show Full View button on these pages
  const showFullViewButton = location.pathname.includes("/movetest") || location.pathname.includes("/add")

  return (
    <div className="pagination-buttons mt-4 d-flex justify-content-center gap-3">
      {hasMoreData && !fullViewMode && (
        <button className="load-more-button2" onClick={loadMore}>
          Load More
        </button>
      )}

      {showFullViewButton && (
        <button
          className={`view-toggle-button full-view-button ${fullViewMode ? 'active' : ''}`}
          onClick={fullView}
        >
          {fullViewMode ? "Collapse View" : "Full View"}
        </button>
      )}
    </div>
  )
}

export default PaginationButtons
