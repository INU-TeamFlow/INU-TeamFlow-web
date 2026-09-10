import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ChevronRight, Plus } from "lucide-react-native";
import { useMyTeams } from "@moimi/core/hooks/team/useTeamQuery";
import { LinearGradient } from "expo-linear-gradient";
import {
  categoryMap,
  categoryColorMap,
  categoryFilterOptions,
} from "@moimi/core/constants/category";
import { darkenColor } from "@/utils/color/darkenColor";

export default function TeamScreen() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { data: teams = [], isLoading } = useMyTeams();

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const tabLayouts = useRef<Record<string, { x: number; width: number }>>({});

  const handleTabLayout = (value: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    tabLayouts.current[value] = { x, width };
    if (value === selectedCategory && indicatorWidth.value === 0) {
      indicatorX.value = x;
      indicatorWidth.value = width;
    }
  };

  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
    const layout = tabLayouts.current[value];
    if (layout) {
      const springConfig = {
        damping: 30,
        stiffness: 450,
        mass: 1,
      };
      indicatorX.value = withSpring(layout.x, springConfig);
      indicatorWidth.value = withSpring(layout.width, springConfig);
    }
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    left: indicatorX.value,
    width: indicatorWidth.value,
  }));

  const filteredTeams = teams.filter((team) => {
    if (selectedCategory === "ALL") return true;
    return team.category === selectedCategory;
  });

  return (
    <View
      className="flex-1 bg-[#F0F2F5]"
      style={{ paddingTop: 76, paddingRight: 10, paddingLeft: 10 }}
    >
      <View className="mb-3 flex-row items-center justify-between px-2">
        <Text className="text-[22px] font-bold text-[#2C2C2C]">
          나의 팀 목록
        </Text>
        <Pressable
          onPress={() => {
            // TODO 2단계: 학교 인증 가드 + /team/create 이동
            console.log("create team");
          }}
          className="flex-row items-center gap-1.5 rounded-lg bg-[#5E92F0] py-3 pr-4 pl-3.5 transition-transform duration-150 ease-out active:scale-90"
        >
          <Plus size={16} strokeWidth={2.5} color="#fff" />
          <Text className="text-[14px] font-semibold text-white">
            팀 생성하기
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 rounded-t-2xl border-[0.8px] border-b-0 border-[#D6DDE5] bg-white px-4 pb-20 pt-4">
        <View className="relative">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="border-b-[0.5px] border-[#D6DDE5]"
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {categoryFilterOptions.map((category) => {
              const isActive = selectedCategory === category.value;
              return (
                <Pressable
                  key={category.value}
                  onLayout={handleTabLayout(category.value)}
                  onPress={() => handleSelectCategory(category.value)}
                  className="items-center px-5 pb-5 pt-1"
                >
                  <Text
                    className={`text-[16px] font-bold ${
                      isActive ? "text-[#5E92F0]" : "text-[#CBD2DA]"
                    }`}
                  >
                    {category.label}
                  </Text>
                </Pressable>
              );
            })}

            <Animated.View
              className="absolute bottom-0 h-0.5 bg-[#5E92F0]"
              style={indicatorStyle}
            />
          </ScrollView>

          <LinearGradient
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            pointerEvents="none"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 32,
            }}
          />
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        >
          {isLoading ? (
            <Text className="py-10 text-center text-[13px] text-[#9C9C9C]">
              불러오는 중...
            </Text>
          ) : filteredTeams.length === 0 ? (
            <View className="items-center gap-2 py-16">
              <Text className="text-[13px] text-[#9C9C9C]">
                아직 함께하는 팀이 없어요
              </Text>
              <Text className="text-[13px] text-[#9C9C9C]">
                지금 모집 중인 팀을 모집 게시판에서 확인해보세요
              </Text>
            </View>
          ) : (
            filteredTeams.map((team) => (
              <Pressable
                key={team.teamId}
                onPress={() => {
                  // TODO 2단계: /team/[id] 상세 화면 연결
                  console.log("team", team.teamId);
                }}
                className="mb-4 overflow-hidden rounded-2xl bg-[#F6F8FA] transition-transform duration-150 ease-out active:scale-95"
              >
                <View
                  className="h-12"
                  style={{ backgroundColor: categoryColorMap[team.category] }}
                />
                <View className="px-5 py-5">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-[17px] font-bold text-[#2C2C2C]">
                      {team.name}
                    </Text>
                    <ChevronRight size={20} strokeWidth={2.5} color="#2C2C2C" />
                  </View>

                  <Text
                    numberOfLines={1}
                    className="mb-4 text-[13px] text-[#989898]"
                  >
                    {team.description}
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <View
                      className="rounded-full px-3 py-2"
                      style={{
                        backgroundColor: categoryColorMap[team.category],
                      }}
                    >
                      <Text
                        className="text-[11px] font-semibold"
                        style={{
                          color: darkenColor(
                            categoryColorMap[team.category],
                            140
                          ),
                        }}
                      >
                        {categoryMap[team.category]}
                      </Text>
                    </View>
                    <Text className="text-[11px] text-[#b0b0b0]">
                      {team.memberCount}명
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
