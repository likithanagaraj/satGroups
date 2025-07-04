import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import TransactionCard from "@/components/home/transcation-card";
import { theme } from "@/infrastructure/themes";
import axiosInstance from "@/utils/axions-instance";
import { width } from "react-native-responsive-sizes";
import { useAuth } from "@/utils/auth-context";
import { t } from "i18next";
import { SkeletonLoader } from "../skeleton/home/home-skeleton";
import Title from "../general/title";
import { useFocusEffect } from "expo-router";

// Define the transaction type
interface Transaction {
  points: string;
  type: string; // "Received" or "Redeemed"
  referred_date: string;
  branch: string;
}

export default function RecentTransactionTabs() {
  const [activeTab, setActiveTab] = useState("Received");
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const { token, driverId } = useAuth();
const fetchTransactions = async () => {
      try {
        setLoading(true);

        const driver_id = driverId;
        const usertoken = token;

        const response = await axiosInstance.post(
          "/driver-points.php",
          {
            driver_id,
            take: 20,
            skip: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );

        // console.log("API Response:", response.data);

        if (response.data.status === "success") {
          setTransactionsData(response.data.transactions || []);
          setTotalPoints(response.data.total_points || 0);
        } else {
          console.error("API returned error:", response.data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    
    fetchTransactions();
  }, []);

   useFocusEffect(
    React.useCallback(() => {
      fetchTransactions(); // Automatically refetch on tab focus
    }, [])
  );


  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    if (!transactionsData || transactionsData.length === 0) {
      return [];
    }

    switch (activeTab) {
      case "Received":
        return transactionsData.filter(
          (transaction) => transaction.type === "Received"
        );
      case "Spent":
        return transactionsData.filter(
          (transaction) =>
            transaction.type === "Redeemed" ||
            parseFloat(transaction.points) < 0
        );
      case "All":
        return transactionsData;
      default:
        return [];
    }
  };

  const EachTransactionCard = ({ item }: { item: Transaction }) => {
    // Format the date from "YYYY-MM-DD" to a more readable format
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
      });
    };

    // Determine if it's a positive or negative transaction
    const isPositive = parseFloat(item.points) >= 0;
    const pointsDisplay = isPositive ? `+${item.points}` : item.points;

    return (
      <TransactionCard
        companyName={item.branch} //
        date={formatDate(item.referred_date)}
        points={pointsDisplay}
        transactionType={item.type}
      />
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No transactions found</Text>
    </View>
  );

  const filteredTransactions = getFilteredTransactions();
  const deviceWidth = Dimensions.get("window").width;
  const tabWidth = (deviceWidth * 0.9 - 16) / 3; // Calculate based on container width, accounting for padding and gaps

  return (
    <View style={{ width: width(90), alignItems: "flex-start", gap: 10 }}>
      <Title>{t("Recent_Transcation")}</Title>
      <View style={styles.container}>
        <View style={styles.tabsList}>
          <TouchableOpacity
            style={[
              styles.tabsTrigger,
              { width: tabWidth },
              activeTab === "Received" && styles.activeTabsTrigger,
            ]}
            onPress={() => setActiveTab("Received")}
          >
            <Text
              style={[
                styles.tabsTriggerText,
                activeTab === "Received" && styles.activeTabsTriggerText,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {t("Received")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabsTrigger,
              { width: tabWidth },
              activeTab === "Spent" && styles.activeTabsTrigger,
            ]}
            onPress={() => setActiveTab("Spent")}
          >
            <Text
              style={[
                styles.tabsTriggerText,
                activeTab === "Spent" && styles.activeTabsTriggerText,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {t("Spent")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabsTrigger,
              { width: tabWidth },
              activeTab === "All" && styles.activeTabsTrigger,
            ]}
            onPress={() => setActiveTab("All")}
          >
            <Text
              style={[
                styles.tabsTriggerText,
                activeTab === "All" && styles.activeTabsTriggerText,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {t("All")}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          keyboardShouldPersistTaps="handled"
          data={loading ? [] : [...filteredTransactions]}
          renderItem={EachTransactionCard}
          keyExtractor={(item, index) => `transaction-${index}`}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            loading ? (
              <View style={{ width: width(90), gap: 15, marginTop: 10 }}>
                <SkeletonLoader width="100%" height={70} />
                <SkeletonLoader width="100%" height={70} />
                <SkeletonLoader width="100%" height={70} />
              </View>
            ) : (
              renderEmptyList()
            )
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width(90),
    alignItems: "center",
  },
  tabsList: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 9999,
    padding: 3,
    marginBottom: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  tabsTrigger: {
    paddingVertical: 5,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabsTrigger: {
    backgroundColor: "#36629A",
    shadowOpacity: 0,
  },
  tabsTriggerText: {
    fontSize: 12,
    color: "#666",
    fontFamily: theme.fontFamily.regular,
    textAlign: "center",
  },
  activeTabsTriggerText: {
    color: "#fff",
  },
  transactionsContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  separator: {
    height: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
    fontSize: 14,
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.regular,
    fontSize: 14,
    padding: 20,
  },
});
