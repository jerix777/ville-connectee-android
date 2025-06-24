
import { useState, useEffect } from "react";
import { usePagination } from "./usePagination";

interface UsePageDataProps<T> {
  queryFn: () => Promise<T[]>;
  itemsPerPage?: number;
  searchFields?: (keyof T)[];
}

export function usePageData<T>({ 
  queryFn, 
  itemsPerPage = 6,
  searchFields = []
}: UsePageDataProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await queryFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    return searchFields.some(field => {
      const value = item[field];
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  const pagination = usePagination({
    data: filteredData,
    itemsPerPage,
  });

  useEffect(() => {
    loadData();
  }, []);

  return {
    data: filteredData,
    paginatedData: pagination.paginatedData,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh: loadData,
    pagination,
  };
}
