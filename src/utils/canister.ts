/// <reference path="../react-app-env.d.ts" />
import { firestore } from "./firebase";
import firebase from "firebase";
/*
 * This file wraps all of our canister interaction functions and makes sure they
 * return the expected values by massaging any data necessary.
 */

import { Principal } from "@dfinity/agent";

import {
  Message,
  ProfileInfoPlus,
  VideoInfo,
  VideoInit,
  VideoResults,
} from "./canister/typings";
import { unwrap } from "./index";
// import { actorController } from "./canister/actor";

// const CanCan = actorController;

export type Optional<Type> = [Type] | [];

export function getUserFromStorage(
  storage = window.localStorage,
  key: string
): ProfileInfoPlus | undefined {
  const lsUser = storage.getItem(key);
  if (lsUser) {
    return JSON.parse(lsUser, (k, v) => {
      if (k === "rewards") {
        return BigInt(v);
      }
      return v;
    }) as ProfileInfoPlus;
  } else {
    return undefined;
  }
}

export async function createProfile(
  userId: string,
  userEmail: string,
  date: string,
  gender: string
) {
  const profile = {
    collectionNames: [],
    categories: [],
    likedVideos: [],
    followerPaywall: false,
    followerRequest: false,
    partnerPaywall: false,
    uploadedVideos: [],
    partners: [],
    requests: [],
    followers: [],
    following: [],
    email: userEmail,
    date: date,
    gender: gender,
  };
  return await firestore
    .collection("profiles")
    .doc(userId)
    .set(profile)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error("failed to create profile: ", err);
      return "";
    });
}

export async function createCollection(userId: string, name: string) {
  return await firestore
    .collection("profiles")
    .doc(userId)
    .update({
      collectionNames: firebase.firestore.FieldValue.arrayUnion(name),
    });
}

export async function createReview(
  userId: string,
  userEmail: string,
  videoId: string,
  content: string,
  profilePic: string
) {
  const comment = {
    userId: userId,
    userEmail: userEmail,
    videoId: videoId,
    content: content,
    profilePic: profilePic,
  };
  await firestore
    .collection("videos")
    .doc(videoId)
    .update({
      reviews: firebase.firestore.FieldValue.arrayUnion(userId),
    });
  return await firestore
    .collection("comments")
    .add(comment)
    .then((result) => {
      return result.id;
    })
    .catch((err) => {
      console.error("error adding review: ", err);
      return "";
    });
}

export async function createLike(
  userId: string,
  videoId: string,
  isLiked: boolean
) {
  await firestore
    .collection("videos")
    .doc(videoId)
    .update({
      likes: isLiked
        ? firebase.firestore.FieldValue.arrayUnion(userId)
        : firebase.firestore.FieldValue.arrayRemove(userId),
    });
  return await firestore
    .collection("profiles")
    .doc(userId)
    .update({
      likedVideos: isLiked
        ? firebase.firestore.FieldValue.arrayUnion(videoId)
        : firebase.firestore.FieldValue.arrayRemove(videoId),
    })
    .catch((err) => {
      console.error("error liking video: ", err);
      return "";
    });
}

export async function createDownload(url: string) {
  // var storage = firebase.storage();
  // var httpsReference = storage.refFromURL(url);
  var xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.onload = (event) => {
    var blob = xhr.response;
  };
  xhr.open("GET", url);
  console.log("downloading...");
  xhr.send();
}

export async function createCategory(userId: string, name: string) {
  return await firestore
    .collection("profiles")
    .doc(userId)
    .update({
      categories: firebase.firestore.FieldValue.arrayUnion(name),
    });
}

export async function createPartnerRequest(
  email: string,
  partnerId: string,
  userId: string,
  description: string
) {
  return await firestore
    .collection("profiles")
    .doc(userId)
    .update({
      requests: firebase.firestore.FieldValue.arrayUnion(
        `Partnerships ${email} ${partnerId} ${description}`
      ),
    });
}

export async function createFollowerRequest(
  email: string,
  partnerId: string,
  userId: string
) {
  return await firestore
    .collection("profiles")
    .doc(userId)
    .update({
      requests: firebase.firestore.FieldValue.arrayUnion(
        `Followers ${email} ${partnerId}`
      ),
    });
}

