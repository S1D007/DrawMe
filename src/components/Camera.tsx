import React from "react";
import Webcam from "react-webcam";

type CamerProps = {
  aspcectRatio?: number;
  facingMode: "user" | "environment";
  cameraRef?: React.MutableRefObject<Webcam | null>;
};

const Camera = (data: CamerProps) => {
  return (
    <Webcam
      ref={data.cameraRef}
      className="h-[600px] rounded-xl shadow-2xl"
      audio={false}
      screenshotFormat="image/png"
      screenshotQuality={1}
      videoConstraints={{
        facingMode: data.facingMode,
        aspectRatio: data.aspcectRatio,
        frameRate: 60,
        // width: 1667,
        // height: 2500,
      }}
    />
  );
};

export default Camera;
