import { ServerWithMemberWithProfile } from '@/type';
import { Channel } from '@prisma/client';
import { create } from 'zustand';

export type ModalType = 'createServer' | 'inviteServer' | 'serverSetting' | 'manageMembers' | 'createChannel' | 'leaveServer' | 'deleteServer' | 'deleteChannel' | 'editChannel' | 'messageFile' | 'deleteMessage';

interface ModalData {
    Server?: ServerWithMemberWithProfile;
    Channel?: Channel;
    apiUrl?: string;
    query?: Record<string, any>
}

interface ModalState {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    open: (type: ModalType, data?: ModalData) => void;
    close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    open: (type: ModalType, data: ModalData = {}) => set({ type, isOpen: true, data }),
    close: () => set({ type: null, isOpen: false, data: {} }),
}));
