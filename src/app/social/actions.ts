
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

/**
 * Handle sending friend request with explicit sender details
 */
export async function handleFriendRequest(senderId: string, senderName: string, receiverId: string) {
  const requestId = `${senderId}_${receiverId}`;
  const requestRef = adminDb.collection('friend_requests').doc(requestId);
  
  const existing = await requestRef.get();
  if (existing.exists && existing.data()?.status === 'pending') {
    return { success: false, message: 'Request already pending' };
  }

  await requestRef.set({
    senderId,
    senderName, // Preserved casing
    receiverId,
    status: 'pending',
    createdAt: FieldValue.serverTimestamp()
  });

  return { success: true };
}

/**
 * Accept a friend request and update both users' friend lists atomically.
 */
export async function acceptFriendRequest(requestId: string, senderId: string, receiverId: string) {
  const batch = adminDb.batch();

  // 1. Update request status
  const requestRef = adminDb.collection('friend_requests').doc(requestId);
  batch.update(requestRef, { status: 'accepted' });

  // 2. Update both user profiles
  const receiverRef = adminDb.collection('users').doc(receiverId);
  const senderRef = adminDb.collection('users').doc(senderId);

  batch.update(receiverRef, {
    friends: FieldValue.arrayUnion(senderId)
  });
  batch.update(senderRef, {
    friends: FieldValue.arrayUnion(receiverId)
  });

  await batch.commit();
  return { success: true };
}

/**
 * Decline a friend request.
 */
export async function declineFriendRequest(requestId: string) {
  await adminDb.collection('friend_requests').doc(requestId).update({
    status: 'declined'
  });
  return { success: true };
}
