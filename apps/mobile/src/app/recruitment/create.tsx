import { router } from "expo-router";
import RecruitmentForm, {
  type RecruitmentFormData,
} from "@/components/RecruitmentForm";
import { useCreateRecruitment } from "@moimi/core/hooks/useRecruitmentQuery";

export default function RecruitmentCreateScreen() {
  const { mutateAsync: createRecruitment } = useCreateRecruitment();

  const handleSubmit = async (form: RecruitmentFormData) => {
    if (form.targetMemberCount === "") return;

    try {
      await createRecruitment({
        title: form.title,
        category: form.category,
        description: form.description,
        infoPostId: form.announcementId || undefined,
        teamId: form.teamId || undefined,
        targetMemberCount: form.targetMemberCount,
        endAt: form.endAt,
      });

      router.replace("/recruitment");
    } catch (err) {
      console.log("모집글 생성 실패", err);
    }
  };

  return <RecruitmentForm mode="create" onSubmit={handleSubmit} />;
}
