import { Meteor } from 'meteor/meteor';

import { escapeHTML } from '../../../../lib/escapeHTML';
import { MessageTypes } from '../../../ui-utils';
import { t } from '../../../utils';

Meteor.startup(function() {
	MessageTypes.registerType({
		id: 'room_changed_privacy',
		system: true,
		message: 'room_changed_privacy',
		data(message) {
			return {
				user_by: message.u && message.u.username,
				room_type: t(message.msg),
			};
		},
	});

	MessageTypes.registerType({
		id: 'room_changed_topic',
		system: true,
		message: 'room_changed_topic',
		data(message) {
			return {
				user_by: message.u && message.u.username,
				room_topic: escapeHTML(message.msg || `(${ t('None').toLowerCase() })`),
			};
		},
	});

	MessageTypes.registerType({
		id: 'room_changed_avatar',
		system: true,
		message: 'room_changed_avatar',
		data(message) {
			return {
				user_by: message.u && message.u.username,
			};
		},
	});


	MessageTypes.registerType({
		id: 'room_changed_announcement',
		system: true,
		message: 'room_changed_announcement',
		data(message) {
			return {
				user_by: message.u && message.u.username,
				room_announcement: escapeHTML(message.msg || `(${ t('None').toLowerCase() })`),
			};
		},
	});

	MessageTypes.registerType({
		id: 'room_changed_description',
		system: true,
		message: 'room_changed_description',
		data(message) {
			return {
				user_by: message.u && message.u.username,
				room_description: escapeHTML(message.msg || `(${ t('None').toLowerCase() })`),
			};
		},
	});
});
