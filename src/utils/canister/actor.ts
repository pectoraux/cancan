import { Actor, HttpAgent, Identity } from "@dfinity/agent";
// import {
//   idlFactory as CanCan_idl,
//   canisterId as CanCan_canister_id,
// } from "dfx-generated/CanCan";
import _SERVICE from "./typings";

// import dfxConfig from "dfx.json";

const DFX_NETWORK = process.env.DFX_NETWORK || "local";
const isLocalEnv = DFX_NETWORK === "local";

function getHost() {
  // Setting host to undefined will default to the window location 👍🏻
  return undefined;
}

const host = getHost();
