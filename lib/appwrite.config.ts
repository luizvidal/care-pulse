import { API_KEY, NEXT_PUBLIC_ENDPOINT, PROJECT_ID } from "@/env";
import {
  Client,
  Databases,
  Functions,
  Messaging,
  Storage,
  Users,
} from "node-appwrite";

const client = new Client();

client.setEndpoint(NEXT_PUBLIC_ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const users = new Users(client);
export const messaging = new Messaging(client);
