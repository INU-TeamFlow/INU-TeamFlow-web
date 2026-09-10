// apps/mobile/src/components/ChatRoomAvatar.tsx
import { View, Text, Image } from "react-native";

type ChatRoomType = "TEAM" | "GROUP" | "DIRECT";

type ChatRoomAvatarProps = {
  imageUrl?: string | null;
  memberProfileUrls?: string[] | null;
  roomName: string;
  chatRoomType: ChatRoomType;
  size?: number; // 기본 48 (웹의 h-12/w-12 대응)
};

export default function ChatRoomAvatar({
  imageUrl,
  memberProfileUrls,
  roomName,
  chatRoomType,
  size = 48,
}: ChatRoomAvatarProps) {
  const isRound = chatRoomType === "DIRECT";
  const shapeStyle = {
    width: size,
    height: size,
    borderRadius: isRound ? size / 2 : size * 0.28, // rounded-full vs rounded-xl 대응
    overflow: "hidden" as const,
    backgroundColor: "#EDF1F5",
  };

  // 1) 단일 이미지
  if (imageUrl) {
    return (
      <View style={shapeStyle}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
    );
  }

  // 2) 멤버 프로필 2x2 그리드
  if (memberProfileUrls && memberProfileUrls.length > 0) {
    const tiles = memberProfileUrls.slice(0, 4);
    while (tiles.length < 4) tiles.push("");
    const half = size / 2;
    return (
      <View style={[shapeStyle, { flexDirection: "row", flexWrap: "wrap" }]}>
        {tiles.map((url, i) => (
          <View
            key={i}
            style={{ width: half, height: half, backgroundColor: "#D6DDE5" }}
          >
            {url ? (
              <Image
                source={{ uri: url }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : null}
          </View>
        ))}
      </View>
    );
  }

  // 3) 이니셜 폴백
  return (
    <View
      style={[
        shapeStyle,
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#D6DDE5",
        },
      ]}
    >
      <Text
        style={{ color: "#3F4852", fontWeight: "700", fontSize: size * 0.4 }}
      >
        {roomName?.charAt(0) ?? "?"}
      </Text>
    </View>
  );
}
