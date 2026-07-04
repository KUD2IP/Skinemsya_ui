import type { GroupMemberViewResponse } from '@/shared/api';
import { Avatar } from '@/shared/ui';
import { avatarToneFromSeed, formatTelegramUsername } from '@/shared/lib';
import * as css from './GroupMembers.css';

interface MemberRowProps {
  member: GroupMemberViewResponse;
}

export function MemberRow({ member }: MemberRowProps) {
  return (
    <div className={css.memberRow} role="listitem">
      <Avatar
        name={member.displayName}
        size="md"
        tone={avatarToneFromSeed(String(member.userId))}
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
    </div>
  );
}
