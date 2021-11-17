import { useEffect, useState } from "react";
import {
  createVideo,
  getVideoInfo,
  addUploadedVideo,
  putVideoChunk,
  putVideoPic,
  putProfilePic,
} from "./canister";
import { VideoInfo, VideoInit } from "./canister/typings";
import { MAX_CHUNK_SIZE, encodeArrayBuffer, hashtagRegExp } from "./index";
import firebase from "firebase";

// Determines number of chunks and creates the VideoInfo
export function getVideoInit(
  userId: string,
  userEmail: string,
  file: File,
  collectionName: string,
  caption: string
): VideoInit {
  const chunkCount = Number(Math.ceil(file.size / MAX_CHUNK_SIZE));
  const timestamp = Number(Date.now() * 1000);
  return {
    userId,
    caption,
    userEmail,
    // @ts-ignore
    collectionName,
    reviews: [],
    likes: [],
    // @ts-ignore
    createdAt: timestamp, // motoko is using nanoseconds
    name: collectionName + " " + timestamp,
    tags: caption.match(hashtagRegExp) || [],
  };
}

export interface UploadVideoInit {
  name: string;
  caption: string;
  chunkCount: number;
  userId: string;
}

// Divides the file into chunks and uploads them to the canister in sequence
async function processAndUploadChunk(
  videoBuffer: ArrayBuffer,
  byteStart: number,
  videoSize: number,
  videoId: string,
  chunk: number
) {
  const videoSlice = videoBuffer.slice(
    byteStart,
    Math.min(videoSize, byteStart + MAX_CHUNK_SIZE)
  );
  const sliceToNat = encodeArrayBuffer(videoSlice);
  return putVideoChunk(videoId, chunk, sliceToNat);
}

// Wraps up the previous functions into one step for the UI to trigger
async function uploadVideo(
  userId: string,
  userEmail: string,
  file: File,
  caption: string,
  collectionName: string
) {
  const videoBuffer = (await file?.arrayBuffer()) || new ArrayBuffer(0);

  const videoInit = getVideoInit(
    userId,
    userEmail,
    file,
    collectionName,
    caption
  );
  const thumb = await generateThumbnail(file);
  const videoId = await createVideo(videoInit);
  const picUrl = await uploadVideoPic(videoId, thumb);
  let chunk = 1;
  var metadata = {
    contentType: "video/mp4",
  };
  // Create a root reference
  var storageRef = firebase.storage().ref();
  // Create a reference to video
  // Upload file and metadata to the object video
  var uploadTask = storageRef
    .child("videos/" + videoId)
    .put(videoBuffer, metadata)
    .then((snapshot) => {
      console.log("Uploaded an array!");
      console.log(snapshot);
    });
  console.log(uploadTask);

  // const putChunkPromises: Promise<[] | [null]>[] = [];
  // for (
  //   let byteStart = 0;
  //   byteStart < file.size;
  //   byteStart += MAX_CHUNK_SIZE, chunk++
  // ) {
  //   // putChunkPromises.push(
  //   //   processAndUploadChunk(videoBuffer, byteStart, file.size, videoId, chunk)
  //   // );
  // }

  // await Promise.all(putChunkPromises);

  // return await checkVidFromIC(videoId, userId);
  return `${videoId} ${videoInit.name} ${picUrl}`;
}

// This isn't Internet Computer specific, just a helper to generate an image
// from a video file
export function generateThumbnail(videoFile: File) {
  const videoElement = document.createElement("video");
  const thumbnailCanvas = document.createElement("canvas");
  const canvasContext = thumbnailCanvas.getContext("2d");

  const videoUrl = URL.createObjectURL(videoFile);
  videoElement.src = videoUrl;

  videoElement.addEventListener("loadedmetadata", () => {
    thumbnailCanvas.width = videoElement.videoWidth;
    thumbnailCanvas.height = videoElement.videoHeight;
  });

  return new Promise<number[]>((resolve, reject) => {
    videoElement.addEventListener("timeupdate", () => {
      canvasContext!.drawImage(
        videoElement,
        0,
        0,
        videoElement.videoWidth,
        videoElement.videoHeight
      );

      URL.revokeObjectURL(videoUrl);

      thumbnailCanvas.toBlob(
        (canvasBlob) => {
          canvasBlob!.arrayBuffer().then((arrayBuffer) => {
            resolve([...new Uint8Array(arrayBuffer)]);
          });
        },
        "image/jpeg",
        0.7
      );
    });
    setTimeout(() => {
      reject("took too long to create blob");
    }, 5000);
    videoElement.currentTime = 0.01;
  });
}

// Stores the videoPic on the canister
async function uploadVideoPic(videoId: string | void, file: number[]) {
  console.log("Storing video thumbnail...");
  try {
    if (videoId) {
      console.log(`Video thumbnail stored for ${videoId}`);
      const picUrl = await putVideoPic(videoId, file);
      return picUrl;
    }
  } catch (error) {
    console.error("Unable to store video thumbnail:", error);
  }
}

// Stores the videoPic on the canister
export async function uploadProfilePic(userId: string | void, file: File) {
  console.log(`Storing profile pic... ${userId}`);
  try {
    if (userId) {
      const res = await putProfilePic(userId, file);
      console.log(`Profile pic stored for ${res}`);
      return res;
    }
  } catch (error) {
    console.error("Unable to store profile pic:", error);
    return "";
  }
}

// Gets videoInfo from the IC after we've uploaded
async function checkVidFromIC(videoId: string, userId: string) {
  console.log("Checking canister for uploaded video...");
  const resultFromCanCan = null; //await getVideoInfo(userId, videoId);
  if (resultFromCanCan === null) {
    throw Error("Invalid video received from CanCan Canister");
  }
  console.log("Upload verified.");
  return resultFromCanCan;
}

// This hook exposes functions to set video data, trigger the upload, and return
// with "success" to toggle loading states.
export function useUploadVideo({
  userId,
  userEmail,
  collectionName,
}: {
  userId: string;
  userEmail: string;
  collectionName: string;
}) {
  const [completedVideo, setCompletedVideo] = useState<any>();
  const [file, setFile] = useState<File>();
  const [caption, setCaption] = useState("");
  const [ready, setReady] = useState(false);

  async function handleUpload(fileToUpload) {
    console.info("Storing video...");
    try {
      console.time("Stored in");
      uploadVideo(
        userId,
        userEmail,
        fileToUpload,
        caption,
        collectionName
      ).then(async (videoInfo) => {
        await addUploadedVideo(userId, videoInfo);
        setCompletedVideo(videoInfo);
      });
      setReady(false);
      setFile(undefined);
      console.timeEnd("Stored in");
    } catch (error) {
      console.error("Failed to store video.", error);
    }
  }

  useEffect(() => {
    if (ready && file !== undefined) {
      handleUpload(file);
    }
  }, [ready]);

  return {
    completedVideo,
    setCaption,
    setFile,
    setReady,
  };
}
