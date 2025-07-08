import { useState, useEffect } from 'react';
import { usePagination } from './usePagination';

interface UseDataManagementProps<T> {
  fetchData: () => Promise<T[]>;
  searchFields: (keyof T)[];
  itemsPerPage?: number;
  enableRealTimeRefresh?: boolean;
}

export function useDataManagement<T extends { id: string }>({
  fetchData,
  searchFields,
  itemsPerPage = 6,
  enableRealTimeRefresh = false
}: UseDataManagementProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("liste");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const refresh = async () => {
    setLoading(true);
    try {
      const newData = await fetchData();
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!enableRealTimeRefresh) return;
    
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [enableRealTimeRefresh]);

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    
    return searchFields.some(field => {
      const value = item[field];
      return value && 
        typeof value === 'string' && 
        value.toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  const pagination = usePagination({
    data: filteredData,
    itemsPerPage,
  });

  return {
    data,
    filteredData,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    refresh,
    pagination,
    hasData: filteredData.length > 0,
    isEmpty: !loading && data.length === 0,
    isFiltered: !loading && searchQuery && filteredData.length === 0
  };
}