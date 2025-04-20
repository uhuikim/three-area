import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/types/layout';

const CURRENT_USER_ID = 'user456'; // 로그인 상태에서 가져와야 함

const fetchUserLayouts = async (): Promise<Layout[]> => {
  const response = await fetch(`/api/layouts?userId=${CURRENT_USER_ID}`);

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
  return response.json();
};

export const useGetUserLayouts = () => {
  const { data, isLoading, isError, isFetching, error, refetch } = useQuery({
    queryKey: ['layouts', CURRENT_USER_ID],
    queryFn: fetchUserLayouts,
  });

  return {
    layouts: data || [],
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  };
};

export default useGetUserLayouts;
