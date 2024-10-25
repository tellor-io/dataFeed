import React, { useContext } from 'react'
import '../../styles/frontendBoilerplate/Footer.css'
import Switch from '@mui/material/Switch'
import { createTheme, styled, ThemeProvider } from '@mui/material/styles'
import { ModeContext } from '../../contexts/Mode'

const CustomSwitch = styled(Switch)(({ theme }) => ({
  color: theme.palette.primary.main,
}))

const theme = createTheme({
  palette: {
    primary: {
      main: '#20f092',
      secondary: 'rgba(32, 240, 146, 0.2)',
    },
  },
})

const label = { inputProps: { 'aria-label': 'Dark/Light Mode Switch' } }

function Footer() {
  //Context State
  const mode = useContext(ModeContext)

  return (
    <div className="Footer">
      <p className="FooterText">&copy; 2023 Tellor, Inc.</p>
      <div className="ModeSwitcher">
        <p className="ModeSwitcherText">
          {mode && mode.mode === 'dark'
            ? 'Switch to Light Mode'
            : 'Switch to Dark Mode'}
        </p>
        <ThemeProvider theme={theme}>
          <CustomSwitch
            {...label}
            checked={mode && mode.mode === 'dark' ? true : false}
            onClick={mode.changeMode}
          />
        </ThemeProvider>
      </div>
    </div>
  )
}

export default Footer
