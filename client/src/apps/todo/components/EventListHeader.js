import React, { useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';

import { builtin_color_list } from '../../../utils/constants';
import OptionsGroup from '../../_common/components/OptionsGroup';

const EventListHeader = (props) => {
	const { activeGroup } = props;

	const [ title, setTitle ] = useState(activeGroup.title);
	const [ dropdown, setDropdown ] = useState(false);
	const [ screenX, setScreenX ] = useState(null);
	const [ screenY, setScreenY ] = useState(null);
	const [ winHeightDiffer, setWinHeightDiffer ] = useState(0);

	const handleGroupRename = () => {};

	const handleGroupDelete = () => {};

	const showDropdown = (x, y, whd) => {
		setWinHeightDiffer(whd);
		setScreenX(x);
		setScreenY(y);
		setDropdown(true);
	};

	const hideDropdown = () => {
		setDropdown(false);
		setScreenX(null);
		setScreenY(null);
	};

	return (
		<div className="EventListHeader-c-00">
			<form
				className="EventListHeader-Form-01"
				onSubmit={(e) => {
					e.preventDefault();
					handleGroupRename();
				}}
			>
				<input
					id="EventListHeader-Input-xx"
					className="Theme-Input-Underline-OnFoucs-99"
					type="text"
					autoComplete="Off"
					placeholder="Group Name"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</form>

			<OptionsGroup
				visible={dropdown}
				group={activeGroup}
				winHeightDiffer={winHeightDiffer}
				positionObj={{
					right: `calc(100vw - ${screenX}px - 8px)`,
					top: screenY - winHeightDiffer - 8
				}}
				handleGroupDelete={handleGroupDelete}
				showDropdown={showDropdown}
				hideDropdown={hideDropdown}
				onRenameClick={() => document.querySelector('#EventListHeader-Input-xx').focus()}
				// hex_color={activeGroup.hex_color}
			>
				<button className="Theme-Btn-Type2-Grey-99" onClick={() => setDropdown(true)}>
					<FaEllipsisH style={{ marginBottom: '-2px', fontSize: '18px', color: 'var(--text-color-light)' }} />
				</button>
			</OptionsGroup>
		</div>
	);
};

export default EventListHeader;
