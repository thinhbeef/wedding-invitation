export const brideSessions = [
  { id: 'lunch', label: 'Cữ trưa', time: '10:30', displayTime: '10h30 trưa', path: '/10h30-trua' },
  { id: 'afternoon', label: 'Cữ chiều', time: '16:00', displayTime: '16h chiều', path: '/16h' },
] as const;

export type SessionId = (typeof brideSessions)[number]['id'];

/** Hai link nhà gái cùng dùng một bản build; đường dẫn quyết định đúng cữ tiệc. */
export function getInvitationVariant(side: string | undefined, pathname: string) {
  const isBride = side === 'bride';
  const path = pathname.replace(/\/+$/, '') || '/';
  const session = isBride ? brideSessions.find((item) => item.path === path) : undefined;
  return {
    isBride,
    session,
    sessions: isBride ? (session ? [session] : brideSessions) : [],
    ceremony: isBride ? 'Lễ vu quy' : 'Lễ tân hôn',
  };
}

export const invitationVariant = getInvitationVariant(
  import.meta.env.VITE_INVITATION_SIDE,
  typeof window === 'undefined' ? '/' : window.location.pathname,
);
