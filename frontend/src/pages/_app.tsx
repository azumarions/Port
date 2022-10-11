import { AppProps } from 'next/app'
import Head from 'next/head'
import { store } from 'ducks/app/store'
import { Provider } from 'react-redux'
import { createGlobalStyle } from 'styled-components'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
