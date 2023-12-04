import React from "react";
import Logo1 from "./assets/logo.png";
import Logo2 from "./assets/Logo 2_6 dec.png";
import axios from "axios";
type Props = {
  image: string;
};

const Form: React.FC<Props> = ({ image }) => {
  const [details, setDetails] = React.useState({
    name: "",
    phone_number: "",
    email: "",
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://sketch-api.gokapturehub.com/create-user",
        {
          ...details,
          image,
        }
      );
      const { data } = response;
      window.location.reload();
      alert("Your sketch has been submitted successfully");
    } catch (e: any) {
      alert(`Something went wrong, ${e.response.data.message}`);
    }
  };
  if (loading)
    return (
      <div className="w-screen h-screen flex justify-center items-center flex-col space-y-4">
        <img src={Logo1} alt="logo" className="h-36" />
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col space-y-2">
      <img src={Logo1} alt="logo" className="h-20" />
      <form
        className="w-96 p-6 bg-white shadow-md rounded-lg justify-center items-center"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Enter Your Details
        </h2>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            onChange={(e) => {
              setDetails({ ...details, name: e.target.value });
            }}
            id="name"
            className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="whatsapp" className="block mb-1 font-medium">
            Whatsapp Number
          </label>
          <input
            onChange={(e) => {
              setDetails({ ...details, phone_number: e.target.value });
            }}
            id="whatsapp"
            className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Enter your WhatsApp number"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            onChange={(e) => {
              setDetails({ ...details, email: e.target.value });
            }}
            id="email"
            className="border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
            type="email"
            placeholder="Enter your email"
          />
        </div>
        <button className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300 w-full">
          Submit
        </button>
      </form>
      <div
        onClick={()=>{
          window.location.reload()
        }}
        className="text-white bg-black rounded-full text-xl cursor-pointer px-4 py-2 font-semibold shadow-sm"
      >
        Retry
      </div>
      <img src={Logo2} alt="logo" className="h-28 w-auto" />
    </div>
  );
};

export default Form;
