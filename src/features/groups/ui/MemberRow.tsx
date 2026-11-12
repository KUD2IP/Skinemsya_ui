import { Trash } from '@phosphor-icons/react';
import type { GroupMemberViewResponse } from '@/shared/api';
import { telegramPhotoUrl } from '@/features/auth';
import { Avatar, Icon, IconButton } from '@/shared/ui';
import { avatarToneFromSeed, formatTelegramUsername } from '@/shared/lib';
import * as css from './GroupMembers.css';

interface MemberRowProps {
  member: GroupMemberViewResponse;
  currentUserId?: number;
  onRemove?: (member: GroupMemberViewResponse) => void;
}

export function MemberRow({ member, currentUserId, onRemove }: MemberRowProps) {
  const photo =
    member.photoUrl || (currentUserId != null && member.userId === currentUserId ? telegramPhotoUrl() : null);

  return (
    <div className={css.memberRow} role="listitem">
      <Avatar
        name={member.displayName}
        size="md"
        tone={avatarToneFromSeed(String(member.userId))}
        src={photo}
      />
      <span className={css.memberBody}>
        <span className={css.memberName}>{member.displayName}</span>
        {member.telegramUsername ? (
          <span className={css.memberUsername}>
            {formatTelegramUsername(member.telegramUsername)}
          </span>
        ) : null}
      </span>
      {member.role === 'OWNER' ? <span className={css.rolePill}>Владелец</span> : null}
      {onRemove ? (
        <IconButton
          variant="bare"
          aria-label={`Удалить ${member.displayName}`}
          onClick={() => onRemove(member)}
        >
          <Icon icon={Trash} size="sm" />
        </IconButton>
      ) : null}
    </div>
  );
}
