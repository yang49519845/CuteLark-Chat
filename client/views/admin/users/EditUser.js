import React, { useMemo, useState, useCallback } from 'react';
import { Box, Field, Margins, Button, Callout } from '@rocket.chat/fuselage';

import { useTranslation } from '../../../contexts/TranslationContext';
import { useEndpointAction } from '../../../hooks/useEndpointAction';
import { useEndpointUpload } from '../../../hooks/useEndpointUpload';
import { useRoute } from '../../../contexts/RouterContext';
import UserAvatarEditor from '../../../components/avatar/UserAvatarEditor';
import { useForm } from '../../../hooks/useForm';
import UserForm from './UserForm';
import { FormSkeleton } from '../../../components/Skeleton';
import { useEndpointData } from '../../../hooks/useEndpointData';
import { AsyncStatePhase } from '../../../hooks/useAsyncState';

export function EditUserWithData({ uid, ...props }) {
	const t = useTranslation();
	const { value: roleData, phase: roleState, error: roleError } = useEndpointData('roles.list', '');
	const { value: data, phase: state, error } = useEndpointData('users.info', useMemo(() => ({ userId: uid }), [uid]));

	if ([state, roleState].includes(AsyncStatePhase.LOADING)) {
		return <FormSkeleton/>;
	}

	if (error || roleError) {
		return <Callout m='x16' type='danger'>{t('User_not_found')}</Callout>;
	}

	return <EditUser data={data.user} roles={roleData.roles} {...props}/>;
}

const getInitialValue = (data) => ({
	roles: data.roles,
	name: data.name ?? '',
	password: '',
	username: data.username,
	status: data.status,
	bio: data.bio ?? '',
	nickname: data.nickname ?? '',
	email: (data.emails && data.emails[0].address) || '',
	verified: (data.emails && data.emails[0].verified) || false,
	setRandomPassword: false,
	requirePasswordChange: data.setRandomPassword || false,
	customFields: data.customFields ?? {},
	statusText: data.statusText ?? '',
});

export function EditUser({ data, roles, ...props }) {
	const t = useTranslation();

	const [avatarObj, setAvatarObj] = useState();

	const { values, handlers, reset, hasUnsavedChanges } = useForm(getInitialValue(data));

	const router = useRoute('admin-users');

	const goToUser = useCallback((id) => router.push({
		context: 'info',
		id,
	}), [router]);

	const saveQuery = useMemo(() => ({
		userId: data._id,
		data: values,
	}), [data._id, values]);

	const saveAvatarQuery = useMemo(() => ({
		userId: data._id,
		avatarUrl: avatarObj && avatarObj.avatarUrl,
	}), [data._id, avatarObj]);

	const resetAvatarQuery = useMemo(() => ({
		userId: data._id,
	}), [data._id]);

	const saveAction = useEndpointAction('POST', 'users.update', saveQuery, t('User_updated_successfully'));
	const saveAvatarAction = useEndpointUpload('users.setAvatar', saveAvatarQuery, t('Avatar_changed_successfully'));
	const saveAvatarUrlAction = useEndpointAction('POST', 'users.setAvatar', saveAvatarQuery, t('Avatar_changed_successfully'));
	const resetAvatarAction = useEndpointAction('POST', 'users.resetAvatar', resetAvatarQuery, t('Avatar_changed_successfully'));

	const updateAvatar = useCallback(async () => {
		if (avatarObj === 'reset') {
			return resetAvatarAction();
		}
		if (avatarObj.avatarUrl) {
			return saveAvatarUrlAction();
		}
		avatarObj.set('userId', data._id);
		return saveAvatarAction(avatarObj);
	}, [avatarObj, resetAvatarAction, saveAvatarAction, saveAvatarUrlAction, data._id]);

	const handleSave = useCallback(async () => {
		const result = await saveAction();
		if (result.success) {
			if (avatarObj) {
				await updateAvatar();
			}
			goToUser(data._id);
		}
	}, [avatarObj, data._id, goToUser, saveAction, updateAvatar]);

	const availableRoles = roles.map(({ _id, description }) => [_id, description || _id]);

	const canSaveOrReset = hasUnsavedChanges || avatarObj;

	const prepend = useMemo(() => <UserAvatarEditor username={data.username} etag={data.avatarETag} setAvatarObj={setAvatarObj}/>, [data.username, data.avatarETag]);

	const append = useMemo(() => <Field>
		<Field.Row>
			<Box display='flex' flexDirection='row' justifyContent='space-between' w='full'>
				<Margins inlineEnd='x4'>
					<Button flexGrow={1} type='reset' disabled={!canSaveOrReset} onClick={reset}>{t('Reset')}</Button>
					<Button mie='none' flexGrow={1} disabled={!canSaveOrReset} onClick={handleSave}>{t('Save')}</Button>
				</Margins>
			</Box>
		</Field.Row>
	</Field>, [handleSave, canSaveOrReset, reset, t]);

	return <UserForm formValues={values} formHandlers={handlers} availableRoles={availableRoles} prepend={prepend} append={append} {...props}/>;
}
