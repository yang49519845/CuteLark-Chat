
import React, { useMemo } from 'react';
import { Box } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';

import { UserInfo } from '../../room/contextualBar/UserInfo';
import { useTranslation } from '../../../contexts/TranslationContext';
import { useSetting } from '../../../contexts/SettingsContext';
import { UserStatus } from '../../../components/UserStatus';
import UserCard from '../../../components/UserCard';
import { UserInfoActions } from './UserInfoActions';
import { FormSkeleton } from '../../../components/Skeleton';
import { getUserEmailAddress } from '../../../lib/getUserEmailAddress';
import { useEndpointData } from '../../../hooks/useEndpointData';
import { AsyncStatePhase } from '../../../hooks/useAsyncState';

export function UserInfoWithData({ uid, username, ...props }) {
	const t = useTranslation();
	const showRealNames = useSetting('UI_Use_Real_Name');
	const approveManuallyUsers = useSetting('Accounts_ManuallyApproveNewUsers');

	const { value: data, phase: state, error, reload } = useEndpointData('users.info', useMemo(() => ({ ...uid && { userId: uid }, ...username && { username } }), [uid, username]));

	const onChange = useMutableCallback(() => reload());

	const user = useMemo(() => {
		const { user } = data || { user: {} };
		const {
			name,
			username,
			roles = [],
			status,
			statusText,
			bio,
			utcOffset,
			lastLogin,
			nickname,
		} = user;
		return {
			name,
			username,
			lastLogin,
			showRealNames,
			roles: roles.map((role, index) => (
				<UserCard.Role key={index}>{role}</UserCard.Role>
			)),
			bio,
			phone: user.phone,
			utcOffset,
			customFields: { ...user.customFields, ...approveManuallyUsers && user.active === false && user.reason && { Reason: user.reason } },
			email: getUserEmailAddress(user),
			createdAt: user.createdAt,
			status: <UserStatus status={status} />,
			customStatus: statusText,
			nickname,
		};
	}, [approveManuallyUsers, data, showRealNames]);

	if (state === AsyncStatePhase.LOADING) {
		return <FormSkeleton/>;
	}

	if (error) {
		return <Box mbs='x16'>{t('User_not_found')}</Box>;
	}

	const admin = data.user?.roles?.includes('admin');

	return <UserInfo
		{...user}
		data={data.user}
		onChange={onChange}
		actions={data && data.user && <UserInfoActions isActive={data.user.active} isAdmin={admin} _id={data.user._id} username={data.user.username} onChange={onChange}/>}
		{...props}
	/>;
}
