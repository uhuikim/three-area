import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/types/layout";

const fetchLayoutById = async (layoutId: string): Promise<Layout> => {
  const response = await fetch(`/api/layouts?layoutId=${layoutId}`);
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
  return response.json();
};

export const useGetLayoutById = (layoutId: string | null) => {
  const { data, isLoading, isError, isFetching, error, refetch } = useQuery({
    queryKey: ["layout", layoutId],
    queryFn: () => (layoutId ? fetchLayoutById(layoutId) : null),
    enabled: !!layoutId,
  });

  return {
    layout: data,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  };
};

export default useGetLayoutById;