export async function handlePartnerRequest(
  accept = true,
  userId: string,
  email: string,
  partnerId: string,
  description: string
) {
  if (!accept) {
    return await firestore
      .collection("profiles")
      .doc(userId)
      .update({
        requests: firebase.firestore.FieldValue.arrayRemove(
          `Partnerships ${email} ${partnerId} ${description}`
        ),
      });
  }
  return await firestore
    .collection("profiles")
    .doc(userId)
    .update({
      partners: firebase.firestore.FieldValue.arrayUnion(
        `${email} ${partnerId} ${description}`
      ),
      requests: firebase.firestore.FieldValue.arrayRemove(
        `Partnerships ${email} ${partnerId} ${description}`
      ),
    });
}

export async function handleFollower(
  accept: boolean,
  userId: string,
  userEmail: string,
  followerId: string,
  followerEmail: string
) {
  return await firestore
    .collection("profiles")
    .doc(userId)
    .update({
      followers: accept
        ? firebase.firestore.FieldValue.arrayUnion(
            `${followerEmail} ${followerId}`
          )
        : firebase.firestore.FieldValue.arrayRemove(
            `${followerEmail} ${followerId}`
          ),
    })
    .then(async () => {
      return await firestore
        .collection("profiles")
        .doc(followerId)
        .update({
          following: accept
            ? firebase.firestore.FieldValue.arrayUnion(`${userEmail} ${userId}`)
            : firebase.firestore.FieldValue.arrayRemove(
                `${userEmail} ${userId}`
              ),
        });
    });
}

export async function saveSettings(
  userId: string,
  paywall2: boolean,
  paywall: boolean,
  permissionedFollow: boolean
) {
  return await firestore.collection("profiles").doc(userId).update({
    followerRequest: permissionedFollow,
    followerPaywall: paywall,
    partnerPaywall: paywall2,
  });
}

export async function handleFollowerRequest(
  accept = true,
  userId: string,
  email: string,
  partnerId: string
) {
  if (!accept) {
    return await firestore
      .collection("profiles")
      .doc(userId)
      .update({
        requests: firebase.firestore.FieldValue.arrayRemove(
          `${email} ${partnerId}`
        ),
      });
  }
  return await firestore
    .collection("profiles")
    .doc(userId)
    .update({
      followers: firebase.firestore.FieldValue.arrayUnion(
        `${email} ${partnerId}`
      ),
      requests: firebase.firestore.FieldValue.arrayRemove(
        `${email} ${partnerId}`
      ),
    });
}

export async function addUploadedVideo(userId: string, videoInfo: any) {
  return await firestore
    .collection("profiles")
    .doc(userId)
    .update({
      uploadedVideos: firebase.firestore.FieldValue.arrayUnion(videoInfo),
    });
}

export async function createChannel(userId: string, name: string) {
  const channel = {
    userId: userId,
    channelName: name,
    collections: [],
    uploadedVideos: [],
    likedVideos: [],
    partners: [],
    followers: [],
    following: [],
  };
  return await firestore
    .collection("channels")
    .add(channel)
    .then((result) => {
      return result.id;
    })
    .catch((err) => {
      console.error("failed to create channel: ", err);
      return "";
    });
}

export async function findOrCreateUser(
  userId: string,
  principal: Principal,
  key: string
): Promise<ProfileInfoPlus> {
  const lsUSER = getUserFromStorage(undefined, key);
  // if (lsUSER !== undefined) {
  //   return lsUSER;
  // }

  const icUser = await getUserFromCanister(userId);
  if (icUser !== null) {
    return icUser;
  } else {
    try {
      // createUser(userId, principal);
    } catch (error) {
      return Promise.reject(error);
    }
    throw Error("couldnt find or create user");
  }
}

export async function isDropDay(): Promise<boolean> {
  return false; //Boolean(unwrap<boolean>(await (await CanCan.actor).isDropDay()));
}

export async function getUserFromCanister(
  userId: string
): Promise<ProfileInfoPlus | null> {
  const icUser = null; //unwrap<ProfileInfoPlus>(
  //   await (await CanCan.actor).getProfilePlus([userId], userId)
  // );
  if (icUser) {
    return icUser;
  } else {
    return null;
  }
}

