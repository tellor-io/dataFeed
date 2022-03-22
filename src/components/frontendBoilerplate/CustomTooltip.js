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
    width: 'fit-content',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 28, 0.9)',
    fontSize: '16px',
    fontWeight: '300',
    textAlign: 'center',
    fontFamily: 'Inconsolata',
    color: '#ffffff',
  },
}))
