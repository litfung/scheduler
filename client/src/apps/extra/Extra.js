import React, { useState } from 'react';
import { renderRoutes } from 'react-router-config';

import { ProgressbarProvider } from '../_common/contexts/ProgressbarContext';
import Header1 from './components/Header1';

import __isNode__ from '../../utils/isNode';

// let __isNode__ = false;

// if (typeof process === 'object') {
// 	if (typeof process.versions === 'object') {
// 		if (typeof process.versions.node !== 'undefined') {
// 			__isNode__ = true;
// 		}
// 	}
// }

const Extra = (props) => {
	const pathName = props.staticContext ? props.staticContext.req.path : !__isNode__ && window.location.pathname;

	return (
		<ProgressbarProvider>
			<div className="Extra-a-00">
				<Header1 pathName={pathName} />
				<div>{renderRoutes(props.route.routes)}</div>
			</div>
		</ProgressbarProvider>
	);
};

export default {
	component: Extra
};

Date.prototype.getFormattedDate = function() {
	return `${this.getFullYear()}-${this.getMonth() + 1}-${this.getDate()}`;
};
