import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { SocialChannel, PostContent, User } from '../types';

export interface DbChannel {
  id: string;
  userId: string;
  platform: 'tiktok' | 'youtube' | 'facebook' | 'instagram';
  accountName: string;
  handle: string;
  avatar: string;
  followers: number;
  status: 'active' | 'expired' | 'connecting';
  nodeRegion: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  connectedAt?: string;
}

export interface DbScheduledPost {
  id: string;
  userId: string;
  title: string;
  caption: string;
  videoUrl: string;
  videoFileName: string;
  targetPlatforms: string[];
  scheduledTime: string;
  status: 'scheduled' | 'publishing' | 'published' | 'draft' | 'failed';
  tiktokConfig?: any;
  youtubeConfig?: any;
  facebookConfig?: any;
  views?: number;
  likes?: number;
  createdAt?: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Channels Firestore DB
export async function saveChannelToDb(channel: DbChannel): Promise<void> {
  const path = `channels/${channel.id}`;
  try {
    await setDoc(doc(db, 'channels', channel.id), {
      ...channel,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteChannelFromDb(channelId: string): Promise<void> {
  const path = `channels/${channelId}`;
  try {
    await deleteDoc(doc(db, 'channels', channelId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export function subscribeToChannels(userId: string, callback: (channels: DbChannel[]) => void) {
  const path = 'channels';
  try {
    const q = query(collection(db, 'channels'), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const channels: DbChannel[] = [];
        snapshot.forEach((doc) => {
          channels.push(doc.data() as DbChannel);
        });
        callback(channels);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

// Scheduled Posts Firestore DB
export async function saveScheduledPostToDb(post: DbScheduledPost): Promise<void> {
  const path = `scheduledPosts/${post.id}`;
  try {
    await setDoc(doc(db, 'scheduledPosts', post.id), {
      ...post,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteScheduledPostFromDb(postId: string): Promise<void> {
  const path = `scheduledPosts/${postId}`;
  try {
    await deleteDoc(doc(db, 'scheduledPosts', postId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export function subscribeToScheduledPosts(userId: string, callback: (posts: DbScheduledPost[]) => void) {
  const path = 'scheduledPosts';
  try {
    const q = query(collection(db, 'scheduledPosts'), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const posts: DbScheduledPost[] = [];
        snapshot.forEach((doc) => {
          posts.push(doc.data() as DbScheduledPost);
        });
        callback(posts);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

// API Credentials (For TikTok & Meta App Secrets)
export interface ApiCredential {
  platform: 'tiktok' | 'meta' | 'youtube';
  clientId: string;
  clientSecret?: string;
  redirectUri?: string;
  updatedAt: string;
  environment?: 'sandbox' | 'live';
}

export async function saveApiCredentialToDb(credential: ApiCredential): Promise<void> {
  const path = `apiCredentials/${credential.platform}`;
  try {
    localStorage.setItem(`api_cred_${credential.platform}`, JSON.stringify(credential));
  } catch (e) {
    console.warn('localStorage save failed', e);
  }
  try {
    await setDoc(doc(db, 'apiCredentials', credential.platform), credential);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getApiCredentialFromDb(platform: string): Promise<ApiCredential | null> {
  try {
    const local = localStorage.getItem(`api_cred_${platform}`);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {}

  const path = `apiCredentials/${platform}`;
  try {
    const docRef = doc(db, 'apiCredentials', platform);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as ApiCredential;
      try {
        localStorage.setItem(`api_cred_${platform}`, JSON.stringify(data));
      } catch (e) {}
      return data;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// User Profile
export async function saveUserProfileToDb(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), {
      ...user,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
