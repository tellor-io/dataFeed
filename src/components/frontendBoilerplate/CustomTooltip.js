import React from 'react'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'

export const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: 'rgba(28, 28, 28, 0.9)',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    width: 'auto', // Allows the tooltip to expand based on content
    maxWidth: '300px', // Prevents the tooltip from becoming too wide
    whiteSpace: 'pre-wrap', // Allows for multiline content
    backgroundColor: 'rgba(28, 28, 28, 0.9)', // Adjust background color for visibility
    color: '#ffffff', // Text color for readability
    border: '1px solid #ffffff', // Adds a border to make the tooltip stand out
    padding: '10px', // Increase padding for better spacing
    fontSize: '14px', // Adjust font size as needed
    fontFamily: 'Inconsolata', // Adjust font family as needed
  },
}))
