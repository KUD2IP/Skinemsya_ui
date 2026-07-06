// Типы DTO бэкенда skinemsya_java. Источник истины — docs/API.md.

export interface TelegramAuthRequest {
  initData: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  /** TTL access-токена в секундах. */
  expiresIn: number;
  /** При входе из Telegram-чата — авто-привязка группы и подсказка следующего шага. */
  chatBootstrap?: ChatBootstrapResponse | null;
}

export type ChatSuggestedAction = 'CREATE_EVENT' | 'OPEN_APP';

export interface ChatBootstrapResponse {
  groupId: number;
  groupName: string;
  groupType: GroupType;
  suggestedAction: ChatSuggestedAction;
  eventId?: number;
}

export interface UserResponse {
  id: number;
  telegramUserId: number;
  displayName: string;
  paymentDetails: string | null;
  phone: string | null;
  preferredBank: string | null;
  notificationSettings: string | null;
}

export interface UpdateProfileRequest {
  paymentDetails?: string;
  phone?: string;
  preferredBank?: string;
  notificationSettings?: string;
}

export type GroupType = 'CHAT_LINKED' | 'STANDALONE';
export type GroupRole = 'OWNER' | 'MEMBER';
export type EventStatus = 'DRAFT' | 'DISTRIBUTION' | 'CALCULATED' | 'COMPLETED';

export interface GroupResponse {
  id: number;
  name: string;
  type: GroupType;
  telegramChatId: number | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMemberViewResponse {
  id: number;
  groupId: number;
  userId: number;
  role: GroupRole;
  displayName: string;
  telegramUsername: string | null;
  telegramUserId: number;
  joinedAt: string;
}

export interface CreateStandaloneGroupRequest {
  name: string;
}

export interface ChatLinkedGroupRequest {
  initData: string;
}

export interface UpdateGroupRequest {
  name: string;
}

export interface AddGroupMemberRequest {
  telegramUsername: string;
}

export interface EventResponse {
  id: number;
  groupId: number;
  name: string;
  description: string | null;
  payerId: number;
  createdBy: number;
  status: EventStatus;
  payerRequisitesReady: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  name: string;
  description?: string;
  payerId: number;
}

export interface UpdateEventRequest {
  name: string;
  description?: string;
  payerId: number;
}

export interface FileResponse {
  id: number;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export type PositionSource = 'MANUAL' | 'RECEIPT';

export interface PositionResponse {
  id: number;
  eventId: number;
  receiptId: number | null;
  name: string;
  quantity: number;
  totalPriceKopecks: number;
  shared: boolean;
  tips: boolean;
  lowConfidence: boolean;
  source: PositionSource;
  createdAt: string;
  remainingQuantity?: number | null;
  mySelectedQuantity?: number | null;
  soldOut?: boolean | null;
}

export type ReceiptStatus = 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';

export interface ReceiptResponse {
  id: number;
  eventId: number;
  fileId: number;
  status: ReceiptStatus;
  createdAt: string;
}

export interface CreatePositionRequest {
  name: string;
  quantity: number;
  totalPriceKopecks: number;
}

export interface UpdatePositionRequest {
  name: string;
  quantity: number;
  totalPriceKopecks: number;
}

export interface MarkSharedRequest {
  forAll: boolean;
}

export interface ProcessReceiptRequest {
  fileId: number;
}

export interface SelectionItem {
  positionId: number;
  quantity: number;
}

export interface UpdateSelectionsRequest {
  selections: SelectionItem[];
}

export type DebtStatus = 'UNPAID' | 'PENDING_CONFIRMATION' | 'PAID';

export interface DebtResponse {
  id: number;
  eventId: number;
  debtorId: number;
  creditorId: number;
  amountKopecks: number;
  status: DebtStatus;
  paymentStatus?: PaymentStatus | null;
  screenshotFileId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface DebtSummaryResponse {
  totalOwedKopecks: number;
  totalToReceiveKopecks: number;
  unpaidCount: number;
  pendingCount: number;
}

export interface ParticipantStatusItem {
  userId: number;
  selectionCompleted: boolean;
  debtStatus: string;
}

export interface ParticipantsStatusResponse {
  totalParticipants: number;
  completedSelections: number;
  participants: ParticipantStatusItem[];
}

export type PaymentStatus =
  | 'CREATED'
  | 'DEBTOR_CONFIRMED'
  | 'PAYER_CONFIRMED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface PaymentDetailsResponse {
  debtId: number;
  eventId: number;
  amountKopecks: number;
  creditorId: number;
  creditorName: string;
  paymentDetails: string;
  phone: string | null;
  preferredBank: string | null;
  status: PaymentStatus;
}

export interface PaymentResponse {
  id: number;
  debtId: number;
  status: PaymentStatus;
  screenshotFileId: number | null;
  debtorConfirmedAt: string | null;
  payerConfirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmDebtorRequest {
  screenshotFileId?: number | null;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'DOMAIN_CONFLICT'
  | 'DOMAIN_RULE_VIOLATION'
  | 'INTEGRATION_ERROR'
  | 'INTERNAL_ERROR';

export interface ApiErrorField {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  code: ApiErrorCode;
  message: string;
  correlationId?: string;
  fields?: ApiErrorField[];
}

export interface PageResult<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
}

export function pageHasMore<T>(page: PageResult<T>): boolean {
  if (page.totalElements === 0) return false;
  return (page.page + 1) * page.size < page.totalElements;
}
