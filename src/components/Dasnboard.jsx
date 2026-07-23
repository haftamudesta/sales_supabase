import { useEffect, useState } from "react";
import supabase from "../supabase-client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetchMetrics();

    // Create realtime subscription
    const channel = supabase
      .channel("deal-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales_deal",
        },
        (payload) => {
          console.log("Realtime change:", payload);

          // Refresh dashboard data
          fetchMetrics();
        },
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from("sales_deal")
        .select("name, value");

      if (error) {
        throw error;
      }

      const groupedData = Object.values(
        data.reduce((acc, deal) => {
          if (!acc[deal.name]) {
            acc[deal.name] = {
              name: deal.name,
              total: 0,
            };
          }

          acc[deal.name].total += Number(deal.value);

          return acc;
        }, {}),
      );

      setMetrics(groupedData);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h1>Real-Time Sales Dashboard</h1>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="total" name="Total Sales" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
