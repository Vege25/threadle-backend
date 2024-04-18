import { ChatMessages, PostItem, UserWithNoPassword } from './DBTypes';

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type MediaResponse = MessageResponse & {
  media: PostItem | PostItem[];
};

// for auth server
type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: UserWithNoPassword;
};

type UserResponse = MessageResponse & {
  user: UserWithNoPassword;
};

type UserDeleteResponse = MessageResponse & {
  user: { user_id: number };
};

type ChatResponse = {
  chat_id: number;
  sender_id: number;
  receiver_id: number;
  other_user: UserWithNoPassword;
  created_at: Date | string;
};

// for upload server
type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    media_type: string;
    filesize: number;
  };
};

export type {
  MessageResponse,
  ErrorResponse,
  MediaResponse,
  LoginResponse,
  UploadResponse,
  UserResponse,
  UserDeleteResponse,
  ChatResponse,
};
