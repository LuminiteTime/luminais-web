import React from 'react'

import ClickSpark from './src/components/ClickSpark/ClickSpark'

export const wrapRootElement = ({ element }) => (
  <ClickSpark
    sparkColor="#14beb0"
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
