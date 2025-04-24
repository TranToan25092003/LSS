import { useState, useEffect } from "react"
import axios from "axios"

import ItemList from "../components/item/item-list"
import FilterBar from "../components/item/filter-bar"
import SearchBar from "../components/item/search-bar"
import Pagination from "../components/item/pagination"

export default function ListItemsPage() {
  const [pageSize, setPageSize] = useState(0)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

   

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    priceRange: [0, 1000000000],
    rate: "",
    isFree: false,
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        const params = {}

        if (filters.search) params.search = filters.search
        if (filters.category) params.category = filters.category
        if (filters.status) params.status = filters.status
        if (filters.rate) params.rate = filters.rate
        if (filters.isFree) params.isFree = true

        params.minPrice = filters.priceRange[0]
        params.maxPrice = filters.priceRange[1]

        if (filters.sortBy) {
          if (filters.sortBy === "price-asc") {
            params.sortBy = "price"
            params.sortOrder = "asc"
          } else if (filters.sortBy === "price-desc") {
            params.sortBy = "price"
            params.sortOrder = "desc"
          } else {
            params.sortBy = filters.sortBy
            params.sortOrder = filters.sortOrder
          }
        }

        const response = await axios.get("http://localhost:3000/items", {
          params: {
            ...params,
            page: currentPage,
          },
        })
        

        let filteredItems = response.data.items

        
        setItems(filteredItems)
        setTotalItems(response.data.totalItems)
        setPageSize(response.data.limit)
      } catch (error) {
        console.error("Error fetching items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [filters, currentPage])

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setCurrentPage(1)
  }



  const onChangePage = (page) => {
    setCurrentPage(page)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">List Items</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <SearchBar 
      search={filters.search}
      onSearchChange={(value) => handleFilterChange({ search: value })}
      />

        <div className="text-sm text-gray-500">{totalItems} items found</div>
      </div>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No items found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <>
          <ItemList items={items} />
          <div className="mt-12">
          <Pagination 
            total={totalItems}
            currentPage={currentPage}
            onChange={onChangePage}
            pageSize={pageSize}
            align="center"

          />
          </div>
        </>
      )}
    </main>
  )
}