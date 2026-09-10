// apps/mobile/src/app/(tabs)/mypage.tsx
import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Check,
  Pen,
  ChevronRight,
  LogOut,
  SquarePen,
  Vote,
  UserRoundPlus,
  Bookmark,
  MessageCircleQuestion,
} from "lucide-react-native";
import { colleges } from "@moimi/core/constants/departments";
import {
  useMyProfile,
  useUpdateMyProfile,
} from "@moimi/core/hooks/useUserQuery";
import SelectField from "@/components/SelectField";

const DEFAULT_PROFILE_IMAGE = require("@/assets/images/default-profile.png");

const menuItems = [
  { icon: SquarePen, title: "내가 작성한 글", path: "/mypage/mypost" },
  { icon: Vote, title: "내 투표", path: "/mypage/votes" },
  { icon: UserRoundPlus, title: "초대 이력", path: "/mypage/invitations" },
  { icon: Bookmark, title: "스크랩", path: "/mypage/scraps" },
  { icon: MessageCircleQuestion, title: "문의하기", path: "/mypage/inquiry" },
];

const departmentOptions = colleges.flatMap((college) =>
  college.departments.map((department) => ({
    label: `${college.name} · ${department.name}`,
    value: department.value,
  }))
);

export default function MyPageScreen() {
  const router = useRouter();
  const { data: profileData, isError } = useMyProfile();
  const { mutate: updateMyProfileMutate, isPending: isUpdatePending } =
    useUpdateMyProfile();

  const [modify, setModify] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const currentCollege = colleges.find((college) =>
    college.departments.some(
      (department) => department.value === profileData?.department
    )
  );

  const startModify = () => {
    if (!profileData) return;
    setEditName(profileData.name);
    setEditEmail(profileData.email);
    setEditDepartment(profileData.department);
    setPassword("");
    setCheckPassword("");
    setModify(true);
  };

  const saveModify = () => {
    if (!profileData) return;

    if (password || checkPassword) {
      if (password !== checkPassword) {
        // TODO: 토스트 컴포넌트로 교체
        console.log("새 비밀번호를 확인해주세요");
        return;
      }
    }

    if (!editName.trim() || !editEmail.trim() || !editDepartment) {
      console.log("이름, 이메일, 학과를 모두 입력해주세요");
      return;
    }

    updateMyProfileMutate(
      {
        email: editEmail.trim(),
        name: editName.trim(),
        department: editDepartment,
        ...(password ? { password } : {}),
      },
      {
        onSuccess: () => setModify(false),
        onError: () => console.log("프로필 수정에 실패했습니다"),
      }
    );
  };

  const logout = async () => {
    // TODO: 기존 토큰 삭제 로직(AsyncStorage/SecureStore)으로 교체
    router.replace("/login");
  };

  if (isError || !profileData) return null;

  return (
    <View className="flex-1 bg-[#F0F2F5]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 76,
          paddingBottom: 120,
          paddingHorizontal: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <View className="relative rounded-3xl border-[0.5px] border-[#D6DDE5] bg-white p-6">
          {!modify && (
            <Pressable
              onPress={startModify}
              className="absolute right-4 top-4 z-10 h-9 w-9 items-center justify-center rounded-full bg-[#EEF1F5] active:scale-90"
            >
              <Pen size={14} strokeWidth={2.5} color="#989898" />
            </Pressable>
          )}

          <View className="items-center mt-4 mb-4">
            <View className="relative h-36 w-36">
              <Image
                source={
                  modify
                    ? DEFAULT_PROFILE_IMAGE
                    : profileData.imageUrl
                    ? { uri: profileData.imageUrl }
                    : DEFAULT_PROFILE_IMAGE
                }
                className="h-full w-full rounded-full"
                resizeMode="cover"
              />
              {profileData.isSchoolVerified ? (
                <View className="absolute bottom-1 right-1 h-[34px] w-[34px] items-center justify-center rounded-full bg-[#A7ECA7]">
                  <Check size={19} strokeWidth={2.5} color="#2C6E2C" />
                </View>
              ) : (
                <Pressable
                  onPress={() =>
                    console.log("TODO: navigate /mypage/authentication")
                  }
                  className="absolute -right-4 bottom-1 rounded-full bg-[#E75A5A] px-3 py-1.5 active:scale-90"
                >
                  <Text className="text-[12px] font-medium text-white">
                    학교 인증
                  </Text>
                </Pressable>
              )}
            </View>

            {!modify && (
              <View className="items-center">
                <Text className="mt-6 text-[22px] font-bold text-[#2C2C2C]">
                  {profileData.name}
                </Text>
                <Text className="mt-1 text-[15px] text-[#989898]">
                  @{profileData.username}
                </Text>
                <Text className="mt-4 text-[14px] text-[#989898]">
                  {currentCollege?.name} ·{" "}
                  {
                    currentCollege?.departments.find(
                      (d) => d.value === profileData.department
                    )?.name
                  }
                </Text>
                {profileData.isSchoolVerified && (
                  <Text className="mt-1 text-[14px] text-[#989898]">
                    {profileData.studentNumber}
                  </Text>
                )}
              </View>
            )}
          </View>

          {modify && (
            <View className="mt-6">
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder="이름"
                className="mb-2 rounded-xl border border-[#D6DDE5]/60 bg-white px-2 py-4 pl-4 text-[#2C2C2C]"
              />
              <TextInput
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="이메일"
                autoCapitalize="none"
                className="mb-2 rounded-xl border border-[#D6DDE5]/60 bg-white px-2 py-4 pl-4 text-[#2C2C2C]"
              />
              <SelectField
                value={editDepartment}
                onChange={setEditDepartment}
                options={departmentOptions}
                placeholder="학과 선택"
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="새 비밀번호"
                secureTextEntry
                className="mb-2 mt-2 rounded-xl border border-[#D6DDE5]/60 bg-white px-2 py-4 pl-4 text-[#2C2C2C]"
              />
              <TextInput
                value={checkPassword}
                onChangeText={setCheckPassword}
                placeholder="새 비밀번호 확인"
                secureTextEntry
                className="mb-3 rounded-xl border border-[#D6DDE5]/60 bg-white px-2 py-4 pl-4 text-[#2C2C2C]"
              />
              <View className="flex-row gap-2">
                <Pressable
                  onPress={saveModify}
                  disabled={isUpdatePending}
                  className="flex-1 rounded-xl bg-[#5E92F0] py-3.5 active:scale-95"
                >
                  <Text className="text-center text-[15px] font-semibold text-white">
                    완료
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setModify(false)}
                  disabled={isUpdatePending}
                  className="flex-1 rounded-xl border border-[#D6DDE5]/60 bg-[#F6F8FA] py-3.5 active:scale-95"
                >
                  <Text className="text-center text-[15px] font-semibold text-[#2c2c2c]">
                    취소
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* MY 메뉴 */}
        <View className="mt-4 rounded-3xl border-[0.5px] border-[#D6DDE5] bg-white p-6">
          <Text className="text-[18px] font-bold text-[#2C2C2C]">MY</Text>
          <View className="mt-4 gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.title}
                  onPress={() => console.log("TODO: navigate", item.path)}
                  className="min-h-[64px] flex-row items-center gap-4 rounded-2xl bg-[#F6F8FA] px-5 active:scale-[0.98]"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                    <Icon size={18} strokeWidth={2} color="#5E92F0" />
                  </View>
                  <Text className="flex-1 text-[16px] font-medium text-[#2C2C2C]">
                    {item.title}
                  </Text>
                  <ChevronRight size={16} color="#B0B8C1" />
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 로그아웃 */}
        <View className="mt-4 flex-row justify-end">
          <Pressable
            onPress={logout}
            className="flex-row items-center gap-1.5 rounded-xl px-3 py-1 active:opacity-70"
          >
            <LogOut size={14} color="#2C2C2C99" />
            <Text className="text-[13px] font-medium text-[#2C2C2C]/60">
              로그아웃
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
