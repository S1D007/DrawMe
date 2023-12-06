import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Logo1 from "./assets/logo.png";

const socket = io("https://sketch-api.gokapturehub.com", {
  transports: ["websocket"],
});

type Data = {
  name: string;
  image: string;
  email: string;
  phone_number: string;
};

const Live = () => {
  const [data, setData] = useState<Data[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollInterval, setScrollInterval] = useState<any | null>(null);

  useEffect(() => {
    socket.on("result", (newData) => {
      setData((prev) => [...prev, newData]);
    });
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "https://sketch-api.gokapturehub.com/users"
        );
        const { data } = response;
        setData(data);
        startAutoScroll();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  const startAutoScroll = () => {
    if (!scrollInterval && containerRef.current) {
      const container = containerRef.current;
      const interval = setInterval(() => {
        container.scrollLeft += 2; // Adjust scroll speed as needed
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
      }, 20); // Adjust scroll speed as needed

      setScrollInterval(interval);
    }
  };

  const stopAutoScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  };

  return (
    <div className="w-screen h-full p-2" onMouseEnter={stopAutoScroll} onMouseLeave={startAutoScroll}>
      <img src={Logo1} alt="logo" className="h-14" />
      <div
        className="w-full flex gap-4 p-2 overflow-hidden h-full"
        ref={containerRef}
        style={{ whiteSpace: "nowrap" }}
      >
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center min-w-[250px]">
            <img
              src={item.image}
              alt={item.name}
              className="h-96 object-cover"
            />
            <p className="text-center mt-2">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Live;
