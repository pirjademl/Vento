"use client";

import { apiInstance } from "@/api/api";
import { useSelectedLayoutSegment } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useFetch = (url: string) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiInstance.get(url);
      const data = response.data;

      setData(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [url, fetchData]);
  return { data, isLoading, isError, refetch: fetchData };
};
