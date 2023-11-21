import React, { useRef } from "react";
import Camera from "./components/Camera";
import Webcam from "react-webcam";

const filter = (image: HTMLImageElement, filters: string, width: number, height: number) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx) {
    canvas.width = width;
    canvas.height = height;
    ctx.filter = filters;
    ctx.drawImage(image, 0, 0, width, height);
  }
  return canvas;
};

const generateSketch = (bnw: HTMLCanvasElement, blur: HTMLCanvasElement) => {
  const canvas: any = document.createElement("canvas");
  canvas.width = bnw.width;
  canvas.height = bnw.height;
  canvas.__skipFilterPatch = true; // add this for Safari iOS
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(bnw, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "color-dodge";
    ctx.drawImage(blur, 0, 0, canvas.width, canvas.height);
  }
  return canvas;
};

const App = () => {
  const [captureImage, setCaptureImage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sketchImageGenerated, setSketchImageGenerated] = React.useState<boolean>(false); // eslint-disable-line
  const cameraRef = useRef<Webcam>(null);

  const capture = React.useCallback(() => {
    const imageSrc = cameraRef.current?.getScreenshot();
    setCaptureImage(imageSrc);
  }, [cameraRef]);

  const reset = React.useCallback(() => {
    setCaptureImage(null);
    setSketchImageGenerated(false);
  }, [setCaptureImage]);

  const applyFiltersAndSketch = () => {
    if (captureImage) {
      setLoading(true);
      const image = new Image();
      image.src = captureImage;

      image.onload = () => {
        const width = image.width;
        const height = image.height;

        const bnw = filter(image, "grayscale(1)", width, height);
        const blur = filter(image, "grayscale(1) invert(1) blur(5px)", width, height);

        const sketchImg = generateSketch(bnw, blur);

        // Increasing image quality using canvas.toDataURL with high-quality settings
        const sketchDataURL = sketchImg.toDataURL("image/jpeg", 1.0); // Adjust quality (1.0 is maximum)

        setCaptureImage(sketchDataURL);
        setLoading(false);
        setSketchImageGenerated(true);
      };
    }
  };

  const downloadSketch = () => {
    if (captureImage) {
      const anchor = document.createElement("a");
      anchor.href = captureImage;
      anchor.download = "sketch_image.jpeg";
      anchor.click();
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center flex-col items-center space-y-2">
      <img
        src="https://www.gokapture.com/img/gokapture/favicon.png"
        alt="logo"
        className="h-36"
      />
      {captureImage ? (
        <img
          src={captureImage}
          alt="capture"
          className="h-[600px] rounded-xl shadow-2xl"
        />
      ) : (
        <Camera cameraRef={cameraRef} facingMode="user" aspcectRatio={9 / 16} />
      )}

      {!captureImage && !loading ? (
        <img
          onClick={capture}
          src="https://cdn.iconscout.com/icon/free/png-256/free-camera-1809-461609.png"
          alt="capture"
          className="cursor-pointer h-24 w-24 absolute bottom-5 shadow-sm"
        />
      ) : (
        <div className="flex justify-center absolute bottom-5 items-center flex-row space-x-5 w-full">
          <img
            onClick={reset}
            src="https://cdn.iconscout.com/icon/free/png-256/free-retry-1-386755.png"
            alt="reset"
            className="cursor-pointer h-24 w-24  shadow-sm"
          />
          <img
            onClick={sketchImageGenerated ? downloadSketch : applyFiltersAndSketch}
            src={
              sketchImageGenerated
                ? "https://cdn.icon-icons.com/icons2/903/PNG/512/download-3_icon-icons.com_69534.png"
                : "https://cdn-icons-png.flaticon.com/512/1/1122.png"
            }
            alt="reset"
            className="cursor-pointer h-24 w-24 shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default App;
