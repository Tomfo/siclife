
import ListMembers from "./list-members";
import { HydrationBoundary, QueryClient ,dehydrate} from "@tanstack/react-query";
import { fetchMembers } from "@/helpers/api-request";

export default async function RegisterPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getmembers"],
    queryFn: fetchMembers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListMembers />
    </HydrationBoundary>
  );
}