"use client"

import { useState, useEffect } from "react"
import ItemList from "../components/item/item-list"
import FilterBar from "../components/filter-bar"
import Pagination from "../components/pagination"
import { mockItems } from "../lib/mock-data"

export default function ListItemsPage() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    priceRange: [0, 1000000],
    rate: "",
    isFree: false,
  })

  const ITEMS_PER_PAGE = 8

  // Simulate fetching data from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/items')
        // const data = await response.json()

        // Using mock data for demonstration
        setTimeout(() => {
          setItems(mockItems)
          setFilteredItems(mockItems)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching items:", error)
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  // Apply filters when filters state changes
  useEffect(() => {
    if (items.length > 0) {
      let result = [...items]

      // Filter by category
      if (filters.category) {
        result = result.filter((item) => item.category === filters.category)
      }

      // Filter by status
      if (filters.status) {
        result = result.filter((item) => item.status === filters.status)
      }

      // Filter by price range
      result = result.filter((item) => item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1])

      // Filter by rate type
      if (filters.rate) {
        result = result.filter((item) => item.rate === filters.rate)
      }

      // Filter by free items
      if (filters.isFree) {
        result = result.filter((item) => item.isFree)
      }

      setFilteredItems(result)
      setCurrentPage(1) // Reset to first page when filters change
    }
  }, [filters, items])

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  // Calculate pagination
  const totalItems = filteredItems.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = filteredItems.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Items</h1>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <ItemList items={currentItems} />

          {totalItems > 0 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </main>
  )
}