export async function getUserProfile(userId: string) {
  return await firestore
    .collection("profiles")
    .doc(userId)
    .get()
    .then((doc) => {
      return doc.data();
    })
    .catch((err) => {
      console.error("error getting profile: ", err);
      return null;
    });
}

export async function getUserChannel(channelId: string) {
  return await firestore
    .collection("channels")
    .doc(channelId)
    .get()
    .then((doc) => {
      return doc.data();
    })
    .catch((err) => {
      console.error("error getting uploaded videos: ", err);
      return null;
    });
}

export async function getSearchVideos(
  userId: string,
  terms: string[],
  limit: [] | [number] = [3]
): Promise<VideoInfo[]> {
  // @ts-ignore
  const videos = {};
  // unwrap<VideoResults>(
  //   await (await CanCan.actor).getSearchVideos(userId, terms, limit)
  // );
  // if (videos !== null) {
  // const unwrappedVideos = videos.map((v) => v[0]);
  // return unwrappedVideos;
  // } else {
  //   return Promise.resolve([]);
  // }
  return Promise.resolve([]);
}

export async function getFeedVideos() {
  // Create a reference with an initial file path and name
  var storage = firebase.storage();
  var videos = await (await storage.ref("videos").listAll()).items;
  // var userIds = Array<any>()
  // var uids = await firestore.collection('videos').get();

  return videos;
}

export async function getFeedVideo(videoId: string) {
  // Create a reference with an initial file path and name
  var storage = firebase.storage();
  var video = await (await storage.ref("videos")).child(videoId);
  // unwrap<VideoResults>(
  //   await (await CanCan.actor).getFeedVideos(userId, [])
  // );
  return video.getDownloadURL();
}

export async function getVideosInfo(
  following = Array<string>(),
  filter = false
) {
  return await firestore
    .collection("videos")
    .get()
    .then((res) => {
      if (filter) {
        return res.docs.filter((vInfo) =>
          following.includes(vInfo.data().userId)
        );
      }
      console.log("NO FILTER");
      return res.docs;
    })
    .catch((err) => {
      console.error("no video found", err);
      return null;
    });
}

export async function getVideosFromUser(userId: string) {
  return await firestore
    .collection("videos")
    .where("userId", "==", userId)
    .get()
    .then((res) => {
      return res.docs;
    })
    .catch((err) => {
      console.error("no video found", err);
      return null;
    });
}

export async function getVideoInfo(videoId: string) {
  return await firestore
    .collection("videos")
    .doc(videoId)
    .get()
    .then((doc) => {
      return doc.data();
    })
    .catch((err) => {
      console.error("no video found with id: " + videoId, err);
      return null;
    });
}

export async function getComments(videoId: string) {
  return await firestore
    .collection("comments")
    .where("videoId", "==", videoId)
    .get()
    .then((res) => {
      return res.docs;
    })
    .catch((err) => {
      console.error("no video found with id: " + videoId, err);
      return null;
    });
}

export async function getProfilePic(userId: string) {
  const profilePic = null; //unwrap(await (await CanCan.actor).getProfilePic(userId));
  return profilePic;
}

export async function createVideo(videoInit: VideoInit): Promise<string> {
  return await firestore
    .collection("videos")
    .add(videoInit)
    .then((result) => {
      return result.id;
    })
    .catch((err) => {
      console.error("error adding video: ", err);
      return "";
    });
}

