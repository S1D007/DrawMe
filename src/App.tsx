import React, { useRef } from "react";
import Camera from "./components/Camera";
import Webcam from "react-webcam";
import axios from "axios";
import Logo1 from "./assets/logo.png";
import Form from "./Form";
import Live from "./Live";
const App = () => {
  const [facingMode, setFacingMode] = React.useState<"user" | "environment">(
    "user"
  );
  const [captureImage, setCaptureImage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [live, setLive] = React.useState<boolean>(false); // eslint-disable-line
  const [sketchImageGenerated, setSketchImageGenerated] =
    React.useState<boolean>(false); // eslint-disable-line
  const cameraRef = useRef<Webcam>(null);

  const capture = React.useCallback(() => {
    const imageSrc = cameraRef.current?.getScreenshot();
    setCaptureImage(imageSrc);
  }, [cameraRef]);

  const reset = React.useCallback(() => {
    setCaptureImage(null);
    setSketchImageGenerated(false);
  }, [setCaptureImage]);

  const applyFiltersAndSketch = async () => {
    if (captureImage) {
      setLoading(true);
      // Convert base64 image to Blob
      const base64Parts = captureImage.split(",");
      const contentType = base64Parts[0].split(";")[0].split(":")[1];
      const byteCharacters = atob(base64Parts[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });

      // Create a File object from the Blob
      const file = new File([blob], "image.jpeg", { type: contentType });

      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        "https://api-sketch.gokapturehub.com/pencil_sketch?blur_simga=10",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            blur_simga: 25,
          },
        }
      );
      const { data } = response;
      const { processed_image_url } = data;
      setCaptureImage(processed_image_url);
      setLoading(false);
      setSketchImageGenerated(true);
    }
  };

  const [downloadImageButtonClicked, setDownloadImageButtonClicked] =
    React.useState<boolean>(false);

  const downloadSketch = async () => {
    if (captureImage) {
      // add the functionality to download the sketch//
      const response = await axios.get(captureImage, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sketch.jpeg";
      link.click();
      URL.revokeObjectURL(url);
    }
  };
  // if the url includes live then render the live component
  // console.log(window.location.href)
  if (live) {
    return <Live />;
  }

  if (downloadImageButtonClicked) {
    return <Form image={captureImage} />;
  }

  if (loading)
    return (
      <div className="w-screen h-screen flex justify-center items-center flex-col space-y-4">
        <img src={Logo1} alt="logo" className="h-16" />
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  const aspR = () => {
    // check whether the device is IPad or not and it is set to potrait mode and similarly with desktop
    const isIPad = navigator.userAgent.match(/iPad/i) != null;
    const isDesktop = window.innerWidth > 1024;
    const isIphone = navigator.userAgent.match(/iPhone/i) != null;
    const isPotrait = window.innerHeight > window.innerWidth;
    if (isIPad) {
      return 16 / 9;
    } else if (isDesktop) {
      return 9 / 16;
    } else if (isIphone && isPotrait) {
      return 16 / 9;
    } else {
      return 16 / 9;
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center flex-col items-center space-y-4">
      <img src={Logo1} alt="logo" className="h-14" />
      {captureImage ? (
        <img
          src={captureImage}
          alt="capture"
          className="max-h-[600px] rounded-xl shadow-2xl"
        />
      ) : (
        <Camera
          cameraRef={cameraRef}
          facingMode={facingMode}
          aspcectRatio={aspR()}
        />
      )}

      {!captureImage && !loading ? (
        <>
          <div className="flex justify-center items-center flex-row space-x-5 w-full">
            <div
              onClick={() => {
                setLive(true);
              }}
              className="text-white bg-black rounded-full text-xl cursor-pointer px-4 py-2 font-semibold shadow-sm"
            >
              Live
            </div>
            <div
              onClick={capture}
              className="text-white bg-black rounded-full text-xl cursor-pointer px-4 py-2 font-semibold shadow-sm"
            >
              Capture
            </div>
            {/* for live button */}
          </div>
          <div className="flex justify-center items-center gap-1 flex-col">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const dataURL = e.target?.result;
                    setCaptureImage(dataURL as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
              id="imageUploadInput"
            />
            <label
              htmlFor="imageUploadInput"
              className="mt-4 py-2 px-4 bg-gray-700 text-white rounded-3xl text-xl font-semibold relative overflow-hidden cursor-pointer"
            >
              Upload Image
            </label>
            <div className="flex justify-center items-center flex-row gap-5">
              <button
                className="mt-4 py-2 px-4 bg-gray-700 text-white rounded-3xl text-xl font-semibold relative overflow-hidden"
                onClick={() => {
                  setFacingMode((prev)=> prev === "user" ? "environment" : "user");
                }}
              >
                Toggle Camera
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center  items-center flex-row space-x-5 w-full">
          <div
            onClick={reset}
            className="text-white bg-black rounded-full text-xl cursor-pointer px-4 py-2 font-semibold shadow-sm"
          >
            Reset
          </div>
          {sketchImageGenerated ? (
            <>
              <div
                onClick={downloadSketch}
                className="text-white bg-black rounded-full text-xl cursor-pointer px-4 py-2 font-semibold shadow-sm"
              >
                Download
              </div>
              <div
                onClick={() => {
                  setDownloadImageButtonClicked(true);
                }}
                className="text-white bg-black rounded-full text-xl cursor-pointer px-4 py-2 font-semibold shadow-sm"
              >
                {"Next"}
              </div>
            </>
          ) : (
            <>
              <div
                onClick={() => {
                  applyFiltersAndSketch();
                }}
                className="text-white bg-black rounded-full text-xl cursor-pointer px-4 py-2 font-semibold shadow-sm"
              >
                {"Next"}
              </div>
              {/* <div
                onClick={downloadSketch}
                className="text-white bg-black rounded-full text-xl cursor-pointer px-4 py-2 font-semibold shadow-sm"
              >
                Download
              </div> */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
