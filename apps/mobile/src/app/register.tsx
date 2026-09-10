import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import { useSignup } from "@moimi/core/hooks/useAuthQuery";
import { colleges } from "@moimi/core/constants/departments";
import { MESSAGES, REGISTER_TEXT } from "@moimi/core/constants/messages";
import { ROUTES } from "@moimi/core/constants/routes";
import SelectField from "@/components/SelectField";

export default function RegisterScreen() {
  const { mutate: signupMutate, isPending: isSignupPending } = useSignup();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCheckPasswordVisible, setIsCheckPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasCheckPassword = checkPassword.length > 0;
  const isPasswordMatched = password === checkPassword;
  const currentCollege = colleges.find((item) => item.id === college);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 2000);
  };

  const isEmpty = (v: string) => v.trim() === "";
  const hasEmptyField = () =>
    [username, password, checkPassword, email, name, college, department].some(
      isEmpty
    );

  const handleSubmit = () => {
    if (isSignupPending) return;

    if (hasEmptyField()) {
      showError(MESSAGES.REGISTER.EMPTY_FIELD);
      return;
    }
    if (password !== checkPassword) {
      showError(MESSAGES.REGISTER.PASSWORD_MISMATCH);
      return;
    }

    signupMutate(
      {
        username: username.trim(),
        password,
        email: email.trim(),
        name: name.trim(),
        department,
        imageKey: null,
      },
      {
        onSuccess: () => {
          router.replace(ROUTES.LOGIN as never);
        },
        onError: () => {
          showError(
            "이미 사용 중인 아이디 또는 이메일이거나 입력 정보가 올바르지 않습니다"
          );
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#F0F2F5]"
    >
      {errorMessage && (
        <View className="absolute left-0 right-0 top-32 z-50 items-center">
          <View className="rounded-full bg-[#2C2C2C] px-5 py-2">
            <Text className="text-sm font-semibold text-white">
              {errorMessage}
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        className="px-5 pt-8"
      >
        <View className="rounded-3xl border-[0.5px] border-[#D6DDE5] bg-white px-6 pb-8 pt-6">
          <View className="mb-2 mt-2 flex-row items-center justify-center">
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              className="absolute left-0 h-8 w-8 items-center justify-center"
            >
              <ChevronLeft size={28} strokeWidth={2.5} color="#9c9c9c" />
            </Pressable>
            <Text className="text-[26px] font-bold text-[#2c2c2c]">
              {REGISTER_TEXT.TITLE}
            </Text>
          </View>

          {/* 아이디 */}
          <View className="mb-1 mt-6">
            <Text className="mx-1 mb-1 text-[14px] font-medium text-[#989898]">
              {REGISTER_TEXT.USERNAME_LABEL}
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder={REGISTER_TEXT.USERNAME_PLACEHOLDER}
              placeholderTextColor="#989898"
              autoCapitalize="none"
              className="mb-4 h-[53px] w-full rounded-full bg-[#F6F8FA] px-5 text-[15px] text-[#2C2C2C]"
            />
          </View>

          {/* 비번 */}
          <View className="mb-5">
            <Text className="mx-1 mb-1 text-[14px] font-medium text-[#989898]">
              {REGISTER_TEXT.PASSWORD_LABEL}
            </Text>
            <View className="relative justify-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={REGISTER_TEXT.PASSWORD_PLACEHOLDER}
                placeholderTextColor="#989898"
                secureTextEntry={!isPasswordVisible}
                className="h-[53px] w-full rounded-full bg-[#F6F8FA] pl-5 pr-14 text-[15px] text-[#2C2C2C]"
              />
              <Pressable
                onPress={() => setIsPasswordVisible((prev) => !prev)}
                className="absolute right-5 h-6 w-6 items-center justify-center"
                hitSlop={8}
              >
                {isPasswordVisible ? (
                  <Eye size={20} color="#989898" />
                ) : (
                  <EyeOff size={20} color="#989898" />
                )}
              </Pressable>
            </View>
          </View>

          {/* 비번 확인 */}
          <View className="mb-5">
            <Text className="mx-1 mb-1 text-[14px] font-medium text-[#989898]">
              {REGISTER_TEXT.CHECK_PASSWORD_LABEL}
            </Text>
            <View className="relative justify-center">
              <TextInput
                value={checkPassword}
                onChangeText={setCheckPassword}
                placeholder={REGISTER_TEXT.CHECK_PASSWORD_PLACEHOLDER}
                placeholderTextColor="#989898"
                secureTextEntry={!isCheckPasswordVisible}
                className="h-[53px] w-full rounded-full bg-[#F6F8FA] pl-5 pr-14 text-[15px] text-[#2C2C2C]"
              />
              <Pressable
                onPress={() => setIsCheckPasswordVisible((prev) => !prev)}
                className="absolute right-5 h-6 w-6 items-center justify-center"
                hitSlop={8}
              >
                {isCheckPasswordVisible ? (
                  <Eye size={20} color="#989898" />
                ) : (
                  <EyeOff size={20} color="#989898" />
                )}
              </Pressable>
            </View>

            {hasCheckPassword && (
              <View className="mx-1 mt-2 flex-row items-center">
                <View
                  className={`mr-2 h-5 w-5 items-center justify-center rounded-full ${
                    isPasswordMatched ? "bg-[#E8F7F0]" : "bg-[#FDECEC]"
                  }`}
                >
                  <Text
                    className={`text-[12px] font-bold ${
                      isPasswordMatched ? "text-[#22A06B]" : "text-[#E22222]"
                    }`}
                  >
                    {isPasswordMatched ? "✓" : "!"}
                  </Text>
                </View>
                <Text
                  className={`text-[14px] font-medium ${
                    isPasswordMatched ? "text-[#22A06B]" : "text-[#E22222]"
                  }`}
                >
                  {isPasswordMatched
                    ? "비밀번호가 일치해요"
                    : "비밀번호가 일치하지 않아요"}
                </Text>
              </View>
            )}
          </View>
          {/* 이름 */}
          <View className="mb-1">
            <Text className="mx-1 mb-1 text-[14px] font-medium text-[#989898]">
              {REGISTER_TEXT.NAME_LABEL}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={REGISTER_TEXT.NAME_PLACEHOLDER}
              placeholderTextColor="#989898"
              className="mb-4 h-[53px] w-full rounded-full bg-[#F6F8FA] px-5 text-[15px] text-[#2C2C2C]"
            />
          </View>
          {/* 이메일 */}
          <View className="mb-1">
            <Text className="mx-1 mb-1 text-[14px] font-medium text-[#989898]">
              {REGISTER_TEXT.EMAIL_LABEL}
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={REGISTER_TEXT.EMAIL_PLACEHOLDER}
              placeholderTextColor="#989898"
              autoCapitalize="none"
              keyboardType="email-address"
              className="mb-4 h-[53px] w-full rounded-full bg-[#F6F8FA] px-5 text-[15px] text-[#2C2C2C]"
            />
          </View>

          <View className="mb-5">
            <Text className="mx-1 mb-1 text-[14px] font-medium text-[#989898]">
              학과
            </Text>

            <View className="mb-2">
              <SelectField
                value={college}
                onChange={(value) => {
                  setCollege(value);
                  setDepartment("");
                }}
                options={colleges.map((c) => ({ label: c.name, value: c.id }))}
                placeholder="단과대 선택"
              />
            </View>

            <SelectField
              value={department}
              onChange={setDepartment}
              options={
                currentCollege?.departments.map((d) => ({
                  label: d.note ? `${d.name} ${d.note}` : d.name,
                  value: d.value,
                })) ?? []
              }
              placeholder="학과 선택"
              disabled={!college}
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={isSignupPending}
            className={`mt-4 items-center self-center rounded-xl px-14 h-[45px] justify-center transition-transform duration-150 ease-out active:scale-90 ${
              isSignupPending ? "bg-[#B0B8C1]" : "bg-[#5E92F0]"
            }`}
          >
            <View className="flex-row items-center">
              <Text className="text-[17px] font-bold text-white">
                {REGISTER_TEXT.REGISTER_BUTTON}
              </Text>
              {isSignupPending && (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