export async function follow(
  userToFollow: string,
  follower: string,
  willFollow: boolean
) {
  try {
    if (willFollow) {
      return await firestore
        .collection("profiles")
        .doc(userToFollow)
        .update({
          followers: firebase.firestore.FieldValue.arrayUnion(follower),
        });
    } else {
      return await firestore
        .collection("profiles")
        .doc(userToFollow)
        .update({
          followers: firebase.firestore.FieldValue.arrayRemove(follower),
        });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function like(user: string, videoId: string, willLike: boolean) {
  // try {
  //   await (await CanCan.actor).putProfileVideoLike(user, videoId, willLike);
  // } catch (error) {
  //   console.error(error);
  // }
}

export async function superLike(
  user: string,
  videoId: string,
  willSuperLike: boolean
) {
  // try {
  //   await (await CanCan.actor).putSuperLike(user, videoId, willSuperLike);
  // } catch (error) {
  //   console.error(error);
  // }
}

export async function getMessages(username: string): Promise<Message[]> {
  const messages = []; //await (await CanCan.actor).getMessages(username);
  return messages;
}

// Videos are stored as chunked byteArrays, and must be assembled once received
export async function getVideoChunks(videoInfo: any): Promise<string> {
  return await videoInfo.getDownloadURL();
  // const { fullPath } = videoInfo;
  // const chunkBuffers: Buffer[] = [];
  // const chunksAsPromises: Array<Promise<Optional<number[]>>> = [];
  // // for (let i = 1; i <= Number(chunkCount.toString()); i++) {
  // //   chunksAsPromises.push((await CanCan.actor).getVideoChunk(videoId, i));
  // // }
  // const nestedBytes: number[][] = (await Promise.all(chunksAsPromises))
  //   .map(unwrap)
  //   .filter((v): v is number[] => v !== null);
  // nestedBytes.forEach((bytes) => {
  //   const bytesAsBuffer = Buffer.from(new Uint8Array(bytes));
  //   chunkBuffers.push(bytesAsBuffer);
  // });
  // const videoBlob = new Blob([Buffer.concat(chunkBuffers)], {
  //   type: "video/mp4",
  // });
  // const vidURL = URL.createObjectURL(videoBlob);
  // return vidURL;
}

export async function putVideoChunk(
  videoId: string,
  chunkNum: number,
  chunkData: number[]
) {
  // return (await CanCan.actor).putVideoChunk(videoId, chunkNum, chunkData);
}

export async function putVideoPic(videoId: string, file: number[]) {
  var bytes = new Uint8Array(file);
  // Create the file metadata
  var metadata = {
    contentType: "image/jpeg",
  };
  // Create a root reference
  var storageRef = firebase.storage().ref();
  // Upload file and metadata to the object 'images/mountains.jpg'
  return storageRef
    .child("images/" + videoId)
    .put(bytes, metadata)
    .then((snapshot) => {
      console.log("Uploaded an array!");
      return snapshot.ref.getDownloadURL();
    });
}

export async function putProfilePic(userId: string, file: File) {
  // var bytes = new Uint8Array(file);
  // Create the file metadata
  var metadata = {
    contentType: "image/jpeg",
  };
  // Create a root reference
  var storageRef = firebase.storage().ref();
  // Upload file and metadata to the object 'images/mountains.jpg'
  return storageRef
    .child("profilePics/" + userId)
    .put(file, metadata)
    .then((snapshot) => {
      console.log("Uploaded an array!");
      return snapshot.ref.getDownloadURL();
    });
}

// export async function getVideoPic(videoId: string): Promise<number[]> {
//   // const icResponse = await (await CanCan.actor).getVideoPic(videoId);
//   // const pic = unwrap<number[]>(icResponse);
//   // if (pic !== null) {
//   //   return pic;
//   // } else {
//   //   throw Error("pic should not be empty");
//   // }
// }

export function getLocationCanisterPrincipal(location: Location): Principal {
  const pattern =
    /(\.?((?:[a-z0-9]{5}-){4}[a-z0-9]{3})\..*)|(canisterId=([^$&]+))/;
  const match = location.href.match(pattern);
  if (!match) {
    throw new Error("Failed to parse url containing canisterId");
  }
  const [, , canisterId] = match;
  const canisterPrincipal = Principal.fromText(canisterId);
  return canisterPrincipal;
}

export async function checkUsername(username: string): Promise<boolean> {
  // return await (await CanCan.actor).checkUsernameAvailable(username);
  return false;
}

// export async function getMessages(username: string): Promise<Message[]> {
// const messages = await (await CanCan.actor).getMessages(username);
// return messages;
// }

export async function putRewardTransfer(
  sender: string,
  recipient: string,
  amount: BigInt
) {
  // return await (await CanCan.actor).putRewardTransfer(
  //   sender,
  //   recipient,
  //   amount
  // );
}

export async function putAbuseFlagVideo(
  reporter: string,
  target: string,
  shouldFlag: boolean
) {
  // return await (await CanCan.actor).putAbuseFlagVideo(
  //   reporter,
  //   target,
  //   shouldFlag
  // );
}
