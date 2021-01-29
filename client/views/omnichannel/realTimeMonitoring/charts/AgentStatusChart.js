import React, { useRef, useEffect } from 'react';

import Chart from './Chart';
import { useTranslation } from '../../../../contexts/TranslationContext';
import { drawDoughnutChart } from '../../../../../app/livechat/client/lib/chartHandler';
import { useUpdateChartData } from './useUpdateChartData';
import { useEndpointData } from '../../../../hooks/useEndpointData';
import { AsyncStatePhase } from '../../../../hooks/useAsyncState';

const labels = ['Available', 'Away', 'Busy', 'Offline'];

const initialData = {
	available: 0,
	away: 0,
	busy: 0,
	offline: 0,
};

const init = (canvas, context, t) => drawDoughnutChart(
	canvas,
	t('Agents'),
	context,
	labels,
	Object.values(initialData),
);

const AgentStatusChart = ({ params, reloadRef, ...props }) => {
	const t = useTranslation();

	const canvas = useRef();
	const context = useRef();

	const updateChartData = useUpdateChartData({
		context,
		canvas,
		t,
		init,
	});

	const { value: data, phase: state, reload } = useEndpointData(
		'livechat/analytics/dashboards/charts/agents-status',
		params,
	);

	reloadRef.current.agentStatusChart = reload;

	const {
		offline = 0,
		available = 0,
		away = 0,
		busy = 0,
	} = data ?? initialData;

	useEffect(() => {
		const initChart = async () => {
			context.current = await init(canvas.current, context.current, t);
		};
		initChart();
	}, [t]);

	useEffect(() => {
		if (state === AsyncStatePhase.RESOLVED) {
			updateChartData('Offline', [offline]);
			updateChartData('Available', [available]);
			updateChartData('Away', [away]);
			updateChartData('Busy', [busy]);
		}
	}, [available, away, busy, offline, state, t, updateChartData]);

	return <Chart ref={canvas} {...props}/>;
};

export default AgentStatusChart;
