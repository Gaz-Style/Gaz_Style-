import React from 'react';
import LiveChatClient from './LiveChatClient';
import { getWhatsAppChatsAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function LiveChatPage() {
    const chats = await getWhatsAppChatsAction();
    return <LiveChatClient initialChats={chats} />;
}
