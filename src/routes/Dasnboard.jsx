import { useCallback, useEffect, useState } from "react";
import supabase from "../supabase-client";
import { Form } from "../components/Form";

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
  const [deals, setDeals] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("sales_deal")
        .select("id, name, value")
        .order("id", { ascending: true });

      if (error) throw error;

      setDeals(data);

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
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("dashboard-sales")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales_deal",
        },
        () => {
          fetchData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Real-Time Sales Dashboard</h1>

      <div style={{ width: "100%", height: 400 }}>
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

      <Form deals={deals} />
    </div>
  );
};
