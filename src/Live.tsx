import React, { useEffect } from "react";
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
    const [data, setData] = React.useState<Data[]>([]);
    useEffect(() => {
        socket.on("result", (data) => {
            setData((prev) => [...prev, data]);
        });
    }, []);
    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(
                "https://sketch-api.gokapturehub.com/users"
            );
            const { data } = response;
            setData(data);
        };
        getData();
    }, []);

    return (
        <div className="w-screen h-full p-2">
            <img src={Logo1} alt="logo" className="h-14" />
            <div className="flex flex-wrap flex-row gap-4 p-2">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-60 object-cover"
                        />
                        <p className="text-center mt-2">{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Live;
