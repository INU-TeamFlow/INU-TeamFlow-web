import { router } from "expo-router";
import InfoPostForm from "@/components/InfoPostForm";
import { useCreateInfoPost } from "@moimi/core/hooks/useInfoPostQuery"; // TODO: 실제 export명 확인 필요

export default function InfoPostCreateScreen() {
  const createInfoPost = useCreateInfoPost();

  return (
    <InfoPostForm
      mode="create"
      onSubmit={async (form) => {
        const created = await createInfoPost.mutateAsync(form);
        router.replace(`/infoPost/${created.infoPostId}`);
      }}
    />
  );
}
