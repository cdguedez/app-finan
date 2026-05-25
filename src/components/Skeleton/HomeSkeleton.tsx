import { View, SafeAreaView } from "react-native";
import { StylesHomeScreen } from "../../screens/Auth/styles/HomeScreen.styles";
import Skeleton from "../../components/Skeleton/Skeleton";

const HomeSkeleton = () => (
  <View style={StylesHomeScreen.container}>
    <SafeAreaView style={StylesHomeScreen.content}>
      {/* Header Skeleton */}
      <View style={StylesHomeScreen.header}>
        <View style={StylesHomeScreen.headerLeft}>
          <Skeleton width={120} height={16} borderRadius={4} />
          <Skeleton
            width={180}
            height={28}
            borderRadius={6}
            style={{ marginTop: 8 }}
          />
        </View>
        <Skeleton width={44} height={44} borderRadius={12} />
      </View>

      {/* Balance Card Skeleton */}
      <Skeleton
        width="100%"
        height={160}
        borderRadius={24}
        style={{ marginBottom: 25 }}
      />

      {/* Stats Grid Skeleton */}
      <View style={StylesHomeScreen.statsGrid}>
        <Skeleton width="48%" height={100} borderRadius={20} />
        <Skeleton width="48%" height={100} borderRadius={20} />
      </View>

      {/* Section Header Skeleton */}
      <View style={[StylesHomeScreen.sectionHeader, { marginBottom: 15 }]}>
        <Skeleton width={150} height={20} borderRadius={4} />
        <Skeleton width={60} height={16} borderRadius={4} />
      </View>

      {/* Transactions List Skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Skeleton
            width={48}
            height={48}
            borderRadius={14}
            style={{ marginRight: 15 }}
          />
          <View style={{ flex: 1 }}>
            <Skeleton width="60%" height={16} borderRadius={4} />
            <Skeleton
              width="40%"
              height={12}
              borderRadius={4}
              style={{ marginTop: 6 }}
            />
          </View>
          <Skeleton width={70} height={18} borderRadius={4} />
        </View>
      ))}
    </SafeAreaView>
  </View>
);

export { HomeSkeleton };
