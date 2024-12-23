"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skull } from "lucide-react";

const API_URL = "https://uo73p5ji61.execute-api.us-east-1.amazonaws.com/Prod";

const Counter = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");

    if (action === "increment") {
      incrementCount();
    } else {
      fetchCount();
    }
  }, []);

  const fetchCount = async () => {
    try {
      const response = await fetch(`${API_URL}/kill-counter`);
      const data = await response.json();
      setCount(data.count);
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  };

  const incrementCount = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/kill-counter/increment`, { method: "POST" });
      await fetchCount();
    } catch (error) {
      console.error("Error incrementing count:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Skull className={loading ? "animate-pulse" : ""} size={32} />
            <span className="text-4xl font-bold">{count}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Counter;
