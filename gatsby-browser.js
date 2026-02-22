import React from 'react'
import './src/styles/global.css'

import ClickSpark from './src/components/ClickSpark/ClickSpark'

export const wrapRootElement = ({ element }) => (
	<ClickSpark
		sparkColor="#78f7a9"
		sparkSize={10}
		sparkRadius={15}
		sparkCount={8}
		duration={400}
		easing="ease-in-out"
		extraScale={1}
	>
		{element}
	</ClickSpark>
)
